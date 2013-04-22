/*
 * lifeBLUE Media jQuery plugin to validate forms.
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
	$.fn.lb_validator = function(customOptions) {
		var options = $.extend({},$.fn.lb_validator.defaultOptions, customOptions);
		return this.each(function(){
			var $this = $(this);
			$this.submit(function(){
				return validate();
			}); // fire when the form validates
			if(options.validateNow) { // validate now if we are told to.
				return validate();
			}
			function validate() {
				var error = false; // set the error flag
				if($.isFunction(options.extraValidation)) {
					error = !options.extraValidation.apply(this);
				}
				$(options.requiredSelector).each(function() { // itterate through required input, select, and textareas
					var $required = $(this);
					if($required.hasClass("valCheck")) { // validate checkbox groups
						var hasChecked = false;
						$('input:checkbox:checked', $required).each(function(){
							hasChecked = true;
						});
						if(hasChecked==false) {
							$(options.errorSelector, $required).show();
							error = true;
						}
					} else { // validate required fields
						$('input, select, textarea', $required).each(function(){
							if($(this).val()=="") {
								$(options.errorSelector, $required).show();
								$required.addClass("error");
								error = true;
							}
							else
							{
								$required.removeClass("error");
							}
							if($required.hasClass(options.emailValidationClass)) {
								filter = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
								if ( !filter.test( $(this).val() ) ) {
									//$(options.errorSelector, $required).show();
									$required.addClass("error");
									error = true;
								}
							}
							if($required.hasClass(options.phoneValidationClass)) {
								filter = /^(\+\d)*\s*(\(\d{3}\)|\d{3})*(\s{0,1}|-{0,1})\d{3}(-{0,1}|\s{0,1})\d{4}$/;
								if ( !filter.test( $(this).val() ) ) {
									//$(options.errorSelector, $required).show();
									$required.addClass("error");
									error = true;
								}
							}
							if($required.hasClass(options.zipValidationClass)) {
								filter = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
								if (!filter.test($(this).val())) {
									//$(options.errorSelector, $required).show();
									$required.addClass("error");
									error = true;
								}
							}
						});
					}
					if(error==true)
					{
						$required.addClass(options.validationErrorClass);
					}
				});
				
				//$('.formfield').corner();
				
				if(error==true)
				{
					if($.isFunction(options.hasErrors)) {
						options.hasErrors.apply(this); // call error callback
					}
					return false;
				}
				else
				{
					return true;
				}
			}
		});
	}
	$.fn.lb_validator.defaultOptions = {
		requiredSelector : '.val',
		checkSelector : '.valCheck',
		errorSelector : '.valError',
		validationErrorClass : 'validationError',
		validationCheckClass : 'validationCheck',
		emailValidationClass : 'valEmail',
		phoneValidationClass : 'valPhone',
		zipValidationClass : 'valZip',
		validateNow : false,
		extraValidation : null,
		hasErrors : null // callback for errors
	}
})(jQuery);