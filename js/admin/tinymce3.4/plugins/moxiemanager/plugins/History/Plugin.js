/**
 * Plugin.js
 *
 * Copyright 2003-2013, Moxiecode Systems AB, All rights reserved.
 */

/*jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true, camelcase:false */
/*global moxman:true */

moxman.require([
	"moxman/PluginManager",
	"moxman/vfs/FileSystemManager",
	"moxman/util/JsonRpc"
], function(PluginManager, FileSystemManager, JsonRpc) {
	PluginManager.add("history", function(manager) {
		function removeHistory() {
			var paths = [];

			manager.getSelectedFiles().each(function(file) {
				paths.push(file.info.link);
			});

			JsonRpc.exec('history.remove', {paths: paths}, function() {
				manager.refresh();
			});
		}

		function gotoFile() {
			FileSystemManager.getFile(manager.getSelectedFiles()[0].info.link, function(file) {
				manager.open(file);
			});
		}

		manager.on('BeforeRenderManageMenu', function(e) {
			var menu = e.menu;

			if (manager.currentDir.path == '/History') {
				e.preventDefault();

				menu.append({text: 'Remove link', onclick: removeHistory});
				menu.append({text: 'Goto file', onclick: gotoFile});
			}
		});
	});
});
