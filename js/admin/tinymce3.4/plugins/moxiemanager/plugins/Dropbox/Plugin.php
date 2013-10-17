<?php
/**
 * Plugin.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * ...
 */
class MOXMAN_Dropbox_Plugin implements MOXMAN_IPlugin, MOXMAN_ICommandHandler {
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
		if ($name === "dropbox.getClientId") {
			return MOXMAN::getConfig()->get("dropbox.app_id");
		}
	}
}

MOXMAN::getPluginManager()->add("dropbox", new MOXMAN_Dropbox_Plugin());

?>