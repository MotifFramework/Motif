SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


CREATE TABLE `LB_Actions` (
  `actionId` int(11) NOT NULL AUTO_INCREMENT,
  `actionType` varchar(128) NOT NULL,
  `actionMessage` varchar(512) NOT NULL,
  `creationDate` int(11) NOT NULL,
  PRIMARY KEY (`actionId`),
  KEY `actionType` (`actionType`),
  KEY `creationDate` (`creationDate`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11909 ;

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

INSERT INTO `LB_Content` (`contentId`, `fullURL`, `contentSlug`, `contentAlias`, `contentDescription`, `creator`, `creationDate`, `updatedBy`, `updatedDate`, `contentSectionId`, `contentTypeId`, `templateId`, `headerStatus`, `redirectLocation`, `showInNavigation`, `navigationAnchor`, `status`, `navigationOrder`, `ruleId`) VALUES
(1, '/index', 'index', 'index', '', 1, 1334010178, 1, 1334010178, 0, 1, 2, '404', '', 0, 'Home', 1, 0, 1);

CREATE TABLE `LB_ContentCache` (
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `publishedData` text,
  PRIMARY KEY (`fullURL`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_ContentCache` (`fullURL`, `publishedData`) VALUES
('/index', '{"template":"Reef_DefaultHome","data":[{"entityKey":"content","data":"<p>The home page content.<\\/p>"},{"entityKey":"metaTitle","data":"Home Page"},{"entityKey":"metaDescription","data":"This is the home page for the site"},{"entityKey":"tweetText","data":""},{"entityKey":"openGraphTitle","data":""},{"entityKey":"openGraphDescription","data":""},{"entityKey":"openGraphImage","data":""}]}');

CREATE TABLE `LB_ContentData_Float` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` float DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_ContentData_Int` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_ContentData_Text` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` text,
  KEY `versionId` (`versionId`,`contentId`,`contentKey`),
  KEY `contentId` (`contentId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_ContentData_Text` (`versionId`, `contentId`, `contentKey`, `data`) VALUES
(1, 1, 'content', '<p>The home page content.</p>'),
(1, 1, 'tweetText', ''),
(1, 1, 'openGraphDescription', ''),
(1, 1, 'openGraphImage', '');

CREATE TABLE `LB_ContentData_VC64` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) DEFAULT NULL,
  `data` varchar(64) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_ContentData_VC255` (
  `versionId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `contentKey` varchar(128) NOT NULL DEFAULT '',
  `data` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`versionId`,`contentId`,`contentKey`),
  KEY `contentId` (`contentId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_ContentData_VC255` (`versionId`, `contentId`, `contentKey`, `data`) VALUES
(1, 1, 'metaTitle', 'Home Page'),
(1, 1, 'metaDescription', 'This is the home page for the site'),
(1, 1, 'openGraphTitle', '');

CREATE TABLE `LB_ContentPublishQueue` (
  `publishId` int(11) NOT NULL AUTO_INCREMENT,
  `publishLock` int(11) DEFAULT NULL,
  `publishType` varchar(255) DEFAULT NULL,
  `publishKey` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`publishId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

INSERT INTO `LB_ContentPublishQueue` (`publishId`, `publishLock`, `publishType`, `publishKey`) VALUES
(1, 0, 'LB_Content', '1');

CREATE TABLE `LB_ContentPublishSchedule` (
  `contentId` int(11) NOT NULL,
  `publishStart` int(11) DEFAULT NULL,
  `publishEnd` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`contentId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

INSERT INTO `LB_ContentTypes` (`contentTypeId`, `contentTypeName`, `contentTypeDescription`, `templateId`, `defaultAllowsCommenting`, `defaultAllowsRating`, `defaultAllowsTagging`, `defaultAllowsFavoriting`, `parentContentTypeId`, `useOption`, `status`, `isSelectable`) VALUES
(1, 'Basic Page', 'This is a basic interior page', 1, 0, 0, 0, 0, 2, 1, 1, 1),
(3, 'Post', 'A basic blog-style post.', 1, 0, 0, 0, 0, 1, 1, 1, 1),
(2, 'Meta Data', 'This is the meta data.', 1, 0, 0, 0, 0, 0, 2, 1, 1);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

INSERT INTO `LB_ContentVersion` (`versionId`, `contentId`, `createdBy`, `creationDate`, `updatedBy`, `updatedDate`, `workflowState`, `scheduleStart`, `scheduleEnd`) VALUES
(1, 1, 1, 1334010195, 1, 1334010195, 4, 0, 0),
(2, 1, 1, 1350070325, 1, 1350070325, 4, 0, 0),
(3, 1, 1, 1350270004, 1, 1350270004, 4, 0, 0),
(4, 1, 1, 1350270141, 1, 1350270141, 4, 0, 0);

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

CREATE TABLE `LB_Crud` (
  `crudId` int(11) NOT NULL AUTO_INCREMENT,
  `crudName` varchar(256) NOT NULL,
  `dateCreated` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`crudId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `LB_DataTypeDefinition` (
  `dataTypeDefinitionId` int(11) NOT NULL AUTO_INCREMENT,
  `dataTypeName` varchar(255) DEFAULT NULL,
  `dataTypeDescription` text,
  `dataTypeClass` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `dataStorageType` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dataTypeDefinitionId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

INSERT INTO `LB_DataTypeDefinition` (`dataTypeDefinitionId`, `dataTypeName`, `dataTypeDescription`, `dataTypeClass`, `status`, `dataStorageType`) VALUES
(1, 'Input Field', 'A standard single line input field.', 'LB_ContentManagement_Presentation_DataTypes_InputField', 1, 'VC255'),
(2, 'WYSIWYG Editor', 'A specialized editor helping create HTML markup of content.', 'LB_ContentManagement_Presentation_DataTypes_WYSIWYGEditor', 1, 'Text'),
(3, 'File Uploader', 'Allows you to select files from your hard drive to upload for use.', 'LB_ContentManagement_Presentation_DataTypes_FileUpload', 1, 'Text'),
(4, 'Content Picker', 'Content Picker', 'LB_ContentManagement_Presentation_DataTypes_ContentPicker', 1, 'Text'),
(5, 'Call Out Box', 'A Generator for call out boxes.', 'LB_ContentManagement_Presentation_DataTypes_CallOutBox', 1, 'Text'),
(6, 'Drop Down List', 'Drop Down List', 'LB_ContentManagement_Presentation_DataTypes_DropDownList', 1, 'Text'),
(7, 'Tag Picker', 'Tag input box w/ auto fill', 'LB_ContentManagement_Presentation_DataTypes_TagPicker', 1, 'Text'),
(8, 'Curriculum Chart', 'Curriculum Chart Builder (Introduced in SHP)', 'LB_ContentManagement_Presentation_DataTypes_CurriculumChart', 1, 'Text'),
(9, 'Media Picker', 'A entity to select media items using the TinyMCE Image Manager.', 'LB_ContentManagement_Presentation_DataTypes_MediaPicker', 1, 'Text'),
(10, 'Date Time Picker', 'Use this data type to add a date time element.', 'LB_ContentManagement_Presentation_DataTypes_DateTimePicker', 1, 'Int'),
(11, 'Content Selector Drop Down', 'Use this data type to select a single piece of Content via a drop down.', 'LB_ContentManagement_Presentation_DataTypes_ContentDropDownList', 1, 'Text'),
(12, 'Text Area', 'Use this data type to create unstyled text.', 'LB_ContentManagement_Presentation_DataTypes_TextArea', 1, 'Text'),
(13, 'Content Selector Grid', 'Use this data type to select multiple pieces of content from a checkbox grid.', 'LB_ContentManagement_Presentation_DataTypes_ContentGrid', 1, 'Text');

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

INSERT INTO `LB_DataTypeEntity` (`dataTypeEntityId`, `contentTypeId`, `dataTypeDefinitionId`, `entityKey`, `entityName`, `entityDescription`, `required`, `validatorType`, `dataStorageType`, `contentTypeGroupId`, `entityOrder`, `status`) VALUES
(9, 3, 1, 'postTitle', 'Post Title', 'Title for this post', 1, '', 'VC255', 4, 0, 1),
(2, 1, 2, 'content', 'Content', 'The content for this page.', 1, '', 'Text', 1, 0, 1),
(3, 2, 1, 'metaTitle', 'Meta Title', 'This is the page title', 0, '', 'VC255', 2, 0, 1),
(4, 2, 1, 'metaDescription', 'Meta Description', 'A description of the page content', 0, '', 'VC255', 2, 0, 1),
(5, 2, 12, 'tweetText', 'Tweet Text', 'The text that will appear when the page is tweeted', 0, '', 'Text', 3, 0, 1),
(6, 2, 1, 'openGraphTitle', 'Open Graph Title', 'The title of the page that will appear in social networks', 0, '', 'VC255', 3, 0, 1),
(7, 2, 12, 'openGraphDescription', 'Open Graph Description', 'The description of the page that will appear in social networks', 0, '', 'Text', 3, 0, 1),
(8, 2, 9, 'openGraphImage', 'Open Graph Image', 'The image that will appear for the page when shared in social networks', 0, '', 'Text', 3, 0, 1),
(10, 3, 10, 'postDate', 'Post Date', 'The publication date for this blog post (used for archiving, NOT for go-live visibility)', 0, '', 'Int', 4, 0, 1),
(11, 3, 12, 'postExcerpt', 'Post Excerpt', 'The brief excerpt visible on the blog landing page', 0, '', 'Text', 4, 0, 1);

CREATE TABLE `LB_DataTypeEntityGroups` (
  `entityGroupId` int(11) NOT NULL AUTO_INCREMENT,
  `contentTypeId` int(11) DEFAULT NULL,
  `entityGroupName` varchar(255) DEFAULT NULL,
  `entityGroupDescription` text,
  `entityGroupOrder` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`entityGroupId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

INSERT INTO `LB_DataTypeEntityGroups` (`entityGroupId`, `contentTypeId`, `entityGroupName`, `entityGroupDescription`, `entityGroupOrder`, `status`) VALUES
(1, 1, 'Content', '', 0, 1),
(2, 2, 'Page Meta', '', 0, 1),
(3, 2, 'Open Graph Information', '', 0, 1),
(4, 3, 'Post Details', '', 0, 1);

CREATE TABLE `LB_DataTypeEntityOptions` (
  `dataTypeEntityOptionId` int(11) NOT NULL AUTO_INCREMENT,
  `dataTypeEntityId` int(11) DEFAULT NULL,
  `optionKey` varchar(255) DEFAULT NULL,
  `optionValue` text,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`dataTypeEntityOptionId`),
  KEY `dataTypeEntityId` (`dataTypeEntityId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `LB_Files` (
  `resourceId` int(11) NOT NULL,
  `fileUrl` varchar(256) NOT NULL,
  PRIMARY KEY (`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_Images` (
  `resourceId` int(11) NOT NULL,
  `imageUrl` varchar(256) NOT NULL,
  PRIMARY KEY (`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_Modules` (
  `moduleId` int(11) NOT NULL AUTO_INCREMENT,
  `moduleName` varchar(256) NOT NULL,
  `moduleAlias` varchar(128) NOT NULL,
  `moduleDescription` varchar(512) NOT NULL,
  `activityClass` varchar(128) NOT NULL,
  `adminDisplay` int(11) NOT NULL,
  PRIMARY KEY (`moduleId`),
  KEY `moduleName` (`moduleName`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

INSERT INTO `LB_Modules` (`moduleId`, `moduleName`, `moduleAlias`, `moduleDescription`, `activityClass`, `adminDisplay`) VALUES
(1, 'User Management', 'Users', 'Allows for the authorization of users, admin panel accessibility, and additional user-based functionality.', 'LB_UserManagement_Logic_User', 1),
(2, 'Content Management', 'Content', 'Allows for the generation and rendering of generic content, admin panel accessibility, and additional content-based functionality including extendible content types.', 'LB_ContentManagement_Logic_Content', 2);

CREATE TABLE `LB_ModuleSections` (
  `moduleAlias` varchar(128) NOT NULL,
  `sectionName` varchar(64) NOT NULL,
  `sectionLink` varchar(256) NOT NULL,
  `displayOrder` int(11) NOT NULL,
  `permission` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`moduleAlias`,`sectionName`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_ModuleSections` (`moduleAlias`, `sectionName`, `sectionLink`, `displayOrder`, `permission`) VALUES
('Users', 'Users', '/admin/users/index.html', 0, 'Manage Users'),
('Users', 'Roles', '/admin/users/usertypes.html', 1, 'Manage Users'),
('Content', 'All Content', '/admin/content/items.html', 0, 'Create Content,Delete Content,Manage Navigation'),
('Content', 'Content Templates', '/admin/content/contentTypes.html', 2, 'Manage Content Types'),
('Resources', 'Overview', '/admin/resources/index.html', 0, NULL),
('Resources', 'Files', '/admin/resources/files.html', 1, NULL),
('Resources', 'Images', '/admin/resources/images.html', 2, NULL),
('Resources', 'Tags', '/admin/resources/tags.html', 3, NULL),
('Content', 'Workflow Rules', '/admin/content/workflowRules.html', 3, 'Manage Workflow Rules'),
('Crud', 'Overview', '/admin/crud/index.html', 0, 'Crud Overview');

CREATE TABLE `LB_Notifications` (
  `notificationId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0',
  `message` varchar(500) DEFAULT NULL,
  `createdDate` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `lookupId` int(11) DEFAULT NULL,
  PRIMARY KEY (`notificationId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

INSERT INTO `LB_Notifications` (`notificationId`, `userId`, `message`, `createdDate`, `status`, `type`, `lookupId`) VALUES
(1, 1, '<a href="/admin/content/manage.html?id=1">/index.html</a> has been published!', 1350070326, 1, 'Content', 0);

CREATE TABLE `LB_RegisteredControls` (
  `controlId` int(11) NOT NULL AUTO_INCREMENT,
  `controlName` varchar(255) DEFAULT NULL,
  `controlClass` text,
  `useInline` int(11) DEFAULT NULL,
  `useDesigner` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`controlId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `LB_ResourceToContent` (
  `resourceTypeId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL,
  PRIMARY KEY (`resourceTypeId`,`contentId`,`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_ResourceToResource` (
  `recessiveResourceTypeId` int(11) NOT NULL,
  `dominantResourceId` int(11) NOT NULL,
  `recessiveResourceId` int(11) NOT NULL,
  PRIMARY KEY (`recessiveResourceTypeId`,`dominantResourceId`,`recessiveResourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_ResourceToUser` (
  `resourceTypeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL,
  PRIMARY KEY (`resourceTypeId`,`userId`,`resourceId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_ResourceTypes` (
  `resourceTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `resourceTypeName` varchar(128) NOT NULL,
  `resourceTypeDescription` varchar(512) NOT NULL,
  `resourceTypePage` varchar(128) NOT NULL,
  `resourceTypeClass` varchar(128) NOT NULL,
  `adminSubmittable` tinyint(4) NOT NULL,
  PRIMARY KEY (`resourceTypeId`),
  KEY `resourceTypeName` (`resourceTypeName`,`resourceTypeDescription`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

INSERT INTO `LB_ResourceTypes` (`resourceTypeId`, `resourceTypeName`, `resourceTypeDescription`, `resourceTypePage`, `resourceTypeClass`, `adminSubmittable`) VALUES
(1, 'Files', 'Files are used to store and manage any file of any extension.', 'files', 'LB_ResourceManagement_Logic_ResourceTypes_File', 1),
(2, 'Images', 'Images are used to store and manage any image media.', 'images', 'LB_ResourceManagement_Logic_ResourceTypes_Image', 1),
(3, 'Tags', 'Tags are used to characterize and group elements.', 'tags', 'LB_ResourceManagement_Logic_ResourceTypes_Tag', 1);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

INSERT INTO `LB_Settings` (`settingId`, `settingName`, `settingDescription`, `settingGroup`, `settingValue`, `settingStatus`) VALUES
(1, 'LB_SYSTEM_PROJECT_NAME', 'Provides the display name for this project', 'System', 'LB Core Default', 1),
(2, 'LB_SYSTEM_CURRENCY_CHARACTER', 'Provides a default character for denoting currency', 'System', '$', 1),
(3, 'LB_SYSTEM_DATETIME_FORMAT', 'Provides a string format the system uses to format dates', 'System', 'F jS, Y \\a\\t g:m a', 1),
(4, 'LB_SYSTEM_DATE_FORMAT', 'Provides a string format the system uses to format full date and time output', 'System', 'F jS, Y', 1),
(5, 'LB_SYSTEM_ACTIONS_EXPIRATION', 'Determines the number of days Actions are stored in the database before being purged', 'System', '0', 1),
(6, 'LB_SYSTEM_ACTIONS_HISTORY', 'Determines the number of days to look up Actions to be displayed in the administrative panel', 'System', '0', 1),
(7, 'LB_USER_REQUIRES_UNIQUE_USERNAME', 'Determines whether a unique username is required upon creating a new user', 'User Management', '1', 1),
(8, 'LB_USER_REQUIRES_EMAIL_VERIFICATION', 'Determines whether email verification is required upon creating a new user', 'User Management', '0', 1),
(9, 'LB_USER_PASSWORD_REGULAR_EXPRESSION', 'Verifies that new passwords meet a required strength test', 'User Management', '', 1),
(10, 'LB_USER_PASSWORD_FORMAT', 'Determines the type of encryption being used for user passwords and other sensitive data', 'User Management', 'Open SSL', 1),
(11, 'LB_USER_DEFAULT_LOGIN_URL', 'Provides a default page url to redirect users to when requesting authenticated sources', 'User Management', '/admin/login.html', 1),
(12, 'LB_USER_DEFAULT_REGISTER_URL', 'Provides a default page url to redirect users to when requesting registration', 'User Management', '/register.html', 1),
(13, 'LB_USER_QUESTION_AND_ANSWER_REQUIRED', 'Determines whether password retrieval question and answer are required upon creation of a new user', 'User Management', '0', 1),
(14, 'LB_USER_ALLOWED_LOGIN_ATTEMPTS', 'Determines the number of login attempts allowed before locking a user''s account', 'User Management', '10', 1),
(15, 'LB_USER_LOGIN_LOCKOUT_WINDOW', 'Determines the number of minutes that must pass after a user maxes out login attempts', 'User Management', '10', 1),
(16, 'LB_CONTENT_HAS_CMS', 'Determines the type of Request Handler that will be used to handle page requests', 'Content', '1', 1),
(17, 'LB_CONTENT_DEFAULT_TEMPLATE', 'Sets a default template to use for CMS and frontend pages in the scenario that a template is not specified', 'Content', 'Reef_Blank', 1),
(18, 'LB_SYSTEM_MULTISERVER_PUBLISH', 'Determines whether the workflow and publishing system will push content to multiple presentation servers or just a single server', 'System', '0', 1),
(19, 'LB_CONTENT_GOOGLE_ANALYTICS_ID', 'Activate Google analytics code by putting GA ID here', 'Content', '0', 1),
(20, 'LB_CONTENT_FACEBOOK_APP_ID', 'Load basic Facebook SDK code by entering your app id here', 'Content', '0', 1),
(21, 'LB_CONTENT_DEFAULT_TITLE', 'Load the default page title here.', 'Content', 'Website', 1),
(22, 'LB_CONTENT_DEFAULT_DESCRIPTION', 'Load the default page description here.', 'Content', 'Website description', 1),
(23, 'LB_CONTENT_DEFAULT_IMAGEPATH', 'Load the default image path here for Open Graph image.', 'Content', 'http://www.lifeblue.com/resources/images/fb-avatar.jpg', 1),
(24, 'LB_CONTENT_DEFAULT_KEYWORDS', 'Load the default keywords here for SEO.', 'Content', 'website, things, stuff', 1);

CREATE TABLE `LB_SiteDesignOverride` (
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `designOverride` text,
  PRIMARY KEY (`fullURL`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `LB_Templates` (
  `templateId` int(11) NOT NULL AUTO_INCREMENT,
  `templateName` varchar(255) DEFAULT NULL,
  `templateClass` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`templateId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=48 ;

INSERT INTO `LB_Templates` (`templateId`, `templateName`, `templateClass`, `status`) VALUES
(1, 'Default Template', 'Reef_Default', 1),
(2, 'Default Home Page Template', 'Reef_DefaultHome', 1);

CREATE TABLE `LB_TrashCan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullURL` varchar(500) NOT NULL DEFAULT '',
  `publishedData` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE `LB_UserData` (
  `userId` int(11) NOT NULL,
  `userDataType` varchar(128) NOT NULL,
  `userDataValue` varchar(512) NOT NULL,
  PRIMARY KEY (`userId`,`userDataType`),
  KEY `userDataType` (`userDataType`,`userDataValue`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_UserData` (`userId`, `userDataType`, `userDataValue`) VALUES
(1, 'HomeDirectory', '0'),
(1, 'description', '');

CREATE TABLE `LB_UserLogins` (
  `userId` int(11) NOT NULL,
  `loginTime` int(11) NOT NULL,
  `success` tinyint(4) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `ipAddress` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`,`loginTime`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_UserLogins` (`userId`, `loginTime`, `success`, `active`, `ipAddress`) VALUES
(1, 1326921745, 1, 0, '127.0.0.1'),
(1, 1334008125, 1, 0, '127.0.0.1'),
(1, 1334008316, 1, 0, '127.0.0.1'),
(1, 1334008623, 1, 0, '127.0.0.1'),
(1, 1350268030, 1, 0, '127.0.0.1');

CREATE TABLE `LB_UserPermissions` (
  `userPermissionId` int(11) NOT NULL AUTO_INCREMENT,
  `userPermissionSet` varchar(256) NOT NULL,
  `userPermissionName` varchar(256) NOT NULL,
  `userPermissionDescription` varchar(512) NOT NULL,
  PRIMARY KEY (`userPermissionId`),
  KEY `userPermissionName` (`userPermissionName`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=45 ;

INSERT INTO `LB_UserPermissions` (`userPermissionId`, `userPermissionSet`, `userPermissionName`, `userPermissionDescription`) VALUES
(24, 'Content', 'Edit Content Sections', 'Allows for the modification of Content Section details'),
(23, 'Content', 'View Content Sections', 'Allows for the viewing of Content Sections'),
(22, 'Content', 'Delete Generic Content', 'Allows for the deletion of content under the Generic Content type'),
(21, 'Content', 'Edit Generic Content', 'Allows for the modification of details for content under the Generic Content type'),
(20, 'Content', 'View Generic Content', 'Allows for the viewing of content under the Generic Content type'),
(19, 'Content', 'Archive Content', 'Allows for the archiving of content'),
(18, 'Content', 'Publish Content', 'Allows for the publishing of content'),
(17, 'Content', 'Approve Content', 'Allows for the approving of content'),
(16, 'Content', 'Draft Content', 'Allows for the drafting of content'),
(15, 'Content', 'Access Control Editor', 'Allows general access to the Control Content Editor'),
(14, 'Content', 'Access Template Editor', 'Allows general access to the Template Content Editor'),
(13, 'Content', 'Access Content Module', 'Allows general access to the Content Module'),
(12, 'Users', 'Delete User Types', 'Allows for the deletion of User Types'),
(11, 'Users', 'Edit User Type Permissions', 'Allows for the modification of User Type permissions'),
(10, 'Users', 'Edit User Types', 'Allows for the modification of User Type data'),
(8, 'Users', 'Delete Users', 'Allows for the deletion of Users'),
(9, 'Users', 'View User Types', 'Allows for the viewing of User Types'),
(7, 'Users', 'Edit User Permissions', 'Allows for the modification of User permissions'),
(6, 'Users', 'Edit Users', 'Allows for the modification of User data'),
(5, 'Users', 'View Users', 'Allows for the viewing of Users'),
(4, 'Users', 'Access Users Module', 'Allows general access to the Users Module'),
(3, 'System', 'Delete Settings', 'Allows for the deletion of Settings'),
(2, 'System', 'Edit Settings', 'Allows for the modification of Setting details'),
(1, 'System', 'View Settings', 'Allows general access to the Settings section'),
(41, 'Permissions', 'Delete Content', 'Delete and Remove content from the site.'),
(40, 'Permissions', 'Create Content', 'Create and edit content in the system.'),
(39, 'Permissions', 'Manage Navigation', 'Manage site navigation order and strucutre.'),
(38, 'Permissions', 'Manage Users', 'Add, Edit, and Delete Users'),
(37, 'Permissions', 'Manage Content Types', 'Manage content types and structure'),
(36, 'Permissions', 'Manage System Settings', 'Manage system settings and information'),
(25, 'Content', 'Delete Content Sections', 'Allows for the deletion of Content Sections'),
(26, 'Resources', 'Access Resources Module', 'Allows general access to the Resource Module'),
(27, 'Resources', 'View Files', 'Allows for the viewing of resources under the Files type'),
(28, 'Resources', 'Edit Files', 'Allows for the modification of details for resources under the Files type'),
(29, 'Resources', 'Delete Files', 'Allows for the deletion of resources under the Files type'),
(30, 'Resources', 'View Images', 'Allows for the viewing of resources under the Images type'),
(31, 'Resources', 'Edit Images', 'Allows for the modification of details for resources under the Images type'),
(32, 'Resources', 'Delete Images', 'Allows for the deletion of resources under the Images type'),
(33, 'Resources', 'View Tags', 'Allows for the viewing of resources under the Tags type'),
(34, 'Resources', 'Edit Tags', 'Allows for the modification of details for resources under the Tags type'),
(35, 'Resources', 'Delete Tags', 'Allows for the deletion of resources under the Tags type'),
(42, 'Permissions', 'Manage Workflow Rules', 'Permission to manage system workflow rules.'),
(43, 'Permissions', 'Delete Folders', 'Delete folders/sections in your tree structure.'),
(44, 'Permissions', 'Crud Overview', 'Crud overview description');

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=53 ;

INSERT INTO `LB_Users` (`userId`, `userName`, `password`, `email`, `dateCreated`, `approved`, `disabled`, `lockedOut`, `lastLogin`, `userTypeId`, `securityQuestion`, `securityAnswer`, `notifications`) VALUES
(1, 'LB ADMIN', 'a7c2ac0236c2b907e60d9db90070b56f169b64007f5a85d935e4c51a906b795222746c122b8c273b02e4f583fde08a7e298bbaa9dc0643d3086b88a4d5f074576660b095a79675f75d1f03c6d3a51a31dd897d46d1226c23417f088284ee4a0dfb4d8eb00fa24a2aa20a806a16c1053af741c408dd645a165ceaf5ede8a19592961001c35c889dee22ddba7d0e45e8e34d414887ae94ee7b8637e4ec5681ae9d29a25452f41efde7742e52a986772f956edbdbcb0fc1479ce3b7bcba4c5f8a562c2ea4ac0ced8da2fc05602cece256bcdfa28224ecb4a054da259320e502dcd90b7edbbd5cdc8d66a53d632d4dc97cccf550d07a8b427f4e91c061189f84e492', 'lbadmin@lifeblue.com', 2011, 1, 0, 0, 1350268030, 1, '', '', 1);

CREATE TABLE `LB_UserSectionPermissions` (
  `id` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) DEFAULT NULL,
  UNIQUE KEY `id` (`id`,`type`,`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_UserSectionPermissions` (`id`, `type`, `status`, `userId`) VALUES
(0, 'section', 1, 1);

CREATE TABLE `LB_UserToUserPermission` (
  `userId` int(11) NOT NULL,
  `userPermissionId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`userPermissionId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_UserToUserPermission` (`userId`, `userPermissionId`) VALUES
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43),
(1, 44);

CREATE TABLE `LB_UserTypes` (
  `userTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `userTypeName` varchar(256) NOT NULL,
  `userTypeDescription` varchar(512) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userTypeId`),
  KEY `userTypeName` (`userTypeName`,`userTypeDescription`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

INSERT INTO `LB_UserTypes` (`userTypeId`, `userTypeName`, `userTypeDescription`, `status`) VALUES
(1, 'Super Admin', 'Performs all site maintenance and monitors site activity.', 1);

CREATE TABLE `LB_UserTypeToUserPermission` (
  `userTypeId` int(11) NOT NULL,
  `userPermissionId` int(11) NOT NULL,
  PRIMARY KEY (`userTypeId`,`userPermissionId`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `LB_UserTypeToUserPermission` (`userTypeId`, `userPermissionId`) VALUES
(1, 36),
(1, 37),
(1, 38),
(1, 39),
(1, 40),
(1, 41),
(1, 42),
(1, 43);

CREATE TABLE `LB_WorkflowPath` (
  `pathId` int(11) NOT NULL AUTO_INCREMENT,
  `ruleId` int(11) DEFAULT NULL,
  `userTypeId` int(11) DEFAULT NULL,
  `action` varchar(25) DEFAULT NULL,
  `publishWhen` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`pathId`),
  KEY `userTypeId` (`userTypeId`),
  KEY `ruleId` (`ruleId`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

INSERT INTO `LB_WorkflowPath` (`pathId`, `ruleId`, `userTypeId`, `action`, `publishWhen`) VALUES
(1, 1, 1, 'Both', 'Always');

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=25 ;

CREATE TABLE `LB_WorkflowRule` (
  `ruleId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`ruleId`),
  KEY `status` (`status`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

INSERT INTO `LB_WorkflowRule` (`ruleId`, `name`, `description`, `status`) VALUES
(1, 'Default', 'Default workflow with only a superuser', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
