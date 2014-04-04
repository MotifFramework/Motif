/**
 * Motif Background Size
 *
 * Mimics the `background-size: cover` CSS property. Great for IE8 fallbacks.
 *
 * @version 0.1 (06/07/13)
 * @author  Jonathan Pacheco (jonathan@lifeblue.com)
 *
 * Copyright 2013 Lifeblue
 */

(function ( $, window, undefined ) {

    "use strict";

    // Default Variables
    var defaults = {

            // System Variables
            "pluginName": "backgroundSize",

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

        // Methods
        methods = {

            // Init method, run on initialization
            "init": function ( config ) {

                // Loop through each instance of this plugin and return it
                return this.each( function () {
                    var thisElem = $(this),

                        // Combine defaults with user configs
                        settings = $.extend( true, {}, defaults,  config ),
                        browserWindow = $(window),
                        newImage,

                        // Grab data variables
                        originalData = thisElem.data(),

                        // Plugin settings
                        data = {
                            "originalData": originalData,
                            "loadedClass": settings.loadedClass,
                            "wrapperClass": settings.wrapperClass,
                            "imageClass": settings.imageClass,
                            "leftOffsetClass": settings.leftOffsetClass,
                            "topOffsetClass": settings.topOffsetClass,
                            "onInit": settings.onInit,
                            "onImageLoad": settings.onImageLoad,
                            "onResize": settings.onResize
                        };

                    // Add settings to data object
                    thisElem.data( "backgroundSizeSettings", data );

                    // Create and return new image
                    newImage = methods.createImage( thisElem );

                    // On browser resize...
                    browserWindow.on( "resize", function () {

                        // ...size the image
                        methods.sizeImage( newImage, thisElem );
                    });

                    // If onInit callback...
                    if ( typeof settings.onInit === "function" ) {
                        settings.onInit( thisElem );
                    }
                });
            },

            // Create new BG image
            "createImage": function ( elem ) {
                var data = elem.data("backgroundSizeSettings"),
                    imageSource = elem.attr("data-img"),
                    imageWrapper = $("<div class='" + data.wrapperClass + "' />"),
                    cssRegex = new RegExp( /^url\((['"]?)(.*)\1\)$/ ),
                    newImage;

                // If no `data-img` is specified...
                if ( !imageSource ) {

                    // Grab the CSS `background-image`
                    imageSource = elem.css("background-image");

                    // Clean the string
                    imageSource = cssRegex.exec( imageSource );
                    imageSource = imageSource ? imageSource[2] : "";

                    // Hide the CSS `background-image`
                    elem.css( "background-image", "none" );
                }

                // Create new image
                newImage = $("<img class='" + data.imageClass + "' src='" + imageSource + "'>")
                    .load( function onLoad () {

                        // Size the image once it loads
                        methods.sizeImage( newImage, elem, function onLoadCallback () {

                            // After it's sized, run some more load prep
                            methods.loadImage( newImage, elem );
                        });
                    });

                // Append the wrapper to the elem
                imageWrapper.append( newImage ).appendTo( elem );

                return newImage;
            },

            "sizeImage": function ( image, elem, callback ) {
                var data = elem.data("backgroundSizeSettings"),
                    elemWidth = elem.outerWidth(),
                    elemHeight = elem.outerHeight(),
                    elemRatio = elemWidth / elemHeight,
                    imageRatio = image.width() / image.height(),
                    imageWrapper = image.parent(),
                    leftOffset,
                    topOffset;

                // If the image ratio is greater than the elem,
                // we must offset the image horizontally
                if ( imageRatio > elemRatio ) {

                    // Set left offset class
                    imageWrapper.removeClass( data.topOffsetClass ).addClass( data.leftOffsetClass );

                    // Calculate left offset
                    leftOffset = Math.floor( ( ( elemHeight * imageRatio ) - elemWidth ) / 2 );

                    // Apply offset to the image
                    image.css({
                        "margin-bottom": 0,
                        "margin-left": -leftOffset
                    });

                // Otherwise, we must offset the image vertically
                } else {

                    // Set top offset class
                    imageWrapper.removeClass( data.leftOffsetClass ).addClass( data.topOffsetClass );

                    // Calculate top offset
                    topOffset = Math.floor( ( ( elemWidth / imageRatio) - elemHeight ) / 2 );

                    // Apply offset to the image
                    image.css({
                        "margin-bottom": -topOffset,
                        "margin-left": 0
                    });
                }

                // If onResize callback...
                if ( typeof data.onResize === "function" ) {
                    data.onResize.call( elem, image );
                }
                // If other callback...
                if ( typeof callback === "function" ) {
                    callback.call( elem, image );
                }
            },

            // Load Image prep
            "loadImage": function ( image, elem ) {
                var data = elem.data("backgroundSizeSettings");

                // Hide the image before we pop it back in place
                image.hide();

                // If onImageLoad callback...
                if ( typeof data.onImageLoad === "function" ) {
                    data.onImageLoad.call( elem, image );
                }

                // Add the loaded class, which pops it back in place
                elem.addClass( data.loadedClass );

                // Fade the image in
                image.fadeIn( 500 );
            }
        };

    // Initialize plugin
    $.fn[defaults.pluginName] = function ( m ) {

        // If a method is called by name...
        if ( methods[m] ) {

            // ...return specified method.
            return methods[m].apply( this, Array.prototype.slice.call( arguments, 1 ) );

        // ...else if no method is called or an object is passed...
        } else if ( !m || typeof m === "object" ) {

            // ...return the "init" method.
            return methods.init.apply( this, arguments );

        // ...otherwise...
        } else {

            // ...log an error.
            console.log( defaults.pluginName + ": Invalid method passed" );
        }
    };

}( jQuery, window ));
