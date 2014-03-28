(function ( $, window, document, LB, undefined ) {

    "use strict";

    var PLUGIN = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    PLUGIN.prototype = {
        "defaults": {
            
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this );

            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("PLUGIN-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
        }
    };

    PLUGIN.defaults = PLUGIN.prototype.defaults;

    LB.apps.PLUGIN = PLUGIN;

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "PLUGIN", window.LB.apps.PLUGIN );