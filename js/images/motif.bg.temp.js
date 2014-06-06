/*!
 * BackgroundCover v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 *
 * @author AUTHOR <EMAIL>
 */
(function ( window, document, Motif ) {

    "use strict";

    var BackgroundCover = function ( elem, userOptions ) {
            var self = this;
            [].forEach.call( document.querySelectorAll( elem ), function (el) {
                self.elem = el;
                self.init.call( self, userOptions );

                return this;
            });

            return this;
        };

    BackgroundCover.prototype = {
        "defaults": {

            // Classes
            "loadedClass": "fake-bg-is-ready",
            "wrapperClass": "fake-bg-wrapper",
            "imageClass": "fake-bg-image",
            "leftOffsetClass": "fake-bg-left-offset",
            "topOffsetClass": "fake-bg-top-offset",

            // On Init
            "onInit": null,

            // On Image Load
            "onImageLoad": null,

            // On Image Resize
            "onResize": null
        },

        "init": function ( userOptions ) {

            this.initVars( userOptions );
            this.bindScroll();

            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.elem.getAttribute("data-bgsize-options");
            this.options = Motif.utils.extend( this.defaults, this.config, this.metadata );
            this.path = this.elem.getAttribute("data-img");
            this.image = this.createImage();
        },

        "createImage": function () {
            var self = this,
                wrapper = document.createElement("div"),
                elem = new Image();

            elem.addEventListener( "load", function onImageLoad () {
                self.measureImage.call( self );
                self.sizeImage.call( self, self.showImage );
            }, false );
            elem.className = this.options.imageClass;
            elem.src = this.path;
            wrapper.className = this.options.wrapperClass;
            wrapper.appendChild( elem );
            this.elem.appendChild( wrapper );

            return {
                "wrapper": wrapper,
                "elem": elem
            };
        },

        "measureImage": function () {
            return this.image.ratio = this.image.elem.width / this.image.elem.height;
        },

        "bindScroll": function () {
            var self = this;

            window.addEventListener( "resize", function onWindowScroll () {
                self.sizeImage.call( self );
            }, false );
        },

        "sizeImage": function ( fn ) {
            var elemWidth = this.elem.offsetWidth,
                elemHeight = this.elem.offsetHeight,
                elemRatio = elemWidth / elemHeight;

            if ( this.image.ratio > elemRatio ) {
                this.offsetHorizontally( elemWidth, elemHeight );
            } else {
                this.offsetVertically( elemWidth, elemHeight );
            }

            if ( typeof fn === "function" ) {
                fn.call( this );
            }
        },
        "offsetHorizontally": function ( w, h ) {
            var leftOffset = Math.floor( ( ( h * this.image.ratio ) - w ) / -2 );

            this.image.wrapper.classList.remove( this.options.topOffsetClass );
            this.image.wrapper.classList.add( this.options.leftOffsetClass );
            this.image.elem.style.marginBottom = 0;
            this.image.elem.style.marginLeft = leftOffset + "px";
        },
        "offsetVertically": function ( w, h ) {
            var topOffset = Math.floor( ( ( w / this.image.ratio ) - h ) / -2 );

            this.image.wrapper.classList.remove( this.options.leftOffsetClass );
            this.image.wrapper.classList.add( this.options.topOffsetClass );
            this.image.elem.style.marginBottom = topOffset + "px";
            this.image.elem.style.marginLeft = 0;
        },
        "showImage": function () {
            this.image.wrapper.classList.add( this.options.loadedClass );
            return this.image.wrapper;
        }
    };

    BackgroundCover.defaults = BackgroundCover.prototype.defaults;

    Motif.apps.BackgroundCover = BackgroundCover;

}( window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
}));
