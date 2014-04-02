(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Gauntlet = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        GauntletInput = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    Gauntlet.prototype = {
        "defaults": {
            "alertClasses": {
                "error": "input-alert--error",
                "success": "input-alert--success"
            },
            "labelClasses": {
                "error": "is-erroneous",
                "success": "is-successful"
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

        "passed": [],
        "failed": [],

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
            this.metadata = this.$elem.data("gauntlet-options");
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

            self.$elem.on( "change", self.$fields, function onInputChange () {
                self.getVerdict.call( self, $( this ) );
                self.errorReport.call( self, self.passed, self.failed );
                self.resetVerdicts.call( self );
            });

            self.$elem.on( "submit", function onFormSubmit () {
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
                        self.inputSuccess.call( self, passed[i] );
                    }
                }
            },
            "failedGauntlet": function ( failed ) {
                var self = this;

                if ( failed.length ) {
                    for (var i = failed.length - 1; i >= 0; i--) {
                        self.inputError.call( self, failed[i] );
                    }
                }
            },
            "inputError": function ( input ) {
                input.$elem.closest("label")
                    .removeClass( this.options.labelClasses.success )
                    .addClass( this.options.labelClasses.error );

                this.addMessage.call( this, input );
            },
                "addMessage": function ( input ) {
                    var currentMessage = input.$elem.next( "." + this.options.alertClasses.error );

                    if ( !currentMessage.length ) {
                        input.$elem.after("<strong class='" + this.options.alertClasses.error + "'>" + input.errorMessage + "</strong>");
                    }
                },
            "inputSuccess": function ( input ) {
                var inputLabel = input.$elem.closest("label");

                inputLabel.removeClass( this.options.labelClasses.error );

                if ( !!input.val ) {
                    inputLabel.addClass( this.options.labelClasses.success );
                } else {
                    inputLabel.removeClass( this.options.labelClasses.success );
                }

                this.removeMessage.call( this, input );
            },
                "removeMessage": function ( input ) {
                    input.$elem.next( "." + this.options.alertClasses.error ).remove();
                },
            "resetVerdicts": function () {
                this.passed = [];
                this.failed = [];
            },
        "checkAllFields": function () {
            var self = this,
                submit = true;

            self.$elem.find( self.$fields ).each( function eachField () {
                self.getVerdict.call( self, $( this ) );
                self.errorReport.call( self, self.passed, self.failed );
            });

            if ( self.failed.length ) {
                submit = false;
            }

            self.resetVerdicts.call( self );

            return submit;
        },
        "submitForm": function () {
            return this.checkAllFields();
        },
        "validate": function ( input ) {
            var instance = $.data( input[ 0 ], "gauntletInput" ),
                verdict;

            if ( !instance ) {
                input.gauntletInput({
                    "messages": this.options.messages,
                    "patterns": this.options.patterns
                });
                instance = $.data( input[ 0 ], "gauntletInput" );
            } else {
                input.gauntletInput("validateInput");
            }

            return instance;
        }
    };

    GauntletInput.prototype = {
        "init": function ( userOptions ) {
            this.initVars( userOptions );
            this.getTests();
            this.validateInput();
            return this;
        },
        "defaults": {
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
            }
        },
        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("gauntlet-input-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.type = this.getType( this.$elem );
            this.disabled = this.$elem.prop("disabled");
            this.required = this.$elem.attr("required");
            this.confirm = this.$elem.attr("data-gauntlet-confirm");
            if ( !!this.confirm ) {
                this.$confirms = $( "#" + this.confirm );

            }
            this.pattern = this.$elem.attr("pattern") || this.options.patterns[ this.type ] || false;
            this.tests = [];
            this.errorMessage = this.$elem.attr("data-error");

            if ( !this.errorMessage ) {
                if ( !!this.confirm ) {
                    this.errorMessage = this.options.messages[ this.type + "Confirm" ];
                } else {
                    this.errorMessage = this.options.messages[ this.type ];
                }
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
            if ( !!this.pattern ) {
                this.tests.push("patternTest");
            }
            if ( !!this.confirm ) {
                this.tests.push("confirmTest");
            }
            if ( this.type === "checkbox" || this.type === "radio" ) {
                this.tests.push("checkboxTest");
            }
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
                    if ( !!self.required ) {

                        // ...it fails
                        self.passes = false;

                    // If it's not required
                    } else {

                        // ...it passes
                        self.passes = true;
                    }

                // If there *is* a value...
                } else {

                    // Loop through the tests
                    for ( i = self.tests.length - 1; i >= 0; i -= 1 ) {

                        // Push the results to an array
                        results.push( self[ self.tests[ i ] ].call( self ) );
                    }

                    // If any of the tests failed...
                    if ( results.indexOf( false ) !== -1 ) {

                        // ...it fails
                        self.passes = false;

                    // If they all passed...
                    } else {

                        // ...it passed
                        self.passes = true;
                    }
                }
            }

            return self.passes;
        },

        "requiredTest": function () {
            if ( !!this.required ) {
                return false;
            }

            return true;
        },

        "confirmTest": function () {
            if ( this.val !== this.$confirms.val() ) {

                // It failed
                return false;
            }

            return true;
        },

        "patternTest": function () {
            var filter = new RegExp( this.pattern );

            if ( !filter.test( this.val ) ) {
                return false;
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

$.createPlugin( "gauntlet", window.Motif.apps.Gauntlet );
$.createPlugin( "gauntletInput", window.Motif.apps.GauntletInput );