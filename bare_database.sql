-- MySQL dump 10.13  Distrib 5.1.44, for apple-darwin8.11.1 (i386)
--
-- Host: localhost    Database: lbcore
-- ------------------------------------------------------
-- Server version	5.1.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `LB_Actions`
--

DROP TABLE IF EXISTS `LB_Actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Actions` (
  `actionId` int(11) NOT NULL AUTO_INCREMENT,
  `actionType` varchar(128) NOT NULL,
  `actionMessage` varchar(512) NOT NULL,
  `creationDate` int(11) NOT NULL,
  PRIMARY KEY (`actionId`),
  KEY `actionType` (`actionType`),
  KEY `creationDate` (`creationDate`)
) ENGINE=MyISAM AUTO_INCREMENT=11909 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Actions`
--

LOCK TABLES `LB_Actions` WRITE;
/*!40000 ALTER TABLE `LB_Actions` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Content`
--

DROP TABLE IF EXISTS `LB_Content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `navigationOrder` int(11) NOT NULL DEFAULT '0',
  `ruleId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`contentId`),
  KEY `ruleId` (`ruleId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Content`
--

LOCK TABLES `LB_Content` WRITE;
/*!40000 ALTER TABLE `LB_Content` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentCache`
--

DROP TABLE IF EXISTS `LB_ContentCache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentCache` (
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `publishedData` text,
  PRIMARY KEY (`fullURL`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentCache`
--

LOCK TABLES `LB_ContentCache` WRITE;
/*!40000 ALTER TABLE `LB_ContentCache` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentCache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentData_Float`
--

DROP TABLE IF EXISTS `LB_ContentData_Float`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentData_Float` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` float DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentData_Float`
--

LOCK TABLES `LB_ContentData_Float` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_Float` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentData_Float` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentData_Int`
--

DROP TABLE IF EXISTS `LB_ContentData_Int`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentData_Int` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentData_Int`
--

LOCK TABLES `LB_ContentData_Int` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_Int` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentData_Int` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentData_Text`
--

DROP TABLE IF EXISTS `LB_ContentData_Text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentData_Text` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` text,
  KEY `versionId` (`versionId`,`contentId`,`contentKey`),
  KEY `contentId` (`contentId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentData_Text`
--

LOCK TABLES `LB_ContentData_Text` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_Text` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentData_Text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentData_VC255`
--

DROP TABLE IF EXISTS `LB_ContentData_VC255`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentData_VC255` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) NOT NULL DEFAULT '',
  `data` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`versionId`,`contentId`,`contentKey`),
  KEY `contentId` (`contentId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentData_VC255`
--

LOCK TABLES `LB_ContentData_VC255` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_VC255` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentData_VC255` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentData_VC64`
--

DROP TABLE IF EXISTS `LB_ContentData_VC64`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentData_VC64` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` varchar(64) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentData_VC64`
--

LOCK TABLES `LB_ContentData_VC64` WRITE;
/*!40000 ALTER TABLE `LB_ContentData_VC64` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentData_VC64` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentPublishQueue`
--

DROP TABLE IF EXISTS `LB_ContentPublishQueue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentPublishQueue` (
  `publishId` int(11) NOT NULL AUTO_INCREMENT,
  `publishLock` int(11) DEFAULT NULL,
  `publishType` varchar(255) DEFAULT NULL,
  `publishKey` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`publishId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentPublishQueue`
--

LOCK TABLES `LB_ContentPublishQueue` WRITE;
/*!40000 ALTER TABLE `LB_ContentPublishQueue` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentPublishQueue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentPublishSchedule`
--

DROP TABLE IF EXISTS `LB_ContentPublishSchedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentPublishSchedule` (
  `contentId` int(11) NOT NULL,
  `publishStart` int(11) DEFAULT NULL,
  `publishEnd` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`contentId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentPublishSchedule`
--

LOCK TABLES `LB_ContentPublishSchedule` WRITE;
/*!40000 ALTER TABLE `LB_ContentPublishSchedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentPublishSchedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentSections`
--

DROP TABLE IF EXISTS `LB_ContentSections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentSections`
--

LOCK TABLES `LB_ContentSections` WRITE;
/*!40000 ALTER TABLE `LB_ContentSections` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentSections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentTypes`
--

DROP TABLE IF EXISTS `LB_ContentTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentTypes`
--

LOCK TABLES `LB_ContentTypes` WRITE;
/*!40000 ALTER TABLE `LB_ContentTypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentVersion`
--

DROP TABLE IF EXISTS `LB_ContentVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentVersion`
--

LOCK TABLES `LB_ContentVersion` WRITE;
/*!40000 ALTER TABLE `LB_ContentVersion` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentVersion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentWorkflow`
--

DROP TABLE IF EXISTS `LB_ContentWorkflow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ContentWorkflow` (
  `contentId` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `createdDate` int(11) DEFAULT NULL,
  `userTypeId` int(11) DEFAULT NULL,
  `userId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`contentId`),
  KEY `status` (`status`),
  KEY `userTypeId` (`userTypeId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentWorkflow`
--

LOCK TABLES `LB_ContentWorkflow` WRITE;
/*!40000 ALTER TABLE `LB_ContentWorkflow` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentWorkflow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ContentWorkflowLog`
--

DROP TABLE IF EXISTS `LB_ContentWorkflowLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ContentWorkflowLog`
--

LOCK TABLES `LB_ContentWorkflowLog` WRITE;
/*!40000 ALTER TABLE `LB_ContentWorkflowLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ContentWorkflowLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Crud`
--

DROP TABLE IF EXISTS `LB_Crud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Crud` (
  `crudId` int(11) NOT NULL AUTO_INCREMENT,
  `crudName` varchar(256) NOT NULL,
  `dateCreated` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`crudId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Crud`
--

LOCK TABLES `LB_Crud` WRITE;
/*!40000 ALTER TABLE `LB_Crud` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Crud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_DataTypeDefinition`
--

DROP TABLE IF EXISTS `LB_DataTypeDefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_DataTypeDefinition` (
  `dataTypeDefinitionId` int(11) NOT NULL AUTO_INCREMENT,
  `dataTypeName` varchar(255) DEFAULT NULL,
  `dataTypeDescription` text,
  `dataTypeClass` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `dataStorageType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dataTypeDefinitionId`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_DataTypeDefinition`
--

LOCK TABLES `LB_DataTypeDefinition` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeDefinition` DISABLE KEYS */;
INSERT INTO `LB_DataTypeDefinition` VALUES (1,'Input Field','A standard single line input field.','LB_ContentManagement_Presentation_DataTypes_InputField',1,'VC255'),(2,'WYSIWYG Editor','A specialized editor helping create HTML markup of content.','LB_ContentManagement_Presentation_DataTypes_WYSIWYGEditor',1,'Text'),(3,'File Uploader','Allows you to select files from your hard drive to upload for use.','LB_ContentManagement_Presentation_DataTypes_FileUpload',1,'Text'),(4,'Content Picker','Content Picker','LB_ContentManagement_Presentation_DataTypes_ContentPicker',1,'Text'),(5,'Call Out Box','A Generator for call out boxes.','LB_ContentManagement_Presentation_DataTypes_CallOutBox',1,'Text'),(6,'Drop Down List','Drop Down List','LB_ContentManagement_Presentation_DataTypes_DropDownList',1,'Text'),(7,'Tag Picker','Tag input box w/ auto fill','LB_ContentManagement_Presentation_DataTypes_TagPicker',1,'Text'),(8,'Curriculum Chart','Curriculum Chart Builder (Introduced in SHP)','LB_ContentManagement_Presentation_DataTypes_CurriculumChart',1,'Text'),(9,'Media Picker','A entity to select media items using the TinyMCE Image Manager.','LB_ContentManagement_Presentation_DataTypes_MediaPicker',1,'Text'),(10,'Date Time Picker','Use this data type to add a date time element.','LB_ContentManagement_Presentation_DataTypes_DateTimePicker',1,'Int');
/*!40000 ALTER TABLE `LB_DataTypeDefinition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_DataTypeEntity`
--

DROP TABLE IF EXISTS `LB_DataTypeEntity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_DataTypeEntity`
--

LOCK TABLES `LB_DataTypeEntity` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeEntity` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_DataTypeEntity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_DataTypeEntityGroups`
--

DROP TABLE IF EXISTS `LB_DataTypeEntityGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_DataTypeEntityGroups` (
  `entityGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `contentTypeId` int(11) DEFAULT NULL,
  `entityGroupName` varchar(255) DEFAULT NULL,
  `entityGroupDescription` text,
  `entityGroupOrder` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`entityGroupId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_DataTypeEntityGroups`
--

LOCK TABLES `LB_DataTypeEntityGroups` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeEntityGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_DataTypeEntityGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_DataTypeEntityOptions`
--

DROP TABLE IF EXISTS `LB_DataTypeEntityOptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_DataTypeEntityOptions` (
  `dataTypeEntityOptionId` int(11) NOT NULL AUTO_INCREMENT,
  `dataTypeEntityId` int(11) DEFAULT NULL,
  `optionKey` varchar(255) DEFAULT NULL,
  `optionValue` text,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`dataTypeEntityOptionId`),
  KEY `dataTypeEntityId` (`dataTypeEntityId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_DataTypeEntityOptions`
--

LOCK TABLES `LB_DataTypeEntityOptions` WRITE;
/*!40000 ALTER TABLE `LB_DataTypeEntityOptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_DataTypeEntityOptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Files`
--

DROP TABLE IF EXISTS `LB_Files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Files` (
  `resourceId` int(11) NOT NULL,
  `fileUrl` varchar(256) NOT NULL,
  PRIMARY KEY (`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Files`
--

LOCK TABLES `LB_Files` WRITE;
/*!40000 ALTER TABLE `LB_Files` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Images`
--

DROP TABLE IF EXISTS `LB_Images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Images` (
  `resourceId` int(11) NOT NULL,
  `imageUrl` varchar(256) NOT NULL,
  PRIMARY KEY (`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Images`
--

LOCK TABLES `LB_Images` WRITE;
/*!40000 ALTER TABLE `LB_Images` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ModuleSections`
--

DROP TABLE IF EXISTS `LB_ModuleSections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ModuleSections` (
  `moduleAlias` varchar(128) NOT NULL,
  `sectionName` varchar(64) NOT NULL,
  `sectionLink` varchar(256) NOT NULL,
  `displayOrder` int(11) NOT NULL,
  `permission` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`moduleAlias`,`sectionName`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ModuleSections`
--

LOCK TABLES `LB_ModuleSections` WRITE;
/*!40000 ALTER TABLE `LB_ModuleSections` DISABLE KEYS */;
INSERT INTO `LB_ModuleSections` VALUES ('Users','Users','/admin/users/index.html',0,'Manage Users'),('Users','Roles','/admin/users/usertypes.html',1,'Manage Users'),('Content','All Content','/admin/content/items.html',0,'Create Content,Delete Content,Manage Navigation'),('Content','Content Templates','/admin/content/contentTypes.html',2,'Manage Content Types'),('Resources','Overview','/admin/resources/index.html',0,NULL),('Resources','Files','/admin/resources/files.html',1,NULL),('Resources','Images','/admin/resources/images.html',2,NULL),('Resources','Tags','/admin/resources/tags.html',3,NULL),('Content','Workflow Rules','/admin/content/workflowRules.html',3,'Manage Workflow Rules'),('Crud','Overview','/admin/crud/index.html',0,'Crud Overview');
/*!40000 ALTER TABLE `LB_ModuleSections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Modules`
--

DROP TABLE IF EXISTS `LB_Modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Modules` (
  `moduleId` int(11) NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(256) NOT NULL,
  `moduleAlias` varchar(128) NOT NULL,
  `moduleDescription` varchar(512) NOT NULL,
  `activityClass` varchar(128) NOT NULL,
  `adminDisplay` int(11) NOT NULL,
  PRIMARY KEY (`moduleId`),
  KEY `moduleName` (`moduleName`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Modules`
--

LOCK TABLES `LB_Modules` WRITE;
/*!40000 ALTER TABLE `LB_Modules` DISABLE KEYS */;
INSERT INTO `LB_Modules` VALUES (1,'User Management','Users','Allows for the authorization of users, admin panel accessibility, and additional user-based functionality.','LB_UserManagement_Logic_User',1),(2,'Content Management','Content','Allows for the generation and rendering of generic content, admin panel accessibility, and additional content-based functionality including extendible content types.','LB_ContentManagement_Logic_Content',2),(4,'Crud Management','Crud','Allows for the management of a Crud.','LB_Crud_Logic_Crud',1);
/*!40000 ALTER TABLE `LB_Modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Notifications`
--

DROP TABLE IF EXISTS `LB_Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Notifications` (
  `notificationId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0',
  `message` varchar(500) DEFAULT NULL,
  `createdDate` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `lookupId` int(11) DEFAULT NULL,
  PRIMARY KEY (`notificationId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Notifications`
--

LOCK TABLES `LB_Notifications` WRITE;
/*!40000 ALTER TABLE `LB_Notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_RegisteredControls`
--

DROP TABLE IF EXISTS `LB_RegisteredControls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_RegisteredControls` (
  `controlId` int(11) NOT NULL AUTO_INCREMENT,
  `controlName` varchar(255) DEFAULT NULL,
  `controlClass` text,
  `useInline` int(11) DEFAULT NULL,
  `useDesigner` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`controlId`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_RegisteredControls`
--

LOCK TABLES `LB_RegisteredControls` WRITE;
/*!40000 ALTER TABLE `LB_RegisteredControls` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_RegisteredControls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ResourceToContent`
--

DROP TABLE IF EXISTS `LB_ResourceToContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ResourceToContent` (
  `resourceTypeId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL,
  PRIMARY KEY (`resourceTypeId`,`contentId`,`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ResourceToContent`
--

LOCK TABLES `LB_ResourceToContent` WRITE;
/*!40000 ALTER TABLE `LB_ResourceToContent` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ResourceToContent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ResourceToResource`
--

DROP TABLE IF EXISTS `LB_ResourceToResource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ResourceToResource` (
  `recessiveResourceTypeId` int(11) NOT NULL,
  `dominantResourceId` int(11) NOT NULL,
  `recessiveResourceId` int(11) NOT NULL,
  PRIMARY KEY (`recessiveResourceTypeId`,`dominantResourceId`,`recessiveResourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ResourceToResource`
--

LOCK TABLES `LB_ResourceToResource` WRITE;
/*!40000 ALTER TABLE `LB_ResourceToResource` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ResourceToResource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ResourceToUser`
--

DROP TABLE IF EXISTS `LB_ResourceToUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ResourceToUser` (
  `resourceTypeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL,
  PRIMARY KEY (`resourceTypeId`,`userId`,`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ResourceToUser`
--

LOCK TABLES `LB_ResourceToUser` WRITE;
/*!40000 ALTER TABLE `LB_ResourceToUser` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_ResourceToUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_ResourceTypes`
--

DROP TABLE IF EXISTS `LB_ResourceTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_ResourceTypes` (
  `resourceTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `resourceTypeName` varchar(128) NOT NULL,
  `resourceTypeDescription` varchar(512) NOT NULL,
  `resourceTypePage` varchar(128) NOT NULL,
  `resourceTypeClass` varchar(128) NOT NULL,
  `adminSubmittable` tinyint(4) NOT NULL,
  PRIMARY KEY (`resourceTypeId`),
  KEY `resourceTypeName` (`resourceTypeName`,`resourceTypeDescription`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_ResourceTypes`
--

LOCK TABLES `LB_ResourceTypes` WRITE;
/*!40000 ALTER TABLE `LB_ResourceTypes` DISABLE KEYS */;
INSERT INTO `LB_ResourceTypes` VALUES (1,'Files','Files are used to store and manage any file of any extension.','files','LB_ResourceManagement_Logic_ResourceTypes_File',1),(2,'Images','Images are used to store and manage any image media.','images','LB_ResourceManagement_Logic_ResourceTypes_Image',1),(3,'Tags','Tags are used to characterize and group elements.','tags','LB_ResourceManagement_Logic_ResourceTypes_Tag',1);
/*!40000 ALTER TABLE `LB_ResourceTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Resources`
--

DROP TABLE IF EXISTS `LB_Resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Resources` (
  `resourceId` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `creator` int(11) NOT NULL,
  `lastUpdatedBy` int(11) NOT NULL,
  `resourceTypeId` int(11) NOT NULL,
  `creationDate` int(11) NOT NULL,
  `updateDate` int(11) NOT NULL,
  `adminSubmitted` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`resourceId`),
  KEY `creator` (`creator`),
  KEY `resourceTypeId` (`resourceTypeId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Resources`
--

LOCK TABLES `LB_Resources` WRITE;
/*!40000 ALTER TABLE `LB_Resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_Resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Settings`
--

DROP TABLE IF EXISTS `LB_Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Settings`
--

LOCK TABLES `LB_Settings` WRITE;
/*!40000 ALTER TABLE `LB_Settings` DISABLE KEYS */;
INSERT INTO `LB_Settings` VALUES (1,'LB_SYSTEM_PROJECT_NAME','Provides the display name for this project','System','LB Core Default',1),(2,'LB_SYSTEM_CURRENCY_CHARACTER','Provides a default character for denoting currency','System','$',1),(3,'LB_SYSTEM_DATETIME_FORMAT','Provides a string format the system uses to format dates','System','F jS, Y \\a\\t g:m a',1),(4,'LB_SYSTEM_DATE_FORMAT','Provides a string format the system uses to format full date and time output','System','F jS, Y',1),(5,'LB_SYSTEM_ACTIONS_EXPIRATION','Determines the number of days Actions are stored in the database before being purged','System','0',1),(6,'LB_SYSTEM_ACTIONS_HISTORY','Determines the number of days to look up Actions to be displayed in the administrative panel','System','0',1),(7,'LB_USER_REQUIRES_UNIQUE_USERNAME','Determines whether a unique username is required upon creating a new user','User Management','1',1),(8,'LB_USER_REQUIRES_EMAIL_VERIFICATION','Determines whether email verification is required upon creating a new user','User Management','0',1),(9,'LB_USER_PASSWORD_REGULAR_EXPRESSION','Verifies that new passwords meet a required strength test','User Management','',1),(10,'LB_USER_PASSWORD_FORMAT','Determines the type of encryption being used for user passwords and other sensitive data','User Management','Open SSL',1),(11,'LB_USER_DEFAULT_LOGIN_URL','Provides a default page url to redirect users to when requesting authenticated sources','User Management','/admin/login.html',1),(12,'LB_USER_DEFAULT_REGISTER_URL','Provides a default page url to redirect users to when requesting registration','User Management','/register.html',1),(13,'LB_USER_QUESTION_AND_ANSWER_REQUIRED','Determines whether password retrieval question and answer are required upon creation of a new user','User Management','0',1),(14,'LB_USER_ALLOWED_LOGIN_ATTEMPTS','Determines the number of login attempts allowed before locking a user\'s account','User Management','10',1),(15,'LB_USER_LOGIN_LOCKOUT_WINDOW','Determines the number of minutes that must pass after a user maxes out login attempts','User Management','10',1),(16,'LB_CONTENT_HAS_CMS','Determines the type of Request Handler that will be used to handle page requests','Content','1',1),(17,'LB_CONTENT_DEFAULT_TEMPLATE','Sets a default template to use for CMS and frontend pages in the scenario that a template is not specified','Content','Reef_Blank',1);
/*!40000 ALTER TABLE `LB_Settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_SiteDesignOverride`
--

DROP TABLE IF EXISTS `LB_SiteDesignOverride`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_SiteDesignOverride` (
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `designOverride` text,
  PRIMARY KEY (`fullURL`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_SiteDesignOverride`
--

LOCK TABLES `LB_SiteDesignOverride` WRITE;
/*!40000 ALTER TABLE `LB_SiteDesignOverride` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_SiteDesignOverride` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Templates`
--

DROP TABLE IF EXISTS `LB_Templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Templates` (
  `templateId` int(11) NOT NULL AUTO_INCREMENT,
  `templateName` varchar(255) DEFAULT NULL,
  `templateClass` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`templateId`)
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Templates`
--

LOCK TABLES `LB_Templates` WRITE;
/*!40000 ALTER TABLE `LB_Templates` DISABLE KEYS */;
INSERT INTO `LB_Templates` VALUES (1,'Interior Template','Reef_Default',1);
/*!40000 ALTER TABLE `LB_Templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserData`
--

DROP TABLE IF EXISTS `LB_UserData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserData` (
  `userId` int(11) NOT NULL,
  `userDataType` varchar(128) NOT NULL,
  `userDataValue` varchar(512) NOT NULL,
  PRIMARY KEY (`userId`,`userDataType`),
  KEY `userDataType` (`userDataType`,`userDataValue`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserData`
--

LOCK TABLES `LB_UserData` WRITE;
/*!40000 ALTER TABLE `LB_UserData` DISABLE KEYS */;
INSERT INTO `LB_UserData` VALUES (1,'HomeDirectory','0'),(1,'description','');
/*!40000 ALTER TABLE `LB_UserData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserLogins`
--

DROP TABLE IF EXISTS `LB_UserLogins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserLogins` (
  `userId` int(11) NOT NULL,
  `loginTime` int(11) NOT NULL,
  `success` tinyint(4) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `ipAddress` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`,`loginTime`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserLogins`
--

LOCK TABLES `LB_UserLogins` WRITE;
/*!40000 ALTER TABLE `LB_UserLogins` DISABLE KEYS */;
INSERT INTO `LB_UserLogins` VALUES (1,1326921745,1,0,'127.0.0.1');
/*!40000 ALTER TABLE `LB_UserLogins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserPermissions`
--

DROP TABLE IF EXISTS `LB_UserPermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserPermissions` (
  `userPermissionId` int(11) NOT NULL AUTO_INCREMENT,
  `userPermissionSet` varchar(256) NOT NULL,
  `userPermissionName` varchar(256) NOT NULL,
  `userPermissionDescription` varchar(512) NOT NULL,
  PRIMARY KEY (`userPermissionId`),
  KEY `userPermissionName` (`userPermissionName`)
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserPermissions`
--

LOCK TABLES `LB_UserPermissions` WRITE;
/*!40000 ALTER TABLE `LB_UserPermissions` DISABLE KEYS */;
INSERT INTO `LB_UserPermissions` VALUES (24,'Content','Edit Content Sections','Allows for the modification of Content Section details'),(23,'Content','View Content Sections','Allows for the viewing of Content Sections'),(22,'Content','Delete Generic Content','Allows for the deletion of content under the Generic Content type'),(21,'Content','Edit Generic Content','Allows for the modification of details for content under the Generic Content type'),(20,'Content','View Generic Content','Allows for the viewing of content under the Generic Content type'),(19,'Content','Archive Content','Allows for the archiving of content'),(18,'Content','Publish Content','Allows for the publishing of content'),(17,'Content','Approve Content','Allows for the approving of content'),(16,'Content','Draft Content','Allows for the drafting of content'),(15,'Content','Access Control Editor','Allows general access to the Control Content Editor'),(14,'Content','Access Template Editor','Allows general access to the Template Content Editor'),(13,'Content','Access Content Module','Allows general access to the Content Module'),(12,'Users','Delete User Types','Allows for the deletion of User Types'),(11,'Users','Edit User Type Permissions','Allows for the modification of User Type permissions'),(10,'Users','Edit User Types','Allows for the modification of User Type data'),(8,'Users','Delete Users','Allows for the deletion of Users'),(9,'Users','View User Types','Allows for the viewing of User Types'),(7,'Users','Edit User Permissions','Allows for the modification of User permissions'),(6,'Users','Edit Users','Allows for the modification of User data'),(5,'Users','View Users','Allows for the viewing of Users'),(4,'Users','Access Users Module','Allows general access to the Users Module'),(3,'System','Delete Settings','Allows for the deletion of Settings'),(2,'System','Edit Settings','Allows for the modification of Setting details'),(1,'System','View Settings','Allows general access to the Settings section'),(41,'Permissions','Delete Content','Delete and Remove content from the site.'),(40,'Permissions','Create Content','Create and edit content in the system.'),(39,'Permissions','Manage Navigation','Manage site navigation order and strucutre.'),(38,'Permissions','Manage Users','Add, Edit, and Delete Users'),(37,'Permissions','Manage Content Types','Manage content types and structure'),(36,'Permissions','Manage System Settings','Manage system settings and information'),(25,'Content','Delete Content Sections','Allows for the deletion of Content Sections'),(26,'Resources','Access Resources Module','Allows general access to the Resource Module'),(27,'Resources','View Files','Allows for the viewing of resources under the Files type'),(28,'Resources','Edit Files','Allows for the modification of details for resources under the Files type'),(29,'Resources','Delete Files','Allows for the deletion of resources under the Files type'),(30,'Resources','View Images','Allows for the viewing of resources under the Images type'),(31,'Resources','Edit Images','Allows for the modification of details for resources under the Images type'),(32,'Resources','Delete Images','Allows for the deletion of resources under the Images type'),(33,'Resources','View Tags','Allows for the viewing of resources under the Tags type'),(34,'Resources','Edit Tags','Allows for the modification of details for resources under the Tags type'),(35,'Resources','Delete Tags','Allows for the deletion of resources under the Tags type'),(42,'Permissions','Manage Workflow Rules','Permission to manage system workflow rules.'),(43,'Permissions','Delete Folders','Delete folders/sections in your tree structure.'),(44,'Permissions','Crud Overview','Crud overview description');
/*!40000 ALTER TABLE `LB_UserPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserSectionPermissions`
--

DROP TABLE IF EXISTS `LB_UserSectionPermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserSectionPermissions` (
  `id` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  UNIQUE KEY `id` (`id`,`type`,`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserSectionPermissions`
--

LOCK TABLES `LB_UserSectionPermissions` WRITE;
/*!40000 ALTER TABLE `LB_UserSectionPermissions` DISABLE KEYS */;
INSERT INTO `LB_UserSectionPermissions` VALUES (0,'section',1,1);
/*!40000 ALTER TABLE `LB_UserSectionPermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserToUserPermission`
--

DROP TABLE IF EXISTS `LB_UserToUserPermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserToUserPermission` (
  `userId` int(11) NOT NULL,
  `userPermissionId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`userPermissionId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserToUserPermission`
--

LOCK TABLES `LB_UserToUserPermission` WRITE;
/*!40000 ALTER TABLE `LB_UserToUserPermission` DISABLE KEYS */;
INSERT INTO `LB_UserToUserPermission` VALUES (1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44);
/*!40000 ALTER TABLE `LB_UserToUserPermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserTypeToUserPermission`
--

DROP TABLE IF EXISTS `LB_UserTypeToUserPermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserTypeToUserPermission` (
  `userTypeId` int(11) NOT NULL,
  `userPermissionId` int(11) NOT NULL,
  PRIMARY KEY (`userTypeId`,`userPermissionId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserTypeToUserPermission`
--

LOCK TABLES `LB_UserTypeToUserPermission` WRITE;
/*!40000 ALTER TABLE `LB_UserTypeToUserPermission` DISABLE KEYS */;
INSERT INTO `LB_UserTypeToUserPermission` VALUES (1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43);
/*!40000 ALTER TABLE `LB_UserTypeToUserPermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_UserTypes`
--

DROP TABLE IF EXISTS `LB_UserTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_UserTypes` (
  `userTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `userTypeName` varchar(256) NOT NULL,
  `userTypeDescription` varchar(512) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userTypeId`),
  KEY `userTypeName` (`userTypeName`,`userTypeDescription`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_UserTypes`
--

LOCK TABLES `LB_UserTypes` WRITE;
/*!40000 ALTER TABLE `LB_UserTypes` DISABLE KEYS */;
INSERT INTO `LB_UserTypes` VALUES (1,'Super Admin','Performs all site maintenance and monitors site activity.',1);
/*!40000 ALTER TABLE `LB_UserTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_Users`
--

DROP TABLE IF EXISTS `LB_Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_Users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(256) NOT NULL,
  `password` text NOT NULL,
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
  PRIMARY KEY (`userId`),
  KEY `userName` (`userName`),
  KEY `email` (`email`),
  KEY `securityQuestion` (`securityQuestion`),
  KEY `securityAnswer` (`securityAnswer`)
) ENGINE=MyISAM AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_Users`
--

LOCK TABLES `LB_Users` WRITE;
/*!40000 ALTER TABLE `LB_Users` DISABLE KEYS */;
INSERT INTO `LB_Users` VALUES (1,'LB ADMIN','a7c2ac0236c2b907e60d9db90070b56f169b64007f5a85d935e4c51a906b795222746c122b8c273b02e4f583fde08a7e298bbaa9dc0643d3086b88a4d5f074576660b095a79675f75d1f03c6d3a51a31dd897d46d1226c23417f088284ee4a0dfb4d8eb00fa24a2aa20a806a16c1053af741c408dd645a165ceaf5ede8a19592961001c35c889dee22ddba7d0e45e8e34d414887ae94ee7b8637e4ec5681ae9d29a25452f41efde7742e52a986772f956edbdbcb0fc1479ce3b7bcba4c5f8a562c2ea4ac0ced8da2fc05602cece256bcdfa28224ecb4a054da259320e502dcd90b7edbbd5cdc8d66a53d632d4dc97cccf550d07a8b427f4e91c061189f84e492','lbadmin@lifeblue.com',2011,1,0,0,1326921745,1,'','',1);
/*!40000 ALTER TABLE `LB_Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_WorkflowPath`
--

DROP TABLE IF EXISTS `LB_WorkflowPath`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_WorkflowPath` (
  `pathId` int(11) NOT NULL AUTO_INCREMENT,
  `ruleId` int(11) DEFAULT NULL,
  `userTypeId` int(11) DEFAULT NULL,
  `action` varchar(25) DEFAULT NULL,
  `publishWhen` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`pathId`),
  KEY `userTypeId` (`userTypeId`),
  KEY `ruleId` (`ruleId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_WorkflowPath`
--

LOCK TABLES `LB_WorkflowPath` WRITE;
/*!40000 ALTER TABLE `LB_WorkflowPath` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_WorkflowPath` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_WorkflowPeople`
--

DROP TABLE IF EXISTS `LB_WorkflowPeople`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_WorkflowPeople`
--

LOCK TABLES `LB_WorkflowPeople` WRITE;
/*!40000 ALTER TABLE `LB_WorkflowPeople` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_WorkflowPeople` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LB_WorkflowRule`
--

DROP TABLE IF EXISTS `LB_WorkflowRule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LB_WorkflowRule` (
  `ruleId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`ruleId`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LB_WorkflowRule`
--

LOCK TABLES `LB_WorkflowRule` WRITE;
/*!40000 ALTER TABLE `LB_WorkflowRule` DISABLE KEYS */;
/*!40000 ALTER TABLE `LB_WorkflowRule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-02-21 14:37:26
