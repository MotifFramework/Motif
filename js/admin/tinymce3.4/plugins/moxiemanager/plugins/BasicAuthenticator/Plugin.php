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
class MOXMAN_BasicAuthenticator_Plugin implements MOXMAN_Auth_IStandaloneAuthenticator {
	public function authenticate(MOXMAN_Auth_User $user) {
		if (isset($_COOKIE["moxmanauth"])) {
			$config = MOXMAN::getConfig();
			$userKey = $_COOKIE["moxmanauth"];

			foreach ($config->get('basicauthenticator.users') as $userItem) {
				$matchKey = hash("sha256",
					$userItem["username"] .
					$userItem["password"] .
					$config->get('general.license')
				);

				if ($userKey === $matchKey) {
					$user->setName($userItem["username"]);
					return true;
				}
			}
		}

		if (isset($_SESSION["moxman_authUser"])) {
			$user->setName($_SESSION["moxman_authUser"]);
			return true;
		}

		return false;
	}

	public function login(MOXMAN_Auth_User $user) {
		$config = MOXMAN::getConfig();

		foreach ($config->get('basicauthenticator.users') as $userItem) {
			if ($userItem["username"] == $user->getName() && $userItem["password"] == $user->getPassword()) {
				if ($user->isPersistent()) {
					setcookie("moxmanauth", hash("sha256",
						$userItem["username"] .
						$userItem["password"] .
						$config->get('general.license')
					));
				} else {
					$_SESSION["moxman_authUser"] = $user->getName();
				}

				return true;
			}
		}

		return false;
	}

	public function logout(MOXMAN_Auth_User $user) {
		unset($_SESSION["moxman_authUser"]);
		setcookie("moxmanauth", "", time() - 3600);
	}
}

MOXMAN::getAuthManager()->add("BasicAuthenticator", new MOXMAN_BasicAuthenticator_Plugin());

?>