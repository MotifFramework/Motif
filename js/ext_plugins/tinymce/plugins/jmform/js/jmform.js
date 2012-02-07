/**
 * JMForm plugin for TinyMCE
 * @author Jason McInerney
 */
 
tinyMCEPopup.requireLangPack();

var action, dom = tinyMCEPopup.editor.dom;
var HF_IDs = Array();
var HF_vals = Array();

function setAutoValidate(on) {
  var formObj = document.forms[0];
  if (on) {
    formObj.elements['jmformOnsubmit'].value = 'SendRequest(this);';
    formObj.elements['jmformOnsubmit'].disabled = 'true';
  }
  else {
    formObj.elements['jmformOnsubmit'].value = '';
    formObj.elements['jmformOnsubmit'].disabled = '';
  }
}

function addHiddenField() {
  var formObj = document.forms[0];
  tempID = formObj.elements['jmformH0_ID'].value;
  tempVal = formObj.elements['jmformH0_Val'].value;
  
  if (tempID != '') {
    var curInd = HF_IDs.length;
    HF_IDs[curInd] = tempID;
    HF_vals[curInd] = tempVal;
    curInd = HF_IDs.length;
    newRow = '<tr><td class="column1" align="right">';
    newRow += '<input type="button" name="remHF" value="X" style="width: 15px; color: red;" onMouseUp="removeHiddenField(' + curInd + ');">';
    newRow += '&nbsp;&nbsp;' + curInd + '&nbsp;&nbsp;</td>';
    newRow += '<td class="column1">' + tempID + '</td>';
    newRow += '<td class="column1">' + tempVal + '</td></tr>';
    tableCode = document.getElementById('hiddenfields_table').innerHTML;
    re = RegExp("\<\/table\>","ig");
    tableCode = tableCode.replace(re,newRow);
    tableCode += "</table>";
    document.getElementById('hiddenfields_table').innerHTML = tableCode;
  }
}

function removeHiddenField(ind) {
  var conf = confirm('Delete hidden field ' + ind +'?');
  if (conf == true) {
      var formObj = document.forms[0];
      var newRow = '';
      HF_IDs.splice(ind-1,1);
      HF_vals.splice(ind-1,1);
      for (var i=0;i<HF_IDs.length;i++) {
          var curInd = i+1;
          newRow += '<tr><td class="column1" align="right">';
          newRow += '<input type="button" name="remHF" value="X" style="width: 15px; color: red;" onMouseUp="removeHiddenField(' + curInd + ');">';
          newRow += '&nbsp;&nbsp;' + curInd + '&nbsp;&nbsp;</td>';
          newRow += '<td class="column1">' + HF_IDs[i] + '</td>';
          newRow += '<td class="column1">' + HF_vals[i] + '</td></tr>';
      }
      newRow = "<!-- end hidden field input -->" + newRow;
      tableCode = document.getElementById('hiddenfields_table').innerHTML;
      var re = new RegExp("\\n","ig");
      tableCode = tableCode.replace(re,"");	
      re = RegExp(/\<\!\-\-\send\shidden\sfield\sinput\s\-\-\>(.)+$/ig);
      tableCode = tableCode.replace(re,newRow);
      tableCode += "</table>";
      document.getElementById('hiddenfields_table').innerHTML = tableCode;
  }
}
	
