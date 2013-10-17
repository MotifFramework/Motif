<?php
/**
 * DebugHandler.php
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/**
 * Http handler that makes it possible to retrieve some debug data if debug is set to true
 *
 * @package MOXMAN_Handlers
 */
class MOXMAN_Handlers_DebugHandler implements MOXMAN_Http_IHandler {
	/**
	 * Process a request using the specified context.
	 *
	 * @param MOXMAN_Http_Context $httpContext Context instance to pass to use for the handler.
	 */
	public function processRequest(MOXMAN_Http_Context $httpContext) {
		$config = MOXMAN::getConfig();

		if (!$config->get("general.debug")) {
			return;
		}

		$request = $httpContext->getRequest();

		if ($request->get("info")) {
			phpinfo();
			die();
		}

		$response = $httpContext->getResponse();
		$response->disableCache();
		$response->setHeader('Content-type', 'text/html');

		$sitepaths = MOXMAN_Util_PathUtils::getSitePaths();

		$scriptFilename = $_SERVER["SCRIPT_FILENAME"];
		if (realpath($scriptFilename) != $scriptFilename) {
			$scriptFilename = $scriptFilename . "<br />(". realpath($scriptFilename) .")";
		}

		$result = array(
			"MOXMAN_ROOT" => MOXMAN_ROOT,
			"realpath('.')" => realpath("."),
			"Config.php rootpath" => $config->get("filesystem.rootpath"),
			"Config.php wwwroot" => $config->get("filesystem.local.wwwroot"),
			"wwwroot resolve" => $sitepaths["wwwroot"],
			"wwwroot realpath" => realpath($sitepaths["wwwroot"]),
			"prefix resolve" => $sitepaths["prefix"],
			"storage path" => MOXMAN_Util_PathUtils::toAbsolute(MOXMAN_ROOT, $config->get("storage.path")),
			"storage writable" => is_writable(MOXMAN_Util_PathUtils::toAbsolute(MOXMAN_ROOT, $config->get("storage.path"))),
			"script filename" => $scriptFilename,
			"script name" => $_SERVER["SCRIPT_NAME"]
		);

		$out = "<html><body><table border='1'>";
		foreach($result as $name => $value) {
			if ($value === true) {
				$value = "True";
			} else if ($value === false) {
				$value = "False";
			}

			$out .= "<tr>";
			$out .= "<td>". $name ."&nbsp;</td><td>". $value ."&nbsp;</td>";
			$out .= "</tr>";
		}
		$out .= "</table><a href='?action=debug&info=true'>Show phpinfo</a>";
		$out .= "</body></html>";

		$response->sendContent($out);
	}
}

?>