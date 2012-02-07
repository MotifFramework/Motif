/**
 * $Id: editor_plugin_src.js 2.0.0 2008-02-06 jasonmac $
 *
 * @author Jason McInerney
 * @copyright Copyright © 2007, Jason McInerney, All rights reserved.
 * For TinyMCE v3
 */

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.JMFormPlugin', {
		init : function(ed, url) {
			var f = this;

			f.editor = ed;
			f.url = url;

			// Register buttons
			each([
				['jmform', 'jmform.gif', 'Insert/Edit a form', 'mceJMFormInsertForm', true],
  			['jmform_delete', 'jmform_delete.gif', 'Delete selected form', 'mceJMFormDelete'],
  			['jmform_insert_input', 'jmform_insert_input.gif', 'Insert/Edit form input element', 'mceJMFormInsertInput', true],
  			['jmform_insert_select', 'jmform_insert_select.gif', 'Insert/Edit form select element', 'mceJMFormInsertSelect', true],
  			['jmform_insert_textarea', 'jmform_insert_textarea.gif', 'Insert/Edit form textarea element', 'mceJMFormInsertTextarea', true]
			], function(c) {
				ed.addButton(c[0], {image : url + '/img/' + c[1], title : c[2], cmd : c[3], ui : c[4]});
			});

			ed.onInit.add(function() {
				if (ed && ed.plugins.contextmenu) {
					ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
						var sm; 
						if (ed.dom.getParent(e, 'form')) {
							m.addSeparator();
							if (e.nodeName.toLowerCase() == 'input')
                m.add({title : 'Edit input element', icon : url + 'jmform_insert_input.gif', cmd : 'mceJMFormInsertInput', ui : true});
              else if (e.nodeName.toLowerCase() == 'select')
								m.add({title : 'Edit select element', icon : 'jmform_insert_select.gif', cmd : 'mceJMFormInsertSelect', ui : true});
							else if (e.nodeName.toLowerCase() == 'textarea')
                m.add({title : 'Edit textarea element', icon : 'jmform_insert_textarea.gif', cmd : 'mceJMFormInsertTextarea', ui : true});
							else {
                //sm = m.addMenu({title : 'Add form elements...'});
								//sm.add({title : 'Insert input element', icon : 'jmform_insert_input.gif', cmd : 'mceJMFormInsertInput', ui : true});
                //sm.add({title : 'Insert select element', icon : 'jmform_insert_select.gif', cmd : 'mceJMFormInsertSelect', ui : true});
                //sm.add({title : 'Insert textarea element', icon : 'jmform_insert_textarea.gif', cmd : 'mceJMFormInsertTextarea', ui : true});
              }
              m.add({title : 'Edit form', icon : 'jmform.gif', cmd : 'mceJMFormInsertForm', ui : true, value : {action : 'insert'}});
              m.add({title : 'Delete form', icon : 'jmform_delete.gif', cmd : 'mceJMFormDelete', ui : true});
						} else
							m.add({title : 'Insert form', icon : 'jmform.gif', cmd : 'mceJMFormInsertForm', ui : true});              
					});
				}
			});
 
      ed.onNodeChange.add(f._nodeChange, f);
			ed.onVisualAid.add(f._visualAid, f);
		},

    
		execCommand : function(cmd, ui, val) {
			var ed = this.editor, b;

			// Is form command
			switch (cmd) {
				case "mceJMFormInsertForm":
  			case "mceJMFormInsertInput":
  			case "mceJMFormInsertSelect":
  			case "mceJMFormInsertTextarea":
  			case "mceJMFormDelete":
					ed.execCommand('mceBeginUndoLevel');
          this._doExecCommand(cmd, ui, val);
					ed.execCommand('mceEndUndoLevel');
					return true;
			}

			// Pass to next handler in chain
			return false;
		},

		getInfo : function() {
			return {
				longname : 'JMForm',
				author : 'Jason McInerney',
				authorurl : 'https://sourceforge.net/projects/jmforms',
				infourl : 'https://sourceforge.net/tracker/?func=detail&atid=738747&aid=1662152&group_id=103281',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private plugin internal methods 
    
    _nodeChange : function(ed, cm, n) {
			var el, p;

			p = ed.dom.getParent(n, 'form');

      if (!p) {
				cm.setActive('jmform',0);
        cm.setActive('jmform_insert_input',0);
				cm.setActive('jmform_insert_select',0);
				cm.setActive('jmform_insert_textarea',0);
				cm.setDisabled('jmform_insert_input', 1);
				cm.setDisabled('jmform_insert_select', 1);
				cm.setDisabled('jmform_insert_textarea', 1);
				cm.setDisabled('jmform_delete', 1);
			} else {				
        cm.setActive('jmform_insert_input',0);
				cm.setActive('jmform_insert_select',0);
				cm.setActive('jmform_insert_textarea',0);
        cm.setDisabled('jmform_insert_input', 0);
        cm.setDisabled('jmform_insert_select', 0);
				cm.setDisabled('jmform_insert_textarea', 0);
				cm.setDisabled('jmform_delete', 0);
				cm.setActive('jmform',1);
        if (n.nodeName.toLowerCase() == 'input')
          cm.setActive('jmform_insert_input',1);
        else if (n.nodeName.toLowerCase() == 'select')
          cm.setActive('jmform_insert_select',1);
        else if (n.nodeName.toLowerCase() == 'textarea')
          cm.setActive('jmform_insert_textarea',1);
			}
		},

    _visualAid : function(ed, e, s) {
			var dom = ed.dom;

			tinymce.each(dom.select('form', e), function(e) {
				if (s)
					dom.addClass(e, 'mceVisualAid');
				else
					dom.removeClass(e, 'mceVisualAid');	
			});
		},
    
		_doExecCommand : function(command, user_interface, value) {
			var inst = this.editor, ed = inst, url = this.url;
      var focusElm = inst.selection.getNode();
			var inpElm = (focusElm.nodeName.toLowerCase() == "input") ? focusElm : null;
			var selElm = (focusElm.nodeName.toLowerCase() == "select") ? focusElm : null;
			var taElm = (focusElm.nodeName.toLowerCase() == "textarea") ? focusElm : null;
			var formElm = inst.dom.getParent(focusElm, "form");
			var doc = inst.contentWindow.document;

			function inArray(ar, v) {
				for (var i=0; i<ar.length; i++) {
					// Is array
					if (ar[i].length > 0 && inArray(ar[i], v))
						return true;
					// Found value
					if (ar[i] == v)
						return true;
				}
				return false;
			}

      function makeInp() {
  			var newInp = doc.createElement("input");
  			newInp.innerHTML = "&nbsp;";
  		}

			function prevElm(node, name) {
				while ((node = node.previousSibling) != null) {
					if (node.nodeName == name)
						return node;
				}

				return null;
			}

			function nextElm(node, names) {
				var namesAr = names.split(',');

				while ((node = node.nextSibling) != null) {
					for (var i=0; i<namesAr.length; i++) {
						if (node.nodeName.toLowerCase() == namesAr[i].toLowerCase() )
							return node;
					}
				}

				return null;
			}

      function deleteMarked(frm) {
        frm.inps = frm.elements;
  			if (frm.inps == 0)
  				return;

  			var inp = frm.inps[0];
  			do {
  				var nextinp = nextElm(inp, "input,select,textarea");
  				if (inp._delete)
  							inp.parentNode.removeChild(inp);
  			} while ((inp = nextinp) != null);
  		}

			// ---- Commands -----

			// Handle commands
			switch (command) {
  			case "mceJMFormInsertTextarea":
  				if (taElm == undefined || taElm == null)
  					value = "insert";
  				else
  					value = "update";
  					
  				if (user_interface) {
            var template = new Array();

  					template['file'] = url + '/textarea.htm';
  					template['width'] = 380;
  					template['height'] = 480;

  					// Language specific width and height addons
  					template['width'] += inst.getLang('jmform.elemprops_delta_width', 0);
  					template['height'] += inst.getLang('jmform.elemprops_delta_height', 0);
            
            inst.windowManager.open({
              url : template['file'],
              width : template['width'],
              height : template['height'],
              inline : 1
            }, {
              plugin_url : url
            });
   				}

  				return true;
        
        case "mceJMFormInsertSelect":
  				if (selElm == undefined || selElm == null)
  					value = "insert";
  				else
  					value = "update";
  					
  				if (user_interface) {
            var template = new Array();

  					template['file'] = url + '/select.htm';
  					template['width'] = 380;
  					template['height'] = 510;

  					// Language specific width and height addons
  					template['width'] += inst.getLang('jmform.elemprops_delta_width', 0);
  					template['height'] += inst.getLang('jmform.elemprops_delta_height', 0);
            
            inst.windowManager.open({
              url : template['file'],
              width : template['width'],
              height : template['height'],
              inline : 1
            }, {
              plugin_url : url
            });
   				}

  				return true;
        
        case "mceJMFormInsertInput":
  				if (selElm == undefined || selElm == null)
  					value = "insert";
  				else
  					value = "update";
  					
  				if (user_interface) {
            var template = new Array();

  					template['file'] = url + '/input.htm';
  					template['width'] = 380;
  					template['height'] = 480;

  					// Language specific width and height addons
  					template['width'] += inst.getLang('jmform.elemprops_delta_width', 0);
  					template['height'] += inst.getLang('jmform.elemprops_delta_height', 0);
            
            inst.windowManager.open({
              url : template['file'],
              width : template['width'],
              height : template['height'],
              inline : 1
            }, {
              plugin_url : url
            });
   				}

  				return true;
          
        case "mceJMFormInsertForm":
  				if (formElm == undefined || formElm == null)
  					value = "insert";
  				else
  					value = "update";
  					
  				if (user_interface) {
            var template = new Array();
            template['file'] = url + '/jmform.htm';
  					template['width'] = 380;
  					template['height'] = 400;

  					// Language specific width and height addons
  					template['width'] += inst.getLang('jmform.elemprops_delta_width', 0);
  					template['height'] += inst.getLang('jmform.elemprops_delta_height', 0);
            
            inst.windowManager.open({
              url : template['file'],
              width : template['width'],
              height : template['height'],
              inline : 1
            }, {
              plugin_url : url
            });
   				}

  				return true;
          
				case "mceJMFormDelete":
					var form = inst.dom.getParent(inst.selection.getNode(), "form");
					if (form) {
						form.parentNode.removeChild(form);
						inst.execCommand('mceRepaint');
					}
					return true;
				
			}

			// Pass to next handler in chain
			return false;
		}
	});

	// Register plugin
	tinymce.PluginManager.add('jmform', tinymce.plugins.JMFormPlugin);
})();

