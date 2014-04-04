/**
 * Ajax Submission by Motif
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */

(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var AjaxSubmission = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    AjaxSubmission.prototype = {
        "defaults": {
            "errorClass": "is-erroneous",
            "successClass": "is-successful",
            "alertErrorClass": "alert-panel--error",
            "alertSuccessClass": "alert-panel--success",
            "errorText": "There was an error submitting your form. Please contact the site's administrator.",
            "successText": "Great! Your form has been submitted.",
            "feedbackMessage": "append",
            "clearForm": true,
            "scrollElem": null,
            "callback": null
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars();
            this.initValidation();

            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("ajax-submission-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.error = false;
            this.method = this.$elem.attr("method") || "post";
            this.action = this.$elem.attr("action");
        },

        /**
         * On Submit
         * Makes AJAX call, passing on config `afterSubmit` 
         * both on success and error
         */

        "submitForm": function () {
            var self = this;

            // Make AJAX call
            $.ajax({
                type: self.method,
                url: self.action,
                data: decodeURIComponent( self.$elem.serialize() ),
                cache: false
            })

                // If successful...
                .done( function ajaxSuccess ( data ) {
                    self.ajaxCallback.call( self, data );
                })

                // If unsuccessful...
                .fail( function ajaxError ( data ) {
                    self.ajaxCallback.call( self, data, true );
                })

                // Always
                .always( function ajaxAlways ( data ) {
                    $document.trigger("ajax/complete", [ self.$elem ]);
                });
        },
            "ajaxCallback": function ( data, error ) {

                // If there was an error...
                if ( error ) {

                    // ...set `error` to be true...
                    this.error = true;
                }

                // ...then call the after-submission method
                this.afterSubmit();

                return data;
            },

        /**
         * After Submit
         * Gets built response, calls to reset form 
         * and place message, runs callback (if there)
         */

        "afterSubmit": function () {
            var message = this.options.feedbackMessage ? this.buildMessage() : false;

            // If there was no error...
            if ( !this.error ) {

                // ...call method to reset form
                this.resetForm();
            }

            // Call method to place response message
            this.placeMessage( message );

            // Then, if a callback function has been supplied...
            if ( typeof this.options.callback === "function" ) {

                // ...call it, passing on this form as context
                this.options.callback();
            }
        },

        /**
         * Build Message
         * Builds message string with config
         * @return {String}
         */

        "buildMessage": function () {
            var message = '<p class="';

            // Build out the message using our options
            message += this.error ? this.options.alertErrorClass : this.options.alertSuccessClass;
            message += '">';
            message += this.error ? this.options.errorText : this.options.successText;
            message += '</p>';

            // Return the message string
            return message;
        },

        /**
         * Reset Form
         * Resets form and removes success 
         * class from fields
         */

        "resetForm": function () {
            if ( this.options.clearForm ) {

                // Reset this form
                this.elem.reset();

                // Remove "success" classes from form fields
                this.$elem
                    .find("label")
                    .removeClass( this.options.successClass );
            }

            return this.options.clearForm;
        },

        /**
         * Place Message
         * Depending on where specified in config, 
         * places message
         */

        "placeMessage": function ( message ) {
            var $message;

            if ( message && this.options.feedbackMessage ) {
                $message = $( message );

                switch ( this.options.feedbackMessage ) {
                    case "prepend":
                        this.$elem.prepend( $message );
                        break;
                    case "append":
                        this.$elem.append( $message );
                        break;
                    case "before":
                        this.$elem.before( $message );
                        break;
                    case "after":
                        this.$elem.after( $message );
                        break;
                }

                this.goToMessage( $message );
            }
        },

        /**
         * Go To Message
         * Right now, crudely animates to placed message
         */

        "goToMessage": function ( message ) {
            var scrollElem = this.options.scrollElem || $("html, body");

            scrollElem.animate({
                scrollTop: message.offset().top
            }, 500 );
            this.removeMessage( message );
        },

        /**
         * Remove Message
         * Right now, crudely removes message 
         * after timeout
         */

        "removeMessage": function ( message ) {

            // After a few seconds, remove message
            setTimeout(function () {
                message.slideUp( 150, function onSlideUpComplete () {
                    message.remove();
                });
            }, 8000);
        },
        "initValidation": function () {
            var self = this;

            self.$elem.plugin("gauntlet", {
                "ajaxSubmit": function () {
                    self.submitForm.call( self );
                }
            });
        }
    };

    AjaxSubmission.defaults = AjaxSubmission.prototype.defaults;

    Motif.apps.AjaxSubmission = AjaxSubmission;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "ajaxSubmission", window.Motif.apps.AjaxSubmission );