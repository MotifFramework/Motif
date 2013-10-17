<?php
/**
 * FileUrlResolver.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * Resolves the specified url to a file instance.
 *
 * @package MOXMAN_Vfs_Local
 */
class MOXMAN_AmazonS3_FileUrlResolver implements MOXMAN_Vfs_IFileUrlResolver {
	/** @ignore */
	private $fileSystem;

	/**
	 * Constructs a new FileUrlResolver.
	 *
	 * @param MOXMAN_Vfs_FileSystem $filesystem File system reference.
	 */
	public function __construct($filesystem) {
		$this->fileSystem = $filesystem;
	}

	/**
	 * Returns a file object out of the specified URL.
	 *
	 * @param string Absolute URL for the specified file.
	 * @return MOXMAN_Vfs_IFile File that got resolved or null if it wasn't found.
	 */
	public function getFile($url) {
		$file = null;
		$prefix = $this->fileSystem->getBucketOption("urlprefix", "http://s3.amazonaws.com");
		$match = MOXMAN_Util_PathUtils::combine($prefix, substr($this->fileSystem->getRootPath(), 5));
		$bucketname = $this->fileSystem->getBucketOption("name");

		if (strpos($url, $match) === 0) {
			$bucketpath = MOXMAN_Util_PathUtils::combine($prefix, $bucketname);
			$filePath = MOXMAN_Util_PathUtils::combine("s3://". $bucketname, substr($url, strlen($bucketpath)));
			return $this->fileSystem->getFile($filePath);
		}

		return $file;
	}
}

?>