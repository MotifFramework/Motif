/* LB Validation Plugin, v. 0.2 (1/27/12) */
/**
 * LB Validation Plugin
 * =============================================================================
 * 
 * Client-side jQuery `<form>` validation based off HTML5 patterns
 *
 * @version 0.2 (1/27/12)
 * 
 * @todo 
 */

(function ($, undefined) {

    "use strict";

    var vars = {
        // System Variables
        "pluginName": "lb_validation",

        // Class Names
        "classes": {
            "errorClass": "error",
            "successClass": "success",
            "warningClass": "warning",
            "messageClass": "input-alert",
            "requiredClass": "required"
        },

        // Error Messages
        "emailMsg": "A valid email address is required.",
        "emailConfirmMsg": "Check that your email addresses match.",
        "invalidMsg": "This field is required.",
        "totalsMsg": "Check that your totals don't exceed the limit",
        "telMsg": "Make sure you've entered a valid phone number.",
        "searchMsg": "Please input a search term.",
        "numberMsg": "Enter a valid number.",
        "errorMsg": "There was an error.",
        "passwordMsg": "Your password must match the criteria.",
        "passwordConfirmMsg": "Be sure that your passwords match.",
        "radioMsg": "Please choose one of the options above.",
        "checkboxMsg": "This field is required.",
        "selectMsg": "Select an option.",

        // Type of inputs to regex
        "types": {
            "email": /^([a-zA-Z0-9._%+\-])+@([a-zA-Z0-9_.\-])+\.([a-zA-Z])+([a-zA-Z])+/,
            "tel": /^((([0-9]{1})*[\- .(]*([0-9]{3})[\- .)]*[0-9]{3}[\- .]*[0-9]{4})+)*$/,
            "number": /^[0-9]*/
        },

        // Form fields to validate
        "fieldsToCheck": "input[type='text'], input[type='email'], input[type='search'], input[type='tel'], input[type='url'], input[type='number'], input[type='password'], input[type='checkbox'], input[type='radio'], textarea, select",
        "errorReport": function (o) {

            // Variables
            var $this = $(this),
                fieldsToCheck = o;

            fieldsToCheck.each(function () {

                // Variables
                var currentInput = $(this);

                methods.removeMessage.call($this, currentInput);
                methods.addMessage.call($this, currentInput);
            });
        },
        "ajaxSubmit": null
    },

        // Methods
        methods = {
            "init": function (o) {

                return this.each(function () {

                    // Variables
                    var $this = $(this),
                        s = $.extend(true, {}, vars, o),
                        fieldsToCheck = $this.find(s.fieldsToCheck),
                        messages = {
                            'email': s.emailMsg,
                            'email-confirm': s.emailConfirmMsg,
                            'password': s.passwordMsg,
                            'password-confirm': s.passwordConfirmMsg,
                            'tel': s.telMsg,
                            'search': s.searchMsg,
                            'text': s.invalidMsg,
                            'number': s.numberMsg,
                            'text-totals': s.totalsMsg,
                            'textarea': s.invalidMsg,
                            'checkbox': s.checkboxMsg,
                            'radio': s.radioMsg,
                            'select': s.selectMsg,
                            'default': s.errorMsg
                        },
                        settings = {
                            "messages": messages,
                            "fieldsToCheck": s.fieldsToCheck,
                            "types": s.types,
                            "classes": s.classes,
                            "errorReport": s.errorReport,
                            "ajaxSubmit": s.ajaxSubmit
                        };

                    // novalidate to prevent browser from intervening, set settings as data
                    $this.attr("novalidate", true).data("lbValidation", settings);

                    // On field change...
                    fieldsToCheck.on("change", function () {

                        // Variables
                        var verdict = methods.validate.call($this, $(this)),
                            failedObjects = [],
                            passedObjects = [];

                        // If field does not validate, push to failedObjects
                        if (!verdict) {
                            failedObjects.push($(this));
                        } else {
                            passedObjects.push($(this));
                        }

                        // Call errorReport
                        s.errorReport.call($this, $(this));
                    });

                    // On Submit
                    $this.submit(function () {
                        return methods.formSubmit.call($this, fieldsToCheck);
                    });
                });
            },

            "validate": function (o) {

                // Variables
                var currentInput = o,
                    currentValue = currentInput.val(),
                    inputType = currentInput.attr("type"),
                    inputName = currentInput.attr("name"),
                    inputPattern = currentInput.attr("pattern"),
                    checkboxGroup,
                    hasChecked,
                    filter,
                    verdict = true,
                    $this = $(this),
                    formSettings = $this.data("lbValidation"),

                    confirmingInput = currentInput.attr("data-validate-confirm"),
                    confirmedInput = $("#" + confirmingInput);

                // If it's not disabled...
                if (currentInput.prop("disabled") !== true) {

                    // If there's no value...
                    if ($.trim(currentValue) === "") {
                        if (!!currentInput.attr("required")) {

                            // It failed
                            verdict = false;
                        }

                    // If there is a value...
                    } else {

                        // If "pattern" is defined...
                        if (!!inputPattern) {

                            // Create filter out of pattern
                            filter = new RegExp(inputPattern);

                            // If pattern isn't matched...
                            if (!filter.test(currentValue)) {

                                // It failed
                                verdict = false;

                            // If it's matched but is also a confirmation input...
                            } else if (!!confirmingInput) {

                                // If it doesn't match the input it confirms...
                                if (currentValue !== confirmedInput.val()) {

                                    // It failed
                                    verdict = false;
                                }
                            }

                        // If it's confirming another input...
                        } else if (!!confirmingInput) {

                            // If the values don't match...
                            if (currentValue !== confirmedInput.val()) {

                                // It failed
                                verdict = false;
                            }

                        // If it's a checkbox or radio...
                        } else if (inputType === "checkbox" || inputType === "radio") {

                            if (!!currentInput.attr("required")) {
                                checkboxGroup = $this.find("input[name='" + inputName + "']");
                                hasChecked = false;

                                // Run through the checkbox group
                                checkboxGroup.each(function () {

                                    // If any are checked, pass on to variable
                                    if ($(this).is(":checked")) {
                                        hasChecked = true;
                                    }
                                });

                                // If none were checked...
                                if (hasChecked === false) {

                                    // It failed
                                    verdict = false;
                                }
                            }

                        // If it's not a textarea, select, checkbox or radio, but it matches our types array...
                        } else if (!!inputType && !!formSettings.types[inputType]) {

                            // Find the filter in our filter types array
                            filter = formSettings.types[inputType];

                            // If it doesn't match the pattern...
                            if (!filter.test(currentValue)) {

                                // If failed
                                verdict = false;
                            }
                        }
                    }
                }

                // Return the failed objects
                currentInput.data("verdict", verdict);
                return verdict;
            },

            "formSubmit": function (o) {

                // Variables
                var $this = $(this),
                    data = $this.data("lbValidation"),
                    fieldsToCheck = o,
                    failedObjects = [],
                    firstError;

                // Check each field
                fieldsToCheck.each(function () {

                    // Return validation true/false for each field
                    var verdict = methods.validate.call($this, $(this));

                    // If it's false, push this into failedObjects array
                    if (!verdict) {
                        failedObjects.push($(this));
                    }
                });

                // errorReport
                data.errorReport.call($this, fieldsToCheck);

                if (failedObjects.length > 0) {

                    // Variables
                    firstError = $this
                        .find("." + data.classes.messageClass + "--" + data.classes.errorClass)
                        .first()
                        .prev()
                        .offset();

                    // Actions
                    $("html, body").animate({
                        scrollTop: firstError.top - 100
                    }, 500);
                    return false;
                } else {
                    if (typeof data.ajaxSubmit === "function") {
                        data.ajaxSubmit.call($this);
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            "addMessage": function (o) {

                // Variables
                var $this = $(this),
                    data = $this.data("lbValidation"),
                    currentInput = o,
                    verdict = currentInput.data("verdict"),
                    inputType = currentInput.attr("type"),
                    parentUL,
                    parentFieldset,
                    currentLabel,
                    legendID,
                    legend,
                    inputName,
                    checkboxGroup,
                    hasChecked,
                    parentLabel;

                // Just in case, since selects and textareas don't have "type" attribute...
                if (!inputType || inputType === "select-one") {
                    if (currentInput.is("select")) {
                        inputType = "select";
                    } else if (currentInput.is("textarea")) {
                        inputType = "textarea";
                    } else {
                        inputType = "text";
                    }
                }

                if (inputType === "checkbox" || inputType === "radio") {

                    // Variables
                    parentUL = currentInput.closest("ul");
                    parentFieldset = parentUL.closest("fieldset");
                    currentLabel = parentUL.find('label[for="' + currentInput.attr('id') + '"]');
                    legendID = parentUL.attr("id");
                    legend = parentFieldset.find('[data-for="' + legendID + '"]');
                    inputName = currentInput.attr("name");
                    checkboxGroup = $this.find("input[name='" + inputName + "']");
                    hasChecked = false;

                    // Run through the checkbox group
                    checkboxGroup.each(function () {

                        // If any are checked, pass on to variable
                        if ($(this).is(":checked")) {
                            hasChecked = true;
                        }
                    });

                    if (!verdict) {
                        legend.addClass(data.classes.errorClass);
                        parentUL.after('<b class="' + data.classes.messageClass + '--' + data.classes.errorClass + '">' + data.messages[inputType] + '</b>');
                    } else {
                        if (verdict === true) {
                            currentLabel.addClass(data.classes.successClass);
                        }
                    }
                } else {
                    parentLabel = currentInput.closest("label");

                    if (!verdict) {
                        parentLabel.addClass(data.classes.errorClass);
                        currentInput.after('<b class="' + data.classes.messageClass + '--' + data.classes.errorClass + '">' + data.messages[inputType] + '</b>');
                    } else {
                        if ($.trim(currentInput.val()) !== "") {
                            parentLabel.addClass(data.classes.successClass);
                        }
                    }
                }
            },
            "removeMessage": function (o) {

                // Variables
                var $this = $(this),
                    data = $this.data("lbValidation"),
                    currentInput = o,
                    inputType = currentInput.attr("type"),
                    parentUL,
                    parentFieldset,
                    currentLabel,
                    legendID,
                    legend,
                    inputName,
                    parentLabel;

                if (inputType === "checkbox" || inputType === "radio") {

                    // Variables
                    parentUL = currentInput.closest("ul");
                    parentFieldset = parentUL.closest("fieldset");
                    currentLabel = parentUL.find('label[for="' + currentInput.attr('id') + '"]');
                    legendID = parentUL.attr("id");
                    legend = parentFieldset.find('[data-for="' + legendID + '"]');
                    inputName = currentInput.attr("name");

                    // REMEMBER TO ADD "IF VERDICT"
                    legend.removeClass(data.classes.errorClass);
                    currentLabel.removeClass(data.classes.successClass);
                    parentUL.next('.' + data.classes.messageClass + '--' + data.classes.errorClass).remove();
                } else {

                    // Variables
                    parentLabel = currentInput.closest("label");

                    // Actions
                    parentLabel.removeClass(data.classes.successClass).removeClass(data.classes.errorClass);
                    currentInput.next('.' + data.classes.messageClass + '--' + data.classes.errorClass).remove();
                }
            }
        };

    $.fn[vars.pluginName] = function (m) {
        if (methods[m]) {
            return methods[m].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!m || typeof m === "object") {
            return methods.init.apply(this, arguments);
        } else {
            console.log(vars.pluginName + ": Invalid method passed");
        }
    };

}(jQuery));
