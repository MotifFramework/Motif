<?php

/**
* This class handles MoxieManager SymfonyAuthenticator (Symfony < 2.x).
* Contributed by Tristan Bessoussa
*/
class MOXMAN_SymfonyAuthenticator_Plugin implements MOXMAN_Auth_IAuthenticator {
	public function authenticate(MOXMAN_Auth_User $user) {
		$config = MOXMAN::getConfig();

		if ($config->get('SymfonyAuthenticator.application_name') == '') {
			die('You should define a SymfonyAuthenticator.application_name name in Moxiemanager config file.');
		}

		if ($config->get('SymfonyAuthenticator.application_env') == '') {
			die('You should define a SymfonyAuthenticator.application_env in Moxiemanager config file.');
		}

		if ($config->get('SymfonyAuthenticator.project_configuration_path') == '') {
			die('You should define a SymfonyAuthenticator.project_configuration_path in Moxiemanager config file.');
		}

		require_once($config->get('SymfonyAuthenticator.project_configuration_path'));

		$configuration = ProjectConfiguration::getApplicationConfiguration(
			$config->get('SymfonyAuthenticator.application_name'),
			$config->get('SymfonyAuthenticator.application_env'),
			false
		);

		$context = sfContext::createInstance($configuration);

		// Is the user authenticated ?
		if ($context->getUser()->isAuthenticated()) {

			// Do we need a special role to access to the moxiemanager ?
			if ($config->get('SymfonyAuthenticator.credential') != '') {
				if ($context->getUser()->hasCredential($config->get('SymfonyAuthenticator.credential'))) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
		return false;
	}
}

MOXMAN::getAuthManager()->add("SymfonyAuthenticator", new MOXMAN_SymfonyAuthenticator_Plugin());