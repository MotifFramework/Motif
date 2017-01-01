/**
 * Sample actions execution file
 */

(function ( $, window, document, Modernizr, Motif, undefined ) {

    "use strict";

    var App = function () {
        this.initUI();
        this.initForms();
    };

    App.prototype.initUI = function () {
        $(".js-tabs").plugin("tabs", {
            "cssTransition": Modernizr.csstransitions
        });
        $(".canvas-trigger").plugin("reveal", {
            "type": "exclusive",
            "activeClass": "is-active",
            "visitedClass": "was-active"
        });
        $(".js-reveal").plugin("reveal", {
            "type": "exclusive",
            "activeClass": "is-revealed",
            "visitedClass": "was-revealed"
        });
        $(".js-fade").plugin("reveal", {
            "activeClass": "is-faded",
            "visitedClass": "was-faded"
        });
        $(".js-expand").plugin("reveal", {
            "type": "exclusive",
            "activeClass": "is-expanded",
            "visitedClass": "was-expanded"
        });
    };

    App.prototype.initForms = function () {
        $("[data-validation='ajax']").plugin("ajaxSubmission");
        $("[data-validation='true']").plugin("gauntlet");
    };

    new App();

}( jQuery, window, document, Modernizr, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );