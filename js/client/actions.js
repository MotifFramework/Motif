/**
 * Client Actions
 * =============================================================================
 * 
 * Creating the `Client` namespace so that it can be publically accessed
 * 
 * @todo 
 */

(function ( $, Client, undefined ) {

    "use strict";

    /**
     * Utilities
     * -----------------------------------------------------------------------------
     * 
     * General utilities that other functions might need to use
     * 
     * @todo 
     */

    Client.utils = {

        /**
         * Init Plugin
         * For maximum convenience for the most basic plugin use cases, 
         * this takes a simple config and starts the `loadPlugin` process 
         * for you (if it knows that elements exist on the page)
         *
         * @param {Object} config Includes targetElems, pluginName, pluginSource, 
         *   pluginOptions (Object)
         */

        initPlugin: function ( config ) {

                // Basic plugin config
            var pluginConfig = {
                    name: config.pluginName,
                    url: config.pluginSource,
                    options: config.pluginOptions
                };

            // If the target elements exist...
            if ( config.targetElems.length ) {

                // ...start loading the plugin
                Client.utils.loadPlugin( config.targetElems, pluginConfig );
            }
        },

        /**
         * Load Plugin
         * If you know you want to bind a plugin right after you get a 
         * script, this automates it for you by combinding `getScript` 
         * and `bindPlugin`
         */

        loadPlugin: function ( target, config ) {

            // Call `getScript` util, passing on plugin name, url, and creating a callback...
            Client.utils.getScript( config.name, config.url, function loadPluginCallback() {

                // ...where we call the `bindPlugin` util, passing on the target elem, 
                // plugin name, and options
                Client.utils.bindPlugin( target, config.name, config.options );
            });
        },

        /**
         * Get Script
         * A slightly altered version of jQuery's `$.getScript` that first 
         * checks if the plugin has been loaded
         * 
         * @todo Don't like that we're repeating the `typeof` conditional
         */

        getScript: function ( name, url, callback ) {

            // If the plugin has not been registered...
            if ( !$.fn[name] ) {

                // Use jQuery's `$.getScript`
                $.getScript( url, function getScriptCallback () {

                    // If a callback function was provided...
                    if ( typeof callback === "function" ) {

                        // ...run it
                        callback();
                    }
                });

            // If the plugin *has* been registered 
            // and a callback has been provided...
            } else if ( typeof callback === "function" ) {

                // ...run it
                callback();

            // Otherwise...
            } else {

                // ...return true
                return true;
            }
        },

        /**
         * Bind Plugin
         * Right now, a crazy simple way of initializing a plugin
         * and passing on options
         */

        bindPlugin: function ( target, plugin, options ) {

            // Ex: $("#elem").pluginName({ option: value });
            target[plugin]( options );
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

    Client.ajaxForm = {

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
            var context = Client.ajaxForm,
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
            var context = Client.ajaxForm,
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
            var context = Client.ajaxForm,
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
            var context = Client.ajaxForm,
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
            var context = Client.ajaxForm,

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
     * Validate Forms
     * -----------------------------------------------------------------------------
     * 
     * Client-side form validation with the `lb_validation` plugin
     * 
     * @todo 
     */

    Client.validateForms = {

        /**
         * Config
         */

        config: {
            forms: $("[data-validation='true']"),
            pluginName: "lb_validation",
            pluginSource: "/resources/c/js/client/jquery.lb-validation.min.js",
            ajaxSubmit: true,
            ajaxConfig: {}
        },

        /**
         * Init
         * If the page needs validation, get the plugin rolling
         */

        init: function ( config ) {
            var context = Client.validateForms,

                // Extend the settings so we know we're up to date
                settings = $.extend( true, {}, this.config, config || {} );

            // If the target elements are on the page...
            if ( settings.forms.length ) {

                // ...get the validation plugin
                context.getPlugin( settings );
            }
        },

        /**
         * Get Plugin
         *
         * @todo Use `Client.utils.getScript` directly instead of this?
         */

        getPlugin: function ( config ) {

            // Call `getScript` util
            Client.utils.getScript( config.pluginName, config.pluginSource, function bindValidationPlugin() {

                // ...then call a custom `bindPlugin`
                Client.validateForms.bindPlugin( config );
            });
        },

        /**
         * Bind Plugin
         * First checks if we need to build the `ajaxSubmit` 
         * function, then calls `Client.utils.bindPlugin`
         */

        bindPlugin: function ( config ) {
            var context = Client.validateForms,

                // Create an empty `pluginSettings` object 
                // for us to (possibly) populate
                pluginSettings = {};

            // If our config says we want to `ajaxSubmit...
            if ( config.ajaxSubmit ) {

                // Call the `buildAjaxSubmit` method, which returns 
                // a function, which we attach to `pluginSettings` 
                // as `ajaxSubmit` (which is what our validation plugin
                // looks for)
                pluginSettings.ajaxSubmit = context.buildAjaxSubmit( config );
            }

            // Now, bind the plugin for real
            Client.utils.bindPlugin( config.forms, config.pluginName, pluginSettings );
        },

        /**
         * Build Ajax Submit
         * Builds (and returns) an Ajax function for the validation plugin 
         * to run on submission
         */

        buildAjaxSubmit: function ( config ) {

            // We must return a function
            return function ajaxSubmit() {

                // Call our `ajaxForm` init method from up top
                Client.ajaxForm.init.call( $(this), config.ajaxConfig );
            };
        }
    };

    Client.lbReveal = {

        /**
         * Config
         */

        config: {
            targetElems: $("[data-reveal]"),
            pluginName: "lb_reveal",
            pluginSource: "/resources/c/js/plugins/jquery.lb-reveal.min.js",
            pluginOptions: {}
        },

        /**
         * Init
         */

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} );

            // Init the Plugin
            Client.utils.initPlugin( settings );
        }
    };


    Client.bindUI = {
        init: function () {
            Client.lbReveal.init({
                targetElems: $(".js-tabs"),
                pluginOptions: {
                    type: "radio",
                    activeClass: "is-current"
                }
            });

            Client.lbReveal.init({
                targetElems: $(".canvas-trigger"),
                pluginOptions: {
                    "type": "exclusive",
                    "activeClass": "is-active",
                    "visitedClass": "was-active"
                }
            });

            Client.lbReveal.init({
                targetElems: $(".js-reveal"),
                pluginOptions: {
                    type: "exclusive",
                    activeClass: "is-revealed",
                    visitedClass: "was-revealed"
                }
            });

            Client.lbReveal.init({
                targetElems: $(".js-expand"),
                pluginOptions: {
                    activeClass: "is-expanded",
                    visitedClass: "was-expanded",
                    type: "exclusive"
                }
            });

            Client.lbReveal.init({
                targetElems: $(".js-fade"),
                pluginOptions: {
                    activeClass: "is-faded",
                    visitedClass: "was-faded"
                }
            });
        }
    };

    /**
     * Data Icons
     * -----------------------------------------------------------------------------
     * 
     * In IE8 or browsers that don't support generated content, fake the [data-icon] 
     * pseudo element by placing `<i>` elements inline.
     * 
     * @todo The `.each` in `init` might need to be its own method?
     */

    Client.dataIcons = {
        config: {
            ie8: $("html.lte8"),
            dataIcon: $("[data-icon]")
        },

        /**
         * Init
         * Checks if it needs to generate icons, loops through each instance
         * @param  {Object} config 
         */

        init: function ( config ) {
            var context = Client.dataIcons,
                settings = $.extend( true, {}, context.config, config || {} );

            // Check if Modernizr can't find generated content, or if the browser 
            // is IE8, which is known to have issues with [data-icon] via CSS
            if ( (!Modernizr.generatedcontent || context.config.ie8.length) && context.config.dataIcon.length ) {

                // Loop through each [data-icon] instance on the page...
                context.config.dataIcon.each( function createIcons() {
                    var elem = $(this),

                        // Build a new icon
                        newIcon = context.buildIcon.call( elem, settings );

                    // Place the new icon
                    context.placeIcon.call( elem, newIcon, settings );
                });
            }
        },

        /**
         * Build Icons
         * Build the icon string with `<i>` and data attributes
         * @param  {Object} config
         * @return {String}
         */

        buildIcon: function ( config ) {
            var elem = $(this),
                icon = "";

            icon += "<i class='data-icon ";
            icon += elem.attr("data-icon-family");
            icon += "' aria-hidden='true'>";
            icon += elem.attr("data-icon");
            icon += "</i>";

            return icon;
        },

        /**
         * Place Icon
         * Places the icon to its parent element based on data attribute position
         * @param  {String} icon   
         * @param  {Object} config 
         */

        placeIcon: function ( icon, config ) {
            var elem = $(this),
                newIcon = $(icon),
                iconPosition = elem.attr("data-icon-position");

            // If it's "before" or "solo"...
            if ( iconPosition === "before" || iconPosition === "solo" ) {

                // ...prepend it
                newIcon.prependTo( elem );

            // If it's "after"...
            } else if ( iconPosition === "after" ) {

                // ...append it
                newIcon.appendTo( elem );
            }
        }
    };

    /**
     * Client Actions Init
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Client.init = function () {
        Client.validateForms.init();
        Client.bindUI.init();
        Client.dataIcons.init();
    };

    Client.init();

}( jQuery, window.Client = window.Client || {} ) );
