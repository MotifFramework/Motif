/**
 * Client Actions
 * =============================================================================
 * 
 * Creating the `Client` namespace so that it can be publically accessed
 * 
 * @todo 
 */

(function ( $, window, document, Motif, undefined ) {

    "use strict";

    /**
     * Client Actions Init
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    var App = function () {
        this.initReveals();
        this.initForms();
        this.initScrollEvents();
    };

    App.prototype.initReveals = function () {
        $(".js-tabs").plugin("reveal", {
            "type": "radio",
            "activeClass": "is-current"
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
        $("[data-validation='true']").plugin("lb_validation");
    };

    App.prototype.initScrollEvents = function () {
        $("#basics__nav").plugin("scrollEvents");

        $(".js-scrolling").on("click", function () {
            $( $(this).attr("href") ).plugin("lb_scrolling");
            return false;
        });
    };

    new App();

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );