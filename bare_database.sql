# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.28-0ubuntu0.12.04.3)
# Database: lb_core_dev_01
# Generation Time: 2013-10-09 02:29:39 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table LB_Actions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Actions`;

CREATE TABLE `LB_Actions` (
  `actionId` int(11) NOT NULL AUTO_INCREMENT,
  `actionType` varchar(128) NOT NULL,
  `actionMessage` varchar(512) NOT NULL,
  `creationDate` int(11) NOT NULL,
  PRIMARY KEY (`actionId`),
  KEY `actionType` (`actionType`),
  KEY `creationDate` (`creationDate`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_Actions` WRITE;
/*!40000 ALTER TABLE `LB_Actions` DISABLE KEYS */;

INSERT INTO `LB_Actions` (`actionId`, `actionType`, `actionMessage`, `creationDate`)
VALUES
  (1,'Users','The user <a href=\"/admin/users/user.html?id=1\">Lifeblue Admin</a> was updated',1381285512);

/*!40000 ALTER TABLE `LB_Actions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_Content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Content`;

CREATE TABLE `LB_Content` (
  `contentId` int(11) NOT NULL AUTO_INCREMENT,
  `fullURL` text,
  `contentSlug` varchar(255) DEFAULT NULL,
  `contentAlias` varchar(255) DEFAULT NULL,
  `contentDescription` text,
  `creator` int(11) DEFAULT NULL,
  `creationDate` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` int(11) DEFAULT NULL,
  `contentSectionId` int(11) DEFAULT NULL,
  `contentTypeId` int(11) DEFAULT NULL,
  `templateId` int(11) DEFAULT NULL,
  `headerStatus` varchar(128) DEFAULT NULL,
  `redirectLocation` varchar(255) DEFAULT NULL,
  `showInNavigation` int(11) DEFAULT NULL,
  `navigationAnchor` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `published` int(11) NOT NULL DEFAULT '0',
  `navigationOrder` int(11) NOT NULL DEFAULT '0',
  `ruleId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`contentId`),
  KEY `ruleId` (`ruleId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_Content` WRITE;
/*!40000 ALTER TABLE `LB_Content` DISABLE KEYS */;

INSERT INTO `LB_Content` (`contentId`, `fullURL`, `contentSlug`, `contentAlias`, `contentDescription`, `creator`, `creationDate`, `updatedBy`, `updatedDate`, `contentSectionId`, `contentTypeId`, `templateId`, `headerStatus`, `redirectLocation`, `showInNavigation`, `navigationAnchor`, `status`, `published`, `navigationOrder`, `ruleId`)
VALUES
  (1,'/index','index','index','',1,1334010178,1,1334010178,0,1,2,'404','',0,'Home',1,0,0,1);

/*!40000 ALTER TABLE `LB_Content` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ContentCache
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentCache`;

CREATE TABLE `LB_ContentCache` (
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `publishedData` text,
  PRIMARY KEY (`fullURL`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_ContentCache` WRITE;
/*!40000 ALTER TABLE `LB_ContentCache` DISABLE KEYS */;

INSERT INTO `LB_ContentCache` (`fullURL`, `publishedData`)
VALUES
  ('/index','{\"template\":\"home\",\"data\":[{\"entityKey\":\"content\",\"data\":\"<p>The home page content.<\\/p>\"},{\"entityKey\":\"metaTitle\",\"data\":\"Home Page\"},{\"entityKey\":\"metaDescription\",\"data\":\"This is the home page for the site\"},{\"entityKey\":\"tweetText\",\"data\":\"\"},{\"entityKey\":\"openGraphTitle\",\"data\":\"\"},{\"entityKey\":\"openGraphDescription\",\"data\":\"\"},{\"entityKey\":\"openGraphImage\",\"data\":\"\"}]}');

/*!40000 ALTER TABLE `LB_ContentCache` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ContentData_Float
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentData_Float`;

CREATE TABLE `LB_ContentData_Float` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_ContentData_Int
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentData_Int`;

CREATE TABLE `LB_ContentData_Int` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_ContentData_Text
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentData_Text`;

CREATE TABLE `LB_ContentData_Text` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` text,
  KEY `versionId` (`versionId`,`contentId`,`contentKey`),
  KEY `contentId` (`contentId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_ContentData_Text` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_Text` DISABLE KEYS */;

INSERT INTO `LB_ContentData_Text` (`versionId`, `contentId`, `contentKey`, `data`)
VALUES
  (1,1,'content','<p>The home page content.</p>'),
  (1,1,'tweetText',''),
  (1,1,'openGraphDescription',''),
  (1,1,'openGraphImage','');

/*!40000 ALTER TABLE `LB_ContentData_Text` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ContentData_VC255
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentData_VC255`;

CREATE TABLE `LB_ContentData_VC255` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) NOT NULL DEFAULT '',
  `data` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`versionId`,`contentId`,`contentKey`),
  KEY `contentId` (`contentId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_ContentData_VC255` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_VC255` DISABLE KEYS */;

INSERT INTO `LB_ContentData_VC255` (`versionId`, `contentId`, `contentKey`, `data`)
VALUES
  (1,1,'metaDescription','This is the home page for the site'),
  (1,1,'metaTitle','Home Page'),
  (1,1,'openGraphTitle','');

/*!40000 ALTER TABLE `LB_ContentData_VC255` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ContentData_VC64
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentData_VC64`;

CREATE TABLE `LB_ContentData_VC64` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_ContentPublishSchedule
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentPublishSchedule`;

CREATE TABLE `LB_ContentPublishSchedule` (
  `contentId` int(11) NOT NULL,
  `publishStart` int(11) DEFAULT NULL,
  `publishEnd` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`contentId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_ContentSections
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentSections`;

CREATE TABLE `LB_ContentSections` (
  `contentSectionId` int(11) NOT NULL AUTO_INCREMENT,
  `parentContentSectionId` int(11) NOT NULL DEFAULT '0',
  `sectionName` varchar(255) DEFAULT NULL,
  `sectionSlug` varchar(255) DEFAULT NULL,
  `sectionDescription` text,
  `showInNavigation` int(11) DEFAULT NULL,
  `navigationAnchor` varchar(255) DEFAULT NULL,
  `fullURL` text,
  `status` int(11) DEFAULT NULL,
  `sectionOrder` int(11) DEFAULT NULL,
  PRIMARY KEY (`contentSectionId`),
  KEY `parentContentSectionId` (`parentContentSectionId`),
  KEY `sectionSlug` (`sectionSlug`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_ContentTypes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentTypes`;

CREATE TABLE `LB_ContentTypes` (
  `contentTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `contentTypeName` varchar(255) DEFAULT NULL,
  `contentTypeDescription` text,
  `templateId` int(11) DEFAULT NULL,
  `defaultAllowsCommenting` int(11) DEFAULT NULL,
  `defaultAllowsRating` int(11) DEFAULT NULL,
  `defaultAllowsTagging` int(11) DEFAULT NULL,
  `defaultAllowsFavoriting` int(11) DEFAULT NULL,
  `parentContentTypeId` int(11) DEFAULT NULL,
  `useOption` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '1',
  `isSelectable` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`contentTypeId`),
  KEY `templateId` (`templateId`),
  KEY `parentContentTypeId` (`parentContentTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_ContentTypes` WRITE;
/*!40000 ALTER TABLE `LB_ContentTypes` DISABLE KEYS */;

INSERT INTO `LB_ContentTypes` (`contentTypeId`, `contentTypeName`, `contentTypeDescription`, `templateId`, `defaultAllowsCommenting`, `defaultAllowsRating`, `defaultAllowsTagging`, `defaultAllowsFavoriting`, `parentContentTypeId`, `useOption`, `status`, `isSelectable`)
VALUES
  (1,'Basic Page','This is a basic interior page',1,0,0,0,0,2,1,1,1),
  (2,'Meta Data','This is the meta data.',1,0,0,0,0,0,2,1,1),
  (3,'Post','A basic blog-style post.',1,0,0,0,0,1,1,1,1);

/*!40000 ALTER TABLE `LB_ContentTypes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ContentVersion
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentVersion`;

CREATE TABLE `LB_ContentVersion` (
  `versionId` int(11) NOT NULL AUTO_INCREMENT,
  `contentId` int(11) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `creationDate` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedDate` int(11) DEFAULT NULL,
  `workflowState` int(11) DEFAULT NULL,
  `scheduleStart` int(11) DEFAULT NULL,
  `scheduleEnd` int(11) DEFAULT NULL,
  PRIMARY KEY (`versionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_ContentVersion` WRITE;
/*!40000 ALTER TABLE `LB_ContentVersion` DISABLE KEYS */;

INSERT INTO `LB_ContentVersion` (`versionId`, `contentId`, `createdBy`, `creationDate`, `updatedBy`, `updatedDate`, `workflowState`, `scheduleStart`, `scheduleEnd`)
VALUES
  (1,1,1,1334010195,1,1334010195,4,0,0);

/*!40000 ALTER TABLE `LB_ContentVersion` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ContentWorkflow
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentWorkflow`;

CREATE TABLE `LB_ContentWorkflow` (
  `contentId` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `createdDate` int(11) DEFAULT NULL,
  `userTypeId` int(11) DEFAULT NULL,
  `userId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`contentId`),
  KEY `status` (`status`),
  KEY `userTypeId` (`userTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_ContentWorkflowLog
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ContentWorkflowLog`;

CREATE TABLE `LB_ContentWorkflowLog` (
  `contentId` int(11) NOT NULL,
  `peopleId` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `createdDate` int(11) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  KEY `contentId` (`contentId`),
  KEY `peopleId` (`peopleId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_Crud
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Crud`;

CREATE TABLE `LB_Crud` (
  `crudId` int(11) NOT NULL AUTO_INCREMENT,
  `crudName` varchar(256) NOT NULL,
  `dateCreated` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`crudId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_DataTypeDefinition
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_DataTypeDefinition`;

CREATE TABLE `LB_DataTypeDefinition` (
  `dataTypeDefinitionId` int(11) NOT NULL AUTO_INCREMENT,
  `dataTypeName` varchar(255) DEFAULT NULL,
  `dataTypeDescription` text,
  `dataTypeClass` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `dataStorageType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dataTypeDefinitionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_DataTypeDefinition` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeDefinition` DISABLE KEYS */;

INSERT INTO `LB_DataTypeDefinition` (`dataTypeDefinitionId`, `dataTypeName`, `dataTypeDescription`, `dataTypeClass`, `status`, `dataStorageType`)
VALUES
  (1,'Input Field','A standard single line input field.','\\Febe\\ContentManagement\\Presentation_DataTypes_InputField',1,'VC255'),
  (2,'WYSIWYG Editor','A specialized editor helping create HTML markup of content.','\\Febe\\ContentManagement\\Presentation_DataTypes_WYSIWYGEditor',1,'Text'),
  (3,'File Uploader','Allows you to select files from your hard drive to upload for use.','\\Febe\\ContentManagement\\Presentation_DataTypes_FileUpload',0,'Text'),
  (4,'Content Picker','Content Picker','\\Febe\\ContentManagement\\Presentation_DataTypes_ContentPicker',1,'Text'),
  (5,'Drop Down List','Drop Down List','\\Febe\\ContentManagement\\Presentation_DataTypes_DropDownList',1,'Text'),
  (6,'Tag Picker','Tag input box w/ auto fill','\\Febe\\ContentManagement\\Presentation_DataTypes_TagPicker',1,'Text'),
  (7,'Media Picker','A entity to select media items using the TinyMCE Image Manager.','\\Febe\\ContentManagement\\Presentation_DataTypes_MediaPicker',1,'Text'),
  (8,'Date Time Picker','Use this data type to add a date time element.','\\Febe\\ContentManagement\\Presentation_DataTypes_DateTimePicker',1,'Int'),
  (9,'Content Selector Drop Down','Use this data type to select a single piece of Content via a drop down.','\\Febe\\ContentManagement\\Presentation_DataTypes_ContentDropDownList',1,'Text'),
  (10,'Text Area','Use this data type to create unstyled text.','\\Febe\\ContentManagement\\Presentation_DataTypes_TextArea',1,'Text'),
  (11,'Content Selector Grid','Use this data type to select multiple pieces of content from a checkbox grid.','\\Febe\\ContentManagement\\Presentation_DataTypes_ContentGrid',1,'Text'),
  (12,'Multiple Media Picker','A entity to select media items using the TinyMCE Image Manager.','\\Febe\\ContentManagement\\Presentation_DataTypes_MultiMediaPicker',1,'Text');

/*!40000 ALTER TABLE `LB_DataTypeDefinition` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_DataTypeEntity
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_DataTypeEntity`;

CREATE TABLE `LB_DataTypeEntity` (
  `dataTypeEntityId` int(11) NOT NULL AUTO_INCREMENT,
  `contentTypeId` int(11) DEFAULT NULL,
  `dataTypeDefinitionId` int(11) DEFAULT NULL,
  `entityKey` varchar(255) DEFAULT NULL,
  `entityName` varchar(255) DEFAULT NULL,
  `entityDescription` text,
  `required` int(11) DEFAULT NULL,
  `validatorType` varchar(255) DEFAULT NULL,
  `dataStorageType` varchar(128) DEFAULT NULL,
  `contentTypeGroupId` int(11) DEFAULT NULL,
  `entityOrder` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`dataTypeEntityId`),
  KEY `contentTypeId` (`contentTypeId`),
  KEY `dataTypeDefinitionId` (`dataTypeDefinitionId`),
  KEY `contentTypeGroupId` (`contentTypeGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_DataTypeEntity` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeEntity` DISABLE KEYS */;

INSERT INTO `LB_DataTypeEntity` (`dataTypeEntityId`, `contentTypeId`, `dataTypeDefinitionId`, `entityKey`, `entityName`, `entityDescription`, `required`, `validatorType`, `dataStorageType`, `contentTypeGroupId`, `entityOrder`, `status`)
VALUES
  (1,3,1,'postTitle','Post Title','Title for this post',1,'','VC255',4,0,1),
  (2,1,2,'content','Content','The content for this page.',1,'','Text',1,0,1),
  (3,2,1,'metaTitle','Meta Title','This is the page title',0,'','VC255',2,0,1),
  (4,2,1,'metaDescription','Meta Description','A description of the page content',0,'','VC255',2,0,1),
  (5,2,10,'tweetText','Tweet Text','The text that will appear when the page is tweeted',0,'','Text',3,0,1),
  (6,2,1,'openGraphTitle','Open Graph Title','The title of the page that will appear in social networks',0,'','VC255',3,0,1),
  (7,2,10,'openGraphDescription','Open Graph Description','The description of the page that will appear in social networks',0,'','Text',3,0,1),
  (8,2,7,'openGraphImage','Open Graph Image','The image that will appear for the page when shared in social networks',0,'','Text',3,0,1),
  (9,3,8,'postDate','Post Date','The publication date for this blog post (used for archiving, NOT for go-live visibility)',0,'','Int',4,0,1),
  (10,3,10,'postExcerpt','Post Excerpt','The brief excerpt visible on the blog landing page',0,'','Text',4,0,1);

/*!40000 ALTER TABLE `LB_DataTypeEntity` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_DataTypeEntityGroups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_DataTypeEntityGroups`;

CREATE TABLE `LB_DataTypeEntityGroups` (
  `entityGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `contentTypeId` int(11) DEFAULT NULL,
  `entityGroupName` varchar(255) DEFAULT NULL,
  `entityGroupDescription` text,
  `entityGroupOrder` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`entityGroupId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_DataTypeEntityGroups` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeEntityGroups` DISABLE KEYS */;

INSERT INTO `LB_DataTypeEntityGroups` (`entityGroupId`, `contentTypeId`, `entityGroupName`, `entityGroupDescription`, `entityGroupOrder`, `status`)
VALUES
  (1,1,'Content','',0,1),
  (2,2,'Page Meta','',0,1),
  (3,2,'Open Graph Information','',0,1),
  (4,3,'Post Details','',0,1);

/*!40000 ALTER TABLE `LB_DataTypeEntityGroups` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_DataTypeEntityOptions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_DataTypeEntityOptions`;

CREATE TABLE `LB_DataTypeEntityOptions` (
  `dataTypeEntityOptionId` int(11) NOT NULL AUTO_INCREMENT,
  `dataTypeEntityId` int(11) DEFAULT NULL,
  `optionKey` varchar(255) DEFAULT NULL,
  `optionValue` text,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`dataTypeEntityOptionId`),
  KEY `dataTypeEntityId` (`dataTypeEntityId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_Modules
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Modules`;

CREATE TABLE `LB_Modules` (
  `moduleId` int(11) NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(256) NOT NULL,
  `moduleAlias` varchar(128) NOT NULL,
  `moduleDescription` varchar(512) NOT NULL,
  `activityClass` varchar(128) NOT NULL,
  `adminDisplay` int(11) NOT NULL,
  PRIMARY KEY (`moduleId`),
  KEY `moduleName` (`moduleName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_Modules` WRITE;
/*!40000 ALTER TABLE `LB_Modules` DISABLE KEYS */;

INSERT INTO `LB_Modules` (`moduleId`, `moduleName`, `moduleAlias`, `moduleDescription`, `activityClass`, `adminDisplay`)
VALUES
  (1,'User Management','Users','Allows for the authorization of users, admin panel accessibility, and additional user-based functionality.','LB_UserManagement_Logic_User',1),
  (2,'Content Management','Content','Allows for the generation and rendering of generic content, admin panel accessibility, and additional content-based functionality including extendible content types.','LB_ContentManagement_Logic_Content',2),
  (3,'Settings Management','Settings','','LB_Reef_Logic_Settings',3);

/*!40000 ALTER TABLE `LB_Modules` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_ModuleSections
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_ModuleSections`;

CREATE TABLE `LB_ModuleSections` (
  `moduleAlias` varchar(128) NOT NULL,
  `sectionName` varchar(64) NOT NULL,
  `sectionLink` varchar(256) NOT NULL,
  `displayOrder` int(11) NOT NULL,
  `permission` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`moduleAlias`,`sectionName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_ModuleSections` WRITE;
/*!40000 ALTER TABLE `LB_ModuleSections` DISABLE KEYS */;

INSERT INTO `LB_ModuleSections` (`moduleAlias`, `sectionName`, `sectionLink`, `displayOrder`, `permission`)
VALUES
  ('Content','Content List','/admin/content/items.html',0,'Create Content,Delete Content,Manage Navigation'),
  ('Settings','System Settings','/admin/settings/index.html',0,'Manage System Settings'),
  ('Settings','Website Settings','/admin/settings/site.html',1,'Manage Website Settings'),
  ('Users','Roles','/admin/users/usertypes.html',1,'Manage Users'),
  ('Users','Users','/admin/users/index.html',0,'Manage Users'),
  ('Users','Workflow Rules','/admin/users/workflowRules.html',2,'Manage Workflow Rules');

/*!40000 ALTER TABLE `LB_ModuleSections` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_Notifications
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Notifications`;

CREATE TABLE `LB_Notifications` (
  `notificationId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0',
  `message` varchar(500) DEFAULT NULL,
  `createdDate` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `lookupId` int(11) DEFAULT NULL,
  PRIMARY KEY (`notificationId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_RegisteredControls
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_RegisteredControls`;

CREATE TABLE `LB_RegisteredControls` (
  `controlId` int(11) NOT NULL AUTO_INCREMENT,
  `controlName` varchar(255) DEFAULT NULL,
  `controlClass` text,
  `useInline` int(11) DEFAULT NULL,
  `useDesigner` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`controlId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_Settings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Settings`;

CREATE TABLE `LB_Settings` (
  `settingId` int(11) NOT NULL AUTO_INCREMENT,
  `settingName` varchar(128) NOT NULL,
  `settingDescription` varchar(512) NOT NULL,
  `settingGroup` varchar(256) NOT NULL,
  `settingValue` varchar(512) NOT NULL,
  `settingStatus` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`settingId`),
  KEY `settingName` (`settingName`),
  KEY `settingGroup` (`settingGroup`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_Settings` WRITE;
/*!40000 ALTER TABLE `LB_Settings` DISABLE KEYS */;

INSERT INTO `LB_Settings` (`settingId`, `settingName`, `settingDescription`, `settingGroup`, `settingValue`, `settingStatus`)
VALUES
  (1,'LB_SYSTEM_PROJECT_NAME','Provides the display name for this project','System','LB Core Default',1),
  (5,'LB_SYSTEM_ACTIONS_EXPIRATION','Determines the number of days Actions are stored in the database before being purged','System','0',1),
  (6,'LB_SYSTEM_ACTIONS_HISTORY','Determines the number of days to look up Actions to be displayed in the administrative panel','System','0',1),
  (7,'LB_USER_REQUIRES_UNIQUE_USERNAME','Determines whether a unique username is required upon creating a new user','User Management','1',1),
  (8,'LB_USER_REQUIRES_EMAIL_VERIFICATION','Determines whether email verification is required upon creating a new user','User Management','0',1),
  (9,'LB_USER_PASSWORD_REGULAR_EXPRESSION','Verifies that new passwords meet a required strength test','User Management','',1),
  (10,'LB_USER_PASSWORD_FORMAT','Determines the type of encryption being used for user passwords and other sensitive data','User Management','Blowfish',1),
  (11,'LB_USER_DEFAULT_LOGIN_URL','Provides a default page url to redirect users to when requesting authenticated sources','User Management','/admin/login.html',1),
  (12,'LB_USER_DEFAULT_REGISTER_URL','Provides a default page url to redirect users to when requesting registration','User Management','/register.html',1),
  (13,'LB_USER_QUESTION_AND_ANSWER_REQUIRED','Determines whether password retrieval question and answer are required upon creation of a new user','User Management','0',1),
  (14,'LB_USER_ALLOWED_LOGIN_ATTEMPTS','Determines the number of login attempts allowed before locking a user\'s account','User Management','10',1),
  (15,'LB_USER_LOGIN_LOCKOUT_WINDOW','Determines the number of minutes that must pass after a user maxes out login attempts','User Management','10',1),
  (16,'LB_CONTENT_HAS_CMS','Determines the type of Request Handler that will be used to handle page requests','Content','1',1),
  (17,'LB_CONTENT_DEFAULT_TEMPLATE','Sets a default template to use for CMS and frontend pages in the scenario that a template is not specified','Content','Reef_Blank',1),
  (19,'LB_CONTENT_GOOGLE_ANALYTICS_ID','Activate Google analytics code by putting GA ID here','Content','0',1),
  (20,'LB_CONTENT_FACEBOOK_APP_ID','Load basic Facebook SDK code by entering your app id here','Content','0',1),
  (21,'LB_CONTENT_DEFAULT_TITLE','Load the default page title here.','Content','Website',1),
  (22,'LB_CONTENT_DEFAULT_DESCRIPTION','Load the default page description here.','Content','Website description',1),
  (23,'LB_CONTENT_DEFAULT_IMAGEPATH','Load the default image path here for Open Graph image.','Content','http://www.lifeblue.com/resources/images/fb-avatar.jpg',1),
  (24,'LB_CONTENT_DEFAULT_KEYWORDS','Load the default keywords here for SEO.','Content','website, things, stuff',1),
  (25,'LB_CONTENT_OG_DEFAULT_TITLE','Load the default page title here.','Website','Website',1),
  (26,'LB_CONTENT_OG_DEFAULT_DESCRIPTION','Load the default page description here.','Website','Website description',1),
  (27,'LB_CONTENT_GOOGLEPLUS_LINK','Load basic Facebook SDK code by entering your app id here','Website','',1),
  (28,'LB_CONTENT_YOUTUBE_LINK','Load basic Facebook SDK code by entering your app id here','Website','',1),
  (29,'LB_CONTENT_TWITTER_USERNAME','Load basic Facebook SDK code by entering your app id here','Website','Lifeblue',1),
  (30,'LB_CONTENT_FACEBOOK_LINK','Load basic Facebook SDK code by entering your app id here','Website','https://www.facebook.com/mylifeblue',1);

/*!40000 ALTER TABLE `LB_Settings` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_SiteDesignOverride
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_SiteDesignOverride`;

CREATE TABLE `LB_SiteDesignOverride` (
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `designOverride` text,
  PRIMARY KEY (`fullURL`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_Templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Templates`;

CREATE TABLE `LB_Templates` (
  `templateId` int(11) NOT NULL AUTO_INCREMENT,
  `templateName` varchar(255) DEFAULT NULL,
  `templateClass` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`templateId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_Templates` WRITE;
/*!40000 ALTER TABLE `LB_Templates` DISABLE KEYS */;

INSERT INTO `LB_Templates` (`templateId`, `templateName`, `templateClass`, `status`)
VALUES
  (1,'Basic Page','basicInterior',1),
  (2,'Home Page','home',1);

/*!40000 ALTER TABLE `LB_Templates` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_TrashCan
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_TrashCan`;

CREATE TABLE `LB_TrashCan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `publishedData` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_UserData
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserData`;

CREATE TABLE `LB_UserData` (
  `userId` int(11) NOT NULL,
  `userDataType` varchar(128) NOT NULL,
  `userDataValue` varchar(512) NOT NULL,
  PRIMARY KEY (`userId`,`userDataType`),
  KEY `userDataType` (`userDataType`,`userDataValue`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserData` WRITE;
/*!40000 ALTER TABLE `LB_UserData` DISABLE KEYS */;

INSERT INTO `LB_UserData` (`userId`, `userDataType`, `userDataValue`)
VALUES
  (1,'description',''),
  (1,'HomeDirectory','0');

/*!40000 ALTER TABLE `LB_UserData` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_UserLogins
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserLogins`;

CREATE TABLE `LB_UserLogins` (
  `userId` int(11) NOT NULL,
  `loginTime` int(11) NOT NULL,
  `success` tinyint(4) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `ipAddress` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`,`loginTime`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserLogins` WRITE;
/*!40000 ALTER TABLE `LB_UserLogins` DISABLE KEYS */;

INSERT INTO `LB_UserLogins` (`userId`, `loginTime`, `success`, `active`, `ipAddress`)
VALUES
  (1,1381285396,1,0,'127.0.0.1');

/*!40000 ALTER TABLE `LB_UserLogins` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_UserPermissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserPermissions`;

CREATE TABLE `LB_UserPermissions` (
  `userPermissionId` int(11) NOT NULL AUTO_INCREMENT,
  `userPermissionSet` varchar(256) NOT NULL,
  `userPermissionName` varchar(256) NOT NULL,
  `userPermissionDescription` varchar(512) NOT NULL,
  PRIMARY KEY (`userPermissionId`),
  KEY `userPermissionName` (`userPermissionName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserPermissions` WRITE;
/*!40000 ALTER TABLE `LB_UserPermissions` DISABLE KEYS */;

INSERT INTO `LB_UserPermissions` (`userPermissionId`, `userPermissionSet`, `userPermissionName`, `userPermissionDescription`)
VALUES
  (1,'Content','Edit Content Sections','Allows for the modification of Content Section details'),
  (2,'Content','View Content Sections','Allows for the viewing of Content Sections'),
  (3,'Content','Delete Generic Content','Allows for the deletion of content under the Generic Content type'),
  (4,'Content','Edit Generic Content','Allows for the modification of details for content under the Generic Content type'),
  (5,'Content','View Generic Content','Allows for the viewing of content under the Generic Content type'),
  (6,'Content','Archive Content','Allows for the archiving of content'),
  (7,'Content','Publish Content','Allows for the publishing of content'),
  (8,'Content','Approve Content','Allows for the approving of content'),
  (9,'Content','Draft Content','Allows for the drafting of content'),
  (10,'Content','Access Control Editor','Allows general access to the Control Content Editor'),
  (11,'Content','Access Template Editor','Allows general access to the Template Content Editor'),
  (12,'Content','Access Content Module','Allows general access to the Content Module'),
  (13,'Content','Delete Content Sections','Allows for the deletion of Content Sections'),
  (14,'Users','Delete User Types','Allows for the deletion of User Types'),
  (15,'Users','Edit User Type Permissions','Allows for the modification of User Type permissions'),
  (16,'Users','Edit User Types','Allows for the modification of User Type data'),
  (17,'Users','Delete Users','Allows for the deletion of Users'),
  (18,'Users','View User Types','Allows for the viewing of User Types'),
  (19,'Users','Edit User Permissions','Allows for the modification of User permissions'),
  (20,'Users','Edit Users','Allows for the modification of User data'),
  (21,'Users','View Users','Allows for the viewing of Users'),
  (22,'Users','Access Users Module','Allows general access to the Users Module'),
  (23,'System','Delete Settings','Allows for the deletion of Settings'),
  (24,'System','Edit Settings','Allows for the modification of Setting details'),
  (25,'System','View Settings','Allows general access to the Settings section'),
  (26,'Permissions','Delete Content','Delete and Remove content from the site.'),
  (27,'Permissions','Create Content','Create and edit content in the system.'),
  (28,'Permissions','Manage Navigation','Manage site navigation order and strucutre.'),
  (29,'Permissions','Manage Users','Add, Edit, and Delete Users'),
  (30,'Permissions','Manage Content Types','Manage content types and structure'),
  (31,'Permissions','Manage System Settings','Manage system settings and information'),
  (32,'Permissions','Manage Workflow Rules','Permission to manage system workflow rules.'),
  (33,'Permissions','Delete Folders','Delete folders/sections in your tree structure.'),
  (34,'Permissions','Crud Overview','Crud overview description'),
  (35,'Permissions','Manage Website Settings','Manage website settings and information'),
  (36,'Permissions','Manage Templates','Manage content templates.');

/*!40000 ALTER TABLE `LB_UserPermissions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_Users`;

CREATE TABLE `LB_Users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(256) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(256) NOT NULL,
  `dateCreated` int(11) NOT NULL,
  `approved` tinyint(4) NOT NULL,
  `disabled` tinyint(4) NOT NULL DEFAULT '0',
  `lockedOut` tinyint(4) NOT NULL DEFAULT '0',
  `lastLogin` int(11) NOT NULL DEFAULT '0',
  `userTypeId` int(11) NOT NULL,
  `securityQuestion` varchar(512) NOT NULL,
  `securityAnswer` varchar(256) NOT NULL,
  `notifications` int(11) NOT NULL DEFAULT '0',
  `resetToken` varchar(256) NOT NULL,
  PRIMARY KEY (`userId`),
  KEY `userName` (`userName`),
  KEY `email` (`email`),
  KEY `securityQuestion` (`securityQuestion`),
  KEY `securityAnswer` (`securityAnswer`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_Users` WRITE;
/*!40000 ALTER TABLE `LB_Users` DISABLE KEYS */;

INSERT INTO `LB_Users` (`userId`, `userName`, `password`, `email`, `dateCreated`, `approved`, `disabled`, `lockedOut`, `lastLogin`, `userTypeId`, `securityQuestion`, `securityAnswer`, `notifications`, `resetToken`)
VALUES
  (1,'Lifeblue Admin','$2a$08$jp.TfwVRy2JqFNwhgE/6u.J9hTimGp7Z.wGrslhMcmVQ2dIL/RvWa','lbadmin@lifeblue.com',1357159508,1,0,0,1381285396,1,'','',1,'');

/*!40000 ALTER TABLE `LB_Users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_UserSectionPermissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserSectionPermissions`;

CREATE TABLE `LB_UserSectionPermissions` (
  `id` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  UNIQUE KEY `id` (`id`,`type`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserSectionPermissions` WRITE;
/*!40000 ALTER TABLE `LB_UserSectionPermissions` DISABLE KEYS */;

INSERT INTO `LB_UserSectionPermissions` (`id`, `type`, `status`, `userId`)
VALUES
  (0,'section',1,1);

/*!40000 ALTER TABLE `LB_UserSectionPermissions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_UserToUserPermission
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserToUserPermission`;

CREATE TABLE `LB_UserToUserPermission` (
  `userId` int(11) NOT NULL,
  `userPermissionId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`userPermissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserToUserPermission` WRITE;
/*!40000 ALTER TABLE `LB_UserToUserPermission` DISABLE KEYS */;

INSERT INTO `LB_UserToUserPermission` (`userId`, `userPermissionId`)
VALUES
  (1,26),
  (1,27),
  (1,28),
  (1,29),
  (1,30),
  (1,31),
  (1,32),
  (1,33),
  (1,34),
  (1,35),
  (1,36);

/*!40000 ALTER TABLE `LB_UserToUserPermission` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_UserTypes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserTypes`;

CREATE TABLE `LB_UserTypes` (
  `userTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `userTypeName` varchar(256) NOT NULL,
  `userTypeDescription` varchar(512) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userTypeId`),
  KEY `userTypeName` (`userTypeName`,`userTypeDescription`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserTypes` WRITE;
/*!40000 ALTER TABLE `LB_UserTypes` DISABLE KEYS */;

INSERT INTO `LB_UserTypes` (`userTypeId`, `userTypeName`, `userTypeDescription`, `status`)
VALUES
  (1,'Super Admin','Performs all site maintenance and monitors site activity.',1);

/*!40000 ALTER TABLE `LB_UserTypes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_UserTypeToUserPermission
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_UserTypeToUserPermission`;

CREATE TABLE `LB_UserTypeToUserPermission` (
  `userTypeId` int(11) NOT NULL,
  `userPermissionId` int(11) NOT NULL,
  PRIMARY KEY (`userTypeId`,`userPermissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_UserTypeToUserPermission` WRITE;
/*!40000 ALTER TABLE `LB_UserTypeToUserPermission` DISABLE KEYS */;

INSERT INTO `LB_UserTypeToUserPermission` (`userTypeId`, `userPermissionId`)
VALUES
  (1,26),
  (1,27),
  (1,28),
  (1,29),
  (1,30),
  (1,31),
  (1,32),
  (1,33),
  (1,35),
  (1,36);

/*!40000 ALTER TABLE `LB_UserTypeToUserPermission` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_WorkflowPath
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_WorkflowPath`;

CREATE TABLE `LB_WorkflowPath` (
  `pathId` int(11) NOT NULL AUTO_INCREMENT,
  `ruleId` int(11) DEFAULT NULL,
  `userTypeId` int(11) DEFAULT NULL,
  `action` varchar(25) DEFAULT NULL,
  `publishWhen` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`pathId`),
  KEY `userTypeId` (`userTypeId`),
  KEY `ruleId` (`ruleId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_WorkflowPath` WRITE;
/*!40000 ALTER TABLE `LB_WorkflowPath` DISABLE KEYS */;

INSERT INTO `LB_WorkflowPath` (`pathId`, `ruleId`, `userTypeId`, `action`, `publishWhen`)
VALUES
  (1,1,1,'Both','Always');

/*!40000 ALTER TABLE `LB_WorkflowPath` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table LB_WorkflowPeople
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_WorkflowPeople`;

CREATE TABLE `LB_WorkflowPeople` (
  `peopleId` int(11) NOT NULL AUTO_INCREMENT,
  `pathId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `userTypeId` int(11) DEFAULT NULL,
  `type` varchar(25) DEFAULT NULL,
  `operator` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`peopleId`),
  KEY `userId` (`userId`),
  KEY `pathId` (`pathId`),
  KEY `userTypeId` (`userTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table LB_WorkflowRule
# ------------------------------------------------------------

DROP TABLE IF EXISTS `LB_WorkflowRule`;

CREATE TABLE `LB_WorkflowRule` (
  `ruleId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`ruleId`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `LB_WorkflowRule` WRITE;
/*!40000 ALTER TABLE `LB_WorkflowRule` DISABLE KEYS */;

INSERT INTO `LB_WorkflowRule` (`ruleId`, `name`, `description`, `status`)
VALUES
  (1,'Default','Default workflow with only a superuser',1);

/*!40000 ALTER TABLE `LB_WorkflowRule` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
