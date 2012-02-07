/**
 * JMForm plugin for TinyMCE
 * @author Jason McInerney
 */
 
tinyMCEPopup.requireLangPack();

var action, dom = tinyMCEPopup.editor.dom;

function insertInput() {
	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var elm = dom.getParent(inst.selection.getNode(), "input");
	var html = '';
	
	if (!AutoValidator.validate(formObj)) {
		alert(inst.getLang('invalid_data'));
		return false;
	}

	//tinyMCEPopup.restoreSelection();

	// Get form data
	jmformName = formObj.elements['jmformName'].value;
	jmformValue = formObj.elements['jmformValue'].value;
	jmformType = formObj.elements['jmformType'].value;
	width = formObj.elements['width'].value;
	height = formObj.elements['height'].value;
	onfocus = formObj.elements['onfocus'].value;
	onblur = formObj.elements['onblur'].value;
	onchange = formObj.elements['onchange'].value;
	onselect = formObj.elements['onselect'].value;
	onclick = formObj.elements['onclick'].value;
	src = formObj.elements['src'].value;
	size = formObj.elements['size'].value;
	id = formObj.elements['jmformId'].value;
	maxlength = formObj.elements['maxlength'].value;
	if (formObj.elements['required'].checked) required = 'true';
	else required = '';
	if (formObj.elements['checked'].checked) checked = 'true';
	else checked = '';
	if (formObj.elements['disabled'].checked) disabled = 'true';
	else disabled = '';
	summary = formObj.elements['summary'].value;
	style = formObj.elements['style'].value;
	className = formObj.elements['class'].options[formObj.elements['class'].selectedIndex].value;
	
	// Update table
	if (action == "update") {
		inst.execCommand('mceBeginUndoLevel');
		tinyMCE.setAttrib(elm, 'name', jmformName, true);
		tinyMCE.setAttrib(elm, 'value', jmformValue, true);
		tinyMCE.setAttrib(elm, 'type', jmformType, true);
		tinyMCE.setAttrib(elm, 'onfocus', onfocus, true);
		tinyMCE.setAttrib(elm, 'onblur', onblur, true);
		tinyMCE.setAttrib(elm, 'onchange', onchange, true);
		tinyMCE.setAttrib(elm, 'onselect', onselect, true);
		tinyMCE.setAttrib(elm, 'onclick', onclick, true);
		tinyMCE.setAttrib(elm, 'src', src, true);
		tinyMCE.setAttrib(elm, 'size', size, true);
		tinyMCE.setAttrib(elm, 'disabled', disabled, true);
		tinyMCE.setAttrib(elm, 'maxlength', maxlength, true);
		tinyMCE.setAttrib(elm, 'required', required, true);
		tinyMCE.setAttrib(elm, 'checked', checked, true);
		tinyMCE.setAttrib(elm, 'style', style);
		tinyMCE.setAttrib(elm, 'class', className);
		tinyMCE.setAttrib(elm, 'id', id);
		tinyMCE.setAttrib(elm, 'summary', summary);
    inst.addVisual();
  	inst.nodeChanged();
  	inst.execCommand('mceEndUndoLevel');
  	tinyMCEPopup.close();
		return true;
	}

	// Create new form
	html += '<input';

	html += makeAttrib('id', id);
	html += makeAttrib('name', jmformName);
	html += makeAttrib('value', jmformValue);
	html += makeAttrib('type', jmformType);
	html += makeAttrib('onfocus', onfocus);
	html += makeAttrib('onblur', onblur);
	html += makeAttrib('onchange', onchange);
	html += makeAttrib('onselect', onselect);
	html += makeAttrib('onclick', onclick);
	html += makeAttrib('size', size);
	html += makeAttrib('maxlength', maxlength);
	html += makeAttrib('required', required);
	html += makeAttrib('checked', checked);
	html += makeAttrib('disabled', disabled);
	html += makeAttrib('src', src);
	html += makeAttrib('class', className);
	html += makeAttrib('style', style);
	html += makeAttrib('summary', summary);
	html += ' />';

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
	var formObj = document.forms[0];
  var inpElm = dom.getParent(inst.selection.getNode(), "input");
  var jmformName = '', jmformValue = ''; width = '', height = '', jmformType = '', size = '', maxlength = '', disabled = '', required = '', checked = '';
  var src = '', onfocus = '', onblur = '', onchange = '', onselect = '', onclick = '';
  var st = '', bordercolor = '', bgcolor = '', backgroundimage = '', id = '', className = '';
  
  if (inpElm != undefined) {
    st = dom.parseStyle(dom.getAttrib(inpElm, "style"));
		className = tinymce.trim(dom.getAttrib(inpElm, 'class').replace(/mceItem.+/g, ''));
		 
    // Get input element data
    jmformName = dom.getAttrib(inpElm, 'name');
    jmformValue = dom.getAttrib(inpElm, 'value');
    width = trimSize(getStyle(inpElm, 'width', 'width'));
    height = trimSize(getStyle(inpElm, 'height', 'height'));
    jmformType = dom.getAttrib(inpElm, 'type');
    size = dom.getAttrib(inpElm, 'size');
    maxlength = dom.getAttrib(inpElm, 'maxlength');
    required = dom.getAttrib(inpElm, 'required');
    checked = dom.getAttrib(inpElm, 'checked');
    src = dom.getAttrib(inpElm, 'src');
    disabled = dom.getAttrib(inpElm, 'disabled');
    onfocus = dom.getAttrib(inpElm, 'onfocus');
    onblur = dom.getAttrib(inpElm, 'onblur');
    onchange = dom.getAttrib(inpElm, 'onchange');
    onselect = dom.getAttrib(inpElm, 'onselect');
    onclick = dom.getAttrib(inpElm, 'onclick');
    bordercolor = convertRGBToHex(getStyle(inpElm, 'bordercolor', 'borderLeftColor'));
    bgcolor = convertRGBToHex(getStyle(inpElm, 'bgcolor', 'backgroundColor'));
    backgroundimage = getStyle(inpElm, 'background', 'backgroundImage').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");;
    id = dom.getAttrib(inpElm, 'id');
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
	formObj.jmformType.value = jmformType;
	formObj.size.value = size;
	formObj.maxlength.value = maxlength;
	formObj.required.checked = required;
	formObj.checked.checked = checked;
	formObj.disabled.checked = disabled;
	formObj.src.value = src;
	formObj.onfocus.value = onfocus;
	formObj.onblur.value = onblur;
	formObj.onchange.value = onchange;
	formObj.onselect.value = onselect;
	formObj.onclick.value = onclick;
	formObj.style.value = dom.serializeStyle(st);

	// Resize some elements
	if (isVisible('backgroundimagebrowser'))
		document.getElementById('backgroundimage').style.width = '180px';

	updateColor('bordercolor_pick', 'bordercolor');
	updateColor('bgcolor_pick', 'bgcolor');
}

function updateAction() {
	//tinyMCEPopup.restoreSelection();
  var inst = tinyMCEPopup.editor, dom = inst.dom;
	var formObj = document.forms[0];  
	var inpElm = dom.getParent(inst.selection.getNode(), "input");
	var jmformElm = dom.getParent(inst.selection.getNode(), "form");

	inst.execCommand('mceBeginUndoLevel');
	inst.addVisual();
  inst.nodeChanged();
	inst.execCommand('mceEndUndoLevel');
	tinyMCEPopup.close();
}


function updateElem(inp, skip_id) {
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var formObj = document.forms[0];  
	var doc = inst.getDoc();

	if (!skip_id)
		inp.setAttribute('id', formObj.jmformId.value);

	inp.setAttribute('style', dom.serializeStyle(dom.parseStyle(formObj.style.value)));
	tinyMCE.setAttrib(inp, 'class', getSelectValue(formObj, 'class'));


	// Set styles
	inp.style.width = getCSSSize(formObj.width.value);
	inp.style.height = getCSSSize(formObj.height.value);
	if (formObj.bordercolor.value != "") {
		inp.style.borderColor = formObj.bordercolor.value;
		inp.style.borderStyle = inp.style.borderStyle == "" ? "solid" : inp.style.borderStyle;
		inp.style.borderWidth = inp.style.borderWidth == "" ? "1px" : inp.style.borderWidth;
	} else
		inp.style.borderColor = '';

	inp.style.backgroundColor = formObj.bgcolor.value;

	if (formObj.backgroundimage.value != "")
		inp.style.backgroundImage = "url('" + formObj.backgroundimage.value + "')";
	else
		inp.style.backgroundImage = '';

	return inp;
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
