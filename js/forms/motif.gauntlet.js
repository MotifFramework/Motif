/*!
 * Motif Gauntlet v1.0.0 (2014-04-04)
 * Trials and tribulations to validate your forms
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";


    /**
     * @module Motif
     * @submodule apps
     * @class Gauntlet
     * @constructor
     * @param {object} elem - The element that contains validating fields
     */
    var Gauntlet = function ( elem ) {
            
            /**
             * Set key properties for our main element
             * @property {object} $elem
             * @property {object} elem
             */
            this.$elem = $( elem );
            this.elem = this.$elem[0];

            return this;
        },

        /**
         * @module Motif
         * @submodule apps
         * @class GauntletInput
         * @constructor
         * @param {object} elem - Specific form field to validate
         */
        GauntletInput = function ( elem ) {
            
            /**
             * Set key properties for our form element
             * @property {object} $elem
             * @property {object} elem
             */
            this.$elem = $( elem );
            this.elem = this.$elem[0];

            return this;
        },
        $document = $( document );

    Gauntlet.prototype = {

        /**
         * Define the default configuration options
         * @property {object} defaults
         */
        "defaults": {
            "alertClasses": {
                "error": "input-alert--error",
                "success": "input-alert--success"
            },
            "labelClasses": {
                "error": "is-erroneous",
                "success": "is-successful",
                "disabled": "is-disabled"
            },

            "messages": {},
            "patterns": {},

            "check": [],
            "ignore": [],

            "errorReport": null,
            "ajaxSubmit": null,
            "scrollToError": true,
            "addTest": []
        },

        /**
         * Form fields to check
         * @property {array} fields
         */
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

        "passed": [],
        "failed": [],

        /**
         * The entrypoint of the plugin that sets events into motion
         * @param  {object} [userOptions]
         */
        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );
            this.prepForm();
            this.bindErrorHandling();
            this.gatherInputs();
            this.bindInputs();

            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("gauntlet-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.checkboxes = {};
            this.updateInputList();
        },

            /**
             * @todo create a fields array for this instance alone
             */
            "updateInputList": function () {
                if ( this.options.check.length ) {
                    this.addToInputList();
                }
                if ( this.options.ignore.length ) {
                    this.removeFromInputList();
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
                    "inputIsInList": function ( input ) {
                        var position = $.inArray( input, this.fields );

                        if ( position === -1 ) {
                            return false;
                        } else {
                            return position;
                        }
                    },

        "prepForm": function () {
            this.$elem.attr( "novalidate", true );
        },
        "bindErrorHandling": function () {
            var self = this;

            $document.on( "gauntlet/fail", function onGauntletFail ( event, input ) {
                self.inputError.call( self, input );
            });
            $document.on( "gauntlet/success", function onGauntletSuccess ( event, input ) {
                self.inputSuccess.call( self, input );
            });
            $document.on( "ajax/complete", function onAjaxComplete ( event, form ) {
                self.enableSubmit.call( self, form );
            });

            if ( self.options.scrollToError ) {
                $document.on( "gauntlet/fail/first", function onGauntletFirstFail ( event, input ) {
                    self.scrollToError.call( self, input );
                });
            }
        },

        "gatherInputs": function () {
            this.$fields = this.fields.join(", ");
            return this.$fields;
        },

        "bindInputs": function () {
            var self = this;

            self.$elem.on( "change", self.$fields, function onInputChange () {
                self.getVerdict.call( self, $( this ) );
                self.errorReport.call( self, self.passed, self.failed );
                self.resetVerdicts.call( self );
            });

            self.$elem.on( "submit", function onFormSubmit () {
                self.disableSubmit.call( self );
                return self.submitForm.call( self );
            });
        },
        "getVerdict": function ( input ) {
            return this.sortResult( this.validate( input ) );
        },

            "sortResult": function ( input ) {
                if ( input.passes ) {
                    this.passed.push( input );
                } else {
                    this.failed.push( input );
                }

                return [ this.passed, this.failed ];
            },
            "errorReport": function ( passed, failed ) {
                if ( typeof this.options.errorReport === "function" ) {
                    this.options.errorReport.call( this, passed, failed );
                } else {
                    this.passedGauntlet( passed );
                    this.failedGauntlet( failed );
                }
            },
            "passedGauntlet": function ( passed ) {
                var self = this;

                if ( passed.length ) {
                    for (var i = passed.length - 1; i >= 0; i--) {
                        $document.trigger( "gauntlet/success", [ passed[ i ] ] );
                    }
                }
            },
            "failedGauntlet": function ( failed ) {
                var self = this,
                    i;

                if ( failed.length ) {
                    for ( i = failed.length - 1; i >= 0; i -= 1 ) {
                        $document.trigger( "gauntlet/fail", [ failed[ i ] ] );

                        if ( i === 0 ) {
                            $document.trigger( "gauntlet/fail/first", [ failed[ i ] ] );
                        }
                    }
                }
            },
        "disableSubmit": function ( form ) {
            var thisForm = form || this.$elem;
            
            thisForm.find("[type='submit']").prop("disabled", true).addClass( this.options.labelClasses.disabled );
        },
        "enableSubmit": function ( form ) {
            var thisForm = form || this.$elem;
            
            thisForm.find("[type='submit']").prop("disabled", false).removeClass( this.options.labelClasses.disabled );
        },
            "scrollToError": function ( input ) {
                $("html, body").animate({
                    scrollTop: input.$elem.offset().top - 50
                }, 500);
            },
            "inputError": function ( input ) {
                if ( input.type === "checkbox" || input.type === "radio" ) {
                    this.checkboxError( input );
                } else {
                    input.$elem.closest("label")
                        .removeClass( this.options.labelClasses.success )
                        .addClass( this.options.labelClasses.error );

                    this.addMessage( input );
                }
            },
                "checkboxError": function ( input ) {
                    var checkboxList = input.$elem.closest("ul", this.$elem),
                        checkboxLabel = input.$elem.closest("label") || $("label[for='" + input.$elem.attr("id") + "']");

                    if ( checkboxList.length ) {
                        this.addMessage( input, checkboxList );
                    } else {
                        this.addMessage( input, checkboxLabel );
                    }
                },
                "addMessage": function ( input, addAfter ) {
                    var elem = addAfter || input.$elem,
                        currentMessage = elem.next( "." + this.options.alertClasses.error );

                    if ( !currentMessage.length ) {
                        elem.after("<strong class='" + this.options.alertClasses.error + "'>" + input.errorMessage + "</strong>");
                    }
                },
            "inputSuccess": function ( input ) {
                if ( input.type === "checkbox" || input.type === "radio" ) {
                    this.checkboxSuccess( input );
                } else {
                    var inputLabel = input.$elem.closest("label");

                    inputLabel.removeClass( this.options.labelClasses.error );

                    if ( !!input.val ) {
                        inputLabel.addClass( this.options.labelClasses.success );
                    } else {
                        inputLabel.removeClass( this.options.labelClasses.success );
                    }

                    this.removeMessage.call( this, input );
                }
            },
                "checkboxSuccess": function ( input ) {
                    var checkboxList = input.$elem.closest("ul", this.$elem),
                        checkboxLabel = input.$elem.closest("label") || $("label[for='" + input.$elem.attr("id") + "']");

                    if ( checkboxList.length ) {
                        this.removeMessage( input, checkboxList );
                    } else {
                        this.removeMessage( input, checkboxLabel );
                    }
                },
                "removeMessage": function ( input, addAfter ) {
                    var elem = addAfter || input.$elem;
                    
                    elem.next( "." + this.options.alertClasses.error ).remove();
                },
            "resetVerdicts": function () {
                this.passed = [];
                this.failed = [];
                this.checkboxes = {};
            },
        "checkAllFields": function () {
            var self = this,
                submit = true;

            self.$elem.find( self.$fields ).each( function eachField () {
                self.getVerdict.call( self, $( this ) );
            });
            self.errorReport.call( self, self.passed, self.failed );

            if ( self.failed.length ) {
                submit = false;
            }

            self.resetVerdicts.call( self );

            return submit;
        },
        "submitForm": function () {
            var verdict = this.checkAllFields();

            if ( verdict && typeof this.options.ajaxSubmit === "function" ) {
                this.options.ajaxSubmit();
                return false;
            } else if ( !verdict ) {
                this.enableSubmit();
            }
            return verdict;
        },
        "validate": function ( input ) {
            var instance = $.data( input[ 0 ], "gauntletInput" );

            if ( !instance ) {
                input.gauntletInput({
                    "messages": this.options.messages,
                    "patterns": this.options.patterns,
                    "addTest": this.options.addTest
                }, this);
                instance = $.data( input[ 0 ], "gauntletInput" );
            } else {
                input.gauntletInput("validateInput");
            }

            return instance;
        }
    };

    GauntletInput.prototype = {
        "init": function ( userOptions, gauntlet ) {
            this.initVars( userOptions, gauntlet );
            this.getTests();
            this.validateInput();
            return this;
        },
        "defaults": {
            "messages": {
                "email": "A valid email address is required.",
                "emailConfirm": "Check that your email addresses match.",
                "text": "This field is required.",
                "textarea": "This field is required.",
                "totals": "Check that your totals don't exceed the limit",
                "tel": "Make sure you've entered a valid phone number.",
                "search": "Please input a search term.",
                "number": "Enter a valid number.",
                "error": "There was an error.",
                "password": "Your password must match the criteria.",
                "passwordConfirm": "Be sure that your passwords match.",
                "radio": "Please choose one of the options above.",
                "checkbox": "Please check at least one option.",
                "select": "Select an option."
            },
            "patterns": {
                "email": /^([a-zA-Z0-9._%+\-])+@([a-zA-Z0-9_.\-])+\.([a-zA-Z])+([a-zA-Z])+/,
                "tel": /^((([0-9]{1})*[\- .(]*([0-9]{3})[\- .)]*[0-9]{3}[\- .]*[0-9]{4})+)*$/,
                "number": /^[0-9]*/
            }
        },
        "initVars": function ( userOptions, gauntlet ) {

            // Extends default options
            this.config = userOptions;
            this.metadata = this.$elem.data("gauntlet-input-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

            // Get important input variables
            this.type = this.getType( this.$elem );
            this.disabled = this.$elem.prop("disabled");
            this.required = this.$elem.attr("required");
            this.confirm = this.$elem.attr("data-gauntlet-confirm");

            if ( !!this.confirm ) {
                this.$confirms = $( "#" + this.confirm );
            } else if ( $("[data-gauntlet-confirm='" + this.$elem.attr("id") + "']").length ) {
                this.$confirmedBy = $("[data-gauntlet-confirm='" + this.$elem.attr("id") + "']");
            }

            this.gauntlet = gauntlet || $.data( this.$elem.closest("form")[ 0 ], "gauntlet" );
            this.$form = this.gauntlet.$elem || this.$elem.closest("form");
            this.name = this.$elem.attr("name");
            this.pattern = this.$elem.attr("pattern") || this.options.patterns[ this.type ] || false;
            this.tests = [];
            this.errorMessage = this.$elem.attr("data-error");

            if ( !this.errorMessage ) {
                /**
                 * Need default message if it's not found on table
                 */
                this.errorMessage = !!this.confirm ? this.options.messages[ this.type + "Confirm" ] : this.options.messages[ this.type ];
            }
        },
        "updateValue": function () {
            return this.val = this.$elem.val();
        },
        "getType": function ( elem ) {
            var inputType = elem.attr("type");

            if ( !inputType || inputType === "select-one" ) {
                if (elem.is("select")) {
                    inputType = "select";
                } else if (elem.is("textarea")) {
                    inputType = "textarea";
                } else {
                    inputType = "text";
                }
            }

            return inputType;
        },
        "getTests": function () {
            var self = this,
                i;

            if ( !!self.pattern ) {
                self.tests.push("patternTest");
            }
            if ( !!self.confirm ) {
                self.tests.push("confirmTest");
            }
            if ( self.type === "checkbox" || self.type === "radio" ) {
                self.tests.push("checkboxTest");
            }
            if ( self.gauntlet.options.addTest.length ) {
                for ( i = self.gauntlet.options.addTest.length - 1; i >= 0; i -= 1 ) {
                    self.runUserTest.call( self, self.gauntlet.options.addTest[ i ] );
                }
            }

            return self.tests;
        },
        "runUserTest": function ( userTest ) {
            var runTest = userTest.condition.call( this, this.$elem );

            if ( runTest ) {
                this.tests.push( userTest.test );
            }

            return runTest;
        },
        "validateInput": function () {
            var self = this,
                results = [],
                i;

            // Make sure we have the latest val
            self.updateValue.call( self );

            // If the input is not disabled...
            if ( this.disabled !== true ) {

                // If it's empty
                if ( $.trim( self.val ) === "" ) {

                    // If it's required...
                    self.passes = !!self.required ? false : true;

                // If there *is* a value...
                } else {

                    // Loop through the tests
                    for ( i = self.tests.length - 1; i >= 0; i -= 1 ) {

                        if ( typeof self.tests[ i ] === "function" ) {
                            results.push( self.tests[ i ].call( self, self.$elem ) );
                        } else {

                            // Push the results to an array
                            results.push( self[ self.tests[ i ] ].call( self ) );
                        }
                    }

                    // If any of the tests failed...
                    self.passes = results.indexOf( false ) !== -1 ? false : true;
                }
            }

            return self.passes;
        },

        "requiredTest": function () {
            return !!this.required ? false : true;
        },

        "confirmTest": function () {
            return this.val !== this.$confirms.val() ? false : true;
        },

        "patternTest": function () {
            var filter = new RegExp( this.pattern );

            return !filter.test( this.val ) ? false : true;
        },

        "checkboxTest": function () {
            var checkboxGroup,
                checked;

            if ( !!this.required ) {
                if ( this.gauntlet.checkboxes[ this.name ] ) {
                    return true;
                }

                checkboxGroup = this.$form.find("input[name='" + this.name + "']");
                checked = checkboxGroup.filter(":checked").length ? true : false;

                this.gauntlet.checkboxes[ this.name ] = {
                    "elems": checkboxGroup,
                    "verdict": checked
                };

                return checked;
            }

            return true;
        }
    };

    Gauntlet.defaults = Gauntlet.prototype.defaults;
    GauntletInput.defaults = GauntletInput.prototype.defaults;

    Motif.apps.Gauntlet = Gauntlet;
    Motif.apps.GauntletInput = GauntletInput;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

jQuery.createPlugin( "gauntlet", window.Motif.apps.Gauntlet );
jQuery.createPlugin( "gauntletInput", window.Motif.apps.GauntletInput );