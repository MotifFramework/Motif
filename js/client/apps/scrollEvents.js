(function ( $, window, document, LB, undefined ) {

    "use strict";

    var ScrollEvents = function ( elem, userOptions ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
            this.config = userOptions;
            this.metadata = this.$elem.data("scrollEvents-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
        },
        $document = $( document );

    ScrollEvents.prototype = {
        "defaults": {
            "stickySection": $("#basics__wrapper"),
            "stickyNav": $("#basics__nav"),
            "stickyNavCurrentClass": "is-sticky",
            "stickyNavBottomClass": "isnt-sticky",
            "minWidth": 768,
            "pluginOptions": {

            }
        },

        "initVars": function () {
            // Init Vars
            this.$window = $( window );
            this.$sticky = this.options.stickyNav;
            this.$stickySection = this.options.stickySection;
            this.scrollFireEvents = [];
        },

        "init": function () {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this );
            this.initStickyNav.call( this );

            // Build Events
            this.initScrollFire.call( this );

            return this;
        },

        "initStickyNav": function () {
            var self = this,
                stickyNavTopObject = {
                    "trigger": function () {
                        return self.getStickyNavTop.call( self );
                    },
                    "event": function ( dir ) {
                        self.stickyNavTopEvent.call( self, dir );
                    },
                    "repeat": true
                },
                stickyNavBotObject = {
                    "trigger": function () {
                        return self.getStickyNavBot.call( self );
                    },
                    "event": function ( dir ) {
                        self.stickyNavBotEvent.call( self, dir );
                    },
                    "repeat": true
                };

            this.scrollFireEvents.push( stickyNavTopObject, stickyNavBotObject );
        },

            // Building the Sticky Nav Top Object
            "getStickyNavTop": function () {
                return this.$stickySection.offset().top;
            },

            "stickyNavTopEvent": function ( dir ) {
                var navWidth = this.$sticky.outerWidth();

                if ( this.$window.width() >= this.options.minWidth ) {

                    if ( dir === "down" ) {
                        this.$sticky.outerWidth( navWidth );
                        this.$stickySection.addClass( this.options.stickyNavCurrentClass );
                        this.$sticky
                            .removeClass( this.options.stickyNavBottomClass )
                            .addClass( this.options.stickyNavCurrentClass );
                    } else if ( dir === "up" ) {
                        this.$sticky.removeAttr("style");
                        this.$stickySection.removeClass( this.options.stickyNavCurrentClass );
                        this.$sticky
                            .removeClass( this.options.stickyNavBottomClass )
                            .removeClass( this.options.stickyNavCurrentClass );
                    }
                } else {
                    this.$sticky.removeAttr("style");
                    this.$sticky.removeClass( this.options.stickyNavCurrentClass ).removeClass( this.options.stickyNavBottomClass );
                }
            },

            // Building the Sticky Nav Top Object
            "getStickyNavBot": function () {
                var stickySectionHeight = this.$stickySection.outerHeight(),
                    stickyNavHeight = this.$sticky.outerHeight();

                return this.$stickySection.offset().top + stickySectionHeight - stickyNavHeight;
            },

            "stickyNavBotEvent": function ( dir ) {
                var navWidth = this.$sticky.outerWidth();

                if ( this.$window.width() >= this.options.minWidth ) {

                    if ( dir === "up" ) {
                        this.$sticky.outerWidth( navWidth );
                        this.$sticky
                            .removeClass( this.options.stickyNavBottomClass )
                            .addClass( this.options.stickyNavCurrentClass );
                    } else if ( dir === "down" ) {
                        this.$sticky.removeAttr("style");
                        this.$sticky
                            .removeClass( this.options.stickyNavCurrentClass )
                            .addClass( this.options.stickyNavBottomClass );
                    }
                } else {
                    this.$sticky.removeAttr("style");
                    this.$sticky.removeClass( this.options.stickyNavCurrentClass ).removeClass( this.options.stickyNavBottomClass );
                }
            },

        "initScrollFire": function () {
            var self = this;

            self.$elem.plugin("scrollFire", {
                "events": self.scrollFireEvents
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