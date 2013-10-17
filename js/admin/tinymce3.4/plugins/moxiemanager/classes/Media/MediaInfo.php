<?php
/**
 * MediaInfo.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * This class returns information about media types. Such as width/height/depth etc.
 *
 * @package MOXMAN_Media
 */
class MOXMAN_Media_MediaInfo {
	/**
	 * Returns an array with media info.
	 *
	 * @param MOXMAN_Vfs_IFile $file File to get the media info for.
	 * @return Array Name/value array with media info.
	 */
	public static function getInfo(MOXMAN_Vfs_IFile $file) {
		if (!$file->exists()) {
			return null;
		}

		$ext = strtolower(MOXMAN_Util_PathUtils::getExtension($file->getName()));

		switch ($ext) {
			case "png":
				return self::getPngInfo($file);

			default:
				if ($file instanceof MOXMAN_Vfs_Local_File) {
					$size = @getimagesize($file->getPath());

					if ($size) {
						return array("width" => $size[0], "height" => $size[1]);
					}
				}
		}
	}

	// @codeCoverageIgnoreStart

	/** @ignore */
	private static function getPngInfo(MOXMAN_Vfs_IFile $file) {
		$stream = null;
		$info = array();

		try {
			$stream = $file->open(MOXMAN_Vfs_IFileStream::READ);
			$magic = $stream->read(8);
			if ($magic === "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A" ) { // Is PNG
				// Read chunks
				do {
					$buff = $stream->read(4);

					if (strlen($buff) != 4) {
						break;
					}

					$chunk = unpack('Nlen', $buff);
					$chunk['type'] = $stream->read(4);

					if (strlen($chunk['type']) != 4) {
						break;
					}

					// Found header then read it
					if ($chunk['type'] == 'IHDR') {
						$header = unpack('Nwidth/Nheight/Cbits/Ctype/Ccompression/Cfilter/Cinterlace', $stream->read(13));
						break;
					}

					// Jump to next chunk and skip CRC
					$stream->skip($chunk['len'] + 4);
				} while ($buff !== null);

				$info = array(
					"width" => $header["width"],
					"height" => $header["height"],
					"depth" => $header['type'] == 3 ? 8 : 32
				);
			}

			$stream->close();

			return $info;
		} catch (Exception $e) {
			if ($stream) {
				$stream->close();
			}

			throw $e;
		}
	}

	// @codeCoverageIgnoreEnd
}
?>