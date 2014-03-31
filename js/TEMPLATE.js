(function ( $, window, document, Motif, undefined ) {

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

    Motif.apps.PLUGIN = PLUGIN;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "PLUGIN", window.Motif.apps.PLUGIN );