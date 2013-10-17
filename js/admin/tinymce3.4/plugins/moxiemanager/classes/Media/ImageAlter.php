<?php
/**
 * ImageAlter.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * This class does basic image manipulation and enables you to batch operations.
 *
 * @package MOXMAN_Media
 */
class MOXMAN_Media_ImageAlter {
	/** @ignore */
	private $image, $depth;

	/**
	 * Loads the specified file path for manipulation.
	 *
	 * @param string $path Path of file to load.
	 */
	public function load($path) {
		// @codeCoverageIgnoreStart
		if (!function_exists("imagecreatefromjpeg")) {
			throw new Exception("Your PHP installation doesn't have GD enabled.");
		}
		// @codeCoverageIgnoreEnd

		switch (MOXMAN_Util_PathUtils::getExtension($path)) {
			case "jpg":
			case "jpeg":
				$this->depth = 24;
				$this->image = imagecreatefromjpeg($path);
				break;

			case "gif":
				$this->depth = 8;
				$this->image = imagecreatefromgif($path);
				imagealphablending($this->image, false);
				imagesavealpha($this->image, true);
				break;

			case "png":
				// todo: fix me!
				//$info = MOXMAN_Media_MediaInfo::getInfo($file);
				$this->depth = 24;
				$this->image = imagecreatefrompng($path);
				imagesavealpha($this->image, true);
				break;
		}
	}

	/**
	 * Saves the current image to the specified file.
	 *
	 * @param stirng $path Path of file to save to.
	 * @param int $quality Image quality for jpegs.
	 */
	public function save($path, $quality = 90) {
		switch (MOXMAN_Util_PathUtils::getExtension($path)) {
			case "jpg":
			case "jpeg":
				$result = imagejpeg($this->image, $path, $quality);
				break;

			case "gif":
				$result = imagegif($this->image, $path);
				break;

			case "png":
				$result = imagepng($this->image, $path);
				break;
		}

		$this->destroy();
	}

	/**
	 * Loads the specified file instance for manipulation.
	 *
	 * @param string $file File instance to load.
	 */
	public function loadFromFile(MOXMAN_Vfs_IFile $file) {
		if ($file instanceof MOXMAN_Vfs_Local_File) {
			return $this->load($file->getInternalPath());
		}

		// @codeCoverageIgnoreStart
		if (!function_exists("imagecreatefromjpeg")) {
			throw new Exception("Your PHP installation doesn't have GD enabled.");
		}
		// @codeCoverageIgnoreEnd

		// Load image into RAM then create it from that
		// TODO: Replace this once PHP get proper buffers for GD
		$stream = $file->open(MOXMAN_Vfs_IFileStream::READ);
		$this->image = imagecreatefromstring($stream->readToEnd());
		$stream->close();

		switch (MOXMAN_Util_PathUtils::getExtension($file->getName())) {
			case "jpg":
			case "jpeg":
				$this->depth = 24;
				break;

			case "gif":
				$this->depth = 8;
				imagealphablending($this->image, false);
				imagesavealpha($this->image, true);
				break;

			case "png":
				// todo: fix me!
				//$info = MOXMAN_Media_MediaInfo::getInfo($file);
				$this->depth = 24;
				imagesavealpha($this->image, true);
				break;
		}
	}

	/**
	 * Saves the image to the specified file.
	 *
	 * @param stirng $file File instance to save image to.
	 * @param int $quality Image quality for jpegs.
	 */
	public function saveToFile(MOXMAN_Vfs_IFile $file, $quality = 90) {
		if ($file instanceof MOXMAN_Vfs_Local_File) {
			return $this->save($file->getInternalPath());
		}

		// Load image into RAM then write that to file
		// TODO: Replace this once PHP get proper buffers for GD
		$stream = $file->open(MOXMAN_Vfs_IFileStream::WRITE);
		$stream->write($this->getAsString(MOXMAN_Util_PathUtils::getExtension($file->getName()), $quality));
		$stream->close();
	}

	/**
	 * Returns the image as a string.
	 *
	 * @param string $type jpg, gif or png type name, defaults to input type.
	 * @param int $quality Image quality for jpegs.
	 * @return string Image as a string.
	 */
	public function getAsString($type, $quality = 90) {
		ob_start();

		switch ($type) {
			case "jpg":
			case "jpeg":
				$result = imagejpeg($this->image, null, $quality);
				break;

			case "gif":
				$result = imagegif($this->image);
				break;

			case "png":
				$result = imagepng($this->image);
				break;
		}

		$this->destroy();
		$data = ob_get_contents();
		ob_end_clean();

		return $data;
	}

	/**
	 * Resizes the image to the specified size.
	 *
	 * @param int $width Width to scale the image to.
	 * @param int $height Height to scale the image to.
	 * @param int Constrain proportions, defaults to false.
	 */
	public function resize($width, $height, $proportional = false) {
		if ($proportional) {
			$ratio = min($width / imagesx($this->image), $height / imagesy($this->image));

			$width = intval(floor(imagesx($this->image) * $ratio));
			$height = intval(floor(imagesy($this->image) * $ratio));

			$width = ($width > 0) ? $width : 1;
			$height = ($height > 0) ? $height : 1;
		}

		$destImg = $this->createImage($width, $height);

		imagecopyresampled(
			$destImg,
			$this->image,
			0, 0, 0, 0,
			$width, $height,
			imagesx($this->image),
			imagesy($this->image)
		);

		$this->setImage($destImg);
	}

