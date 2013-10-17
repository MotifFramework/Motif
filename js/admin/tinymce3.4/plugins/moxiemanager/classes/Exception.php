<?php
/**
 * Exception.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * Exception class used across the product.
 *
 * @package MOXMAN
 */
class MOXMAN_Exception extends Exception {
	/** @ignore */
	private $data;

	const NO_ACCESS = 10;
	const NEEDS_INSTALLATION = 11;
	const DEMO_MODE = 100;
	const NO_READ_ACCESS = 101;
	const NO_WRITE_ACCESS = 102;
	const FILE_EXISTS = 103;
	const FILE_SIZE_TO_LARGE = 104;
	const FILE_DOESNT_EXIST = 105;
	const INVALID_FILE_NAME = 106;
	const METHOD_NOT_FOUND = 107;
	const INVALID_FILE_TYPE = 108;
	const NO_ACCESS_EXTERNAL_AUTH = 1009;

	/**
	 * Sets the current file where the exception was thrown.
	 *
	 * @param string $file File where the exception was thrown.
	 */
	public function setFile($file) {
		$this->file = $file;
	}

	/**
	 * Sets the line number where the exception was thrown.
	 *
	 * @param int $line Line number where the exception was thrown.
	 */
	public function setLine($line) {
		$this->line = $line;
	}

	/**
	 * Sets data to be passed out with the exception could for example a file path.
	 *
	 * @param Array $data Array with extra data to send.
	 */
	public function setData($data) {
		$this->data = $data;
	}

	/**
	 * Returns the extra data for the event.
	 *
	 * @return Array $data Array with extra data.
	 */
	public function getData() {
		return $this->data;
	}

	/**
	 * Throws a internal runtime error as a new exception.
	 *
	 * @param int $errno Error number.
	 * @param string $errstr Error string.
	 * @param string $errfile Error file.
	 * @param int $errline Error line.
	 */
	public static function throwRuntimeError($errno, $errstr, $errfile, $errline) {
		$exception = new MOXMAN_Exception($errstr, $errno);

		$exception->setFile($errfile);
		$exception->setLine($errline);

		throw $exception;
	}
}

// Treat everything as errors
@error_reporting(E_ALL);
set_error_handler(array("MOXMAN_Exception", "throwRuntimeError"));

?>