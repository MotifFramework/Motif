<?php
/**
 * Plugin.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

@session_start();

/**
 * This class handles MoxieManager SessionAuthenticator stuff.
 */
class MOXMAN_SessionAuthenticator_Plugin implements MOXMAN_Auth_IAuthenticator {
	public function authenticate(MOXMAN_Auth_User $user) {
		$config = MOXMAN::getConfig();
		$session = MOXMAN_Http_Context::getCurrent()->getSession();

		// Check logged in key
		$sessionValue = $session->get($config->get("SessionAuthenticator.logged_in_key"), false);
		if (!$sessionValue || $sessionValue === "false") {
			return false;
		}

		// Extend config with session prefixed sessions
		$sessionConfig = array();
		$configPrefix = $config->get("SessionAuthenticator.config_prefix");
		if ($configPrefix) {
			foreach ($_SESSION as $key => $value) {
				if (strpos($key, $configPrefix) === 0) {
					$sessionConfig[substr($key, strlen($configPrefix) + 1)] = $value;
				}
			}
		}

		// Extend the config with the session config
		$config->extend($sessionConfig);

		// Replace ${user} with all config items
		$key = $config->get("SessionAuthenticator.user_key");
		if ($key && isset($_SESSION[$key])) {
			$config->replaceVariable("user", $session->get($key));
			$user->setName($session->get($key));
		}

		// The user is authenticated so let them though
		return true;
	}
}

MOXMAN::getAuthManager()->add("SessionAuthenticator", new MOXMAN_SessionAuthenticator_Plugin());

?>