function insertForm() {
	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var elm = dom.getParent(inst.selection.getNode(), 'form');
	var jmformAction = "", jmformMethod = "POST", className = "", enc = "";
	var jmformName = "";
	var html = '';
	
	if (!AutoValidator.validate(formObj)) {
		alert(inst.getLang('invalid_data'));
		return false;
	}

	//tinyMCEPopup.restoreSelection();

	// Get form data
	jmformAction = formObj.elements['jmformAction'].value;
  if (formObj.elements['jmformMethod'].selectedIndex != undefined && formObj.elements['jmformMethod'].selectedIndex > -1 && formObj.elements['jmformMethod'].options[formObj.elements['jmformMethod'].selectedIndex] != undefined) jmformMethod = formObj.elements['jmformMethod'].options[formObj.elements['jmformMethod'].selectedIndex].value;
	onsubmit = formObj.elements['jmformOnsubmit'].value;
	onreset = formObj.elements['jmformOnreset'].value;
	target = formObj.elements['jmformTarget'].value;
	if (formObj.elements['jmformEnctype'].selectedIndex != undefined && formObj.elements['jmformEnctype'].selectedIndex > -1 && formObj.elements['jmformEnctype'].options[formObj.elements['jmformEnctype'].selectedIndex] != undefined) enc = formObj.elements['jmformEnctype'].options[formObj.elements['jmformEnctype'].selectedIndex].value;
	jmformId = formObj.elements['jmformId'].value;
	jmformName = formObj.elements['jmformName'].value;
	if (formObj.elements['class'].selectedIndex != undefined && formObj.elements['class'].selectedIndex > -1 && formObj.elements['class'].options[formObj.elements['class'].selectedIndex] != undefined) className = formObj.elements['class'].options[formObj.elements['class'].selectedIndex].value;
	summary = formObj.elements['summary'].value;
	style = formObj.elements['style'].value;
	
	// Update form
	if (action == "update") {
    var allFields = new Array();
		inst.execCommand('mceBeginUndoLevel');
		dom.setAttrib(elm, 'action', jmformAction);
		dom.setAttrib(elm, 'method', jmformMethod);
		dom.setAttrib(elm, 'onsubmit', onsubmit);
		dom.setAttrib(elm, 'onreset', onreset);
		dom.setAttrib(elm, 'target', target);
		dom.setAttrib(elm, 'enctype', enc);
		dom.setAttrib(elm, 'class', className);
		dom.setAttrib(elm, 'style', style);
		dom.setAttrib(elm, 'id', jmformId);
		dom.setAttrib(elm, 'name', jmformName);
		dom.setAttrib(elm, 'summary', summary);

    allFields = elm.getElementsByTagName("input");
    for (var i=allFields.length-1; i>=0; i--){
      var curField = allFields[i];
      if (curField.type == "hidden"){
        elm.removeChild(curField);
      }
    }
		//add current hidden elements
    for (var i=0;i<HF_IDs.length;i++) {
        newHF = elm.ownerDocument.createElement("input");
        newHF.type = "hidden";
        newHF.id = HF_IDs[i];
        newHF.name = HF_IDs[i];
        newHF.value = HF_vals[i];
        elm.insertBefore(newHF, elm.firstChild);
    }
		
		// Fix for stange MSIE align bug
		//elm.outerHTML = elm.outerHTML;

		inst.nodeChanged();
		inst.execCommand('mceEndUndoLevel');
    inst.addVisual();

		tinyMCEPopup.close();
		return true;
	}

	// Create new form
	html += '<form';

	html += makeAttrib('id', jmformId);
	html += makeAttrib('name', jmformName);
	html += makeAttrib('action', jmformAction);
	html += makeAttrib('method', jmformMethod);
	html += makeAttrib('onsubmit', onsubmit);
	html += makeAttrib('onreset', onreset);
	html += makeAttrib('target', target);
	html += makeAttrib('enctype', enc);
	html += makeAttrib('class', className);
	html += makeAttrib('style', style);
	html += makeAttrib('summary', summary);
    
	html += '>';
    for (var i=0;i<HF_IDs.length;i++) {
        html += '<input type="hidden" id="' + HF_IDs[i] + '" name="' + HF_IDs[i] + '" value="' + HF_vals[i] + '" />';
    }
    html += '<br /><br />';


	html += "</form>";
  
  inst.execCommand('mceBeginUndoLevel');
	inst.execCommand('mceInsertContent', false, html);
	inst.addVisual();
	inst.execCommand('mceEndUndoLevel');

	tinyMCEPopup.close();
}

