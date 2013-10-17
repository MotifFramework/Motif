<?php
/**
 * File.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * This is a AmazonS3 implementation of the MOXMAN_Vfs_IFile.
 */
class MOXMAN_AmazonS3_File extends MOXMAN_Vfs_BaseFile {
	private $stat;

	/**
	 * Constructs a new file instance.
	 *
	 * @param MOXMAN_Vfs_FileSystem $fileSystem File system instance for the file.
	 * @param String $path Path for the file.
	 * @param Array $stat File stat info or null.
	 */
	public function __construct(MOXMAN_Vfs_FileSystem $fileSystem, $path, $stat = null) {
		$this->fileSystem = $fileSystem;
		$this->path = $path;
		$this->stat = $stat;
	}

	/**
	 * Returns true if the file is a file.
	 *
	 * @return boolean true if the file is a file.
	 */
	public function isFile() {
		return $this->exists() && !$this->getStatItem("isdir");
	}

	/**
	 * Returns true if the file exists.
	 *
	 * @return boolean true if the file exists.
	 */
	public function exists() {
		return $this->getStatItem("size", false) !== false;
	}

	/**
	 * Returns file size as an long.
	 *
	 * @return long file size as an long.
	 */
	public function getSize() {
		return $this->getStatItem("size");
	}

	/**
	 * Returns last modification date in ms as an long.
	 *
	 * @return long last modification date in ms as an long.
	 */
	public function getLastModified() {
		return $this->getStatItem("mdate");
	}

	/**
	 * Deletes the file.
	 *
	 * @param boolean $deep If this option is enabled files will be deleted recurive.
	 */
	public function delete($deep = false) {
		$internalPath = $this->isDirectory() ? $this->getInternalPath() . "/" : $this->getInternalPath();

		$this->sendXmlRequest(array(
			"method" => "DELETE",
			"path" => $internalPath
		));
	}

	/**
	 * Creates a new directory.
	 */
	public function mkdir() {
		$this->sendXmlRequest(array(
			"method" => "PUT",
			"path" => $this->getInternalPath() . '/'
		));
	}

	/**
	 * Copies this file to the specified file instance.
	 *
	 * @param MCE_File $dest File to copy to.
	 */
	public function copyTo(MOXMAN_Vfs_IFile $dest) {
		if ($dest instanceof MOXMAN_AmazonS3_File) {
			$this->sendXmlRequest(array(
				"method" => "PUT",
				"path" => $dest->getInternalPath(),
				"amzHeaders" => array(
					"x-amz-copy-source" => '/' . $this->fileSystem->getBucketOption("name") . $this->getInternalPath()
				)
			));
		} else {
			$fromStream = $this->open("rb");
			$toStream = $dest->open("wb");

			while (($buff = $fromStream->read(8192)) !== "") {
				$toStream->write($buff);
			}

			$fromStream->close();
			$toStream->close();
		}
	}

	/**
	 * Moves this file to the specified file instance.
	 *
	 * @param MCE_File $dest File to rename/move to.
	 */
	public function moveTo(MOXMAN_Vfs_IFile $dest) {
		$this->copyTo($dest);
		$this->delete();
	}

	/**
	 * Returns an array of MCE_File instances based on the specified filter instance.
	 *
	 * @param MCE_FileFilter $filter MCE_FileFilter instance to filter files by.
	 * @return MOXMAN_Vfs_FileList List of MOXMAN_Vfs_IFile instances.
	 */
	public function listFilesFiltered(MOXMAN_Vfs_IFileFilter $filter) {
	 	$files = array();

	 	if ($this->isDirectory()) {
			$fileSystem = $this->getFileSystem();
			$dirPath = $this->getPath();
			$entries = $this->getFileList($this->getInternalPath());
			foreach ($entries as $entry) {
				$file = new MOXMAN_AmazonS3_File($fileSystem, $dirPath . "/" . $entry["name"], $entry);
				if ($filter->accept($file)) {
					$files[] = $file;
				}
			}
		}

		return new MOXMAN_Vfs_FileList($files);
	}

	/**
	 * Opens a file stream by the specified mode. The default mode is rb.
	 *
	 * @param String $mode Mode to open file by, r, rb, w, wb etc.
	 * @return MOXMAN_Vfs_IFileStream File stream implementation for the file system.
	 */
	public function open($mode = MCFM_Vfs_IStream::READ) {
		return new MOXMAN_Vfs_MemoryFileStream($this, $mode);
	}

	/**
	 * Exports the file to the local system, for example a file from a zip or db file system.
	 * Implementations of this method should also support directory recursive exporting.
	 *
	 * @param String $localPath Absolute path to local file.
	 */
	public function exportTo($localPath) {
		if (!file_exists($localPath)) {
			$this->getFileSystem()->exportTo($this->getInternalPath(), $localPath);
		}
	}

