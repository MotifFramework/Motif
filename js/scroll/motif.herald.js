/*!
 * Motif Herald v0.2.1
 * Fire off events depending on scroll position.
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Herald = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        };

    Herald.prototype = {
        "defaults": {
            "window": $( window ),
            "onInit": null,
            "events": []
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("herald-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.$window = this.options.window;
            this.oldPosition = this.$window.scrollTop();
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this, userOptions );
            this.bind.call( this );

            return this;
        },

        "bind": function () {
            var self = this;

            self.$window.on( "scroll.herald", function onHeraldChange () {
                self.testEvents.call( self );
            }).on( "resize.herald", function onHeraldResize () {
                self.refresh.call( self );
            });

            self.refresh.call( self );
        },

        "refresh": function () {
            if ( this.oldPosition > 0 ) {
                this.oldPosition = 0;
                this.$window.trigger("scroll.herald");
            }
        },

        "testEvents": function () {
            var self = this,
                events = self.options.events,
                triggerPosition,
                isTriggered = false,
                i;

            self.currentPosition = self.$window.scrollTop();

            for ( i = 0; i < events.length; i += 1 ) {
                triggerPosition = self.triggerType.call( self, events[ i ] );
                
                if ( ( typeof events[ i ].fired === "undefined" || !events[ i ].fired ) || events[ i ].repeat ) {
                    isTriggered = self.testTrigger.call( self, triggerPosition, i );

                    if ( isTriggered ) {
                        self.triggerEvent.call( self, i );
                    }
                }
            }

            self.oldPosition = self.currentPosition;
        },

        "triggerType": function ( thisEvent ) {
            if ( typeof thisEvent.trigger === "function" ) {
                return thisEvent.trigger.call( this );
            } else {
                return thisEvent.trigger;
            }
        },

        "testTrigger": function ( triggerPosition ) {
            if (
             ( triggerPosition <= this.currentPosition && triggerPosition >= this.oldPosition )
             ||
             ( triggerPosition >= this.currentPosition && triggerPosition <= this.oldPosition )
            ) {
                return true;
            }
            return false;
        },

        "triggerEvent": function ( eventNum ) {
            var events = this.options.events,
                thisEvent = events[ eventNum ];

            thisEvent.event.call( this, this.getDirection.call( this ) );

            // Extend the object to reflect that the event has been fired
            thisEvent.fired = true;
            
            if ( !thisEvent.repeat ) {
                events.splice( eventNum, 1 );
            }
        },

        "getDirection": function ( old, current ) {
            var oldPosition = old || this.oldPosition,
                currentPosition = current || this.currentPosition,
                direction;

            if ( currentPosition > oldPosition ) {
                direction = "down";
            } else if ( currentPosition < oldPosition ) {
                direction = "up";
            }

            return direction;
        }

    };

    Herald.defaults = Herald.prototype.defaults;

    Motif.apps.Herald = Herald;
    

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin("herald", window.Motif.apps.Herald);
