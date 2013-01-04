

/*

Polyfills
---------

*/

if (!Array.prototype.forEach) {
	Array.prototype.forEach	=	function (fn, scope) {
		for (var i = 0, len = this.length; i < len; ++i) {
			fn.call(scope || this, this[i], i, this);
		}
	}
}

/*

Utils Class
-----------

*/

Utils = {};

/*

### Extend ###

*/
Utils.extend = function (first, second, useOrig) { /* Object (Object,Object,Boolean) */

	var obj;
	
	if(useOrig !== false) {
		useOrig = true;
		obj = first;
	} else {
		obj = Utils.extend({},first);
	}

	// Go through new object
	for(i in second) {

		// If object, extend first
		if (typeof second[i] === "Object") {
			Utils.extend(obj[i],second[i]);
		}

		// Update old/new object
		obj[i] = second[i];
	}
	return obj;
}

/*

### Get/Set Attribute ###

*/
Utils.attr	=	function(elem, attr, val) {
	if (!!val) {
		elem.setAttribute(attr, val);
	}
	return elem.getAttribute(attr);
}

/*

### Bind Events ###

*/
Utils.bind = function (elem, ev, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(ev, fn, false);
	} else if (elem.attachEvent) {
		elem.attachEvent("on" + ev, fn);
	}
}



Utils.toArray	=	function (a) {
	return Array.prototype.slice.call(a);
}

/*

### Get By Tag Name ###

*/
Utils.getByTag	=	function (elem, tag) {
	return Utils.toArray(elem.getElementsByTagName(tag));
}

/*

### Get By ID ###

*/
Utils.getById	=	function (elem, id) {
	return elem.getElementById(id);
}





/*

Validatr Class
--------------

*/

function Validatr (_elem, _options) {

	
	/*

	### Private Properties ###

	*/

	var that				=	this,
		_pluginName			=	"lb_validation",
		_mergedSettings,
		_defaultSettings	=	{
			
			// Class Names
			"classes" 				: 	{
				"errorClass"		:	"error",
				"successClass"		:	"success",
				"warningClass"		:	"warning",
				"messageClass"		:	"input-alert",
				"requiredClass"		:	"required"
			},
			
			// Error Messages
			"messages"				:	{
				"email"				:	"A valid email address is required.",
				"email-confirm"		:	"Check that your email addresses match.",
				"invalidMsg"			:	"This field is required.",
				"totalsMsg"				:	"Check that your totals don't exceed the limit",
				"telMsg"				:	"Make sure you've entered a valid phone number.",
				"searchMsg"				:	"Please input a search term.",
				"numberMsg"				:	"Enter a valid number.",
				"errorMsg"				:	"There was an error.",
				"passwordMsg"			:	"Your password must match the criteria.",
				"passwordConfirmMsg"	:	"Be sure that your passwords match.",
				"radioMsg"				:	"Please choose one of the options above.",
				"checkboxMsg"			:	"This field is required.",
				"selectMsg"				:	"Select an option."
			},
			
			// Type of inputs to regex
			"types"					:	{
				"email"				:	/^([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
				"tel"				:	/^((([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+)*$/,
				"number"			:	/^[0-9]*/
			},
			
			// Form fields to validate
			"fieldsToCheck"			:	{
											"input"		:	{
												"type"	:	[
																"text",
																"email",
																"search",
																"tel",
																"url",
																"number",
																"password",
																"checkbox",
																"radio"
															]
											},
											"textarea"	:	{

											},
											"select"	:	{

											}
										},
			"errorReport"			: 	function (o) {
				var	$this			=	$(this),
					fieldsToCheck	=	o;

				fieldsToCheck.each(function () {
					var	currentInput	=	$(this),
						verdict			=	currentInput.data("verdict");
						
					_m.removeMessage.call($this, currentInput);
					_m.addMessage.call($this, currentInput);
				});
			},
			"ajaxSubmit"			:	function () {}
		};


	/*

	### Public Properties ###

	*/


	/*

	### Private Methods ###

	*/

	function __construct() {
		_mergedSettings		=	Utils.extend(_defaultSettings,_options,false);

		// Disable browser form validation
		Utils.attr(_elem, "novalidate", "novalidate");

		// Bind fields on change
		_setBindFieldChange();

		// On Submit
		_setBindFormSubmit();
	}
	function _setBindFieldChange() {
		var fieldObjects	=	_getFieldsToCheck();

		fieldObjects.forEach(function (currElem, index) {
			Utils.bind(currElem, "change", _fieldOnChange);
		});
	}
	function _getFieldsToCheck() {
		var arr	=	[];

		for (tag in _mergedSettings.fieldsToCheck) {
			var unfilteredFields	=	Utils.getByTag(_elem, tag);


			unfilteredFields.forEach(function (currElem, index) {
				var pass	=	true;

				for (attr in _mergedSettings.fieldsToCheck[tag]) {


					var possibleVals	=	_mergedSettings.fieldsToCheck[tag][attr],
						currElemAttr	=	Utils.attr(currElem, attr),
						regex			=	new RegExp("(,|^)" + currElemAttr + "(,|$)");



					possibleVals		=	possibleVals.join();
					console.log(possibleVals);

					if (!regex.test(possibleVals)) {
						pass			=	false;
						break;
					}
				}
				if (pass) {
					arr.push(currElem);
				}
			});
		}

		return arr;
	}
	function _fieldOnChange() {
		console.log("sneeze");
	}
	function _setBindFormSubmit() {
		Utils.bind(_elem, "submit", _formSubmit);
	}
	function _formSubmit() {

	}




	/*

	### Public Methods ###

	*/





	__construct();
}
