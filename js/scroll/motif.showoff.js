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

        "initVars" : function ( userOptions ) {
            
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this, userOptions );
            // this.bind.call( this );

            return this;
        }
    };

    Showoff.defaults = Showoff.prototype.defaults;

    Motif.apps.Showoff = Showoff;
    

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin("showoff", window.Motif.apps.Showoff);

/*

## Features:
    - No Options Passed $('a').showoff(); || $('li').showoff();
        - Looks for any <a href="#someanchor" || data-target="someanchor"> & then trys to match it with an ID somewhere on the page
        - Smart enough to remove the '#' from eiter attr mentioned above
    - Can accept a single string as a target to be scrolled to
    - 

    - Later... Integrate with Greensock to do animations

## Callbacks
    - Oninit
    - Onscroll
    - BeforeScroll
    - AfterScroll

## Options
    - Animation Time : integer
    - Easing type : string
    - GreenSock: {}

*/
