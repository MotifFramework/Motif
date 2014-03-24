(function ( $, window, document, LB, undefined ) {

    "use strict";

    var PLUGIN = function ( elem, userOptions ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
            this.config = userOptions;
            this.metadata = this.$elem.data("PLUGIN-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
        },
        $document = $( document );

    PLUGIN.prototype = {
        "defaults": {
            
        },

        "initVars": function () {
            // Init Vars
        },

        "init": function () {
            if ( !this.$elem.length ) {
                return;
            }

            return this;
        }
    };

    PLUGIN.defaults = PLUGIN.prototype.defaults;

    LB.apps.PLUGIN = PLUGIN;

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "PLUGIN", window.LB.apps.PLUGIN );