<?php
/**
 * LanguageHandler.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * ...
 *
 * @package MOXMAN_Handlers
 */
class MOXMAN_Handlers_LanguageHandler implements MOXMAN_Http_IHandler {
	/**
	 * Process a request using the specified context.
	 *
	 * @param MOXMAN_Http_Context $httpContext Context instance to pass to use for the handler.
	 */
	public function processRequest(MOXMAN_Http_Context $httpContext) {
		$request = $httpContext->getRequest();
		$response = $httpContext->getResponse();
		$langCode = preg_replace('/[^a-z_\-]/i', '', $request->get('code', MOXMAN::getConfig()->get("general.language")));

		$response->disableCache();
		$response->setHeader('Content-type', 'text/javascript');

		if ($request->get("tinymce")) {
			$langFile = MOXMAN_ROOT . '/langs/' . $langCode . '.js';
		} else {
			$langFile = MOXMAN_ROOT . '/langs/moxman_' . $langCode . '.js';
		}

		if (file_exists($langFile)) {
			$response->sendContent(file_get_contents($langFile));
		}
	}
}
?>