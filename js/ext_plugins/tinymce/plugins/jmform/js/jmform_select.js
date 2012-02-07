/**
 *
 * @author Jason McInerney
 * For TinyMCE
 */
 
tinyMCEPopup.requireLangPack();

var action, dom = tinyMCEPopup.editor.dom;
var Op_IDs = new Array();
var Op_vals = new Array();

function addOption() {
  var formObj = document.forms[0];
	tempID = formObj.elements['jmformOp0_ID'].value;
  tempVal = formObj.elements['jmformOp0_Val'].value;
  
  if (tempID != '') {
    var curInd = Op_IDs.length;
    Op_IDs[curInd] = tempID;
    Op_vals[curInd] = tempVal;
    curInd = Op_IDs.length;
    newRow = '<tr><td class="column1" align="right">';
    newRow += '<input type="button" name="remOp" value="X" style="width: 15px; color: red;" onMouseUp="removeOption(' + curInd + ');">';
    newRow += '&nbsp;&nbsp;' + curInd + '&nbsp;&nbsp;</td>';
    newRow += '<td class="column1">' + tempID + '</td>';
    newRow += '<td class="column1">' + tempVal + '</td></tr>';
    tableCode = document.getElementById('options_table').innerHTML;
    re = RegExp("\<\/table\>","ig");
    tableCode = tableCode.replace(re,newRow);
    tableCode += "</table>";
    document.getElementById('options_table').innerHTML = tableCode;
  }
}

function removeOption(ind) {
  var conf = confirm('Delete option ' + ind +'?');
  if (conf == true) {
    var formObj = document.forms[0];
    var newRow = '';
    Op_IDs.splice(ind-1,1);
    Op_vals.splice(ind-1,1);
    for (var i=0;i<Op_IDs.length;i++) {
        var curInd = i+1;
        newRow += '<tr><td class="column1" align="right">';
        newRow += '<input type="button" name="remOp" value="X" style="width: 15px; color: red;" onMouseUp="removeOption(' + curInd + ');">';
        newRow += '&nbsp;&nbsp;' + curInd + '&nbsp;&nbsp;</td>';
        newRow += '<td class="column1">' + Op_IDs[i] + '</td>';
        newRow += '<td class="column1">' + Op_vals[i] + '</td></tr>';
    }
    newRow = "<!-- end options input -->" + newRow;
    tableCode = document.getElementById('options_table').innerHTML;
    var re = new RegExp("\\n","ig");
    //if(tableCode.match(re)) alert("Match!");
    tableCode = tableCode.replace(re,"");	
    re = RegExp(/\<\!\-\-\send\soptions\sinput\s\-\-\>(.)+$/ig);
    tableCode = tableCode.replace(re,newRow);
    tableCode += "</table>";
    document.getElementById('options_table').innerHTML = tableCode;
  }
}

