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
            "classes": {
                "error": "",
                "success": "",
                "warning": ""
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

            self.$elem.on( "gauntlet.change", self.$fields, function onInputChange () {
                this.getVerdict( $( this ) );
                // this.errorReport();
            });

            self.$elem.on( "submit", function onFormSubmit () {
                return self.submitForm.call( self );
            });
        },
        "getVerdict": function ( input ) {
            this.error = this.validate( input );
        },
        "submitForm": function () {
            
        },
        "validate": function ( input ) {
            var verdict = input.gauntletInstance({
                    "messages": this.options.messages,
                    "patterns": this.options.patterns
                });

            return verdict;
        }
    };

    GauntletInput.prototype = {
        "init": function ( userOptions ) {
            this.initVars( userOptions );
            return this.validateInput();
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
            this.val = this.$elem.val();
            this.pattern = this.$elem.attr("pattern") || this.options.patterns[ this.type ] || false;
            this.tests = [];
            this.errorMessage = this.$elem.attr("data-error") || this.options.messages[ this.type ];
        },
        "getType": function ( elem ) {
            var inputType = elem.attr("type");

            if ( !inputType || inputType === "select-one" ) {
                if (currentInput.is("select")) {
                    inputType = "select";
                } else if (currentInput.is("textarea")) {
                    inputType = "textarea";
                } else {
                    inputType = "text";
                }
            }

            return inputType;
        },
        "getTests": function () {
            
            if ( this.disabled !== true ) {
                tests.push("emptyTest");

                if ( !!this.pattern ) {
                    tests.push("patternTest");
                }
                if ( !!this.confirms ) {
                    tests.push("confirmTest");
                }
                if ( this.type === "checkbox" || this.type === "radio" ) {
                    tests.push("checkboxTest");
                }
            }
        },
        "validateInput": function () {
            var results = [],
                i;

            for ( i = this.tests.length - 1; i >= 0; i -= 1 ) {
                results.push( this[ this.tests[ i ] ].call() );
            }

            if ( results.indexOf( false ) !== -1 ) {
                return false;
            }

            return true;
        },
        "emptyTest": function () {
            if ( $.trim( this.val ) === "" && !!this.required ) {
                return false;
            }

            return true;
        },
        "patternTest": function ( pattern, value ) {
            var filter = new RegExp( pattern );

            if ( !filter.test( value ) ) {
                return false;
            }
            
            return true;
        },
        "runTests": function () {
            
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



/*

validate

get each field
call the GauntletInput plugin ($("thisinput").gauntletInput())
it creates a new gauntletinput OR extends the current one.
if it's a new input, tell me what tests need to run on this guy
if it's old BUT has chagned (meaning new userOptions), redo the assessment
validateInput is a GauntletInput method that runs said tests

*/