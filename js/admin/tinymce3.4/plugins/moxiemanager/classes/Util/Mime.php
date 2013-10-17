<?php
/**
 * Mime.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * This class will return mime types for files by extracting the extension and comparing it
 * to a Apache style mime types file.
 *
 * @package MOXMAN_Util
 */
class MOXMAN_Util_Mime {
	/** @ignore */
	private static $mimes = array(), $lastMimeFile, $pos = 0;

	/**
	 * Returns the mime type of an path by resolving it agains a apache style "mime.types" file.
	 *
	 * @param string $path path to Map/get content type by
	 * @param String $mimeFile Absolute filepath to mime.types style file.
	 * @return String mime type of path or an empty string on failue.  
	 */
	public static function get($path, $mimeFile = "") {
		$mime = "";
		$path = explode('.', $path);
		$ext = strtolower(array_pop($path));

		// Use cached mime type
		if (isset(self::$mimes[$ext])) {
			return self::$mimes[$ext];
		}

		// No mime type file specified
		if ($mimeFile === "") {
			$mimeFile = dirname(__FILE__) . '/mimes.txt';
		}

		// Open mime file and start parsing it
		if (($fp = fopen($mimeFile, "r"))) {
			// Seek to last location
			if (self::$lastMimeFile === $mimeFile) {
				fseek($fp, self::$pos, SEEK_SET);
			}

			while (!feof($fp)) {
				$line = trim(fgets($fp, 4096));
				$chunks = preg_split("/(\t+)|( +)/", $line);

				for ($i = 1, $l = count($chunks); $i < $l; $i++) {
					// Cache mime types we do find
					self::$mimes[$chunks[$i]] = $chunks[0];

					if (rtrim($chunks[$i]) == $ext) {
						// Store away file location
						self::$pos = ftell($fp);
						self::$lastMimeFile = $mimeFile;

						// Return the mime type
						$mime = $chunks[0];
						break;
					}
				}
			}

			fclose($fp);
		}

		return $mime;
	}
}

?>