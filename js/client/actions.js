/**
 * Client Actions
 * =============================================================================
 * 
 * Creating the `Client` namespace so that it can be publically accessed
 * 
 * @todo 
 */

(function ( $, window, document, LB, undefined ) {

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
        LB.apps.validateForms.init({
            "forms": $("[data-validation='ajax']")
        });
        LB.apps.validateForms.init({
            "forms": $("[data-validation='true']"),
            "ajaxSubmit": false
        });
    };

    new App();

}( jQuery, window, document, window.LB = window.LB || {
    "utils": {},
    "apps": {}
} ) );