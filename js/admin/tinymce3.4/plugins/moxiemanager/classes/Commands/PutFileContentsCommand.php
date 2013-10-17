<?php
/**
 * PutFileContentsCommand.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * Command that creates files.
 *
 * @package MOXMAN_Commands
 */
class MOXMAN_Commands_PutFileContentsCommand extends MOXMAN_Commands_BaseCommand {
	/**
	 * Executes the command logic with the specified RPC parameters.
	 *
	 * @param Object $params Command parameters sent from client.
	 * @return Object Result object to be passed back to client.
	 */
	public function execute($params) {
		$file = MOXMAN::getFile($params->path);
		$config = $file->getConfig();

		if ($config->get('general.demo')) {
			throw new MOXMAN_Exception(
				"This action is restricted in demo mode.",
				MOXMAN_Exception::DEMO_MODE
			);
		}

		if (!$file->canWrite()) {
			throw new MOXMAN_Exception(
				"No write access to file: " . $file->getPublicPath(),
				MOXMAN_Exception::NO_WRITE_ACCESS
			);
		}

		$filter = MOXMAN_Vfs_CombinedFileFilter::createFromConfig($config, "edit");
		if (!$filter->accept($file)) {
			throw new MOXMAN_Exception(
				"Invalid file name for: " . $file->getPublicPath(),
				MOXMAN_Exception::INVALID_FILE_NAME
			);
		}

		if ($file->exists()) {
			$file->delete(true);
		}

		// Write contents to file
		$stream = $file->open(MOXMAN_Vfs_IFileStream::WRITE);
		if ($stream) {
			$stream->write($params->content);
			$stream->close();
		}

		$this->fireFileAction(MOXMAN_Vfs_FileActionEventArgs::ADD, $file);

		return $this->fileToJson($file);
	}
}

?>