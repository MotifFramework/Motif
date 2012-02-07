/**
 *
 * @author Jason McInerney
 * For TinyMCE
 */

tinyMCEPopup.requireLangPack();

var action, dom = tinyMCEPopup.editor.dom;

function insertTextarea() {
	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var elm = dom.getParent(inst.selection.getNode(), "textarea");
	var html = '';
  
	if (!AutoValidator.validate(formObj)) {
		alert(dom.getLang('invalid_data'));
		return false;
	}

	//tinyMCEPopup.restoreSelection();

	// Get form data
	jmformName = formObj.elements['jmformName'].value;
	jmformValue = formObj.elements['jmformValue'].value;
	width = formObj.elements['width'].value;
	height = formObj.elements['height'].value;
	onfocus = formObj.elements['onfocus'].value;
	onblur = formObj.elements['onblur'].value;
	onchange = formObj.elements['onchange'].value;
	onselect = formObj.elements['onselect'].value;
	onclick = formObj.elements['onclick'].value;
	id = formObj.elements['jmformId'].value;
	maxlength = formObj.elements['maxlength'].value;
	if (formObj.elements['required'].checked) required = 'true';
	else required = '';
	if (formObj.elements['disabled'].checked) disabled = 'true';
	else disabled = '';
	summary = formObj.elements['summary'].value;
	style = formObj.elements['style'].value;
	className = formObj.elements['class'].options[formObj.elements['class'].selectedIndex].value;
	
	// Update table
	if (action == "update") {
		inst.execCommand('mceBeginUndoLevel');
		dom.setAttrib(elm, 'name', jmformName, true);
		dom.setAttrib(elm, 'value', jmformValue, true);
		dom.setAttrib(elm, 'onfocus', onfocus, true);
		dom.setAttrib(elm, 'onblur', onblur, true);
		dom.setAttrib(elm, 'onchange', onchange, true);
		dom.setAttrib(elm, 'onselect', onselect, true);
		dom.setAttrib(elm, 'onclick', onclick, true);
		dom.setAttrib(elm, 'rows', width, true);
		dom.setAttrib(elm, 'cols', height, true);
		dom.setAttrib(elm, 'disabled', disabled, true);
		dom.setAttrib(elm, 'maxlength', maxlength, true);
		dom.setAttrib(elm, 'required', required, true);
		dom.setAttrib(elm, 'style', style);
		dom.setAttrib(elm, 'id', id);
		dom.setAttrib(elm, 'summary', summary);
		
		inst.nodeChanged();
		inst.execCommand('mceEndUndoLevel');

		tinyMCEPopup.close();
		return true;
	}

	// Create new form
	html += '<textarea';

	html += makeAttrib('id', id);
	html += makeAttrib('name', jmformName);
	html += makeAttrib('onfocus', onfocus);
	html += makeAttrib('onblur', onblur);
	html += makeAttrib('onchange', onchange);
	html += makeAttrib('onselect', onselect);
	html += makeAttrib('onclick', onclick);
	html += makeAttrib('rows', width);
	html += makeAttrib('cols', height);
	html += makeAttrib('maxlength', maxlength);
	html += makeAttrib('required', required);
	html += makeAttrib('disabled', disabled);
	html += makeAttrib('class', className);
	html += makeAttrib('style', style);
	html += makeAttrib('summary', summary);
	html += '>';

	html += jmformValue;
	
	html += '</textarea><br />';
	
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

	document.getElementById('backgroundimagebrowsercontainer').innerHTML = getBrowserHTML('backgroundimagebrowser','backgroundimage','image','table');
	document.getElementById('bordercolor_pickcontainer').innerHTML = getColorPickerHTML('bordercolor_pick','bordercolor');
	document.getElementById('bgcolor_pickcontainer').innerHTML = getColorPickerHTML('bgcolor_pick','bgcolor')

	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var textElm = dom.getParent(inst.selection.getNode(), "textarea");
  var formObj = document.forms[0];
  var jmformName = '', jmformValue = ''; width = '', height = '', maxlength = '', disabled = '', required = '';
  var onfocus = '', onblur = '', onchange = '', onselect = '', onclick = '';
  var st = '', bordercolor = '', bgcolor = '', backgroundimage = '', id = '', className = '';
  
  if (textElm != undefined) {
    st = dom.parseStyle(dom.getAttrib(textElm, "style"));
  
    // Get textarea element data
    jmformName = dom.getAttrib(textElm, 'name');
    jmformValue = '';
    if (textElm != undefined && textElm.value != undefined) jmformValue = textElm.value;
    width = dom.getAttrib(textElm, 'rows');
    height = dom.getAttrib(textElm, 'cols');
    maxlength = dom.getAttrib(textElm, 'maxlength');
    required = dom.getAttrib(textElm, 'required');
    disabled = dom.getAttrib(textElm, 'disabled');
    onfocus = dom.getAttrib(textElm, 'onfocus');
    onblur = dom.getAttrib(textElm, 'onblur');
    onchange = dom.getAttrib(textElm, 'onchange');
    onselect = dom.getAttrib(textElm, 'onselect');
    onclick = dom.getAttrib(textElm, 'onclick');    
    onkeyup = dom.getAttrib(textElm, 'onkeyup');
    onkeydown = dom.getAttrib(textElm, 'onkeydown');
    summary = dom.getAttrib(textElm, 'summary');
    bordercolor = convertRGBToHex(getStyle(textElm, 'bordercolor', 'borderLeftColor'));
    bgcolor = convertRGBToHex(getStyle(textElm, 'bgcolor', 'backgroundColor'));
    backgroundimage = getStyle(textElm, 'background', 'backgroundImage').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");;
    id = dom.getAttrib(textElm, 'id');
    className = tinymce.trim(dom.getAttrib(textElm, 'class').replace(/mceItem.+/g, ''));
	}
	// Setup form
	addClassesToList('class', "jmform_styles");
  selectByValue(formObj, 'class', className);
  formObj.bordercolor.value = bordercolor;
	formObj.bgcolor.value = bgcolor;
	formObj.backgroundimage.value = backgroundimage;
	formObj.width.value = width;
	formObj.height.value = height;
	formObj.jmformId.value = id;
	formObj.jmformName.value = jmformName;
	formObj.jmformValue.value = jmformValue;
	formObj.maxlength.value = maxlength;
	formObj.required.checked = required;
	formObj.disabled.checked = disabled;
	formObj.onfocus.value = onfocus;
	formObj.onblur.value = onblur;
	formObj.onchange.value = onchange;
	formObj.onselect.value = onselect;
	formObj.onclick.value = onclick;
	formObj.onkeyup.value = onkeyup;
	formObj.onkeydown.value = onkeydown;
	formObj.summary.value = summary;
	formObj.style.value = dom.serializeStyle(st);

	// Resize some elements
	if (isVisible('backgroundimagebrowser'))
		document.getElementById('backgroundimage').style.width = '180px';

	updateColor('bordercolor_pick', 'bordercolor');
	updateColor('bgcolor_pick', 'bgcolor');
}

