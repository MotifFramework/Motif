(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var PLUGIN = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    PLUGIN.prototype = {
        "defaults": {
            "classes": {
                "error": "",
                "success": "",
                "warning": ""
            },
            "messages": {
                "email": "A valid email address is required.",
                "emailConfirm": "Check that your email addresses match.",
                "text": "This field is required.",
                "totals": "Check that your totals don't exceed the limit",
                "tel": "Make sure you've entered a valid phone number.",
                "search": "Please input a search term.",
                "number": "Enter a valid number.",
                "error": "There was an error.",
                "password": "Your password must match the criteria.",
                "passwordConfirm": "Be sure that your passwords match.",
                "radio": "Please choose one of the options above.",
                "checkbox": "This field is required.",
                "select": "Select an option."
            },
            "patterns": {
                "email": /^([a-zA-Z0-9._%+\-])+@([a-zA-Z0-9_.\-])+\.([a-zA-Z])+([a-zA-Z])+/,
                "tel": /^((([0-9]{1})*[\- .(]*([0-9]{3})[\- .)]*[0-9]{3}[\- .]*[0-9]{4})+)*$/,
                "number": /^[0-9]*/
            },

            "check": [],
            "ignore": [],

            "errorReport": null,
            "ajaxSubmit": null
        },

        "fields": [
            "input[type='text']",
            "input[type='email']",
            "input[type='search']",
            "input[type='tel']",
            "input[type='url']",
            "input[type='number']",
            "input[type='password']",
            "input[type='checkbox']",
            "input[type='radio']",
            "textarea",
            "select"
        ],

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );
            this.prepForm();
            this.gatherInputs();
            this.bindInputs();

            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("PLUGIN-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.updateInputList();

        },
            "updateInputList": function () {
                if ( this.options.check.length ) {
                    this.addToInputList();
                }
                if ( this.options.ignore.length ) {
                    this.removeFromInputList();
                }
            },
            "inputIsInList": function ( input ) {
                var position = this.fields.indexOf( input );

                if ( position === -1 ) {
                    return false;
                } else {
                    return position;
                }
            },
            "addToInputList": function () {
                var position = false,
                    i;
                
                for ( i = this.options.check.length - 1; i >= 0; i -= 1 ) {
                    var thisInput = this.options.check[ i ];

                    position = this.inputIsInList( thisInput );
                    
                    if ( !position ) {
                        this.fields.push( thisInput );
                    }
                }

                return this.fields;
            },
            "removeFromInputList": function () {
                var position = false,
                    i;
                
                for ( i = this.options.ignore.length - 1; i >= 0; i -= 1 ) {
                    var thisInput = this.options.ignore[ i ];

                    position = this.inputIsInList( thisInput );
                    
                    if ( position ) {
                        this.fields.splice( position, 1 );
                    }
                }

                return this.fields;
            },

        "prepForm": function () {
            this.$elem.attr( "novalidate", true );
        },

        "gatherInputs": function () {
            this.$fields = this.fields.join(", ");
            return this.$fields;
        },

        "bindInputs": function () {
            var self = this;

            self.$elem.on( "gauntlet.change", self.$fields, function onInputChange () {
                this.getVerdict();
                this.errorReport();
            });

            self.$elem.on( "submit", function onFormSubmit () {
                return self.submitForm.call( self );
            });
        },
        "getVerdict": function () {
            
        },
        "submitForm": function () {
            
        },
        "validate": function ( input ) {
            var inputValue = input.val(),
                inputType = input.attr("type"),
                inputName = input.attr("name"),
                inputPattern = input.attr("pattern"),
                verdict = true;

            // If it's not disabled...
            if ( input.prop("disabled") !== true ) {
                if ( $.trim( inputValue ) === "" && !! input.attr("required") ) {
                    verdict = false;
                } else {
                    // If "pattern" is defined...
                    if ( !!inputPattern ) {

                        verdict = this.validatePattern( inputPattern, inputValue );

                        // Create filter out of pattern
                        filter = new RegExp(inputPattern);

                        // If pattern isn't matched...
                        if (!filter.test(currentValue)) {

                            // It failed
                            verdict = false;

                        // If it's matched but is also a confirmation input...
                        } else if (!!confirmingInput) {

                            // If it doesn't match the input it confirms...
                            if (currentValue !== confirmedInput.val()) {

                                // It failed
                                verdict = false;
                            }
                        }

                    // If it's confirming another input...
                    } else if (!!confirmingInput) {

                        // If the values don't match...
                        if (currentValue !== confirmedInput.val()) {

                            // It failed
                            verdict = false;
                        }

                    // If it's a checkbox or radio...
                    } else if (inputType === "checkbox" || inputType === "radio") {

                        if (!!currentInput.attr("required")) {
                            checkboxGroup = $this.find("input[name='" + inputName + "']");
                            hasChecked = false;

                            // Run through the checkbox group
                            checkboxGroup.each(function () {

                                // If any are checked, pass on to variable
                                if ($(this).is(":checked")) {
                                    hasChecked = true;
                                }
                            });

                            // If none were checked...
                            if (hasChecked === false) {

                                // It failed
                                verdict = false;
                            }
                        }

                    // If it's not a textarea, select, checkbox or radio, but it matches our types array...
                    } else if (!!inputType && !!formSettings.types[inputType]) {

                        // Find the filter in our filter types array
                        filter = formSettings.types[inputType];

                        // If it doesn't match the pattern...
                        if (!filter.test(currentValue)) {

                            // If failed
                            verdict = false;
                        }
                    }
                }
            }
        }
            "validatePattern": function ( pattern, value ) {
                var filter = new RegExp( pattern );

                if ( !filter.test( value ) ) {
                    return false;
                } else {
                    return true;
                }
            },
            "validateConfirm": function () {
                
            },
            "validateRadio": function () {
                
            }
    };

    PLUGIN.defaults = PLUGIN.prototype.defaults;

    Motif.apps.PLUGIN = PLUGIN;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "PLUGIN", window.Motif.apps.PLUGIN );