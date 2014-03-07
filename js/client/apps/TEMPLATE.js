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

    PLUGIN.counter = 0;

    PLUGIN.prototype = {
        "defaults": {
            
        },

        "init": function () {
            if ( !this.$elem.length ) {
                return;
            }

            return this;
        }
    };

    PLUGIN.defaults = PLUGIN.prototype.defaults;

    $.fn.PLUGIN = function ( userOptions ) {
        return this.each( function ( index, elem ) {
            new PLUGIN( this, userOptions ).init();
        });
    };

    LB.apps.PLUGIN = PLUGIN;

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );