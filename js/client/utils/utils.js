(function ( $, LB, undefined ) {

    "use strict";

    /**
     * Utilities
     * -----------------------------------------------------------------------------
     * 
     * General utilities that other functions might need to use
     * 
     * @todo 
     */

    LB.utils.plugins = {

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
                LB.utils.plugins.loadPlugin( config.targetElems, pluginConfig );
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
            LB.utils.plugins.getScript( config.name, config.url, function loadPluginCallback() {

                // ...where we call the `bindPlugin` util, passing on the target elem, 
                // plugin name, and options
                LB.utils.plugins.bindPlugin( target, config.name, config.options );
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
                loadScript( url, function getScriptCallback () {

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

    $.createPlugin = function ( name, object ) {
        $.fn[ name ] = function( userOptions ) {
            var args;

            if ( this.length ) {
                return this.each( function () {
                    var instance = $.data( this, name );
                    if ( instance ) {
                        if ( typeof userOptions === 'undefined' || typeof userOptions === 'object' ) {
                            instance.init( userOptions );
                        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {

                            // copy arguments & remove function name
                            args = Array.prototype.slice.call( arguments, 1 );

                            // call the method
                            return instance[ userOptions ].apply( instance, args );

                        } else {

                            console.log( name + ": Method " + arg + " does not exist on jQuery." );

                        }
                    } else {
                        instance = $.data( this, name, new object( this ).init( userOptions ) );
                    }
                });
            }
        };
    };

    /**
     * Plugin Wrapper
     * A jQuery "plugin" to call other plugins via the
     * `initPlugin` utility.
     */

    $.fn.plugin = function ( name, url, options ) {
        var scriptUrl,
            userOptions;

        if ( typeof url === "object" ) {
            scriptUrl = "/resources/c/js/" + name + ".min.js";
            userOptions = url;
        } else {
            scriptUrl = url;
            userOptions = options || {};
        }

        LB.utils.plugins.initPlugin({
            targetElems: $( this ),
            pluginName: name,
            pluginSource: scriptUrl,
            pluginOptions: userOptions
        });

        return this;
    };

}( jQuery, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );