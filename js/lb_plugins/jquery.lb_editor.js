/*
 * lifeBLUE Media jQuery plugin to open up a tinymce wysiwyg.
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
	$.fn.lb_editor = function(customOptions) {
		var options;
		// load in options
		if(customOptions == "full") {
			options = {
				script_url : '/resources/js/ext_plugins/tinymce3.4/tiny_mce.js',
				plugins : "lbcontrols,safari,pagebreak,style,layer,table,save,advhr,advimageutsw,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,imagemanager,filemanager",
				buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
				buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,imageutsw,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
				buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen,|,insertimage,insertfile,|,lbcontrols",
				toolbar_location : "top",
				toolbar_align : "left",
				statusbar_location : "bottom",
				valid_elements : "*[*]",
				theme : "advanced"
			}
		} else if( customOptions == "mid" ) {
			options = {
				script_url : '/resources/js/ext_plugins/tinymce3.4/tiny_mce.js',
				plugins : "safari,pagebreak,style,layer,table,save,advhr,advimageutsw,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
				buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
				buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
				buttons3 : "",
				//buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
				toolbar_location : "top",
				toolbar_align : "left",
				statusbar_location : "bottom",
				theme : "advanced"
			}
		} else if( customOptions == "basic" ) {
			options = {
				script_url : '/resources/js/ext_plugins/tinymce3.4/tiny_mce.js',
				plugins : "safari,pagebreak,style,layer,table,save,advhr,advimageutsw,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
				buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright",
				buttons2 : "",
				buttons3 : "",
				toolbar_location : "top",
				toolbar_align : "left",
				statusbar_location : "none",
				theme : "advanced"
			}
		}
		else {
			options = $.extend({},$.fn.lb_editor.defaultOptions, customOptions);
		}
		this.tinymce(
		{
			script_url : options.script_url,
			plugins : options.plugins,
			theme_advanced_buttons1 : options.buttons1,
			theme_advanced_buttons2 : options.buttons2,
			theme_advanced_buttons3 : options.buttons3,
			theme_advanced_toolbar_location : options.toolbar_location,
			theme_advanced_toolbar_align : options.toolbar_align,
			theme_advanced_statusbar_location : options.statusbar_location,
			theme : options.theme,
			content_css : '/resources/css/editor.css',
			valid_elements : '*[*]',
			relative_urls : false,
			force_br_newlines : true,
			force_p_newlines : false
		});
	}
	$.fn.lb_editor.defaultOptions = {
		script_url : '/resources/js/ext_plugins/tinymce3.4/tiny_mce.js',
		plugins : "safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
		buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		toolbar_location : "top",
		toolbar_align : "left",
		statusbar_location : "bottom",
		theme : "advanced",
		valid_elements : '*[*]',
		relative_urls : false
	}
})(jQuery);
