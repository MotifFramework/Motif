(function ( $, window, document, LB, undefined ) {

    "use strict";

    var ScrollEvents = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        };

    ScrollEvents.prototype = {
        "defaults": {

        },

        "initVars": function ( userOptions ) {
            // Init Vars
            this.config = userOptions;
            this.metadata = this.$elem.data("scroll-events-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.$window = $( window );
            this.$sticky = $("#basics__nav");
            this.minWidth = 768;
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this, userOptions );
            this.initStickyNav.call( this );
            this.initScrollPatrol.call( this );

            return this;
        },

        "initStickyNav": function () {
            this.$sticky.plugin("stickySide", {
                "minWidth": this.minWidth,
                "window": this.$window
            });
        },

        "initScrollPatrol": function () {
            this.$sticky.plugin("scrollPatrol", {
                "minWidth": this.minWidth,
                "window": this.$window,
                "offset": 100
            });
        }
    };

    ScrollEvents.defaults = ScrollEvents.prototype.defaults;

    LB.apps.ScrollEvents = ScrollEvents;

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "scrollEvents", window.LB.apps.ScrollEvents );