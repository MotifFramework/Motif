<?php
/**
 * FileSystem.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * This class returns file instances for the AmazonS3 File system.
 */
class MOXMAN_AmazonS3_FileSystem extends MOXMAN_Vfs_FileSystem {
	private $httpClient, $bucket;

	/**
	 * Constructs a new AmazonS3 instance.
	 *
	 * @param String $scheme File system protocol scheme.
	 * @param MOXMAN_Util_Config $config Config instance for file system.
	 * @param String $root Root path for file system.
	 */
	public function __construct($scheme, $config, $root) {
		parent::__construct($scheme, $config, $root);

		$this->cache = new MOXMAN_Util_LfuCache();
		$this->setFileUrlResolver(new MOXMAN_AmazonS3_FileUrlResolver($this));

		// Parse URL and get buckets
		$url = parse_url($this->getRootPath());
		$bucketName = $url["host"];
		$buckets = $this->getConfig()->get("amazons3.buckets");

		// Verify bucket host
		if (!$buckets || !isset($buckets[$bucketName])) {
			throw new MOXMAN_Exception("Could not find bucket: " . $bucketName);
		}

		// Verify that bucket has publickey and privatekey
		$bucket = $buckets[$bucketName];
		if (!isset($bucket["publickey"]) || !isset($bucket["secretkey"])) {
			throw new MOXMAN_Exception("Private and public keys for bucket " . $bucketName . " is required.");
		}

		$bucket["name"] = $bucketName;
		$this->bucket = $bucket;

		// Setup HTTP client
		$this->httpClient = new MOXMAN_Http_HttpClient($url["host"] . ".s3.amazonaws.com");

		// Debug output
		if (isset($bucket["debug_level"]) && $bucket["debug_level"] > 0) {
			$this->httpClient->setLogFunction(array($this, "logHttpClient"));
			$this->httpClient->setLogLevel($bucket["debug_level"]);
		}
	}

	/**
	 * Returns the true/false if the file system can be cached or not.
	 *
	 * @return True/false if the file system is cacheable or not.
	 */
	public function isCacheable() {
		return $this->getBucketOption("cache", true);
	}

	/**
	 * Returns a MOXMAN_Vfs_IFile file instance for the specified path.
	 *
	 * @param String $path Path of the file to get from file system.
	 * @return MOXMAN_Vfs_IFile File instance for the specified path.
	 */
	public function getFile($path) {
		return new MOXMAN_AmazonS3_File($this, $path);
	}

	/**
	 * Closes the file system. This will release any resources used by the file system.
	 */
	public function close() {
		if ($this->httpClient) {
			$this->httpClient->close();
			$this->httpClient = null;
		}
	}

	public function getCache() {
		return $this->cache;
	}

	/**
	 * Returns a bucket option by name or the default value if it isn't defined.
	 *
	 * @param String $name Name of the option to get.
	 * @param mixed $default Default value to return if the option isn't defined.
	 * @return mixed Option value or default value if it doesn't exist.
	 */
	public function getBucketOption($name, $default = "") {
		return isset($this->bucket[$name]) ? $this->bucket[$name] : $default;
	}

	/**
	 * Exports the specified Amazon S3 path to the specified local path.
	 *
	 * @param String $path Path to S3 file in bucket.
	 * @param String $localPath Local file system path to save file to.
	 */
	public function exportTo($path, $localPath) {
		// Replace spaces in file names
		$path = str_replace(' ', '%20', $path);

		$contentMD5 = "";
		$contentType = "";
		$date = gmdate('r');
		$amzHeaders = "/" . MOXMAN_Util_PathUtils::combine($this->bucket["name"], $path);
		$resource = "";

		$signature = implode(array(
			"GET",
			$contentMD5,
			$contentType,
			$date,
			$amzHeaders,
			$resource
		), "\n");

		$signature = $this->hash(trim($signature));

		$this->httpClient->close();
		$request = $this->httpClient->createRequest($path);
		$request->setHeader("date", $date);
		$request->setHeader("Authorization", "AWS " . $this->getBucketOption("publickey") . ":" . $signature);
		$response = $request->send();

		// Read remote file and write the contents to local file
		$fp = fopen($localPath, "wb");
		if ($fp) {
			// Stream file down to disk
			while (($chunk = $response->read()) != "") {
				fwrite($fp, $chunk);
			}

			fclose($fp);
		}
	}

	/**
	 * Imports a local file into the Amazon S3 file system.
	 *
	 * @param String $localPath Local file system path to import.
	 * @param String $path Path of S3 path to store the file at.
	 */
	public function importFrom($localPath, $path) {
		// Replace spaces in file names
		$path = str_replace(' ', '%20', $path);

		$contentMD5 = "";
		$contentType = MOXMAN_Util_Mime::get($path);
		$date = gmdate('r');
		$amzHeaders = "x-amz-acl:public-read\n" . "/" . MOXMAN_Util_PathUtils::combine($this->bucket["name"], $path);
		$resource = "";

		$signature = implode(array(
			"PUT",
			$contentMD5,
			$contentType,
			$date,
			$amzHeaders,
			$resource
		), "\n");

		$signature = $this->hash(trim($signature));

		// Needs a close here for some odd reason since S3 will return a content-length: 0 on the put request
		$this->httpClient->close();

		// Setup request
		$request = $this->httpClient->createRequest($path, "PUT");
		$request->setHeader("Content-Type", $contentType);
		$request->setHeader("x-amz-acl", "public-read");
		$request->setHeader("Content-Disposition", "");
		$request->setHeader("date", $date);
		$request->setHeader("Authorization", "AWS " . $this->getBucketOption("publickey") . ":" . $signature);

		if (MOXMAN::getLogger()) {
			$url = $request->getUrl();
			MOXMAN::getLogger()->debug("[s3] Send local file: " . $localPath . " " . $request->getMethod() . " " . $url["path"]);
		}

		// Send local file to remote system
		$request->setLocalFile($localPath);

		// Send request
		$response = $request->send();
		if ($response->getCode() >= 500) {
			throw new MOXMAN_Exception("Upload failed: AmazonS3 returned an error.");
		}
	}

	/**
	 * Sends a XML request to the S3 rest API.
	 *
	 * @param Array $params Name/value array of query string parameters.
	 * @param String $urlpath Url path part.
	 * @param String $method Request method, GET, DELETE etc.
	 * @return SimpleXMLElement Simple XML element of the response body.
	 */
	public function sendXmlRequest($params) {
		$body = $this->sendRequest($params);
		if ($body) {
			$xml = new SimpleXMLElement($body);
		}

		return $xml;
	}

	public function sendRequest($params) {
		$date = gmdate('r');

		// Default params
		$params = array_merge(array(
			"method" => "GET",
			"path" => "/",
			"query" => array(),
			"date" => $date,
			"contentMD5" => "",
			"contentType" => "",
			"amzHeaders" => array(),
			"resource" => ""
		), $params);

		// Replace spaces in file names
		$params["path"] = str_replace(' ', '%20', $params["path"]);

		// Build amz headers
		$amzHeaders = "";
		foreach ($params["amzHeaders"] as $key => $value) {
			$amzHeaders .= $key . ':' . $value . "\n";
		}
		$amzHeaders .= "/" . $this->bucket["name"] . $params["path"];

		// Create signature
		$signature = trim(implode(array(
			$params["method"],
			$params["contentMD5"],
			$params["contentType"],
			$params["date"],
			$amzHeaders,
			$params["resource"]
		), "\n"));

		$signature = $this->hash($signature);

		// Create request
		$request = $this->httpClient->createRequest($params["path"], $params["method"]);

		foreach ($params["amzHeaders"] as $key => $value) {
			$request->setHeader($key, $value);
		}

		$request->setHeader("date", $params["date"]);
		$request->setHeader("Authorization", "AWS " . $this->getBucketOption("publickey") . ":" . $signature);

		// PUT/DELETE needs 0 length for some reason
		if ($params["method"] == "PUT" || $params["method"] == "DELETE") {
			$request->setHeader("Content-Length", 0);
			$request->setHeader("Transfer-Encoding", "");
		}

		$query = http_build_query($params["query"]);

		if (MOXMAN::getLogger()) {
			MOXMAN::getLogger()->debug("[s3] Send request: " . $params["method"] . " " . $params["path"] . ($query ? "?" . $query : ""));
		}

		$response = $request->send($params["query"]);

		if ($response->getCode() >= 400) {
			throw new MOXMAN_Exception(
				"Could not process AmazonS3 request: " . $response->getCode()
			);
		}

		return $response->getBody();
	}

	/**
	 * Logs HTTP client messages to log file with a specific prefix.
	 *
	 * @param mixed $str String to log.
	 */
	public function logHttpClient($str) {
		MOXMAN::getLogger()->debug("[s3] " . $str);
	}

	/**
	 * Generates the hash required for an Amazon S3 request signature.
	 *
	 * @param String $signature Signature to generate hash for.
	 * @return String Hash of the specified signature.
	 */
	private function hash($signature) {
		// Check for native support PHP 5.1+
		if (function_exists('hash_hmac')) {
			return base64_encode(hash_hmac('sha1', $signature, $this->getBucketOption("secretkey"), true));
		}

		// Fallback for older PHP versions
		$secretKey = $this->getBucketOption("secretkey");
		$padd1 = str_pad($secretKey, 64, chr(0x00)) ^ (str_repeat(chr(0x5c), 64));
		$padd2 = str_pad($secretKey, 64, chr(0x00)) ^ (str_repeat(chr(0x36), 64));

		return base64_encode(pack('H*', sha1($padd1 . pack('H*', sha1($padd2 . $signature)))));
	}
}

?>