/**
 * Admin Actions
 * =============================================================================
 * 
 * Creating the `Admin` namespace
 * 
 * @todo 
 */

(function ( $, Admin, dust, undefined ) {

    "use strict";

    Admin.dust = {
        compileTemplate: function ( template ) {
            return dust.compile( template.output, template.name );
        },
        loadTemplate: function ( template ) {
            dust.loadSource( template );
        },
        build: function ( template, data ) {
            var result;

            dust.render( template, data, function dustRender( errors, output ) {
                result = output;
            });

            return result;
        },
        init: function ( template, data ) {
            Admin.dust.loadTemplate( Admin.dust.compileTemplate( template ) );

            return Admin.dust.build( template.name, data );
        }
    };

    Admin.templates = {
        testTemplate: {
            name: "test",
            output: [ 
                "<h1>{name}</h1>",
                "<p>What a dope.</p>"
            ].join("\n")
        },
        secondaryNav: {
            name: "secondaryNav",
            output: [
                "<ul class='unstyled vertical-nav {ulClass}'>",
                    "{#navigation}",
                        "<li>",
                            "<a href='{url}'>",
                                "{name}",
                            "</a>",
                        "</li>",
                    "{/navigation}",
                "</ul>"
            ].join("\n")
        }
    };

    /**
     * AJAX Form Submission & Response
     * -----------------------------------------------------------------------------
     * 
     * Submits form via AJAX and gives user an inline response message
     * 
     * @todo Make options for more complex messaging
     */

    Admin.ajaxForm = {

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
            var context = Admin.ajaxForm,
                thisForm = $(this),

                // If config are not supplied, pass an empty object
                settings = config || {};

            // Call the submission method, passing on this form and settings
            context.onSubmit.call( thisForm, settings );
        },

        /**
         * On Submit
         * Makes AJAX call, passing on config `afterSubmit` 
         * both on success and error
         */

        onSubmit: function ( config ) {
            var context = Admin.ajaxForm,
                settings = config,
                thisForm = $(this);

            // Make AJAX call
            $.ajax({
                type: thisForm.attr("method"),
                url: thisForm.attr("action"),
                data: decodeURIComponent( thisForm.serialize() ),
                cache: false,

                // If successful...
                success: function ajaxSuccess( data ) {

                    if ( settings.provideMessage ) {

                        // ...call the after-submission method
                        context.afterSubmit.call( thisForm, settings );
                    }

                    return data;
                },

                // If unsuccessful...
                error: function ajaxError( data ) {

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
            var context = Admin.ajaxForm,
                thisForm = $(this),
                settings = $.extend( context.config, config ),

                // Call the method to build the response message
                responseMessage = context.buildMessage( settings );

            // If there was no error...
            if ( !settings.error ) {

                // ...call method to reset form
                context.resetForm.call( thisForm, settings );
            }

            // Call method to place response message
            context.placeMessage.call( thisForm, settings, responseMessage );

            // Then, if a callback function has been supplied...
            if ( typeof settings.callback === "function" ) {

                // ...call it, passing on this form as context
                settings.callback.call( thisForm );
            }
        },

        /**
         * Build Message
         * Builds message string with config
         * Returns string
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
            var context = Admin.ajaxForm,
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
            var context = Admin.ajaxForm,

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

    /**
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.verticalNav = {

        /**
         * Config
         */

        config: {
            navWrapper: $("#vertical-nav-wrapper"),
            hideClass: "off-left",
            revealClass: "off-right",
            template: Admin.templates.secondaryNav,
            url: "/slice/admin/sample-nav.php"
        },

         /**
          * Init
          */

        init: function ( config ) {
            var context = Admin.verticalNav,
                settings = $.extend( true, {}, context.config, config || {} );

            // Call the nav hiding method
            context.hideNav( settings );
        },

        hideNav: function ( config ) {
            var context = Admin.verticalNav;

            // Find the wrapper's child, hide it with class
            config.navWrapper.children().addClass( config.hideClass );

            // Call the method to remove the old nav
            context.removeNav( config );
        },

        removeNav: function ( config ) {
            var context = Admin.verticalNav;

            // CRUDE: Wait for CSS Animation
            setTimeout( function () {

                // Clear out the html
                config.navWrapper.html("");

                // Call method to get new nav
                context.getNav( config );
            }, 250 );
        },

        getNav: function ( config ) {
            var context = Admin.verticalNav;

            // Via AJAX, get JSON string of new nav
            $.getJSON( config.url, function getNavJSON( data ) {
                context.buildNav( data, config );
            });
        },

        buildNav: function ( data, config ) {
            var context = Admin.verticalNav,
                items;

            data.ulClass = config.revealClass;
            items = Admin.dust.init( config.template, data );

            // Call method to place new nav
            context.placeNav( items, config );

            return items;
        },

        placeNav: function ( nav, config ) {
            var context = Admin.verticalNav,
                newNav = $(nav);

            // Append new nav in wrapper
            config.navWrapper.append( newNav );

            // Call method to show new nav
            context.showNav( newNav, config );
        },

        showNav: function ( nav, config ) {

            // Show it, yo
            nav.removeClass( config.revealClass );
        }
    };

    /**
     * Admin Actions Init
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.init = function () {
        console.log( Admin.dust.init( Admin.templates.testTemplate, { name: "Chad" } ) );


        $("form").on( "submit", function ( event ) {
            Admin.ajaxForm.init.call( $(this), {
                scrollElem: $(".content-page")
            });
            event.preventDefault();
        });
        $("#vertical-nav-wrapper").on( "click", "a", function ( event ) {
            Admin.verticalNav.init.call( $(this) );
            event.preventDefault();
        });
        $("#content-nav-back").on( "click", function ( event ) {
            Admin.verticalNav.init.call( $(this), {
                hideClass: "off-right",
                revealClass: "off-left"
            });
            event.preventDefault();
        });
    };

    Admin.init();

}( jQuery, window.Admin = window.Admin || {}, window.dust ) );
