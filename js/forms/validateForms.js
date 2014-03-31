(function ( $, window, document, LB, undefined ) {

    "use strict";

    /**
     * Validate Forms
     * -----------------------------------------------------------------------------
     * 
     * Client-side form validation with the `lb_validation` plugin
     * 
     * @todo 
     */

    LB.apps.validateForms = {

        /**
         * Config
         */

        config: {
            forms: $("[data-validation='true']"),
            pluginName: "lb_validation",
            pluginSource: "/resources/c/js/jquery.lb-validation.min.js",
            ajaxSubmit: true,
            ajaxConfig: {}
        },

        /**
         * Init
         * If the page needs validation, get the plugin rolling
         */

        init: function ( config ) {
            var context = LB.apps.validateForms,

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
         * @todo Use `LB.utils.plugins.getScript` directly instead of this?
         */

        getPlugin: function ( config ) {

            // Call `getScript` util
            LB.utils.plugins.getScript( config.pluginName, config.pluginSource, function bindValidationPlugin() {

                // ...then call a custom `bindPlugin`
                LB.apps.validateForms.bindPlugin( config );
            });
        },

        /**
         * Bind Plugin
         * First checks if we need to build the `ajaxSubmit` 
         * function, then calls `LB.utils.plugins.bindPlugin`
         */

        bindPlugin: function ( config ) {
            var context = LB.apps.validateForms,

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
            LB.utils.plugins.bindPlugin( config.forms, config.pluginName, pluginSettings );
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
                LB.apps.ajaxForm.init.call( $(this), config.ajaxConfig );
            };
        }
    };

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );