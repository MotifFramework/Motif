/*!
 * Modal v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 * 
 * @author AUTHOR <EMAIL>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Modal = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];

            return this;
        },
        $document = $( document );

    Modal.counter = 0;
    Modal.timestamp = new Date().getTime();
    Modal.transitionEvent = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
    Modal.transitions = Modernizr.csstransitions || false;

    Modal.prototype = {
        "defaults": {
            "modalClass": "modal--box",
            "modalBgClass": "modal-bg",
            "modalCloseClass": "modal-close",
            "closeText": "Close",
            "modalContentClass": "modal-content",
            "modalTransitionClass": "is-transitioning",
            "namespace": "motif",
            "parentElem": $("body"),
            "allowScroll": false,
            "parentScrollClass": "no-scroll",
            "onShow": null,
            "onHide": null,
            "revealOptions": {
                "type": "exclusive",
                "activeClass": "is-revealed"
            }
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );
            this.initReveal();

            return this;
        },

        "initVars": function ( userOptions ) {

            // Merging configurations
            this.config = userOptions;
            this.metadata = this.$elem.data("modal-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

            // The identity of this modal
            this.identity = this.options.namespace + "--" + Modal.timestamp;

            this.modalId = this.identity;
            this.contentsId = this.options.namespace + "__content--" + Modal.timestamp;
            this.bgId = this.options.namespace + "__bg--" + Modal.timestamp;
            this.closeId = this.options.namespace + "__close--" + Modal.timestamp;

            // The identity of the triggering element
            this.triggerIdentity = this.$elem.attr("id") || this.options.namespace + "-trigger-" + Modal.counter;

            // Ensure the element has the appropriate identity
            this.$elem.attr("id", this.triggerIdentity);

            // Where are we getting the modal content from?
            this.targetContent = this.$elem.data("modal-content") ? this.$elem.data("modal-content") : this.$elem.attr("href");

            // Set up the markup variable
            this.markup = false;

            // Set up the scrollPosition variable
            this.scrollPosition = false;
        },

        /**
         * Initialize the Motif Reveal plugin with Modal-specific config
         * @method gatherTriggers
         * @return {Object}
         */
        "initReveal": function () {
            this.$elem.reveal( this.createRevealConfig() );

            Modal.counter += 1;
        },

        /**
         * Supplement Reveal options for Modal-specific tasks
         * @method createRevealConfig
         * @return {Object}
         */
        "createRevealConfig": function () {
            var self = this;

            self.options.revealOptions.target = function () {
                return [
                    self.markup.modal,
                    self.markup.bg
                ];
            };

            self.options.revealOptions.beforeReveal = function ( elem, action, deferred ) {
                var markup = self.markup;

                // If this reveal action is a "show",
                // we want to update the modal styles and binds based on the user's options
                // and place the modal contents
                if ( action === "show" ) {
                    self.styleModal.call( self, markup );
                    self.getModalContents.call( self );
                }
                
                // We want to note that we are transitioning
                // And bind actions for when that transition ends
                if ( Modal.transitions ) {
                    self.bindTransitionEnd.call( self, action );
                    self.addTransitioning.call( self );
                }

                deferred.resolve();
            };

            self.options.revealOptions.onShow = function ( elem ) {

                // Make sure we are noting the new Hide triggers
                // in the close button and modal background,
                // and updating Motif Reveal accordingly
                this.updateReference.call( this, {
                    "hide": this.gatherHideTriggers.call( this )
                });

                // If we don't want to allow scroll on the body...
                if ( !self.options.allowScroll ) {
                    self.removeScroll.call( self );
                }

                if ( typeof self.options.onShow === "function" ) {
                    self.options.onShow.call( self, self.$elem );
                }
            };

            self.options.revealOptions.onHide = function ( elem ) {
                if ( !self.options.allowScroll ) {
                    self.addScroll.call( self );
                }
                if ( !Modal.transitions ) {
                    self.stripModal.call( self );
                }

                if ( typeof self.options.onHide === "function" ) {
                    self.options.onHide.call( self, self.$elem );
                }
            };

            return self.options.revealOptions;
        },

        "removeScroll": function () {

            // Save the current scroll position for
            // browsers that don't respect our technique
            this.scrollPosition = this.options.parentElem.scrollTop();

            // Add scroll-preventing class to parent element
            this.options.parentElem.addClass( this.options.parentScrollClass );
        },

        "addScroll": function () {

            // Remove scroll-preventing class to parent element
            // then make sure it's at its original scroll position
            this.options.parentElem.removeClass( this.options.parentScrollClass ).scrollTop( this.scrollPosition );
        },

        "addTransitioning": function () {
            this.markup.modal.addClass( this.options.modalTransitionClass );
            this.markup.bg.addClass( this.options.modalTransitionClass );
        },

        "removeTransitioning": function () {
            this.markup.modal.removeClass( this.options.modalTransitionClass );
            this.markup.bg.removeClass( this.options.modalTransitionClass );
        },

        "unbindTransitionEnd": function () {
            this.markup.modal.off( Modal.transitionEvent );            
        },

        "removeContents": function () {

            // Remove the children of the modal contents
            this.markup.contents.children().remove();

            return this.markup.contents;
        },

        "bindTransitionEnd": function ( action ) {
            var self = this;

            // When the contents are done transitioning...
            self.markup.contents.on( Modal.transitionEvent, function ( ev ) {

                // Make sure we are indeed getting the end transition of the contents elem
                if ( ev.originalEvent.target === self.markup.contents[0] ) {

                    // Remove the transitioning class
                    self.removeTransitioning.call( self );

                    if ( action === "hide" ) {
                        self.stripModal.call( self );
                    }

                    // Unbind the transition events
                    self.unbindTransitionEnd.call( self );
                }
            });
        },

        "stripModal": function () {

            // If the modal isn't current...
            if ( !this.markup.modal.hasClass( this.options.revealOptions.activeClass ) ) {

                // Remove the modal contents
                this.removeContents();

                // Remove the modal contents
                this.unstyleModal();

                this.markup = this.getModal();
            }
        },

        "styleModal": function ( markup ) {

            // If there's no markup, get it
            markup = markup ? markup : this.getModal();

            // Add user classes
            markup.bg.addClass( this.options.modalBgClass ).removeAttr("style");
            markup.modal.addClass( this.options.modalClass ).removeAttr("style");
            markup.contents.addClass( this.options.modalContentClass );
            markup.close.addClass( this.options.modalCloseClass );

            // Setup hiding attributes
            this.bindHides( markup );

            this.markup = markup;

            return this.markup;
        },

        "unstyleModal": function ( markup ) {

            // If there's no markup, get it
            markup = markup || this.markup;

            // Add user classes
            markup.bg.removeClass( this.options.modalBgClass ).hide();
            markup.modal.removeClass( this.options.modalClass ).hide();
            markup.contents.removeClass( this.options.modalContentClass );
            markup.close.removeClass( this.options.modalCloseClass );

            return markup;
        },

        "bindHides": function ( markup ) {
            markup = markup || this.markup;

            // Attach Motif Reveal Hide attributes to the background
            // and close button
            markup.bg.attr("data-reveal-hide", this.triggerIdentity);
            markup.close.attr("data-reveal-hide", this.triggerIdentity);
        },

        "getModal": function () {
            var existingModal = $("#" + this.identity);
            if ( existingModal.length ) {
                return {
                    "modal": existingModal,
                    "bg": $("#" + this.bgId),
                    "contents": $("#" + this.contentsId),
                    "close": $("#" + this.closeId)
                };
            } else {
                return this.buildModal();
            }
        },

        "buildModal": function () {
            var modal = $("<div id='" + this.identity + "'></div>"),
                modalContent = $("<div id='" + this.contentsId + "'></div>"),
                modalClose = $("<a id='" + this.closeId + "' href='#" + this.triggerIdentity + "'>" + this.options.closeText + "</a>"),
                modalBg = $("<div id='" + this.bgId + "'></div>"),
                markup = {
                    "bg": modalBg,
                    "modal": modal,
                    "contents": modalContent,
                    "close": modalClose
                };

            // Style Modal
            markup = this.styleModal( markup );

            // Bind Modal
            markup = this.bindModal( markup );

            // Place Modal
            // @TODO: Place this somewhere else?
            this.placeModal( markup );

            return markup;
        },

        "bindModal": function ( markup ) {
            markup.modal.on("click.motif.modal", function ( ev ) {
                if ( $( ev.target ).is( markup.modal ) ) {
                    markup.close.trigger("click");
                }
            });
            markup.modal.on("modal/hide", function () {
                markup.close.trigger("click");
            });
            $document.on("modal/" + this.identity + "/hide", function () {
                markup.close.trigger("click");
            });
            markup.modal.on("click.motif.modal", "[data-modal-hide]", function () {
                markup.modal.trigger("modal/hide");
                return false;
            });

            return markup;
        },

        "placeModal": function ( markup ) {

            // Append the contents and close button to the modal
            markup.modal.append( markup.contents ).append( markup.close );

            // Append the modal and the background to the parent element
            this.options.parentElem.append( markup.modal ).append( markup.bg );
        },

        "getModalContents": function () {
            var hashLocation;

            // If the URL begins with "#"
            if ( this.targetContent.substr(0, 1) === "#" ) {

                // ...just look for that ID on the page and grab
                // its contents
                this.markup.contents.html( $(this.targetContent).html() );

            // Otherwise, it must be an external link
            } else {

                // Find a "#" in the url, in case we are grabbing
                // a partial
                hashLocation = this.targetContent.lastIndexOf("#");

                // If we have found a "#"
                if ( hashLocation !== -1 ) {

                    // Modify the URL to have a space before the "#"
                    // This way jQuery's `.load()` knows to return
                    // just the fragment
                    this.targetContent = this.targetContent.slice(0, hashLocation) + " " + this.targetContent.slice(hashLocation);
                }

                // Load the external content
                this.markup.contents.load( this.targetContent );
            }
        }
    };

    Modal.defaults = Modal.prototype.defaults;

    Motif.apps.Modal = Modal;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "modal", window.Motif.apps.Modal );