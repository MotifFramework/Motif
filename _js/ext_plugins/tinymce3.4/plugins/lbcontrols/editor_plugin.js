/**
 * editor_plugin.js
 *
 * Copyright 2011, Lifeblue
 * http://www.lifeblue.com/
 *
 */

(function() {
	tinymce.create('tinymce.plugins.LBControls', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('mceLBControls', function() {
				
				$("<a></a>").lb_box({
					dataSource : "/admin/content/dialog/controlPicker.html?flushBackground=1&tiny=1",
					title : "Pick A Control...",
					width : 600,
					height : 400,
					type: "iframe",
					animate : true,
					id : "ControlPickerWindow"
				}).click();
				
				/*ed.windowManager.open({
					file : url + '/lbcontrols.htm',
					width : 10,
					height : 10,
					inline : 1
				}, {
					plugin_url : url
				});*/
				
			});

			// Register buttons
			ed.addButton('lbcontrols', {
				title : 'Manage Controls',
				cmd : 'mceLBControls',
				image : ''+url+'/img/application_view_tile.png',
				icon_src : ''+url+'/img/application_view_tile.png'
			});
		},

		getInfo : function() {
			return {
				longname : 'LB Control Manager',
				author : 'LifeBlue',
				authorurl : 'http://www.lifeblue.com',
				infourl : 'http://www.lifeblue.com',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('lbcontrols', tinymce.plugins.LBControls);
})();