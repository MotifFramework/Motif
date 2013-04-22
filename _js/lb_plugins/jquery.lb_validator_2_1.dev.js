/*
 * lifeBLUE Media jQuery plugin to validate forms.
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
	$.fn.lb_validator_2_1 = function(customOptions) {
		var options = $.extend({},$.fn.lb_validator_2_1.defaultOptions, customOptions);
		return this.each(function(){
			var $this = $(this),
				formID = $this.attr("id");
			$this.submit(function(){
				var validateResponse = validate();
				
				if(validateResponse && $.isFunction(options.onSuccess)){
					options.onSuccess.apply(this); // call success callback
					return false;
				}
				
				return validateResponse;
			}); // fire when the form validates
			if(options.validateNow) { // validate now if we are told to.
				return validate();
			}
			function validate() {
				var error = false; // set the error flag
				if($.isFunction(options.extraValidation)) {
					error = !options.extraValidation.apply(this);
				}
				$("#"+formID+" "+options.requiredSelector).each(function() { // itterate through required input, select, and textareas
					var $required = $(this);
					if($required.hasClass("valCheck")) { // validate checkbox groups
						var hasChecked = false;
						$('input:checkbox:checked', $required).each(function(){
							hasChecked = true;
						});
						if(hasChecked==false) {
							$(options.errorSelector, $required).show();
							$required.addClass("error");
							error = true;
						}
						else
						{
							$required.removeClass("error");
						}
					} else { // validate required fields
						$('input, select, textarea', $required).each(function(){
							
							if(options.instantGratification){
								
								$(this).keyup(function() {
									if($required.hasClass(options.emailValidationClass)) {
										filter = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
										if ( filter.test( $(this).val() ) && $(this).val() != "") {
											$required.removeClass("error");
											error = false;
										}
									}else if($required.hasClass(options.phoneValidationClass)) {
										filter = /^(\+\d)*\s*(\(\d{3}\)|\d{3})*(\s{0,1}|-{0,1})\d{3}(-{0,1}|\s{0,1})\d{4}$/;
										if ( !filter.test( $(this).val() ) && $(this).val() != "") {
											$required.removeClass("error");
											error = false;
										}
									}else if($(this).val() != ""){
										$required.removeClass("error");	
										$(options.errorSelector, $required).hide();	
									}
									
								});
							}
													
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
	$.fn.lb_validator_2_1.defaultOptions = {
		requiredSelector : '.val',
		checkSelector : '.valCheck',
		errorSelector : '.valError',
		validationErrorClass : 'validationError',
		validationCheckClass : 'validationCheck',
		emailValidationClass : 'valEmail',
		phoneValidationClass : 'valPhone',
		zipValidationClass : 'valZip',
		validateNow : false,
		instantGratification:false,
		extraValidation : null,
		hasErrors : null, // callback for errors,
		onSuccess : null
	}
})(jQuery);