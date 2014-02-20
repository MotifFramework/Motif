(function ( $, window, LB, undefined ) {

    "use strict";

    function CLASS ( userOptions ) {

        var defaults = {
                "elem": "ELEM"
            };

        // Init
        function init() {
            this.initVars( defaults, userOptions );
            this.initBinds();
            this.initBuild();
        }

        /**
        * Instance vars
        */

        // Use 'this' because we are in our
        // constructor... the context is our
        // instance
        this.options = {};

        // Go ahead and start everything
        init();
    }

    CLASS.prototype = {
        initVars: function ( defaults, userOptions ) {

            // Merge default options with user
            this.options = $.extend( true, {}, defaults, userOptions );

            // Set elem vars
            this.$elem = $( this.options.elem );
            this.elem = this.$elem[0];

            if ( !this.$elem.length ) {
                return;
            }
        },

        initBinds: function () {
            
        },

        initBuild: function () {
            
        }
    };

    LB.apps.CLASS = CLASS;

}( jQuery, window, window.LB = window.LB || { apps: {} } ) );