function updateAction() {
	tinyMCEPopup.restoreSelection();

	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var textElm = dom.getParent(inst.selection.getNode(), "textarea");
  var jmformElm = dom.getParent(inst.selection.getNode(), "form");
	var formObj = document.forms[0];

	inst.execCommand('mceBeginUndoLevel');
	inst.nodeChanged();
  inst.addVisual();
	inst.execCommand('mceEndUndoLevel');
	tinyMCEPopup.close();
}


function updateElem(texta, skip_id) {
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var formObj = document.forms[0];
	var doc = inst.getDoc();

	if (!skip_id)
		texta.setAttribute('id', formObj.jmformId.value);

	texta.setAttribute('style', dom.serializeStyle(dom.parseStyle(formObj.style.value)));
	dom.setAttrib(td, 'class', getSelectValue(formObj, 'class'));


	// Set styles
	texta.style.width = getCSSSize(formObj.width.value);
	texta.style.height = getCSSSize(formObj.height.value);
	if (formObj.bordercolor.value != "") {
		texta.style.borderColor = formObj.bordercolor.value;
		texta.style.borderStyle = texta.style.borderStyle == "" ? "solid" : texta.style.borderStyle;
		texta.style.borderWidth = texta.style.borderWidth == "" ? "1px" : texta.style.borderWidth;
	} else
		texta.style.borderColor = '';

	texta.style.backgroundColor = formObj.bgcolor.value;

	if (formObj.backgroundimage.value != "")
		texta.style.backgroundImage = "url('" + formObj.backgroundimage.value + "')";
	else
		texta.style.backgroundImage = '';

	return texta;
}

function changedBackgroundImage() {
	var formObj = document.forms[0];
	var st = dom.parseStyle(formObj.style.value);

	st['background-image'] = "url('" + formObj.backgroundimage.value + "')";

	formObj.style.value = dom.serializeStyle(st);
}

function changedSize() {
	var formObj = document.forms[0];
	var st = dom.parseStyle(formObj.style.value);

	var width = formObj.width.value;
	if (width != "")
		st['width'] = getCSSSize(width);
	else
		st['width'] = "";

	var height = formObj.height.value;
	if (height != "")
		st['height'] = getCSSSize(height);
	else
		st['height'] = "";

	formObj.style.value = dom.serializeStyle(st);
}

function changedColor() {
	var formObj = document.forms[0];
	var st = dom.parseStyle(formObj.style.value);

	st['background-color'] = formObj.bgcolor.value;
	st['border-color'] = formObj.bordercolor.value;

	formObj.style.value = dom.serializeStyle(st);
}

function changedStyle() {
	var formObj = document.forms[0];
	var st = dom.parseStyle(formObj.style.value);

	if (st['background-image'])
		formObj.backgroundimage.value = st['background-image'].replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");
	else
		formObj.backgroundimage.value = '';

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