function insertSelect() {
	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var elm = dom.getParent(inst.selection.getNode(), "select");
	var html = '';
	
	if (!AutoValidator.validate(formObj)) {
		alert(inst.getLang('invalid_data'));
		return false;
	}

	//tinyMCEPopup.restoreSelection();

	// Get form data
	jmformName = formObj.elements['jmformName'].value;
	defval = formObj.elements['defval'].value;
	width = formObj.elements['width'].value;
	height = formObj.elements['height'].value;
	onfocus = formObj.elements['onfocus'].value;
	onblur = formObj.elements['onblur'].value;
	onchange = formObj.elements['onchange'].value;
	onselect = formObj.elements['onselect'].value;
	onclick = formObj.elements['onclick'].value;
	size = formObj.elements['size'].value;
	id = formObj.elements['jmformId'].value;
	if (formObj.elements['required'].checked) required = 'true';
	else required = '';
	if (formObj.elements['multiple'].checked) multiple = 'true';
	else multiple = '';
	if (formObj.elements['disabled'].checked) disabled = 'true';
	else disabled = '';
	summary = formObj.elements['summary'].value;
	style = formObj.elements['style'].value;
	className = formObj.elements['class'].options[formObj.elements['class'].selectedIndex].value;
	
	// Update table
	if (action == "update") {
		inst.execCommand('mceBeginUndoLevel');
		dom.setAttrib(elm, 'name', jmformName, true);
		dom.setAttrib(elm, 'onfocus', onfocus, true);
		dom.setAttrib(elm, 'onblur', onblur, true);
		dom.setAttrib(elm, 'onchange', onchange, true);
		dom.setAttrib(elm, 'onselect', onselect, true);
		dom.setAttrib(elm, 'onclick', onclick, true);
		dom.setAttrib(elm, 'size', size, true);
		dom.setAttrib(elm, 'disabled', disabled, true);
		dom.setAttrib(elm, 'required', required, true);
		dom.setAttrib(elm, 'multiple', multiple, true);
		dom.setAttrib(elm, 'style', style);
		dom.setAttrib(elm, 'id', id);
		dom.setAttrib(elm, 'summary', summary);
		
		elm.options.length = 0;
		for (var i=0; i<Ops_IDs.length; i++) {
			if (Op_IDs[i] != '') {
                elm.options.length += 1;
				elm.options[i].text = Op_IDs[i];
				elm.options[i].value = Op_vals[i];
				if (defvalue == Op_vals[i]) elm.selectedIndex = i;
			}
		}
		
		inst.nodeChanged();
		inst.execCommand('mceEndUndoLevel');
    inst.addVisual();
		tinyMCEPopup.close();
		return true;
	}

	// Create new form
	html += '<select';

	html += makeAttrib('id', id);
	html += makeAttrib('name', jmformName);
	html += makeAttrib('onfocus', onfocus);
	html += makeAttrib('onblur', onblur);
	html += makeAttrib('onchange', onchange);
	html += makeAttrib('onselect', onselect);
	html += makeAttrib('onclick', onclick);
	html += makeAttrib('size', size);
	html += makeAttrib('required', required);
	html += makeAttrib('multiple', multiple);
	html += makeAttrib('disabled', disabled);
	html += makeAttrib('class', className);
	html += makeAttrib('style', style);
	html += makeAttrib('summary', summary);
	html += ' >';

	for (var i=0; i<Op_IDs.length; i++) {
		if (Op_IDs[i] != '') {
			html += '<option';
			html += makeAttrib('value',Op_vals[i]);
			if (defval == Op_vals[i]) html += makeAttrib('selected','true');
			html += ' >' + Op_IDs[i] + '</option>';
		}
	}
	
	html += '</select>';
	
	inst.execCommand('mceBeginUndoLevel');
	inst.execCommand('mceInsertContent', false, html);
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

	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var selElm = dom.getParent(inst.selection.getNode(), "select");
  var jmformName = '', width = '', height = '', size = '', disabled = '', required = '';
  var defval = '', multiple = '', onfocus = '', onblur = '', onchange = '', onselect = '', onclick = '';
  var st = '', bordercolor = '', bgcolor = '', backgroundimage = '', id = '', className = '';
  
  if (selElm != undefined) {
    st = dom.parseStyle(tinyMCE.getAttrib(selElm, "style"));
  
    // Get select element data
    jmformName = dom.getAttrib(selElm, 'name');
    if (selElm.selectedIndex != undefined && selElm.options[selElm.selectedIndex] != undefined) defval =  selElm.options[selElm.selectedIndex].value;
    width = trimSize(getStyle(selElm, 'width', 'width'));
    height = trimSize(getStyle(selElm, 'height', 'height'));
    size = dom.getAttrib(selElm, 'size');
    required = dom.getAttrib(selElm, 'required');
    multiple = dom.getAttrib(selElm, 'multiple');
    disabled = dom.getAttrib(selElm, 'disabled');
    onfocus = dom.getAttrib(selElm, 'onfocus');
    onblur = dom.getAttrib(selElm, 'onblur');
    onchange = dom.getAttrib(selElm, 'onchange');
    onselect = dom.getAttrib(selElm, 'onselect');
    onclick = dom.getAttrib(selElm, 'onclick');
    bordercolor = convertRGBToHex(getStyle(selElm, 'bordercolor', 'borderLeftColor'));
    bgcolor = convertRGBToHex(getStyle(selElm, 'bgcolor', 'backgroundColor'));
    backgroundimage = getStyle(selElm, 'background', 'backgroundImage').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");;
    id = dom.getAttrib(selElm, 'id');
    className = tinymce.trim(dom.getAttrib(selElm, 'class').replace(/mceItem.+/g, ''));
    
    if (selElm.firstChild != undefined && selElm.firstChild.text != '') {
      var curElm = selElm.firstChild;
      while (curElm.nextSibling != undefined) {
        if (curElm.text != '') {
          Op_IDs.push(curElm.text);
          Op_vals.push(curElm.value);
        }
        curElm = curElm.nextSibling;
        }
        if (curElm.text != '') {
          Op_IDs.push(curElm.text);
          Op_vals.push(curElm.value);
        }
    }
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
	formObj.defval.value = defval;
	formObj.size.value = size;
	formObj.required.checked = required;
	formObj.multiple.checked = multiple;
	formObj.disabled.checked = disabled;
	formObj.onfocus.value = onfocus;
	formObj.onblur.value = onblur;
	formObj.onchange.value = onchange;
	formObj.onselect.value = onselect;
	formObj.onclick.value = onclick;
	formObj.style.value = dom.serializeStyle(st);
	var newRow = '';
    if (Op_IDs.length > 0) {
        for (var i=0;i<Op_IDs.length;i++) {
            var curInd = i+1;
            newRow += '<tr><td class="column1" align="right">';
            newRow += '<input type="button" name="remOp" value="X" style="width: 15px; color: red;" onMouseUp="removeOption(' + curInd + ');">';
            newRow += '&nbsp;&nbsp;' + curInd + '&nbsp;&nbsp;</td>';
            newRow += '<td class="column1">' + Op_IDs[i] + '</td>';
            newRow += '<td class="column1">' + Op_vals[i] + '</td></tr>';
        }
        newRow = "<!-- end options input -->" + newRow;
        tableCode = document.getElementById('options_table').innerHTML;
        var re = new RegExp("\\n","ig");
        tableCode = tableCode.replace(re,"");	
        re = RegExp(/\<\!\-\-\send\soptions\sinput\s\-\-\>(.)+$/ig);
        tableCode = tableCode.replace(re,newRow);
        tableCode += "</table>";
        document.getElementById('options_table').innerHTML = tableCode;
    }
	
	// Resize some elements
	if (isVisible('backgroundimagebrowser'))
		document.getElementById('backgroundimage').style.width = '180px';

	updateColor('bordercolor_pick', 'bordercolor');
	updateColor('bgcolor_pick', 'bgcolor');
}

function updateAction() {
	//tinyMCEPopup.restoreSelection();

	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var selElm = dom.getParent(inst.selection.getNode(), "select");
	var jmformElm = dom.getParent(inst.selection.getNode(), "form");
  
	inst.execCommand('mceBeginUndoLevel');
	inst.nodeChanged();
  inst.addVisual();
	inst.execCommand('mceEndUndoLevel');
	tinyMCEPopup.close();
}


function updateElem(sel, skip_id) {
	var formObj = document.forms[0];
	var inst = tinyMCEPopup.editor, dom = inst.dom;
	var doc = inst.getDoc();

	if (!skip_id)
		sel.setAttribute('id', formObj.jmformId.value);

	sel.setAttribute('style', dom.serializeStyle(dom.parseStyle(formObj.style.value)));
	dom.setAttrib(sel, 'class', getSelectValue(formObj, 'class'));


	// Set styles
	sel.style.width = getCSSSize(formObj.width.value);
	sel.style.height = getCSSSize(formObj.height.value);
	if (formObj.bordercolor.value != "") {
		sel.style.borderColor = formObj.bordercolor.value;
		sel.style.borderStyle = sel.style.borderStyle == "" ? "solid" : sel.style.borderStyle;
		sel.style.borderWidth = sel.style.borderWidth == "" ? "1px" : sel.style.borderWidth;
	} else
		sel.style.borderColor = '';

	sel.style.backgroundColor = formObj.bgcolor.value;

	if (formObj.backgroundimage.value != "")
		sel.style.backgroundImage = "url('" + formObj.backgroundimage.value + "')";
	else
		sel.style.backgroundImage = '';

	return sel;
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
