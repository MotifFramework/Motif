/**
 * Admin Actions
 * =============================================================================
 * 
 * Creating the `Admin` namespace
 * 
 * @todo 
 */

(function ($, Admin, undefined) {

    "use strict";

    /**
     * AJAX Form Submission & Response
     * -----------------------------------------------------------------------------
     * 
     * Submits form via AJAX and gives user an inline response message
     * 
     * @todo Make options for more complex messaging
     */

    Admin.ajaxForm = {

        /**
         * Config
         */

        config: {
            error: false,
            successText: "Great! Your form has been submitted.",
            errorText: "There was an error submitting your form. Please contact the site's administrator.",
            alertClass: "alert panel",
            alertSuccessClass: "success",
            alertErrorClass: "error",
            messageLocation: "append",
            fieldSuccessClass: "success",
            scrollElem: null,
            callback: null
        },

        /**
         * Init
         * Grabs config and passes it and form on to `onSubmit`
         */

        init: function (config) {
            var $this = Admin.ajaxForm,
                thisForm = $(this),

                // If config are not supplied, pass an empty object
                settings = config || {};

            // Call the submission method, passing on this form and settings
            $this.onSubmit.call(thisForm, settings);
        },

        /**
         * On Submit
         * Makes AJAX call, passing on config `afterSubmit` 
         * both on success and error
         */

        onSubmit: function (config) {
            var $this = Admin.ajaxForm,
                settings = config,
                thisForm = $(this);

            // Make AJAX call
            $.ajax({
                type: thisForm.attr("method"),
                url: thisForm.attr("action"),
                data: decodeURIComponent(thisForm.serialize()),
                cache: false,

                // If successful...
                success: function ajaxSuccess() {

                    // ...call the after-submission method
                    $this.afterSubmit.call(thisForm, settings);
                },

                // If unsuccessful...
                error: function ajaxError() {

                    // ...set `error` to be true...
                    settings.error = true;

                    // ...then call the after-submission method
                    $this.afterSubmit.call(thisForm, settings);
                }
            });
        },

        /**
         * After Submit
         * Gets built response, calls to reset form 
         * and place message, runs callback (if there)
         */

        afterSubmit: function (config) {
            var $this = Admin.ajaxForm,
                thisForm = $(this),
                settings = $.extend($this.config, config),

                // Call the method to build the response message
                responseMessage = $this.buildMessage(settings);

            // If there was no error...
            if (!settings.error) {

                // ...call method to reset form
                $this.resetForm.call(thisForm, settings);
            }

            // Call method to place response message
            $this.placeMessage.call(thisForm, settings, responseMessage);

            // Then, if a callback function has been supplied...
            if (typeof settings.callback === "function") {

                // ...call it, passing on this form as context
                settings.callback.call(thisForm);
            }
        },

        /**
         * Build Message
         * Builds message string with config
         * Returns string
         */

        buildMessage: function (config) {
            var message = '<div class="';

            // Build out the message using our options
            message += config.alertClass;
            message += ' ';
            message += config.error ? config.alertErrorClass : config.alertSuccessClass;
            message += '">';
            message += config.error ? config.errorText : config.successText;
            message += '</div>';

            // Return the message string
            return message;
        },

        /**
         * Reset Form
         * Resets form and removes success 
         * class from fields
         */

        resetForm: function (config) {
            var thisForm = $(this);

            // Reset this form
            thisForm[0].reset();

            // Remove "success" classes from form fields
            thisForm
                .find('label')
                .removeClass(config.fieldSuccessClass);
        },

        /**
         * Place Message
         * Depending on where specified in config, 
         * places message
         */

        placeMessage: function (config, message) {
            var $this = Admin.ajaxForm,
                thisForm = $(this),
                responseMessage = $(message);

            // If options tell us to prepend the message...
            if (config.messageLocation === "prepend") {

                // ...place it at the top of the form
                thisForm.prepend(responseMessage);

            // If options tell us to append the message...
            } else if (config.messageLocation === "append") {

                // ...place it at the bottom of the form
                thisForm.append(responseMessage);

            // If options tell us to place the message before...
            } else if (config.messageLocation === "before") {

                // ...place it before the form
                thisForm.before(responseMessage);

            // If options tell us to place the message after...
            } else if (config.messageLocation === "after") {

                // ...place it after the form
                thisForm.after(responseMessage);
            }

            $this.goToMessage(config, responseMessage);
        },

        /**
         * Go To Message
         * Right now, crudely animates to placed message
         */

        goToMessage: function (config, message) {
            var $this = Admin.ajaxForm,

                // If element isn't specified, scroll `html`/`body`
                scrollElem = config.scrollElem || $("html, body");

            scrollElem.animate({
                scrollTop: message.offset().top
            }, 500);
            $this.removeMessage(message);
        },

        /**
         * Remove Message
         * Right now, crudely removes message 
         * after timeout
         */

        removeMessage: function (message) {

            // After a few seconds, remove message
            setTimeout(function () {
                message.slideUp(150);
            }, 8000, function () {
                message.remove();
            });
        }
    };

    /**
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

     Admin.verticalNav = {

        /**
         * Config
         */

        config: {
            navWrapper: $("#vertical-nav-wrapper"),
            hideClass: "off-left",
            revealClass: "off-right",
            url: "/slice/admin/sample-nav.php"
        },

         /**
          * Init
          */

        init: function (config) {
            var $this = Admin.verticalNav,
                settings = $.extend(true, {}, $this.config, config || {});

            // Call the nav hiding method
            $this.hideNav(settings);
        },

        hideNav: function (config) {
            var $this = Admin.verticalNav;

            // Find the wrapper's child, hide it with class
            config.navWrapper.children().addClass(config.hideClass);

            // Call the method to remove the old nav
            $this.removeNav(config);
        },

        removeNav: function (config) {
            var $this = Admin.verticalNav;

            // CRUDE: Wait for CSS Animation
            setTimeout(function () {

                // Clear out the html
                config.navWrapper.html("");

                // Call method to get new nav
                $this.getNav(config);
            }, 250);
        },

        getNav: function (config) {
            var $this = Admin.verticalNav;

            // Via AJAX, get JSON string of new nav
            $.getJSON(config.url, function getNavJSON (data) {
                $this.buildNav(data, config);
            });
        },

        buildNav: function (data, config) {
            var $this = Admin.verticalNav,
                items = "<ul class='unstyled vertical-nav " + config.revealClass + "'>";

            // Loop through each object, build new nav
            $.each(data.navigation, function navlistItems (i, item) {
                items += "<li><a href='";
                items += item.url;
                items += "'>";
                items += item.name;
                items += "</a></li>";
            });
            items += "</ul>";

            // Call method to place new nav
            $this.placeNav(items, config);

            return items;
        },

        placeNav: function (nav, config) {
            var $this = Admin.verticalNav,
                newNav = $(nav);

            // Append new nav in wrapper
            config.navWrapper.append(newNav);

            // Call method to show new nav
            $this.showNav(newNav, config);
        },

        showNav: function (nav, config) {

            // Show it, yo
            nav.removeClass(config.revealClass);
        }
    };

    /**
     * Admin Actions Init
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.init = function () {
        $("form").on("submit", function (event) {
            Admin.ajaxForm.init.call($(this), {
                scrollElem: $(".content-page")
            });
            event.preventDefault();
        });
        $("#vertical-nav-wrapper").on("click", "a", function (event) {
            Admin.verticalNav.init.call($(this));
            event.preventDefault();
        });
        $("#content-nav-back").on("click", function (event) {
            Admin.verticalNav.init.call($(this), {
                hideClass: "off-right",
                revealClass: "off-left"
            });
            event.preventDefault();
        });
    };

    Admin.init();

}(jQuery, window.Admin = window.Admin || {}));