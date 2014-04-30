/*!
 * Motif Ajax Submission v0.2.0
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    /**
     * @module Motif
     * @submodule apps
     * @class AjaxSubmission
     * @constructor
     * @param elem {Object}
     */
    var AjaxSubmission = function ( elem ) {

            /**
             * @property $elem
             * @type Object
             */
            this.$elem = $( elem );

            /**
             * @property elem
             * @type Object
             */
            this.elem = this.$elem[0];
        },
        $document = $( document );

    AjaxSubmission.prototype = {

        /**
         * @property defaults
         * @type Object
         */
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

        /**
         * @method init
         * @param [userOptions] {Object}
         * @return {Object}
         */
        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );
            this.initValidation();

            return this;
        },

        /**
         * @method initVars
         * @param [userOptions] {Object}
         */
        "initVars": function ( userOptions ) {

            /**
             * @property config
             * @type Object
             */
            this.config = userOptions;

            /**
             * @property metadata
             * @type Object
             */
            this.metadata = this.$elem.data("ajax-submission-options");

            /**
             * @property options
             * @type Object
             */
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

            /**
             * @property error
             * @type Boolean
             */
            this.error = false;

            /**
             * @property method
             * @type String
             */
            this.method = this.$elem.attr("method") || "post";

            /**
             * @property action
             * @type String
             */
            this.action = this.$elem.attr("action");
        },

        /**
         * Makes AJAX call, executing `ajaxCallback` afterwards.
         * @method submitForm
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

        /**
         * @method ajaxCallback
         * @param data {Object}
         * @param [error] {Boolean}
         * @return {Object}
         */
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
         * Gets HTML response, calls to reset form and place message, 
         * runs callback (if there).
         * @method afterSubmit
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
         * Builds message string using our configuration.
         * @method buildMessage
         * @return {String} The HTML message to be placed in response
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
         * Resets form and removes success class from fields
         * @method resetForm
         * @return {Boolean}
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
         * Depending on where specified in config, places message
         * @method placeMessage
         * @param message {String} The HTML for the response message
         * @return {Object}
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

            return $message;
        },

        /**
         * Right now, crudely animates to placed message
         * @method goToMessage
         * @param message {Object} The jQuery object of the response message
         */
        "goToMessage": function ( message ) {
            var scrollElem = this.options.scrollElem || $("html, body");

            scrollElem.animate({
                scrollTop: message.offset().top
            }, 500 );
            this.removeMessage( message );
        },

        /**
         * Right now, crudely removes message after timeout
         * @method removeMessage
         * @param message {Object} The jQuery object of the response message
         */
        "removeMessage": function ( message ) {

            // After a few seconds, remove message
            setTimeout( function removeAjaxMessage () {
                message.slideUp( 150, function onSlideUpComplete () {
                    message.remove();
                });
            }, 8000);
        },

        /**
         * Initializes the form validation (in this case, Gauntlet),
         * and passes on our `submitForm` method as a parameter.
         * @method initValidation
         */
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