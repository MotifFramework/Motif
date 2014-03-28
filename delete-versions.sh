#!/usr/bin/env php
<?php

/*
 * Standard CORE CLI Setup, which assumes that this script is run from
 * somewhere inside a project_resources folder which resides at the same
 * level as the docroot folder for this project.
 */
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
$myDir = dirname(__FILE__);
$basePath = preg_replace('/\/project_resources.*/', '/docroot', $myDir);
define("LB_BASE_PATH", $basePath . '/');
require $basePath . '/lib/Febe/Init.php';

$user = \Febe\UserManagement\Logic_User::loginUser('lbadmin@lifeblue.com');

$results = \Febe\Framework\Data_MySql::executeReader("SELECT contentId, contentAlias FROM LB_Content");

$processed = 0;

echo "Deleting...\n";
foreach ($results as $res) {
    $versions = \Febe\Framework\Data_MySql::executeReader("SELECT versionId FROM LB_ContentVersion WHERE contentId = {$res['contentId']} ORDER BY versionId DESC");
    foreach ($versions as $vKey => $vVal) {
        if ($vKey == 0 || $vKey == 1) {
            echo " Skipping contentId:\t{$res['contentId']}\tversionId: {$vVal['versionId']}\n";
            continue;
        }

        \Febe\Framework\Data_MySql::executeNonQuery("DELETE FROM LB_ContentData_Float WHERE versionId = {$vVal['versionId']}");
        \Febe\Framework\Data_MySql::executeNonQuery("DELETE FROM LB_ContentData_Int WHERE versionId = {$vVal['versionId']}");
        \Febe\Framework\Data_MySql::executeNonQuery("DELETE FROM LB_ContentData_Text WHERE versionId = {$vVal['versionId']}");
        \Febe\Framework\Data_MySql::executeNonQuery("DELETE FROM LB_ContentData_VC255 WHERE versionId = {$vVal['versionId']}");
        \Febe\Framework\Data_MySql::executeNonQuery("DELETE FROM LB_ContentData_VC64 WHERE versionId = {$vVal['versionId']}");
        \Febe\Framework\Data_MySql::executeNonQuery("DELETE FROM LB_ContentVersion WHERE versionId = {$vVal['versionId']}");

        $processed++;
        echo "Deleting contentId:\t{$res['contentId']}\tversionId: {$vVal['versionId']}\n";
    }
}

echo "Deleted $processed content object versions.\n";
