<?php
/**
 * MoveToCommand.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * Command for moving multiple files from one path to another.
 *
 * @package MOXMAN_Commands
 */
class MOXMAN_Commands_MoveToCommand extends MOXMAN_Commands_BaseCommand {
	/**
	 * Executes the command logic with the specified RPC parameters.
	 *
	 * @param Object $params Command parameters sent from client.
	 * @return Object Result object to be passed back to client.
	 */
	public function execute($params) {
		$from = $params->from;
		$to = $params->to;

		// Move multiple files
		if (is_array($from)) {
			$result = array();
			foreach ($from as $path) {
				$fromFile = MOXMAN::getFile($path);
				$toFile = MOXMAN::getFile($to, $fromFile->getName());
				$this->moveFile($fromFile, $toFile);

				$result[] = parent::fileToJson($toFile);
			}

			return $result;
		}

		// Move single file
		$fromFile = MOXMAN::getFile($from);
		$toFile = MOXMAN::getFile($params->to);
		$this->moveFile($fromFile, $toFile);

		return parent::fileToJson($toFile);
	}

	/** @ignore */
	private function moveFile($fromFile, $toFile) {
		$config = $toFile->getConfig();

		if ($config->get('general.demo')) {
			throw new MOXMAN_Exception(
				"This action is restricted in demo mode.",
				MOXMAN_Exception::DEMO_MODE
			);
		}

		if (!$fromFile->exists()) {
			throw new MOXMAN_Exception(
				"From file doesn't exist: " . $fromFile->getPublicPath(),
				MOXMAN_Exception::FILE_DOESNT_EXIST
			);
		}

		if ($toFile->exists()) {
			if (strtolower($fromFile->getPath()) != strtolower($toFile->getPath()) || $fromFile->getName() == $toFile->getName()) {
				throw new MOXMAN_Exception(
					"To file already exist: " . $toFile->getPublicPath(),
					MOXMAN_Exception::FILE_EXISTS
				);
			}
		}

		if (!$fromFile->canWrite()) {
			throw new MOXMAN_Exception(
				"No write access to file: " . $fromFile->getPublicPath(),
				MOXMAN_Exception::NO_WRITE_ACCESS
			);
		}

		if (!$toFile->canWrite()) {
			throw new MOXMAN_Exception(
				"No write access to file: " . $toFile->getPublicPath(),
				MOXMAN_Exception::NO_WRITE_ACCESS
			);
		}

		$filter = MOXMAN_Vfs_BasicFileFilter::createFromConfig($config);
		if (!$filter->accept($fromFile, $fromFile->isFile())) {
			throw new MOXMAN_Exception(
				"Invalid file name for: " . $fromFile->getPublicPath(),
				MOXMAN_Exception::INVALID_FILE_NAME
			);
		}

		$filter = MOXMAN_Vfs_CombinedFileFilter::createFromConfig($config, "rename");
		if (!$filter->accept($toFile, $fromFile->isFile())) {
			throw new MOXMAN_Exception(
				"Invalid file name for: " . $toFile->getPublicPath(),
				MOXMAN_Exception::INVALID_FILE_NAME
			);
		}

		// Fire before file action event
		$args = $this->fireBeforeTargetFileAction(MOXMAN_Vfs_FileActionEventArgs::MOVE, $fromFile, $toFile);
		$fromFile = $args->getFile();
		$toFile = $args->getTargetFile();

		$fromFile->moveTo($toFile);

		$this->fireTargetFileAction(MOXMAN_Vfs_FileActionEventArgs::MOVE, $fromFile, $toFile);
	}
}

?>