<?php
/**
 * File.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * Indexed file class.
 *
 * @package MOXMAN_Vfs_Cache
 */
class MOXMAN_Vfs_Cache_File implements MOXMAN_Vfs_IFile {
	private $fileSystem, $wrappedFile, $info;

	public function __construct(MOXMAN_Vfs_FileSystem $fileSystem, MOXMAN_Vfs_IFile $file, $info = null) {
		$this->fileSystem = $fileSystem;
		$this->wrappedFile = $file;
		$this->fileInfoStorage = MOXMAN_Vfs_Cache_FileInfoStorage::getInstance();
		$this->info = $info ? $info : $this->fileInfoStorage->getInfo($file);
	}

	public function getFileSystem() {
		return $this->fileSystem;
	}

	public function getParent() {
		return $this->wrappedFile->getParent();
	}

	public function getParentFile() {
		$file = $this->wrappedFile->getParentFile();
		if ($file) {
			$file = new MOXMAN_Vfs_Cache_File($this->fileSystem, $file);
		}

		return $file;
	}

	public function getName() {
		return $this->wrappedFile->getName();
	}

	public function getPath() {
		return $this->wrappedFile->getPath();
	}

	public function getPublicPath() {
		return $this->wrappedFile->getPublicPath();
	}

	public function getPublicLinkPath() {
		return $this->wrappedFile->getPublicLinkPath();
	}

	public function getUrl() {
		return $this->wrappedFile->getUrl();
	}

	public function exists() {
		if ($this->info) {
			return true;
		}

		return $this->wrappedFile->exists();
	}

	public function isDirectory() {
		if ($this->info) {
			return $this->info["isDirectory"];
		}

		return $this->wrappedFile->isDirectory();
	}

	public function isFile() {
		if ($this->info) {
			return !$this->info["isDirectory"];
		}

		return $this->wrappedFile->isFile();
	}

	public function isHidden() {
		return $this->wrappedFile->isHidden();
	}

	public function getLastModified() {
		if ($this->info) {
			return $this->info["lastModified"];
		}

		return $this->wrappedFile->getLastModified();
	}

	public function canRead() {
		if ($this->info) {
			return $this->info["canRead"];
		}

		return $this->wrappedFile->canRead();
	}

	public function canWrite() {
		if ($this->info) {
			return $this->info["canWrite"];
		}

		return $this->wrappedFile->canWrite();
	}

	public function getSize() {
		if ($this->info) {
			return $this->info["size"];
		}

		return $this->wrappedFile->getSize();
	}

	public function moveTo(MOXMAN_Vfs_IFile $dest) {
		$this->fileInfoStorage->deleteFile($this->getWrappedFile());
		$this->wrappedFile->moveTo($dest);
		$this->fileInfoStorage->putFile($dest);
	}

	public function copyTo(MOXMAN_Vfs_IFile $dest) {
		$this->wrappedFile->copyTo($dest);
		$this->fileInfoStorage->putFile($dest);
	}

	public function delete($deep = false) {
		$this->fileInfoStorage->deleteFile($this->getWrappedFile());
		$this->wrappedFile->delete($deep);
	}

	public function listFiles() {
		return $this->listFilesFiltered(new MOXMAN_Vfs_BasicFileFilter());
	}

	public function listFilesFiltered(MOXMAN_Vfs_IFileFilter $filter) {
		$files = array();

		if ($this->isDirectory()) {
			$fileSystem = $this->getFileSystem();

			$items = $this->getFileInfoStorage()->listInfoItems($this->getWrappedFile(), $this->getFilterQuery($filter));
			if ($items !== null) {
				$dirPath = $this->getPath();
				foreach ($items as $item) {
					$file = $fileSystem->getFile($dirPath . "/" . $item["name"], $item);
					if ($filter->accept($file)) {
						$files[] = $file;
					}
				}
			} else {
				$files = $this->getWrappedFile()->listFiles()->toArray();
				$this->getFileInfoStorage()->putFiles($files);

				for ($i = count($files) - 1; $i >= 0; $i--) {
					if (!$filter->accept($files[$i])) {
						array_splice($files, $i, 1);
					}
				}
			}
		}

		return new MOXMAN_Vfs_FileList($files);
	}

	public function mkdir() {
		$this->wrappedFile->mkdir();
		$this->fileInfoStorage->putFile($this);
	}

	public function open($mode = MOXMAN_Vfs_IStream::READ) {
		return new MOXMAN_Vfs_Cache_FileStream($this, $this->wrappedFile->open($mode), $mode);
	}

	public function exportTo($localPath) {
		return $this->wrappedFile->exportTo($localPath);
	}

	public function importFrom($localPath) {
		$this->wrappedFile->importFrom($localPath);
		$this->fileInfoStorage->putFile($this);
	}

	public function getConfig() {
		return $this->wrappedFile->getConfig();
	}

	public function getMetaData() {
		return $this->wrappedFile->getMetaData();
	}

	public function getWrappedFile() {
		return $this->wrappedFile;
	}

	public function getFileInfoStorage() {
		return $this->fileInfoStorage;
	}

	// Private members

	private function getFilterQuery($filter) {
		$filterQuery = "";

		$filters = $this->getFilters($filter);
		foreach ($filters as $filter) {
			if ($filter instanceof MOXMAN_Vfs_BasicFileFilter) {
				$includeWildcardPattern = $filter->getIncludeWildcardPattern();
				if ($includeWildcardPattern) {
					if (preg_match('/[%\"\'\x00-\x19]/', $includeWildcardPattern)) {
						return "";
					}

					$filterQuery = " AND mc_name LIKE '%" . $includeWildcardPattern . "%'";
				}
			} else {
				return "";
			}
		}

		return $filterQuery;
	}

	private function getFilters($filter) {
		$filters = array();

		if ($filter instanceof MOXMAN_Vfs_CombinedFileFilter) {
			$combinedFilters = $filter->getFilters();
			foreach ($combinedFilters as $filter) {
				$filters = array_merge($this->getFilters($filter), $filters);
			}
		} else {
			$filters[] = $filter;
		}

		return $filters;
	}
}
?>