/*!
 * Motif Tabs v0.2.0 (2014-04-30)
 * Requires Motif Reveal
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 * @todo Autogenerate Tabs Nav, add better History support, add better docs
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    /**
     * @module Motif
     * @submodule apps
     * @class Tabs
     * @constructor
     * @param elem {Object}
     * @param [userOptions] {Object}
     */
    var Tabs = function ( elem, userOptions ) {

            /**
             * @property $elem
             * @type Object
             */
            this.$elem = $( elem );

            /**
             * @property elem
             * @type Object
             */
            this.elem = this.$elem[0];

            return this;
        },
        location = window.location,
        $document = $( document );

    /**
     * @property counter
     * @type Number
     */
    Tabs.counter = 0;

    /**
     * @property hashChangeBound
     * @type Boolean
     */
    Tabs.hashChangeBound = false;

    /**
     * @property onHashChange
     * @type Boolean
     */
    Tabs.onHashChange = false;

    /**
     * @property animationFrame
     * @type Boolean
     */
    Tabs.animationFrame = typeof window.requestAnimFrame === "function" ? true : false;

    Tabs.prototype = {

        /**
         * @property defaults
         * @type Object
         */
        "defaults": {
            "animate": true,
            "cssTransition": true,
            "speed": 300,
            "easing": "swing",
            "history": false,
            "tabsGroup": ".tabs__section",
            "revealOptions": {
                "type": "radio",
                "activeClass": "is-current"
            }
        },

        /**
         * @method init
         * @param [userOptions] {Object}
         * @return {Object}
         */
        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );
            this.bindEvents();
            this.initReveal();

            return this;
        },

        /**
         * @method initVars
         * @param [userOptions] {Object}
         */
        "initVars": function ( userOptions ) {

            /**
             * @property config
             * @type Object
             */
            this.config = userOptions;

            /**
             * @property metadata
             * @type Object
             */
            this.metadata = this.$elem.data("tabs-options");

            /**
             * @property options
             * @type Object
             */
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

            /**
             * @property $triggers
             * @type Object
             */
            this.$triggers = this.gatherTriggers.call( this );

            /**
             * @property $tabs
             * @type Object
             */
            this.$tabs = this.$elem.find( this.options.tabsGroup );

            /**
             * @property group
             * @type String
             */
            this.group = "tabs-group-" + Tabs.counter;

            /**
             * @property initialized
             * @type Boolean
             */
            this.initialized = false;
        },

        /**
         * @method gatherTriggers
         * @return {Object}
         */
        "gatherTriggers": function () {
            return this.$elem.find("nav a");
        },

        /**
         * @method bindEvents
         */
        "bindEvents": function () {
            var self = this;

            if ( self.options.history ) {                    
                $document.on("reveal/queue/done", function tabsInitialized () {
                    self.initialized = true;
                });
                if ( !Tabs.hashChangeBound ) {     
                    window.onhashchange = function () {
                        self.activateFromUrl.call( self );
                    };
                    Tabs.hashChangeBound = true;
                }
            }
        },

        /**
         * @method activateFromUrl
         */
        "activateFromUrl": function () {
            var elem,
                instance;

            if ( !Tabs.onHashChange ) {
                Tabs.onHashChange = true;
                elem = location.hash !== "" ? $("[href='" + location.hash + "']") : false;
                instance = elem.length ? $.data( elem[0], "reveal" ) : false;

                if ( instance ) {
                    instance.processTrigger.call( instance );
                }
                Tabs.onHashChange = false;
            }
        },

        /**
         * Initialize the Motif Reveal plugin with Tab-specific config
         * @method gatherTriggers
         * @return {Object}
         */
        "initReveal": function () {
            this.$triggers.reveal( this.createRevealConfig() );

            Tabs.counter += 1;
        },

        /**
         * Supplement Reveal options for Tab-specific tasks
         * @method createRevealConfig
         * @return {Object}
         */
        "createRevealConfig": function () {
            var self = this;

            self.options.revealOptions.target = function () {
                return self.gatherTargets.call( this );
            };
            self.options.revealOptions.onInit = function () {
                self.prepTabs.call( self, this );
            };
            self.options.revealOptions.onShow = function ( elem ) {
                if ( self.options.history ) {
                    self.updateLocation.call( self, this );
                }
                if ( self.options.animate ) {
                    self.animateTabs.call( self, this );
                }
            };
            self.options.revealOptions.beforeHide = function ( elem ) {
                if ( self.options.history && location.hash === "" ) {
                    self.updateLocation.call( self, this );
                }
                if ( self.options.animate ) {
                    self.prepTransition.call( self, this );        
                }
            };

            return self.options.revealOptions;
        },

        /**
         * @method gatherTargets
         * @return {Array}
         */
        "gatherTargets": function () {
            var targets = [];

            targets.push( $( this.$elem.attr("href") ) );

            return targets;
        },

        /**
         * @method prepTabs
         */
        "prepTabs": function ( instance ) {
            var self = this;

            self.createGroup.call( self, instance );
            self.getCurrentTab.call( self, instance );

            if ( self.options.animate ) {
                if ( self.options.cssTransition ) {
                    if ( !self.$tabs.hasClass("transition-bound") ) {
                        self.transitionEndCss();
                    }
                } else {
                    self.$tabs.addClass("no-transition");
                }
            }
        },

        /**
         * @method createGroup
         * @return {String} The identifying group name
         */
        "createGroup": function ( instance ) {
            instance.group = this.group;
            instance.updateReference.call( instance );

            return instance.group;
        },

        /**
         * @method getCurrentTab
         */
        "getCurrentTab": function ( instance ) {
            var queue = window.Reveal.queue,
                groups = window.Reveal.groups,
                firstTrigger = groups[ instance.group ].triggers[ 0 ];

            if ( this.options.history && location.hash === instance.$elem.attr("href") ) {
                if ( $.inArray( firstTrigger, queue ) > -1 ) {
                    queue.splice( $.inArray( instance.identity, queue ), 1 );
                    window.Reveal.queue = queue;
                }
                instance.setCurrent();

            } else if ( instance.identity === firstTrigger ) {
                instance.setCurrent();
            }
        },

        /**
         * @method transitionEndCss
         */
        "transitionEndCss": function ( e ) {
            var self = this;

            self.$tabs.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function afterAnimateTabs ( e ) {

                if ( e.originalEvent.target === self.$tabs[ 0 ] ) {
                    self.$tabs.removeAttr("style");
                }

            }).addClass("transition-bound");
        },

        /**
         * @method prepTransition
         */
        "prepTransition": function ( instance ) {
            var currentTab = instance.reference.targets[0],
                tabsStyle = this.$tabs.attr("style");

            if ( !tabsStyle ) {
                this.$tabs.outerHeight( currentTab.outerHeight() );
            }
        },

        /**
         * @method updateLocation
         */
        "updateLocation": function ( instance ) {
            if ( this.initialized && !Tabs.onHashChange ) {
                Tabs.onHashChange = true;
                location.hash = instance.$elem.attr("href");
                Tabs.onHashChange = false;
            }
        },

        /**
         * @method animateTabs
         */
        "animateTabs": function ( instance ) {
            var currentTab = instance.reference.targets[ 0 ],
                currentTabHeight = currentTab.outerHeight();

            if ( this.options.cssTransition ) {
                this.animateTabsCss( currentTabHeight );
            } else {
                this.animateTabsJs( currentTabHeight );
            }
        },

        /**
         * @method animateTabsCss
         */
        "animateTabsCss": function ( currentTabHeight ) {
            var self = this;

            if ( self.$tabs.outerHeight() !== currentTabHeight ) {
                if ( Tabs.animationFrame ) {
                    requestAnimFrame( function setTabsHeight () {
                        self.$tabs.outerHeight( currentTabHeight )
                    });
                } else {
                    self.$tabs.outerHeight( currentTabHeight );
                }
            } else {
                self.$tabs.removeAttr("style");
            }
        },

        /**
         * @method animateTabsJs
         */
        "animateTabsJs": function ( currentTabHeight ) {
            var self = this;

            self.$tabs.stop().animate({
                height: currentTabHeight
            }, self.options.speed, self.options.easing, function afterAnimateTabsJs () {
                self.$tabs.removeAttr("style");
            });
        }
    };

    Tabs.defaults = Tabs.prototype.defaults;

    Motif.apps.Tabs = Tabs;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "tabs", window.Motif.apps.Tabs );