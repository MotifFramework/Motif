<?php
Header("Content-type: application/json; charset=utf-8");

$secretKey = "";

if (!$secretKey) {
	die('{"error" : {"message" : "No secret key set.", "code" : 130}}');
}

if (!isset($_REQUEST["hash"]) || !isset($_REQUEST["seed"])) {
	die('{"error" : {"message" : "Error in input.", "code" : 120}}');
}

// Check authentication with your CMS
if (!isset($_SESSION["isLoggedIn"]) || !$_SESSION["isLoggedIn"]) {
	die('{"error" : {"message" : "Not authenticated.", "code" : 180}}');
}

$hash = $_REQUEST["hash"];
$seed = $_REQUEST["seed"];

$localHash = hash_hmac('sha256', $seed, $secretKey);

if ($hash == $localHash) {
	// Hard code some rootpath, get something from sessions etc.
	die('{"result" : {"filesystem.rootpath" : "C:/Inetpub/wwwroot/test"}}');
} else {
	die('{"error" : {"message" : "Error in input.", "code" : 120}}');
}
?>