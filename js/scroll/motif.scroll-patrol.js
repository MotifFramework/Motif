/*!
 * Motif Scroll Patrol v0.1.0
 * A basic navigation scroll "spy" built on Motif Herald
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var ScrollPatrol = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    ScrollPatrol.prototype = {
        "defaults": {
            "ignore": false,
            "topOffset": null,
            "bottomOffset": null,
            "minWidth": false,
            "currentClass": "is-current",
            "offset": 0,
            "window": $( window )
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this, userOptions );
            this.getTargets.call( this );
            this.bindLinks.call( this );
            this.initHerald.call( this );

            return this;
        },

            "initVars": function ( userOptions ) {
                this.config = userOptions;
                this.metadata = this.$elem.data("scroll-patrol-options");
                this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
                this.$window = this.options.window;
                this.$links = this.$elem.find("a");
                this.targets = [];
                this.heraldEvents = [];
            },

            "getTargets": function () {
                var self = this;

                self.$links.each( function eachScrollPatrolLink () {
                    var link = $( this ),
                        target = $( link.attr("href") );

                    if ( target.length ) {
                        self.targets.push({
                            "identity": target.attr("id"),
                            "link": link,
                            "target": target
                        });
                    }
                });

                return self.targets;
            },

            "bindLinks": function () {
                var self = this,
                    i;

                for ( i = self.targets.length - 1; i >= 0; i -= 1 ) {
                    self.bindEvents.call( self, self.targets[ i ] );
                    self.buildEvents.call( self, self.targets[ i ] );
                }
            },

            "bindEvents": function ( object ) {
                var self = this;

                $document.on( "scroll-patrol/" + object.identity + "/top", function onScrollPatrolTop ( event, dir ) {
                    self.topEvent.call( self, object.link, dir );
                });

                $document.on( "scroll-patrol/" + object.identity + "/bottom", function onScrollPatrolBottom ( event, dir ) {
                    self.bottomEvent.call( self, object.link, dir );
                });
            },
                "buildEvents": function ( object ) {
                    var self = this,
                        topObject = {
                            "trigger": function () {
                                return self.getTopPosition.call( self, object.target );
                            },
                            "event": function ( dir ) {
                                $document.trigger( "scroll-patrol/" + object.identity + "/top", [ dir ] );
                            },
                            "repeat": true
                        },
                        bottomObject = {
                            "trigger": function () {
                                return self.getBottomPosition.call( self, object.target );
                            },
                            "event": function ( dir ) {
                                $document.trigger( "scroll-patrol/" + object.identity + "/bottom", [ dir ] );
                            },
                            "repeat": true
                        };

                    self.heraldEvents.push( topObject, bottomObject );

                    return self.heraldEvents;
                },

                "getTopPosition": function ( target ) {
                    if ( typeof this.options.topOffset === "function" ) {
                        return this.options.topOffset.call( this );
                    } else {
                        return target.offset().top - this.options.offset;
                    }
                },

                "topEvent": function ( elem, dir ) {
                    if ( this.options.minWidth && this.$window.width() >= this.options.minWidth ) {
                        if ( dir === "down" ) {
                            this.makeActive.call( this, elem );
                        } else if ( dir === "up" ) {
                            this.makeInactive.call( this, elem );
                        }
                    } else {
                        this.makeInactive.call( this, elem );
                    }
                },

                    "makeActive": function ( elem ) {
                        elem.addClass( this.options.currentClass );
                    },

                    "makeInactive": function ( elem ) {
                        elem.removeClass( this.options.currentClass );
                    },

                "getBottomPosition": function ( target ) {
                    if ( typeof this.options.bottomOffset === "function" ) {
                        return this.options.bottomOffset.call( this );
                    } else {
                        return target.offset().top + target.outerHeight() - this.options.offset;
                    }
                },

                "bottomEvent": function ( elem, dir ) {
                    if ( this.options.minWidth && this.$window.width() >= this.options.minWidth ) {
                        if ( dir === "up" ) {
                            this.makeActive.call( this, elem );
                        } else if ( dir === "down" ) {
                            this.makeInactive.call( this, elem );
                        }
                    } else {
                        this.makeInactive.call( this, elem );
                    }
                },

            "initHerald": function () {
                var self = this;

                self.$elem.plugin("herald", {
                    "window": this.$window,
                    "events": self.heraldEvents
                });
            }
    };

    ScrollPatrol.defaults = ScrollPatrol.prototype.defaults;

    Motif.apps.ScrollPatrol = ScrollPatrol;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "scrollPatrol", window.Motif.apps.ScrollPatrol );