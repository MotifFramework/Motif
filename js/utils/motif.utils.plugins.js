/*!
 * Motif Plugin Utilities v0.2.0
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, Motif, undefined ) {

    "use strict";

    /**
     * @module Motif
     * @submodule utils
     * @class plugins
     * @static
     */

    Motif.utils.plugins = {

        /**
         * For maximum convenience for the most basic plugin use cases, 
         * this takes a simple config and starts the `loadPlugin` process 
         * for you (if it knows that elements exist on the page)
         *
         * @method initPlugin
         * @param config {Object} Includes targetElems, pluginName, pluginSource, pluginOptions (Object)
         */
        initPlugin: function ( config ) {

                // Basic plugin config
            var pluginConfig = {
                    name: config.pluginName,
                    url: config.pluginSource,
                    options: config.pluginOptions
                };

            if ( config.targetElems.length ) {

                // Start loading the plugin
                this.loadPlugin( config.targetElems, pluginConfig );
            }
        },

        /**
         * If you know you want to bind a plugin right after you get a 
         * script, this automates it for you by combinding `getScript` 
         * and `bindPlugin`
         * 
         * @method loadPlugin
         * @param target {Object} Target element (jQuery object)
         * @param config {Object} Includes plugin name, URL, and options
         */
        loadPlugin: function ( target, config ) {
            var self = this;

            // Call `getScript` util, passing on plugin name, url, and creating a callback...
            self.getScript( config.name, config.url, function loadPluginCallback() {

                // ...where we call the `bindPlugin` util, passing on the target elem, 
                // plugin name, and options
                self.bindPlugin( target, config.name, config.options );
            });
        },

        /**
         * A slightly altered version of jQuery's `$.getScript` that first 
         * checks if the plugin has been loaded
         * 
         * @method getScript
         * @param name {String} The name of the plugin we're calling
         * @param url {String} Path to the plugin, if it's external
         * @param [callback] {Function} Callback function
         * @return {Boolean}
         */
        getScript: function ( name, url, callback ) {
            var runCallback = typeof callback === "function" ? true : false;

            // If the plugin has not been registered...
            if ( !$.fn[ name ] ) {
                $.getScript( url, function getScriptCallback () {
                    if ( runCallback ) {
                        callback();
                    }
                });

            // If the plugin *has* been registered 
            // and a callback has been provided, run it
            } else if ( runCallback ) {
                callback();
            } else {
                return true;
            }
        },

        /**
         * Bind Plugin
         * Right now, a crazy simple way of initializing a plugin
         * and passing on options
         * 
         * @method bindPlugin
         * @param target {Object}
         * @param plugin {String}
         * @param options {Object}
         */
        bindPlugin: function ( target, plugin, options ) {

            // Ex: $("#elem").pluginName({ option: value });
            target[plugin]( options );
        }
    };

    /**
     * With help from: https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Another-extending-jQuery-boilerplate
     * @module jQuery
     * @method createPlugin
     * @param name {String}
     * @param object {Object}
     */
    $.createPlugin = function ( name, object ) {

        // Extend jQuery's `.fn` with our `name` param
        $.fn[ name ] = function( userOptions ) {
            var args;

            if ( this.length ) {
                return this.each( function eachThis () {

                    // Check if this plugin already has an instance on this
                    var instance = $.data( this, name );

                    if ( instance ) {

                        // If there are user options or no user options, call `init`
                        if ( typeof userOptions === "undefined" || typeof userOptions === "object" ) {
                            instance.init( userOptions );

                        // Check if `userOptions` is a function of our instance
                        } else if ( typeof userOptions === "string" && typeof instance[ userOptions ] === "function" ) {

                            // Copy arguments & remove function name
                            args = Array.prototype.slice.call( arguments, 1 );

                            return instance[ userOptions ].apply( instance, args );

                        // Otherwise, log error
                        } else {
                            console.log( name + ": Method " + userOptions + " does not exist on jQuery." );
                        }
                    } else {
                        instance = $.data( this, name, new object( this ).init( userOptions ) );
                    }
                });
            }
        };
    };

    /**
     * A jQuery "plugin" to call other plugins via the `initPlugin` utility.
     * 
     * @method plugin
     * @param name {String} The name of the plugin you want to grab
     * @param [url] {String} The url of the plugin's file
     * @param [options] {Object} Plugin options
     */

    $.fn.plugin = function ( name, url, options ) {
        var scriptUrl,
            userOptions;

        if ( typeof url === "object" ) {
            scriptUrl =  name + ".min.js";
            userOptions = url;
        } else {
            scriptUrl = url;
            userOptions = options || {};
        }

        Motif.utils.plugins.initPlugin({
            targetElems: $( this ),
            pluginName: name,
            pluginSource: scriptUrl,
            pluginOptions: userOptions
        });

        return this;
    };

}( jQuery, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );