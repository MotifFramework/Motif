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

$res = \Febe\Framework\Data_MySql::executeReader("SELECT contentId, contentAlias from LB_Content");

$republished = 0;
$skipped = 0;
$processed = 0;
$count = count($res);

echo "Republishing...\n";
foreach ($res as $r) {
    if ($contentObj = \Febe\ContentManagement\Logic_Content::loadContentById($r['contentId'])) {
        if ($cache = \Febe\ContentManagement\Logic_ContentCache::loadContentCache($contentObj->fullURL)) {
            $contentObj->publish(true);
            $action = 'Republished';
            $republished++;
        } else {
            $action = 'Skipped';
            $skipped++;
        }
        $processed++;
        echo "($processed/$count) $action {$contentObj->contentId} {$contentObj->fullURL}.html \n";
    }
}

echo "Processed $processed content objects: Republished $republished and skipped $skipped non-published objects.\n";
