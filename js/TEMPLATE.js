/*!
 * PLUGIN v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 * 
 * @author AUTHOR <EMAIL>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var PLUGIN = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];

            return this;
        },
        $document = $( document );

    PLUGIN.prototype = {
        "defaults": {
            
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );

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