	/**
	 * Imports a local file to the file system, for example when users upload files.
	 * Implementations of this method should also support directory recursive importing.
	 *
	 * @param String $localPath Absolute path to local file.
	 */
	public function importFrom($localPath) {
		if (file_exists($localPath)) {
			$this->getFileSystem()->importFrom($localPath, $this->getInternalPath());
		}
	}

	/**
	 * Returns the absolute public URL for the file.
	 *
	 * @return String Absolute public URL for the file.
	 */
	public function getUrl() {
		$fileSystem = $this->getFileSystem();
		$prefix = $fileSystem->getBucketOption("urlprefix", "http://s3.amazonaws.com");

		return MOXMAN_Util_PathUtils::combine($prefix, $fileSystem->getBucketOption("name") . $this->getInternalPath());
	}

	/**
	 * Returns a stat item or the default value if it wasn't found.
	 *
	 * @param String $key Key of stat item to get.
	 * @param mixed $default Default value to return.
	 * @return mixed Value of stat item or default.
	 */
	public function getStatItem($key, $default = false) {
		// File stat data not specified then we need to get it from server
		if (!$this->stat) {
			$this->stat = $this->getStat();
		}

		return $this->stat !== null && isset($this->stat[$key]) ? $this->stat[$key] : $default;
	}

	/**
	 * Returns the file system internal path. This is used when oding requests on the remote server.
	 *
	 * @param String $path Optional path to convert into internal an internal path.
	 * @return String Internal file system path.
	 */
	public function getInternalPath($path = null) {
		$url = parse_url($path ? $path : $this->path);
		$path = isset($url["path"]) ? $url["path"] : "/";

		return MOXMAN_Util_PathUtils::combine($this->getFileSystem()->getBucketOption("path"), $path);
	}

	/**
	 * Gets the stat info for the current file object.
	 *
	 * @return Array Name/value array with info about the current file.
	 */
	private function getStat() {
		$parentPath = $this->getParent();

		if ($parentPath) {
			$parentPath = $this->getInternalPath($this->getParent());
			$files = $this->getFileList($parentPath, $this->getName());
			$targetStat = null;

			foreach ($files as $stat) {
				$path = MOXMAN_Util_PathUtils::combine($parentPath, $stat["name"]);
				if ($stat["name"] === $this->getName()) {
					$targetStat = $stat;
				}
			}
		} else {
			// Stat info for root directory
			$targetStat = array(
				"name" => $this->fileSystem->getRootName(),
				"isdir" => true,
				"size" => 0,
				"mdate" => time()
			);
		}

		return $targetStat;
	}

	/**
	 * Lists files in the specified path and returns an array with stat info details.
	 *
	 * @param String $path Path to list files in.
	 * @return Array Array with stat info name/value arrays.
	 */
	public function getFileList($path) {
		$prefix = $path === "/" ? "" : substr($path, 1) . "/";

		/*
		$files = $this->fileSystem->getCache()->get($prefix);
		if ($files) {
			return $files;
		}
		*/

		$files = array();
		$xml = $this->sendXmlRequest(array(
			"query" => array(
				"prefix" => $prefix,
				"delimiter" => "/",
				"max-keys" => "5000"
			)
		));

		// List directories
		if (isset($xml->CommonPrefixes)) {
			foreach ($xml->CommonPrefixes as $cprefix) {
				if ($prefix != $cprefix->Prefix) {
					$stat = array(
						"name" => basename($cprefix->Prefix),
						"isdir" => true,
						"size" => 0,
						"mdate" => 0
					);

					$path = MOXMAN_Util_PathUtils::combine($path, $stat["name"]);
					$files[] = $stat;
				}
			}
		}

		// List files
		if (isset($xml->Contents)) {
			foreach ($xml->Contents as $contents) {
				if ($prefix != $contents->Key) {
					$stat = array(
						"name" => basename($contents->Key),
						"isdir" => strrpos($contents->Key, "/") === strlen($contents->Key) - 1,
						"size" => intval($contents->Size),
						"mdate" => strtotime($contents->LastModified)
					);

					$path = MOXMAN_Util_PathUtils::combine($path, $stat["name"]);
					$files[] = $stat;
				}
			}
		}

		//$this->fileSystem->getCache()->put($prefix, $files);

		return $files;
	}

	/**
	 * Sends a XML request to the S3 rest API.
	 *
	 * @param Array $params Name/value array of request parameters.
	 * @return SimpleXMLElement Simple XML element of the response body.
	 */
	private function sendXmlRequest($params) {
		$body = $this->getFileSystem()->sendRequest($params);
		if ($body) {
			return new SimpleXMLElement($body);
		}

		return $body;
	}
}

?>