	/**
	 * This method creates a thumbnail for the image. It will only scale the image down never up and it will always
	 * be proportional.
	 *
	 * @param int $width Target width.
	 * @param int $height Target height.
	 * @return Boolean True/false if the scale occured or not.
	 */
	public function createThumbnail($width, $height, $mode="resize") {
		if ($mode == "crop") {
			$heightRatio = imagesy($this->image) / $height;
			$widthRatio = imagesx($this->image) / $width;

			if ($heightRatio < $widthRatio) {
				$optimalRatio = $heightRatio;
			} else {
				$optimalRatio = $widthRatio;
			}

			$optimalHeight = imagesy($this->image) / $optimalRatio;
			$optimalWidth = imagesx($this->image) / $optimalRatio;

			$this->resize($optimalWidth, $optimalHeight);

			// *** Find center - this will be used for the crop
			$cropStartX = ( $optimalWidth / 2) - ( $width / 2 );
			$cropStartY = ( $optimalHeight / 2) - ( $height / 2 );

			$this->crop($cropStartX, $cropStartY, $width, $height);
		} else {
			$ratio = min($width / imagesx($this->image), $height / imagesy($this->image));
			if ($ratio >= 1) {
				return false; // Scale is up
			}

			$width = intval(floor(imagesx($this->image) * $ratio));
			$height = intval(floor(imagesy($this->image) * $ratio));

			$width = ($width > 0) ? $width : 1;
			$height = ($height > 0) ? $height : 1;

			$this->resize($width, $height);
		}

		return true;
	}

	/**
	 * Crops the currently loaded image to the specified x, y and width/height.
	 *
	 * @param int $x X position to start crop from.
	 * @param int $y Y position to start crop from.
	 * @param int $width Width to crop by.
	 * @param int $height Height to crop by.
	 */
	public function crop($x, $y, $width, $height) {
		$destImg = $this->createImage($width, $height);

		imagecopyresampled(
			$destImg,
			$this->image,
			0, 0, $x, $y,
			$width, $height,
			$width, $height
		);

		$this->setImage($destImg);
	}

	/**
	 * Flips the image by the vertical or horizotal axis.
	 *
	 * @param Boolean $horizontal Horizontal flip.
	 */
	public function flip($horizontal) {
		$width = imagesx($this->image);
		$height = imagesy($this->image);
		$destImg = $this->createImage($width, $height);

		if ($horizontal) {
			for ($i = 0; $i < $width; $i++) {
				imagecopyresampled($destImg, $this->image, $width - $i - 1, 0, $i, 0, 1, $height, 1, $height);
			}
		} else {
			for ($i = 0; $i < $height; $i++) {
				imagecopyresampled($destImg, $this->image, 0, $height - $i - 1, 0, $i, $width, 1, $width, 1);
			}
		}

		$this->setImage($destImg);
	}

	/**
	 * Rotates the image to the specifed angle. The angles are fixes at 90 degrees intervals.
	 *
	 * @param int $angle Angle to rotate the image to.
	 */
	public function rotate($angle) {
		// Use imagerotate on 24 bits images since it's faster
		if ($this->depth == 24) {
			if ($angle == 90) {
				$angle = 270;
			} else if ($angle == 270) {
				$angle = 90;
			}

			$this->setImage(imagerotate($this->image, $angle, 0));
			return;
		}

		// note: imagerotate can't be used since it changes the RGB colors on 8 bit images
		switch ($angle) {
			case 90:
				$width = imagesx($this->image);
				$height = imagesy($this->image);
				$image = $this->createImage($height, $width);

				for ($x = 0; $x < $width; $x++) {
					for ($y = 0; $y < $height; $y++) {
						imagecopy($image, $this->image, $height - $y - 1, $x, $x, $y, 1, 1);
					}
				}
				break;

			case 180:
				$this->flip(false);
				$this->flip(true);
				return;

			case 270:
				$width = imagesx($this->image);
				$height = imagesy($this->image);
				$image = $this->createImage($height, $width);

				for ($x = 0; $x < $width; $x++) {
					for ($y = 0; $y < $height; $y++) {
						imagecopy($image, $this->image, $y, $width - $x - 1, $x, $y, 1, 1);
					}
				}
		}

		$this->setImage($image);
	}

	/**
	 * Destroys the internal data to free resources.
	 */
	public function destroy() {
		if ($this->image) {
			imagedestroy($this->image);
			$this->image = null;
		}
	}

	/**
	 * Returns true/false if the specified file can be altered or not.
	 *
	 * @param MOXMAN_Vfs_IFile $file File to check if can be altered.
	 * @return Boolean True/false if the image can be edited or not.
	 */
	public static function canEdit(MOXMAN_Vfs_IFile $file) {
		$ext = MOXMAN_Util_PathUtils::getExtension($file->getName());

		return preg_match('/gif|jpe?g|png/', $ext) === 1;
	}

	/** @ignore */
	private function setImage($img) {
		// Replace the internal image with the new one
		$this->destroy();
		$this->image = $img;
	}

	/** @ignore */
	private function createImage($width, $height) {
		if ($this->depth === 8) {
			$image = imagecreate($width, $height);
			imagealphablending($image, false);
			imagesavealpha($image, true);

			$transparent = imagecolorallocate($image, 255, 255, 255);
			imagefilledrectangle($image, 0, 0, $width, $height, $transparent);
			imagecolortransparent($image, $transparent);

			return $image;
		}

		$image = imagecreatetruecolor($width, $height);
		imagealphablending($image, false);
		imagesavealpha($image, true);

		return $image;
	}
}

?>