function makeAttrib(attrib, value) {
	var formObj = document.forms[0];
	var valueElm = formObj.elements[attrib];

	if (typeof(value) == "undefined" || value == null) {
		value = "";

		if (valueElm)
			value = valueElm.value;
	}

	if (value == "")
		return "";

	// XML encode it
	value = value.replace(/&/g, '&amp;');
	value = value.replace(/\"/g, '&quot;');
	value = value.replace(/</g, '&lt;');
	value = value.replace(/>/g, '&gt;');

	return ' ' + attrib + '="' + value + '"';
}

function init() {
	tinyMCEPopup.resizeToInnerSize();
  HF_IDs = new Array();
  HF_vals = new Array();
	var jmformAction = "", jmformMethod = "POST", target = "", enc = "", jmformName = "";
	var jmformId = "", summary = "", style = "", className = "", onsubmit = "", onreset = "";
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var formObj = document.forms[0];
  var jmformElm = dom.getParent(inst.selection.getNode(), "form");
  var allFields = new Array();
    
	action = tinyMCEPopup.getWindowArg('action');
  if (!action || action == null)
		action = jmformElm ? "update" : "insert";

	if (jmformElm != undefined && jmformElm && action == "update") {
		st = dom.parseStyle(dom.getAttrib(jmformElm, "style"));
		jmformAction = dom.getAttrib(jmformElm, 'action');
		jmformMethod = dom.getAttrib(jmformElm, 'method');
		jmformName = dom.getAttrib(jmformElm, 'name');
		onsubmit = dom.getAttrib(jmformElm, 'onsubmit');
		onreset = dom.getAttrib(jmformElm, 'onreset');
		target = dom.getAttrib(jmformElm, 'target');
		enc = dom.getAttrib(jmformElm, 'enctype');
		className = tinymce.trim(dom.getAttrib(jmformElm, 'class').replace(/mceItem.+/g, ''));
		jmformId = dom.getAttrib(jmformElm, 'id');
		summary = dom.getAttrib(jmformElm, 'summary');
		style = dom.serializeStyle(st);
        
    allFields = jmformElm.getElementsByTagName("input")
    for (var i=0; i<allFields.length; i++){
      var curField = allFields[i];
      if (curField.type == "hidden"){
        HF_IDs.push(curField.name);
        HF_vals.push(curField.value);
      }
    }
	}

	addClassesToList('class', "jmform_styles");

	// Update form
	selectByValue(formObj, 'class', className);
  if (onsubmit == 'SendRequest(this);') {
    formObj.jmformAuto.checked = true;
    setAutoValidate(true);
  }
	formObj.jmformAction.value = jmformAction;
	for (var i=0;i<formObj.jmformMethod.length;i++) {
    if (formObj.jmformMethod.options[i].value == jmformMethod) {
      formObj.jmformMethod.selectedIndex = i;
      i = formObj.jmformMethod.length;
    }
  }
	formObj.jmformName.value = jmformName;
	formObj.jmformOnsubmit.value = onsubmit;
	formObj.jmformOnreset.value = onreset;
	formObj.jmformTarget.value = target;
	for (var i=0;i<formObj.jmformEnctype.length;i++) {
    if (formObj.jmformEnctype.options[i].value == enc) {
      formObj.jmformEnctype.selectedIndex = i;
      i = formObj.jmformEnctype.length;
    }
  }
	formObj.jmformId.value = jmformId;
	formObj.summary.value = summary;
	formObj.style.value = style;
	formObj.insert.value = inst.getLang(action, 'Insert', true);
  var newRow = '';
  if (HF_IDs.length > 0) {
    for (var i=0;i<HF_IDs.length;i++) {
        var curInd = i+1;
        newRow += '<tr><td class="column1" align="right">';
        newRow += '<input type="button" name="remHF" value="X" style="width: 15px; color: red;" onMouseUp="removeHiddenField(' + curInd + ');">';
        newRow += '&nbsp;&nbsp;' + curInd + '&nbsp;&nbsp;</td>';
        newRow += '<td class="column1">' + HF_IDs[i] + '</td>';
        newRow += '<td class="column1">' + HF_vals[i] + '</td></tr>';
    }
    newRow = "<!-- end hidden field input -->" + newRow;
    tableCode = document.getElementById('hiddenfields_table').innerHTML;
    var re = new RegExp("\\n","ig");
		tableCode = tableCode.replace(re,"");	
    re = RegExp(/\<\!\-\-\send\shidden\sfield\sinput\s\-\-\>(.)+$/ig);
    tableCode = tableCode.replace(re,newRow);
    tableCode += "</table>";
    document.getElementById('hiddenfields_table').innerHTML = tableCode;
  }
}

function changedStyle() {
	var formObj = document.forms[0];
	var st = dom.parseStyle(formObj.style.value);

	if (st['width'])
		formObj.width.value = trimSize(st['width']);

	if (st['height'])
		formObj.height.value = trimSize(st['height']);

	if (st['background-color']) {
		formObj.bgcolor.value = st['background-color'];
		updateColor('bgcolor_pick','bgcolor');
	}

	if (st['border-color']) {
		formObj.bordercolor.value = st['border-color'];
		updateColor('bordercolor_pick','bordercolor');
	}
}

tinyMCEPopup.onInit.add(init);
