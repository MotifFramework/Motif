/*!
 * Motif Herald v0.2.1
 * Fire off events depending on scroll position.
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Showoff = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        };

    Showoff.prototype = {
        "defaults": {
            "window": $( window ),
            "onInit": null,
        },

        init: function () {
            console.log("hello from Showoff");
        }
    };

    Showoff.defaults = Showoff.prototype.defaults;

    Motif.apps.Showoff = Showoff;
    

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin("showoff", window.Motif.apps.Showoff);
