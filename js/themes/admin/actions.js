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

    /**
     * Utilities
     * -----------------------------------------------------------------------------
     * 
     * General utilities that other functions might need to use
     * 
     * @todo 
     */

    Admin.utils = {

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
                Admin.utils.loadPlugin( config.targetElems, pluginConfig );
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
            Admin.utils.getScript( config.name, config.url, function loadPluginCallback() {

                // ...where we call the `bindPlugin` util, passing on the target elem, 
                // plugin name, and options
                Admin.utils.bindPlugin( target, config.name, config.options );
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

    // Admin.dust = {
    //     compileTemplate: function ( template ) {
    //         return dust.compile( template.output, template.name );
    //     },
    //     loadTemplate: function ( template ) {
    //         dust.loadSource( template );
    //     },
    //     build: function ( template, data ) {
    //         var result;

    //         dust.render( template, data, function dustRender( errors, output ) {
    //             result = output;
    //         });

    //         return result;
    //     },
    //     init: function ( template, data ) {
    //         Admin.dust.loadTemplate( Admin.dust.compileTemplate( template ) );

    //         return Admin.dust.build( template.name, data );
    //     }
    // };

    // Admin.templates = {
    //     testTemplate: {
    //         name: "test",
    //         output: [
    //             "<h1>{name}</h1>",
    //             "<p>What a dope.</p>"
    //         ].join("\n")
    //     },
    //     secondaryNav: {
    //         name: "secondaryNav",
    //         output: [
    //             "<ul class='unstyled vertical-nav {ulClass}'>",
    //                 "{#navigation}",
    //                     "<li>",
    //                         "<a href='{url}'>",
    //                             "{name}",
    //                         "</a>",
    //                     "</li>",
    //                 "{/navigation}",
    //             "</ul>"
    //         ].join("\n")
    //     }
    // };

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
            backButton: $("#content-nav-back"),
            hideClass: "off-left",
            revealClass: "off-right",
            // template: Admin.templates.secondaryNav,
            url: "/slice/admin/sample-nav.php",
            navTypeConfig: {
                published: "published status",
                unpublished: "unpublished status",
                pending: "pending status",
                folder: "has-children"
            }
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
            setTimeout(function () {

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
                items = "",
                button;

            // data.ulClass = config.revealClass;
            // items = Admin.dust.init( config.template, data );

            items += "<ul class='unstyled vertical-nav petite-text mtn ";
            items += config.revealClass;
            items += "'>";

            // Loop through each object, build new nav
            $.each( data.nav, function navlistItems ( i, item ) {
                items += "<li><a ";
                items += "class='";
                items += config.navTypeConfig[item.type];
                items += "' ";
                items += "href='";
                items += item.url;
                items += "'>";
                items += item.label;
                items += "</a></li>";
            });

            items += "</ul>";

            // Call method to place new nav
            context.placeNav( items, config );

            if ( data.back ) {
                button = context.buildBackButton( data.back, config );
                context.placeBackButton( button, config );
            } else {
                context.removeBackButton( config );
            }

            return items;
        },

        buildBackButton: function ( data, config ) {
            var button = "";

            button += "<a class='content-nav-back petite-text'";
            button += "href='" + data.url + "'";
            button += "data-icon='&#x2B05;'";
            button += "data-icon-position='before'>";
            button += "<b class='is-hidden'>Return to</b>";
            button += data.label;
            button += "<b class='is-hidden'>Menu</b>";
            button += "</a>";

            return button;
        },

        placeBackButton: function ( button, config ) {
            var context = Admin.verticalNav;

            // Append new nav in wrapper
            config.backButton.html( button );
        },

        removeBackButton: function ( config ) {
            config.backButton.html("");
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
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.secondaryNavigation = {

        config: {
            verticalNavWrapper: $("#vertical-nav-wrapper"),
            navConfig: {}
        },

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} ),
                context = Admin.secondaryNavigation;

            context.bindClick( settings );
        },

        bindClick: function ( config ) {
            config.verticalNavWrapper.on( "click", ".has-children", function ( event ) {
                config.navConfig.url = $(this).attr("href");

                Admin.verticalNav.init.call( $(this), config.navConfig );

                event.preventDefault();
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

    Admin.secondaryNavBack = {

        config: {
            backButton: $("#content-nav-back"),
            navConfig: {
                hideClass: "off-right",
                revealClass: "off-left"
            }
        },

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} ),
                context = Admin.secondaryNavBack;

            context.bindClick( settings );
        },

        bindClick: function ( config ) {
            config.backButton.on( "click", "a", function ( event ) {
                config.navConfig.url = $(this).attr("href");

                Admin.verticalNav.init.call( $(this), config.navConfig );

                event.preventDefault();
            });
        }
    };

    /**
     * Off Canvas
     * -----------------------------------------------------------------------------
     * 
     * Trigger the off-canvas sidebar
     * 
     * @todo 
     */

    Admin.offCanvas = {

        /**
         * Config
         */

        config: {
            targetElems: $(".canvas-trigger"),
            pluginName: "lb_reveal",
            pluginSource: "/resources/c/js/jquery.lb-reveal.min.js",
            pluginOptions: {
                "exclusive": "yes",
                "activeClass": "is-active",
                "visitedClass": "was-active"
            }
        },

        /**
         * Init
         */

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} );

            // Init the Plugin
            Admin.utils.initPlugin( settings );
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

    Admin.dataIcons = {
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
            var context = Admin.dataIcons,
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
     * Off Canvas
     * -----------------------------------------------------------------------------
     * 
     * Trigger the off-canvas sidebar
     * 
     * @todo 
     */

    Admin.contentTree = {

        /**
         * Config
         */

        config: {
            targetElems: $(".content-tree").find(".parent"),
            pluginName: "lb_reveal",
            pluginSource: "/resources/c/js/jquery.lb-reveal.min.js",
            pluginOptions: {
                "exclusive": "yes"
            }
        },

        /**
         * Init
         */

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} );

            // Init the Plugin
            Admin.utils.initPlugin( settings );
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
        Admin.offCanvas.init();
        Admin.dataIcons.init();
        Admin.secondaryNavigation.init();
        Admin.secondaryNavBack.init();
        Admin.contentTree.init();

        $("form").on( "submit", function ( event ) {
            Admin.ajaxForm.init.call( $(this), {
                scrollElem: $(".content-page")
            });
            event.preventDefault();
        });
    };

    Admin.init();

}( jQuery, window.Admin = window.Admin || {}, window.dust ) );
