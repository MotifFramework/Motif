/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	tinymce.create('tinymce.plugins.AdvancedImagePluginUTSW', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('mceAdvImageUTSW', function() {
				// Internal image object like a flash placeholder
				if (ed.dom.getAttrib(ed.selection.getNode(), 'class').indexOf('mceItem') != -1)
					return;

				ed.windowManager.open({
					file : url + '/image.htm',
					width : 480 + parseInt(ed.getLang('advimageutsw.delta_width', 0)),
					height : 385 + parseInt(ed.getLang('advimageutsw.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('imageutsw', {
				title : 'advimageutsw.image_desc',
				cmd : 'mceAdvImageUTSW',
				icon_src : '/resources/js/ext_plugins/tinymce3.4/plugins/imagemanager/pages/im/img/insertimage.gif'
			});
		},

		getInfo : function() {
			return {
				longname : 'Advanced image UTSW',
				author : 'LifeBlue',
				authorurl : 'http://www.lifeblue.com',
				infourl : 'http://www.lifeblue.com',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('advimageutsw', tinymce.plugins.AdvancedImagePluginUTSW);
})();