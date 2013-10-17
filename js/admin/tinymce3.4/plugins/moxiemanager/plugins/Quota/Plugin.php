<?php
/**
 * Quota.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * ...
 */
class MOXMAN_Quota_Plugin implements MOXMAN_IPlugin {
	public function init() {
		MOXMAN::getPluginManager()->get("core")->bind("FileAction", "onFileAction", $this);
		MOXMAN::getPluginManager()->get("core")->bind("BeforeFileAction", "onBeforeFileAction", $this);
	}

	public function onBeforeFileAction(MOXMAN_Vfs_FileActionEventArgs $args) {
		switch ($args->getAction()) {
			case MOXMAN_Vfs_FileActionEventArgs::COPY:
			case MOXMAN_Vfs_FileActionEventArgs::ADD:
				if (!isset($args->getData()->thumb)) {
					if ($args->getAction() == MOXMAN_Vfs_FileActionEventArgs::ADD) {
						$file = $args->getFile();
					} else {
						$file = $args->getTargetFile();
					}

					// Only on local filesystems.
					if ($file instanceof MOXMAN_Vfs_Local_File) {
						$parentFile = $file->getParentFile();

						// If not set, probably a folder?
						if (isset($args->getData()->fileSize)) {
							$fileSize = $args->getData()->fileSize;
						} else {
							$fileSize = 0;
						}

						// Recalculate quota after uploading a new file
						$dirs = MOXMAN::getUserStorage()->get("quota.dirs", new stdClass());
						$this->recalcQuota($parentFile, $dirs);
						MOXMAN::getUserStorage()->put("quota.dirs", $dirs);
						$quotaSize = $this->parseSize($file->getConfig()->get("quota.size", "-1"));

						// Check if size of the root directory exceeds the configured max size
						$rootFile = $file->getFileSystem()->getRootFile();
						if (isset($dirs->{$rootFile->getPublicPath()}) && $dirs->{$rootFile->getPublicPath()}->dsize + $fileSize > $quotaSize) {
							throw new MOXMAN_Exception(
								"Quota exceeded when adding file: " . $file->getPublicPath() . " (" .
								$this->formatSize($dirs->{$rootFile->getPublicPath()}->dsize + $fileSize) .
								" > " .
								$this->formatSize($quotaSize) . ")."
							);
						}
					}
				}
				break;
		}
	}

	public function onFileAction(MOXMAN_Vfs_FileActionEventArgs $args) {
		switch ($args->getAction()) {
			case MOXMAN_Vfs_FileActionEventArgs::LIST_FILES:
				// Recalculate quota size when listing files, only on local filesystems.
				if ($args->getFile() instanceof MOXMAN_Vfs_Local_File) {
					$dirs = MOXMAN::getUserStorage()->get("quota.dirs", new stdClass());
					$this->recalcQuota($args->getFile(), $dirs);
					MOXMAN::getUserStorage()->put("quota.dirs", $dirs);
				}
			break;
		}
	}

	private function recalcQuota($dir, &$dirs) {
		$dsize = 0;
		$lsize = 0;

		if (!$dir->exists()) {
			return 0;
		}

		$files = $dir->listFiles();
		foreach ($files as $file) {
			if ($file->isFile()) {
				$dsize += $file->getSize();
				$lsize += $file->getSize();
			} else {
				// Get local size from quota dirs array
				$publicPath = $file->getPublicPath();
				if (isset($dirs->{$publicPath})) {
					$dsize += $dirs->{$publicPath}->dsize;
				} else {
					$dsize += $this->recalcQuota($file, $dirs);
				}
			}
		}

		$publicPath = $dir->getPublicPath();
		if (!isset($dirs->{$publicPath}) || $dirs->{$publicPath}->dsize !== $dsize) {
			$dirs->{$publicPath} = (object) array("lsize" => $lsize, "dsize" => $dsize);

			// Calculate file size of each parent
			$parent = $dir;
			while (($parent = $parent->getParentFile()) !== null) {
				$this->recalcQuota($parent, $dirs);
			}
		}

		return $dsize;
	}

	// @codeCoverageIgnoreStart

	private function parseSize($size) {
		$bytes = floatval(preg_replace('/[^0-9\\.]/', "", $size));

		if (strpos((strtolower($size)), "k") > 0) {
			$bytes *= 1024;
		}

		if (strpos((strtolower($size)), "m") > 0) {
			$bytes *= (1024 * 1024);
		}

		return $bytes;
	}

	private function formatSize($size) {
		if ($size >= 1048576) {
			return round($size / 1048576, 1) . " MB";
		}

		if ($size >= 1024) {
			return round($size / 1024, 1) . " KB";
		}

		return $size . " b";
	}

	// @codeCoverageIgnoreEnd
}

// Add plugin
MOXMAN::getPluginManager()->add("quota", new MOXMAN_Quota_Plugin());

?>