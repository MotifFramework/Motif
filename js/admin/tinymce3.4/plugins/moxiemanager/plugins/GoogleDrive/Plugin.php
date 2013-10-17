<?php
/**
 * Plugin.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * ...
 */
class MOXMAN_GoogleDrive_Plugin implements MOXMAN_IPlugin, MOXMAN_ICommandHandler {
	public function init() {
	}

	/**
	 * Gets executed when a RPC call is made.
	 *
	 * @param string $name Name of RPC command to execute.
	 * @param Object $params Object passed in from RPC handler.
	 * @return Object Return object that gets passed back to client.
	 */
	public function execute($name, $params) {
		if ($name === "googledrive.getClientId") {
			return MOXMAN::getConfig()->get("googledrive.client_id");
		}
	}
}

// Add plugin
MOXMAN::getPluginManager()->add("googledrive", new MOXMAN_GoogleDrive_Plugin());

?>