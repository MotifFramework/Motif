/* LB Validation Plugin, v. 0.2 (1/27/12) */
(function($) {
	var _v	=	{
			// System Variables
			"pluginName"	:	"validation",
			
			// Class Names
			"errorClass"	:	"error",
			"messageClass"	:	"alert",
			"requiredClass"	:	"required",
			
			// Error Messages
			"emailMsg"				:	"A valid email address is required.",
			"emailConfirmMsg"		:	"Check that your email addresses match.",
			"invalidMsg"			:	"This field is required.",
			"totalsMsg"				:	"Check that your totals don't exceed the limit",
			"telMsg"				:	"Make sure you've entered a valid phone number.",
			"searchMsg"				:	"Please input a search term.",
			"errorMsg"				:	"There was an error.",
			"passwordMsg"			:	"Your password must match the criteria.",
			"passwordConfirmMsg"	:	"Be sure that your passwords match.",
			"radioMsg"				:	"Please choose one of the options above.",
			"checkboxMsg"			:	"This field is required.",
			"selectMsg"				:	"Select an option.",
			
			// Type of inputs to regex
			"types"			:	{
				"email"	:	/^([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
				"tel"	:	/^((([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+)*$/
			},
			
			// Form fields to validate
			"fieldsToCheck"	:	"input[type='text'], input[type='email'], input[type='search'], input[type='tel'], input[type='url'], input[type='password'], input[type='checkbox'], input[type='radio'], textarea, select"
		},
		
		// Methods
		_m	= {
			"init"	:	function(o) {

				return this.each(function() {
					var $this		=	$(this),
					    s			=	$.extend(true, _v, o),
					    fieldTypes	=	$this.find(s.fieldsToCheck),
					    messages	=	{
					    	'email'				:	s.emailMsg,
					    	'email-confirm'		:	s.emailConfirmMsg,
					    	'password'			:	s.passwordMsg,
					    	'password-confirm'	:	s.passwordConfirmMsg,
					    	'tel'				:	s.telMsg,
					    	'search'			:	s.searchMsg,
					    	'text'				:	s.invalidMsg,
					    	'text-totals'		:	s.totalsMsg,
					    	'textarea'			:	s.invalidMsg,
					    	'checkbox'			:	s.checkboxMsg,
					    	'radio'				:	s.radioMsg,
					    	'select'			:	s.selectMsg,
					    	'default'			:	s.errorMsg
					    },
					    parentLabel,
					    inputID,
					    currInput;
					
					$this.attr("novalidate", true);
					
					
				    /* Remove Error on keyup... Not sure if this is really wanted yet*/
				    
				    $this.delegate("input[required], textarea[required], select[required]", "change", function() {			    							
			    		_m.validate.call($(this), {
			    			"form"		:	$this,
			    			"s"			:	s,
			    			"messages"	:	messages
			    		});
				    });
				    
				    
				
				    // On Submit
				    $this.submit(function() {
				    	return _m.formSubmit.call($this, {
				    		"s"			:	s,
				    		"messages"	:	messages
				    	});
				    });
				
				});
			},
			
			"validate"		:	function(o) {
					
					// Variables
		            var currInput		=	$(this),
		            	currVal			=	currInput.val(),
		                attrType		=	currInput.attr("type"),
		                inputID			=	currInput.attr("id"),
		                inputName		=	currInput.attr("name"),
		                inputConfirm,
		                inputValTotals,
		                inputValTotalsLimit,
		                inputTotals	=	0,
		                hasChecked,
		                parentLabel,
		                message,
		                error	=	true,
		                filter,
		                $this	=	o.form;
		            
		            
		            // Find the label, whether it's the wrapper or not
		            if(currInput.closest("label").length > 0) {
		                parentLabel		=	currInput.closest("label");
		            } else {
		                parentLabel		=	$this.find("label[for='" + inputID + "']");
		            }
	            	
	            	if(!attrType || attrType == "select-one") {
	            		if(currInput.is("select")) {
	            			attrType	=	"select";
	            		} else if(currInput.is("textarea")) {
	            			attrType	=	"textarea";
	            		} else {
	            			attrType	=	"text";
	            		}
	            	}
		            
		            // If there's no value...
		            if($.trim(currVal) === "") {
            			_m.addMessage.call($this, {
            				"s"		:	o.s,
            				"inp"	:	currInput,
            				"mess"	:	o.messages[attrType],
            				"lab"	:	parentLabel
            			});
            			error	=	false;
		            } else {
		            
		            	// If "pattern" is defined...
		            	if(!!currInput.attr("pattern")) {

		            		filter	=	new RegExp(currInput.attr("pattern"));
		            		if(!filter.test(currVal)) {
		            			_m.addMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"mess"	:	o.messages[attrType],
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            			error	=	false;
		            		}
		            		
	            			else if(!!currInput.attr("data-confirm")) {
	            				inputConfirm	=	$("#" + currInput.attr('data-confirm'));
	            				
	            				if(currInput.val() !== inputConfirm.val()) {
	            					_m.addMessage.call($this, {
	            						"s"		:	o.s,
	            						"inp"	:	currInput,
	            						"mess"	:	o.messages[attrType + "-confirm"],
	            						"lab"	:	parentLabel,
	            						"type"	:	attrType
	            					});
	            					error	=	false;
	            		    	} else {
	            		    		_m.removeMessage.call($this, {
	            		    			"s"		:	o.s,
	            		    			"inp"	:	currInput,
	            		    			"lab"	:	parentLabel,
	            		    			"type"	:	attrType
	            		    		});
	            		    	}
	            			}
	            			
	            			else if(!!currInput.attr("data-validation-totals")) {
	            				inputValTotals		=	currInput.attr("data-validation-totals"),
	            				inputValTotalsLimit	=	currInput.attr("data-validation-totals-limit");
	            				    
	            				$("input[data-validation-totals='" + inputValTotals + "']").each(function() {
	            					inputTotals += Number($(this).val());
	            				});
	            				if(inputTotals > inputValTotalsLimit) {
	            					_m.addMessage.call($this, {
            							"s"		:	o.s,
            							"inp"	:	currInput,
            							"mess"	:	o.messages[attrType + "-totals"],
            							"lab"	:	parentLabel,
            							"type"	:	attrType
            						});
            						error	=	false;
            					} else {
            						_m.removeMessage.call($this, {
            							"s"		:	o.s,
            							"inp"	:	currInput,
            							"lab"	:	parentLabel,
            							"type"	:	attrType
            						});
            					}
	            			}
		            		
		            		 else {
		            			_m.removeMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            		}
		            	
		            	}
		            	
		            	else if(!!currInput.attr("data-confirm")) {
		            		inputConfirm	=	$("#" + currInput.attr('data-confirm'));
		            		
		            		if(currInput.val() !== inputConfirm.val()) {
		            			_m.addMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"mess"	:	o.messages[attrType + "-confirm"],
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            			error	=	false;
		            		} else {
		            			_m.removeMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            		}
		            	}
		            	
		            	else if(!!currInput.attr("data-validation-totals")) {
		            		inputValTotals		=	currInput.attr("data-validation-totals"),
		            		inputValTotalsLimit	=	currInput.attr("data-validation-totals-limit");
		            		    
		            		$("input[data-validation-totals='" + inputValTotals + "']").each(function() {
		            			inputTotals += Number($(this).val());
		            		});
		            		if(inputTotals > inputValTotalsLimit) {
		            			_m.addMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"mess"	:	o.messages[attrType + "-totals"],
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            			error	=	false;
		            		} else {
		            			_m.removeMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            		}
		            	}
		            	// If it's a checkbox or radio...
		            	
		            	 else if(attrType == "checkbox" || attrType == "radio") {
		            		var checkboxGroup	=	$this.find("input[name='" + inputName + "']");
		            		hasChecked	=	false;

		            		checkboxGroup.each(function() {
		            			if($(this).is(":checked")) {
		            				hasChecked	=	true;
		            			}
		            		});
		            		
		            		if(hasChecked	==	false) {
	            				_m.addMessage.call($this, {
	            					"s"		:	o.s,
	            					"inp"	:	checkboxGroup,
	            					"mess"	:	o.messages[attrType],
	            					"lab"	:	parentLabel,
	            					"type"	:	attrType
	            				});
		            			error	=	false;
		            		} else {
			            		_m.removeMessage.call($this, {
			            			"s"		:	o.s,
			            			"inp"	:	checkboxGroup,
			            			"lab"	:	parentLabel,
			            			"type"	:	attrType
			            		});
		            		}
		            	
		            	// If it's not a textarea, select, checkbox or radio, and if it matches our types array...
		            	} else if(!!attrType && !!o.s.types[attrType]) {
		            		filter	=	o.s.types[attrType];
		            		if(!filter.test(currVal)) {
		            			_m.addMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"mess"	:	o.messages[attrType],
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            			error	=	false;
		            		} else {
		            			_m.removeMessage.call($this, {
		            				"s"		:	o.s,
		            				"inp"	:	currInput,
		            				"lab"	:	parentLabel,
		            				"type"	:	attrType
		            			});
		            		}		            		
		            	} else {
			            	_m.removeMessage.call($this, {
			            		"s"		:	o.s,
			            		"inp"	:	currInput,
			            		"lab"	:	parentLabel,
			            		"type"	:	attrType
			            	});
			            }
		            }
		            return error;
			},
			
			"formSubmit"	:	function(o) {
			
				var $this	=	$(this),
					error	=	true;
		        
		        // Find each required
		        $this.find("select[required], input[required], textarea[required]").each(function() {
					
		            if(!_m.validate.call($(this), {
			            	"form"		:	$this,
			            	"s"			:	o.s,
			            	"messages"	:	o.messages
			            })) {
		            	error	=	false;
		            }
		        });
		        return error;
			},
			"addMessage"	:	function (o) {
				var $this 			=	$(this),
				    parentLI		=	o.inp.closest("li"),
				    parentUL		=	parentLI.closest("ul"),
				    checkboxQuest	=	parentUL.prevAll("p");
				
				if(o.type	==	"checkbox" || o.type == "radio") {
					checkboxQuest.addClass(o.s.errorClass);
					
					if(parentLI.length > 0) {
						if(parentUL.next("." + o.s.errorClass +  "." + o.s.messageClass).length < 1) {
						    parentUL.after('<span class="' + o.s.messageClass + ' ' + o.s.errorClass + '">' + o.mess + '</span>');
						}
					} else {
						if(o.inp.last().next("." + o.s.errorClass).length < 1) {
						    o.inp.last().after('<span class="' + o.s.messageClass + ' ' + o.s.errorClass + '">' + o.mess + '</span>');
						}
					}
				} else {
					o.lab.addClass(o.s.errorClass);
					o.inp.addClass(o.s.errorClass);
					
					if(o.inp.next("." + o.s.errorClass).length > 0) {
						o.inp.next("." + o.s.errorClass).remove();
					}
					o.inp.after('<span class="' + o.s.messageClass + ' ' + o.s.errorClass + '">' + o.mess + '</span>');
				}
			},
			"removeMessage"	:	function (o) {
				var $this 			=	$(this),
				    parentLI		=	o.inp.closest("li"),
				    parentUL		=	parentLI.closest("ul"),
				    checkboxQuest	=	parentUL.prevAll("p");
				
				if(o.type	==	"checkbox" || o.type == "radio") {
					checkboxQuest.removeClass(o.s.errorClass);
					
					if(parentLI.length > 0) {
						if(parentUL.next("." + o.s.errorClass + "." + o.s.messageClass).length > 0) {
						    parentUL.next("." + o.s.errorClass + "." + o.s.messageClass).remove();
						}
					} else {
						if(o.inp.last().next("." + o.s.errorClass + "." + o.s.messageClass).length > 0) {
						    o.inp.last().next("." + o.s.errorClass + "." + o.s.messageClass).remove();
						}
					}
				} else {
					o.lab.removeClass(o.s.errorClass);
					o.inp.removeClass(o.s.errorClass);
	
					var mess	=	o.inp.next("." + o.s.messageClass + "." + o.s.errorClass);
	
					if(mess.length > 0) {
					    mess.remove();
					}
				}
			}
		};
	$.fn[_v.pluginName] = function(m) {
		if (_m[m]) {
            return _m[m].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!m || typeof m == "object") {
            return _m.init.apply(this, arguments);
        } else {
            console.log(_v.pluginName + ": Invalid method passed");
        }
	};

})(jQuery);