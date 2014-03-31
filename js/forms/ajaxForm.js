(function ( $, window, document, LB, undefined ) {

    "use strict";

    /**
     * AJAX Form Submission & Response
     * -----------------------------------------------------------------------------
     * 
     * Submits form via AJAX and gives user an inline response message
     * 
     * @todo Make options for more complex messaging
     */

    LB.apps.ajaxForm = {

        /**
         * Config
         */

        config: {
            error: false,
            provideMessage: true,
            successText: "Great! Your form has been submitted.",
            errorText: "There was an error submitting your form. Please contact the site's administrator.",
            alertClass: "alert panel",
            alertSuccessClass: "success",
            alertErrorClass: "error",
            messageLocation: "append",
            clearForm: true,
            fieldSuccessClass: "success",
            scrollElem: null,
            callback: null
        },

        /**
         * Init
         * Grabs config and passes it and form on to `onSubmit`
         */

        init: function ( config ) {
            var context = LB.apps.ajaxForm,
                thisForm = $(this),

                // If config are not supplied, pass an empty object
                settings = $.extend( true, {}, context.config, config || {} );

            // Call the submission method, passing on this form and settings
            context.onSubmit.call( thisForm, settings );
        },

        /**
         * On Submit
         * Makes AJAX call, passing on config `afterSubmit` 
         * both on success and error
         */

        onSubmit: function ( config ) {
            var context = LB.apps.ajaxForm,
                settings = config,
                thisForm = $(this);

            // Make AJAX call
            $.ajax({
                type: thisForm.attr("method") || "post",
                url: thisForm.attr("action"),
                data: decodeURIComponent( thisForm.serialize() ),
                cache: false,

                // If successful...
                success: function ajaxSuccess( data ) {

                    // If we are told to provide a message...
                    if ( settings.provideMessage ) {

                        // ...call the after-submission method
                        context.afterSubmit.call( thisForm, settings );
                    }

                    return data;
                },

                // If unsuccessful...
                error: function ajaxError( data ) {

                    // If we are told to provide a message...
                    if ( settings.provideMessage ) {

                        // ...set `error` to be true...
                        settings.error = true;

                        // ...then call the after-submission method
                        context.afterSubmit.call( thisForm, settings );
                    }

                    return data;
                }
            });
        },

        /**
         * After Submit
         * Gets built response, calls to reset form 
         * and place message, runs callback (if there)
         */

        afterSubmit: function ( config ) {
            var context = LB.apps.ajaxForm,
                thisForm = $(this),

                // Call the method to build the response message
                responseMessage = context.buildMessage( config );

            // If there was no error...
            if ( !config.error ) {

                // ...call method to reset form
                context.resetForm.call( thisForm, config );
            }

            // Call method to place response message
            context.placeMessage.call( thisForm, config, responseMessage );

            // Then, if a callback function has been supplied...
            if ( typeof config.callback === "function" ) {

                // ...call it, passing on this form as context
                config.callback.call( thisForm );
            }
        },

        /**
         * Build Message
         * Builds message string with config
         * @return {String}
         */

        buildMessage: function ( config ) {
            var message = '<div class="';

            // Build out the message using our options
            message += config.alertClass;
            message += ' ';
            message += config.error ? config.alertErrorClass : config.alertSuccessClass;
            message += '">';
            message += config.error ? config.errorText : config.successText;
            message += '</div>';

            // Return the message string
            return message;
        },

        /**
         * Reset Form
         * Resets form and removes success 
         * class from fields
         */

        resetForm: function ( config ) {
            var thisForm = $(this);

            if ( config.clearForm ) {

                // Reset this form
                thisForm[0].reset();

                // Remove "success" classes from form fields
                thisForm
                    .find("label")
                    .removeClass( config.fieldSuccessClass );
            }
        },

        /**
         * Place Message
         * Depending on where specified in config, 
         * places message
         */

        placeMessage: function ( config, message ) {
            var context = LB.apps.ajaxForm,
                thisForm = $(this),
                responseMessage = $(message);

            // If options tell us to prepend the message...
            if ( config.messageLocation === "prepend" ) {

                // ...place it at the top of the form
                thisForm.prepend( responseMessage );

            // If options tell us to append the message...
            } else if ( config.messageLocation === "append" ) {

                // ...place it at the bottom of the form
                thisForm.append( responseMessage );

            // If options tell us to place the message before...
            } else if ( config.messageLocation === "before" ) {

                // ...place it before the form
                thisForm.before( responseMessage );

            // If options tell us to place the message after...
            } else if ( config.messageLocation === "after" ) {

                // ...place it after the form
                thisForm.after( responseMessage );
            }

            context.goToMessage( config, responseMessage );
        },

        /**
         * Go To Message
         * Right now, crudely animates to placed message
         */

        goToMessage: function ( config, message ) {
            var context = LB.apps.ajaxForm,

                // If element isn't specified, scroll `html`/`body`
                scrollElem = config.scrollElem || $("html, body");

            scrollElem.animate({
                scrollTop: message.offset().top
            }, 500 );
            context.removeMessage( message );
        },

        /**
         * Remove Message
         * Right now, crudely removes message 
         * after timeout
         */

        removeMessage: function ( message ) {

            // After a few seconds, remove message
            setTimeout(function () {
                message.slideUp( 150 );
            }, 8000, function () {
                message.remove();
            });
        }
    };

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );