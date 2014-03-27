(function ( $, window, document, LB, undefined ) {

    "use strict";

    var ScrollFire = function ( elem, userOptions ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
            this.config = userOptions;
            this.metadata = this.$elem.data("scrollfire-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
        };

    ScrollFire.prototype = {
        "defaults": {
            "window": $( window ),
            "onInit": null,
            "events": []
        },

        "initVars": function () {
            this.$window = this.options.window;
            this.oldPosition = this.$window.scrollTop();
        },

        "init": function () {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars.call( this );
            this.bind.call( this );

            return this;
        },

        "bind": function () {
            var self = this;

            self.$window.on( "scroll.scrollfire resize.scrollfire", function onScrollFireChange () {
                self.testEvents.call( self );
            });

            if ( self.oldPosition > 0 ) {
                self.oldPosition = 0;
                self.$window.trigger("scroll.scrollfire");
            }
        },

        "testEvents": function () {
            var self = this,
                events = self.options.events,
                triggerPosition,
                i;

            self.currentPosition = self.$window.scrollTop();

            for ( i = events.length - 1; i >= 0; i -= 1 ) {
                triggerPosition = self.triggerType.call( self, events[ i ] );
                
                if ( ( typeof events[ i ].fired === "undefined" || !events[ i ].fired ) || events[ i ].repeat ) {
                    self.testTrigger.call( self, triggerPosition, i );
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

        "testTrigger": function ( triggerPosition, eventNum ) {
            if (
             ( triggerPosition <= this.currentPosition && triggerPosition >= this.oldPosition )
             ||
             ( triggerPosition >= this.currentPosition && triggerPosition <= this.oldPosition )
            ) {

                // console.log("triggerPosition");
                // console.log(triggerPosition);
                // console.log("this.currentPosition");
                // console.log(this.currentPosition);
                // console.log("this.oldPosition");
                // console.log(this.oldPosition);
                this.triggerEvent.call( this, eventNum );

            }
        },

        "triggerEvent": function ( eventNum ) {
            var events = this.options.events,
                thisEvent = events[ eventNum ];

            thisEvent.event( this.getDirection.call( this ) );

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

    ScrollFire.defaults = ScrollFire.prototype.defaults;

    LB.apps.ScrollFire = ScrollFire;
    

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin("scrollFire", window.LB.apps.ScrollFire);
