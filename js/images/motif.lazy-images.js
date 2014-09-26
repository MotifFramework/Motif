/*!
 * LazyImage v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 * 
 * @author AUTHOR <EMAIL>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var LazyImage = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];

            return this;
        },
        $document = $( document );

    LazyImage.prototype = {
        "namespace": "lazy-img",
        "defaults": {
            "styleImage": true,
            "animate": true,
            "readyClass": "is-ready"
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            // Set variables
            this.initVars( userOptions );

            // If we need to create a placeholder
            if ( this.$placeholder ) {

                // Style the placeholder
                this.stylePlaceholder();

                // Place it
                this.placePlaceholder();
            }

            /**/
            var self = this;
            var btn = $("<button type='button'>Load Image</button>");

            btn.one("click", function () {
                self.$img.trigger(self.namespace + "-load");
            });

            this.$elem.append( btn );
            /**/

            // And that's it for now
            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data(this.namespace + "-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );

            // Create a placeholder if width and height were provided
            this.$placeholder = this.$elem.is("[data-" + this.namespace + "-w]") && this.$elem.is("[data-" + this.namespace + "-h]") ? this.createPlaceholder() : false;

            // If we indeed have a placeholder
            if ( this.$placeholder ) {

                // Let's capture the dimensions
                this.w = this.$elem.attr("data-" + this.namespace + "-w");
                this.h = this.$elem.attr("data-" + this.namespace + "-h");
            }

            // Grab the image path
            this.path = this.$elem.attr("data-" + this.namespace);

            // Create the image
            this.$img = this.createImage();
            this.img = this.$img[0];

            // Create variable for tracking image placement
            this.isPlaced = false;
        },

        "createImage": function () {
            var img = $("<img class='" + this.namespace + "'>");

            this.bindImage( img );

            return img;
        },

        "createPlaceholder": function () {
            return $("<span class='" + this.namespace + "-placeholder' />");
        },

        "placePlaceholder": function () {
            this.$elem.prepend( this.$placeholder );
        },

        "placeImage": function () {
            if ( !this.isPlaced ) {
                this.$img = this.styleImage();

                this.img.src = this.path;

                if ( this.$placeholder ) {
                    this.$placeholder.prepend( this.$img );
                } else {
                    this.$elem.prepend( this.$img );
                }
                this.isPlaced = true;
            }
            return this.$img;
        },

        "styleImage": function () {
            if ( this.options.animate ) {
                this.$img.fadeOut(0);
            }
            if ( this.options.styleImage ) {
                this.$img.css({
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "width": "100%",
                    "max-width": "none"
                });

            }
            return this.$img;
        },

        "bindImage": function ( img ) {
            var self = this;

            // if ( this.$placeholder ) {
                img.load(function () {
                    self.showImage.call( self, $(this) );
                });
            // }

            img.one(self.namespace + "-load", function () {
                self.placeImage.call( self );
            });
        },

        "showImage": function () {
            this.$elem.addClass( this.options.readyClass );
            this.$placeholder.addClass( this.options.readyClass );
            this.$img.addClass( this.options.readyClass );

            if ( this.options.animate ) {
                this.$img.fadeIn( 250 );
            } else if ( this.options.styleImage ) {
                this.$img.show();
            }
        },

        "stylePlaceholder": function () {

            if ( this.options.styleImage ) {
                this.$placeholder.css({
                    "position": "relative",
                    "display": "block",
                    "overflow": "hidden",
                    "padding-top": this.calculateRatio() + "%"
                });
            }

            return this.$placeholder;
        },

        "calculateRatio": function () {
            return 100 * ( this.h / this.w );
        }
    };

    LazyImage.defaults = LazyImage.prototype.defaults;

    Motif.apps.LazyImage = LazyImage;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "lazyImage", window.Motif.apps.LazyImage );