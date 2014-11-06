/*!
 * Motif Reveal v2.0.1
 * Show and hide things with class(es)
 *
 * Reveal accepts single or multiple IDs of target elements and, on click or 
 * hover, adds and removes classes from those target elements as well as the 
 * triggering element. It can group "reveals" so that you can dictate whether 
 * multiple targets can be active at the same time.
 *
 * Reveal keeps track of all these triggers and targets and states by creating
 * a "reference" in a `window.Reveal` object. You can see a model of that
 * reference at the bottom of this file. This allows us to be able to track
 * and manipulate these reveals outside of this plugin. In future development,
 * we will also be able to guarantee that targets of multiple reveals and 
 * groups will retain their appropriate state.
 * 
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Reveal = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];
        },
        $document = $( document );

    Reveal.counter = 0;

    Reveal.animationFrame = typeof window.requestAnimFrame === "function" ? true : false;

    Reveal.prototype = {
        "defaults": {
            "trigger": "click",
            "type": "default",
            "target": "data-reveal",

            // Classes
            "activeClass": "is-current",
            "visitedClass": "is-visited",

            // Hover Intent
            "hoverIntent": null,

            // Callbacks
            "onInit": null,
            "beforeReveal": null,
            "onShow": null,
            "onHide": null,
            "returns": false
        },

        /**
         * Create a new target for the reference
         * @param  {object} elem
         * @return {object}
         */
        "newReferenceTarget": function ( elem ) {
            return {
                "elem": elem,
                "targets": [],
                "fors": [],
                "hide": [],
                "current": false
            };
        },

        /**
         * Create a new group for the reference
         * @return {object}
         */
        "newReferenceGroup": function () {
            return {
                "type": this.options.type,
                "triggers": []
            };
        },

        /**
         * Initialize the instance
         * @param  {object} userOptions
         * @return {object}
         */
        "init": function ( userOptions ) {
            this.initVars.call( this, userOptions );

            // Create window.Reveal reference table
            this.createReference.call( this );

            // Bind optional callbacks
            this.bindCallbacks.call( this );

            // Bind this reveal trigger
            this.bindTrigger.call( this );

            // Make sure trigger targets are listening
            this.bindTargets.call( this );

            // Initialize this trigger
            this.initTrigger.call( this );

            // Update the reveal counter, which we use
            // for naming in the reference table
            Reveal.counter += 1;

            // Finally, trigger this reveal as initialized
            // for any listening callbacks
            $document.trigger("reveal/" + this.identity + "/init");

            return this;
        },

        /**
         * Initialize the variables
         * @param  {object} userOptions
         */
        "initVars": function ( userOptions ) {
            this.identity = this.$elem.attr("id") || "reveal-target-" + Reveal.counter;
            this.group = this.$elem.attr("data-reveal-group") || false;
            this.reference = false;
            this.config = userOptions;
            this.metadata = this.$elem.data("reveal-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
        },

        /**
         * Create the Reveal reference in the window
         */
        "createReference": function () {

            // If the reference table doesn't exist...
            if ( !window.Reveal ) {

                // Create it
                window.Reveal = {
                    "triggers": {},
                    "groups": {},
                    "queue": []
                };
            }
        },

        /**
         * Subscribe to Reveal events if the user has
         * passed any callbacks
         */
        "bindCallbacks": function () {
            var self = this;

            // Check if any of the callbacks are actual
            // functions, then have the document watch
            // for their triggers
            if ( typeof self.options.onInit == "function" ) {
                $document.on("reveal/" + self.identity + "/init", function onRevealInit () {
                    self.options.onInit.call( self, self.$elem );
                });
            }
            if ( typeof self.options.onShow == "function" ) {
                $document.on("reveal/" + self.identity + "/after/show", function onRevealShow () {
                    self.options.onShow.call( self, self.$elem );
                });
            }
            if ( typeof self.options.onHide == "function" ) {
                $document.on("reveal/" + self.identity + "/after/hide", function onRevealHide () {
                    self.options.onHide.call( self, self.$elem );
                });
            }
        },

        /**
         * Bind the user-specified trigger (click or hover)
         * to process on activation
         */
        "bindTrigger": function () {
            var self = this;

            // If we have a click trigger...
            if ( self.options.trigger === "click" ) {

                // Bind this trigger on click
                self.$elem.on( "click", function () {
                    // HERE

                    // ...to process the trigger
                    self.processBeforeTrigger.call( self );

                    // ...and return based on the user's preference
                    return self.options.returns;
                });

            // Otherwise, if it's a hover trigger...
            } else if ( self.options.trigger === "hover" ) {

                // If the Hover Intent plugin is available...
                if ( $.fn.hoverIntent && self.options.hoverIntent ) {

                    // ...use it!
                    self.$elem.hoverIntent({
                        sensitivity: self.options.hoverIntent.sensitivity,
                        interval: self.options.hoverIntent.interval,
                        over: function onRevealOver () {
                            self.processBeforeTrigger.call( self );
                        },
                        timeout: self.options.hoverIntent.timeout,
                        out: function onRevealOut () {
                            self.processBeforeTrigger.call( self );
                        }
                    });

                // Otherwise...
                } else {

                    // ... Do a simple bind...
                    self.$elem.on({
                        mouseenter: function onRevealOver () {
                            self.processBeforeTrigger.call( self );
                        },
                        mouseleave: function onRevealOut () {
                            self.processBeforeTrigger.call( self );
                        }
                    });
                }
            }
        },

            /**
             * Determine what kind of action we are
             * about to take
             * @return {boolean|string}
             */
            "getAction": function () {
                // If this trigger is already current...
                if ( this.reference.current === true ) {

                    // Check if it's a radio
                    if ( this.options.type === "radio" ) {

                        // If it is, let's ignore and bail
                        return false;

                    // If it's NOT a radio...
                    } else {

                        // ...we should hide
                        return "hide";
                    }

                // If it's NOT current
                } else {

                    // ...let's show
                    return "show";
                }
            },

            /**
             * Set a promise if user has specified a `beforeReveal` check
             */
            "processBeforeTrigger": function () {
                var self = this,
                    action = self.getAction.call( self );

                /**
                 * Bail early if the trigger results in no action
                 */
                if ( !action ) {
                    return;
                }
                if ( typeof this.options.beforeReveal === "function" ) {

                    /**
                     * Set a promise before triggering the reveal
                     */
                    this.promiseBeforeTrigger( this.options.beforeReveal, action )
                        .done( function () {
                            self.processTrigger.call( self, action );
                        })
                        .fail( function () {
                            return false;
                        });
                } else {
                    /**
                     * Otherwise process the trigger right away
                     */
                    this.processTrigger( action );
                }
            },

            /**
             * Determine whether to publish or unpublish
             * @param  {string} action - Either "show" or "hide"
             */
            "processTrigger": function ( action ) {
                if ( action === "show" ) {
                    this.publish.call( this );
                } else if ( action === "hide" ) {
                    this.unpublish.call( this );
                }
            },

                /**
                 * "Publish" a reveal while unpublishing old ones
                 */
                "publish": function () {
                    var self = this,
                        oldCurrents = [],
                        key;

                    // If this is part of a group and it's either 
                    // exclusive or radio...
                    // @TODO: Move this up to processTrigger()?
                    if ( self.group && self.options.type !== "default" ) {

                        // Get the "old" current elements
                        oldCurrents = self.getCurrent.call( self, window.Reveal.groups[ self.group ].triggers );


                        // Go through each "old" current
                        $.each( oldCurrents, function ( index, value ) {

                            // Trigger a hide event for each of them.
                            // We don't want them no more.
                            self.unpublish.call( self, value );
                        });
                    }

                    // Turn new current on
                    $document.trigger("reveal/" + this.identity + "/show");
                },

                /**
                 * Unpublish the reveal
                 * @param  {string} val
                 */
                "unpublish": function ( val ) {

                    // If a value was passed, use it,
                    // otherwise, use the identity value
                    var identity = val || this.identity;

                    // Trigger hide on this identity
                    $document.trigger("reveal/" + identity + "/hide");
                },

        /**
         * Bind the internal custom show/hide events
         */
        "bindTargets": function () {
            var self = this;

            // When this identity has triggered to show...
            $document.on("reveal/" + self.identity + "/show", function onRevealShow () {

                // ...launch the Show sequence
                self.showSequence.call( self );
            });

            // When this identity has triggered to hide...
            $document.on("reveal/" + self.identity + "/hide", function onRevealHide () {

                // ...launch the Hide sequence
                self.hideSequence.call( self );
            });
        },

            /**
             * Create the Promise object, call the user's function,
             * passing on the Promise, then return that Promise
             * @param  {function} fn
             * @param  {string}   action
             * @return {object}
             */
            "promiseBeforeTrigger": function ( fn, action ) {
                var deferred = new $.Deferred();

                fn.call( this, this.$elem, action, deferred );

                return deferred.promise();
            },

            /**
             * Sequence of the events to "show" our target
             */
            "showSequence": function () {
                $document.trigger("reveal/" + this.identity + "/before/show");

                // Make this trigger current in the reference
                this.makeCurrent();

                // Show this trigger visually
                this.showTrigger();

                // Show the targets visually
                this.showTargets();

                // Show the Fors visually
                this.showFors();

                // Trigger onShow
                $document.trigger("reveal/" + this.identity + "/after/show");
            },

            /**
             * Sequence of events to "hide" our target
             */
            "hideSequence": function () {

                // Trigger onHide
                $document.trigger("reveal/" + this.identity + "/before/hide");

                // Make this trigger no longer current in the reference
                this.unmakeCurrent();

                // Visually hide the trigger
                this.hideTrigger();

                // Visually hide the targets
                this.hideTargets();

                // Visually hide the Fors
                this.hideFors();

                // Trigger onHide
                $document.trigger("reveal/" + this.identity + "/after/hide");
            },

        /**
         * Sets this reveal as "current" on init
         */
        "initCurrent": function () {

            // This element has the current attribute set to true...
            if ( this.$elem.attr("data-reveal-current") === "true" ) {
                this.setCurrent();
            }
        },

        /**
         * Reveals the current element, unless it's part of a
         * group. Then it pushes it into a queue until all of
         * the group has been accounted for, so that they can
         * listen
         */
        "setCurrent": function () {
            if ( this.group ) {
                window.Reveal.queue.push( this.identity );
            } else {

                // Make it Current
                this.makeCurrent();

                // Then publish
                this.publish();
            }
        },

        /**
         * Execute the queue for this reveal group
         */
        "executeQueue": function () {
            var queue = window.Reveal.queue;

            /**
             * If there's anything in the queue, loop through it
             * and trigger a show for each one
             */
            if ( queue.length ) {
                $.each( queue, function ( i, v ) {
                    $document.trigger("reveal/" + queue[ i ] + "/show");
                });
            }

            // Clear queue
            window.Reveal.queue = [];

            $document.trigger("reveal/queue/done");
        },

        /**
         * Update the reference to make current true
         */
        "makeCurrent": function () {
            this.updateReference.call( this, {
                "current": true
            });
        },

        /**
         * Update the reference to make current false
         */
        "unmakeCurrent": function () {
            this.updateReference.call( this, {
                "current": false
            });
        },

        /**
         * Get the "current" out of this Reveal group
         * @param  {array} group
         * @return {array}
         */
        "getCurrent": function ( group ) {
            var reference = window.Reveal.triggers,
                currents = [];

            /**
             * In this group, if the reference has any
             * of these triggers as true, push it into
             * the currents gorup
             */
            $.each( group, function ( i, v ) {
                if ( reference[ group[ i ] ].current ) {
                    currents.push( group[ i ] );
                }
            });

            return currents;
        },

        /**
         * Initialize this new trigger
         */
        "initTrigger": function () {
            var self = this;
            
            /**
             * Create a new reference for this trigger
             * and check if it is "current"
             */
            this.updateReference.call( this, {
                "targets": this.gatherTargets.call( this ),
                "fors": this.gatherForTriggers.call( this ),
                "hide": this.gatherHideTriggers.call( this )
            });
            self.initCurrent.call( self );
        },

        "gatherTargets": function () {
            var targetStrings,
                targets;

            if ( this.options.target.constructor === Array && this.options.target.length ) {
                targets = this.options.target;
            } else if ( typeof this.options.target === "function" ) {
                targets = this.options.target;
            } else {
                targetStrings = this.$elem.attr( this.options.target ).split(" ");
                targets = [];

                $.each( targetStrings, function eachTarget ( i, v ) {
                    var target = $( "#" + targetStrings[i] );

                    if ( !target.length ) {
                        target = function () {
                            var elem = $( "#" + targetStrings[i] );

                            if ( elem.length ) {
                                return elem;
                            } else {
                                return false;
                            }
                        };
                    }

                    targets.push( target );
                });
            }
            return targets;
        },

        "gatherForTriggers": function () {
            var self = this,
                allFors = $("[data-reveal-for='" + this.identity + "']"),
                fors = [];

            $.each( allFors, function eachFor ( i, v ) {
                self.bindFors.call( self, allFors[ i ] );
                fors.push( allFors[ i ] );
            });

            return fors;    
        },

            "bindFors": function ( forTrigger ) {
                var self = this;

                $( forTrigger ).on( "click", function () {
                    self.$elem.trigger("click");
                    return false;
                });
            },

        "gatherHideTriggers": function () {
            var self = this,
                allHides = $("[data-reveal-hide='" + this.identity + "']"),
                hides = [];

            $.each( allHides, function eachFor ( i, v ) {
                self.bindHides.call( self, allHides[ i ] );
                hides.push( allHides[ i ] );
            });

            return hides;   
        },

            "bindHides": function ( hideTrigger ) {
                var self = this;
                $( hideTrigger ).on( "click", function () {
                    if ( self.reference.current && self.options.type !== "radio" ) {
                        self.$elem.trigger("click");
                    }
                    return false;
                });
            },

        "gatherGroup": function () {
            var groupID = this.$elem.data("reveal-group");

            this.$group = groupID ? $("[data-reveal-group='" + groupID + "']") : false;
        },

        "addClass": function ( elem, userClass ) {
            if ( Reveal.animationFrame ) {
                requestAnimFrame( function () {
                    elem.addClass( userClass );
                });
            } else {
                elem.addClass( userClass );
            }
        },

        "removeClass": function ( elem, userClass ) {
            if ( Reveal.animationFrame ) {
                requestAnimFrame( function () {
                    elem.removeClass( userClass );
                });
            } else {
                elem.removeClass( userClass );
            }
        },

        "show": function ( elem ) {
            this.addClass( elem, this.options.activeClass );
        },

            "showTargets": function () {
                var self = this,
                    targets = typeof self.reference.targets === "function" ? self.reference.targets.call( self ) : self.reference.targets;

                $.each( targets, function hideEachTarget () {
                    self.show.call( self, this );
                });
            },

            "showFors": function () {
                var self = this,
                    fors = self.reference.fors;

                $.each( fors, function showEachFor () {
                    self.show.call( self, $( this ) );
                });
            },

            "showTrigger": function () {
                this.show.call( this, this.$elem );
            },

        "hide": function ( elem ) {
            this.removeClass( elem, this.options.activeClass );

            if ( !elem.hasClass( this.options.visitedClass ) ) {
                this.addClass( elem, this.options.visitedClass );
            }
        },

            "hideTargets": function () {
                var self = this,
                    targets = typeof self.reference.targets === "function" ? self.reference.targets.call( self ) : self.reference.targets;

                $.each( targets, function hideEachTarget () {
                    self.hide.call( self, this );
                });
            },

            "hideFors": function () {
                var self = this,
                    fors = self.reference.fors;

                $.each( fors, function hideEachFor () {
                    self.hide.call( self, $( this ) );
                });
            },

            "hideTrigger": function () {
                this.hide.call( this, this.$elem );
            },

        "updateReference": function ( config ) {
            var self = this,
                updates = config || {},
                reference = window.Reveal,
                referenceGroup = self.group ? reference.groups[ self.group ] : false,
                referenceTrigger = reference.triggers[ self.identity ];

            // If it is part of a group
            // @TODO: Break out group and trigger reference builder
            if ( self.group ) {

                // if Group exists
                if ( referenceGroup ) {

                    if ( $.inArray( self.identity, referenceGroup.triggers ) === -1 ) {
                        referenceGroup.triggers.push( self.identity );
                    }
                } else {
                    reference.groups[ self.group ] = self.newReferenceGroup.call( self );
                    reference.groups[ self.group ].triggers.push( self.identity );
                }
            }

            if ( referenceTrigger ) {

                // If it is, extend the current trigger
                // object with the updates
                $.extend( true, referenceTrigger, updates );

            // If the trigger does not yet exist in
            // the reference, create it
            } else {

                // Then make sure the updates are applied
                reference.triggers[ this.identity ] = $.extend( true, {}, this.newReferenceTarget.call( this, this.$elem ), updates );
            }

            this.reference = reference.triggers[ this.identity ];

            return this.reference;

        }
    };

    Reveal.defaults = Reveal.prototype.defaults;

    Motif.apps.Reveal = Reveal;

    $.fn["reveal"] = function( userOptions ) {
        var self = this,
            args;

        if ( self.length ) {
            return self.each( function ( index, elem ) {
                var instance = $.data( this, "reveal" );
                if ( instance ) {
                    if ( typeof userOptions === 'undefined' || typeof userOptions === 'object' ) {
                        instance.init( userOptions );
                    } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {

                        // copy arguments & remove function name
                        args = Array.prototype.slice.call( arguments, 1 );

                        // call the method
                        return instance[ userOptions ].apply( instance, args );

                    } else {

                        console.log( "Reveal: Method " + arg + " does not exist on jQuery." );

                    }
                } else {
                    instance = $.data( this, "reveal", new Reveal( this ).init( userOptions ) );
                }
                if ( self.length - 1 === index ) {
                    instance.executeQueue.call( self );
                }
            });
        }
    };


}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );


/*

Model of what the Reveal Reference will look like:

window: {
    Reveal: {
        "triggers": {
            "TRIGGER": {
                "elem": $object,
                "targets": [
                    "TARGET",
                    "TARGET",
                    "TARGET"
                ],
                "for": [
                    $object
                ],
                "current": true
            },
            "TRIGGER": {
                "elem": $object,
                "targets": [
                    "TARGET",
                    "TARGET",
                    "TARGET"
                ],
                "for": null,
                "current": false
            }
        },
        "groups": {
            "GROUPNAME": {
                "type": exclusive,
                "triggers": [
                    "TRIGGER",
                    "TRIGGER",
                    "TRIGGER",
                    "TRIGGER"
                ]
            }
        },
        queue: []
    }
}

*/
