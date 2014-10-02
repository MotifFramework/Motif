/*!
 * Motif Sidekick v0.1.0
 * A basic sticky sidebar built on Motif Herald
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Sidekick = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    Sidekick.counter = 0;

    Sidekick.prototype = {
        "defaults": {
            "context": false,
            "stickyClass": "is-sticky",
            "stuckClass": "was-sticky",
            "topOffset": null,
            "bottomOffset": null,
            "keepWidth": true,
            "minWidth": false,
            "window": $( window )
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this, userOptions );
            this.bindEvents.call( this );
            this.buildEvents.call( this );
            this.initHerald.call( this );
            Sidekick.counter += 1;

            return this;
        },

            "initVars": function ( userOptions ) {
                this.config = userOptions;
                this.metadata = this.$elem.data("sidekick-options");
                this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

                if ( this.options.context ) {
                    this.$context = this.options.context;
                } else {
                    this.$context = this.$elem.parent();
                }

                this.identity = this.$elem.attr("id") || "sidekick-" + Sidekick.counter;
                this.$window = this.options.window;
                this.heraldEvents = [];
            },

            "bindEvents": function () {
                var self = this;

                $document.on("sidekick/" + self.identity + "/top", function onStickyTop ( event, dir ) {
                    self.topEvent.call( self, dir );
                });

                $document.on("sidekick/" + self.identity + "/bottom", function onStickyBottom ( event, dir ) {
                    self.bottomEvent.call( self, dir );
                });
            },

            "buildEvents": function () {
                var self = this,
                    topObject = {
                        "trigger": function () {
                            return self.getTopPosition.call( self );
                        },
                        "event": function ( dir ) {
                            $document.trigger( "sidekick/" + self.identity + "/top", [ dir ] );
                        },
                        "repeat": true
                    },
                    bottomObject = {
                        "trigger": function () {
                            return self.getBottomPosition.call( self );
                        },
                        "event": function ( dir ) {
                            $document.trigger( "sidekick/" + self.identity + "/bottom", [ dir ] );
                        },
                        "repeat": true
                    };

                self.heraldEvents.push( topObject, bottomObject );

                return self.heraldEvents;
            },

                "getTopPosition": function () {
                    if ( typeof this.options.topOffset === "function" ) {
                        return this.options.topOffset.call( this );
                    } else {
                        return this.$context.offset().top;
                    }
                },

                "topEvent": function ( dir ) {

                    var sideWidth = this.options.keepWidth ? this.$elem.outerWidth() : false;

                    if ( !this.options.minWidth || (this.options.minWidth && this.$window.width() >= this.options.minWidth) ) {
                        if ( dir === "down" ) {
                            this.stick.call( this, sideWidth );
                        } else if ( dir === "up" ) {
                            this.unstick.call( this );
                        }
                    } else {
                        this.unstick.call( this );
                    }
                },

                "getBottomPosition": function () {
                    if ( typeof this.options.bottomOffset === "function" ) {
                        return this.options.bottomOffset.call( this );
                    } else {
                        return this.$context.offset().top + this.$context.outerHeight() - this.$elem.outerHeight();
                    }
                },

                "bottomEvent": function ( dir ) {

                    var sideWidth = this.options.keepWidth ? this.$elem.outerWidth() : false;

                    if ( !this.options.minWidth || (this.options.minWidth && this.$window.width() >= this.options.minWidth) ) {
                        if ( dir === "up" ) {
                            this.stick.call( this, sideWidth );
                        } else if ( dir === "down" ) {
                            this.stuck.call( this );
                        }
                    } else {
                        this.unstick.call( this );
                    }
                },

                    "stick": function ( sideWidth ) {
                        if ( sideWidth ) {
                            this.$elem.outerWidth( sideWidth );
                        }

                        this.$context.addClass( this.options.stickyClass );
                        this.$elem.removeClass( this.options.stuckClass ).addClass( this.options.stickyClass );
                    },

                    "unstick": function () {
                        this.$context.removeClass( this.options.stickyClass );
                        this.$elem.removeAttr("style").removeClass( this.options.stuckClass + " " + this.options.stickyClass );
                    },

                    "stuck": function () {
                        this.$elem.removeAttr("style").removeClass( this.options.stickyClass ).addClass( this.options.stuckClass );
                    },

            "initHerald": function () {
                var self = this;

                self.$context.plugin("herald", {
                    "window": this.$window,
                    "events": self.heraldEvents
                });
                console.log(self.heraldEvents);
            }
    };

    Sidekick.defaults = Sidekick.prototype.defaults;

    Motif.apps.Sidekick = Sidekick;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "sidekick", window.Motif.apps.Sidekick );