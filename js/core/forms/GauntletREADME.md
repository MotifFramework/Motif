# Motif Gauntlet
## Trials and tribulations to validate your forms

Gauntlet is a form validation plugin that depends on HTML5 syntax.

```javascript
$("form").gauntlet();
```

## Configuration Options

- [alertClass](#alertclass)
- [labelClass](#labelclass)
- [messages](#messages)
- [patterns](#patterns)
- [check](#check)
- [ignore](#ignore)
- [errorReport](#errorreport)
- [ajaxSubmit](#ajaxsubmit)
- [scrollToError](#scrolltoerror)
- [addTest](#addtest)

### alertClasses

Type: `Object` Default:

    {
        "error": "input-alert--error",
        "success": "input-alert--success"
    }

Classes for error alerts during validation.


### labelClasses

Type: `Object` Default:

    {
        "error": "is-erroneous",
        "success": "is-successful",
        "disabled": "is-disabled"
    }

Classes for wrapping labels during validation.

### messages

Type: `Object` Default:

    {
        "email": "A valid email address is required.",
        "emailConfirm": "Check that your email addresses match.",
        "text": "This field is required.",
        "totals": "Check that your totals don't exceed the limit",
        "tel": "Make sure you've entered a valid phone number.",
        "search": "Please input a search term.",
        "number": "Enter a valid number.",
        "error": "There was an error.",
        "password": "Your password must match the criteria.",
        "passwordConfirm": "Be sure that your passwords match.",
        "radio": "Please choose one of the options above.",
        "checkbox": "Please check at least one option.",
        "select": "Select an option."
    }

Error messages by input type.

### patterns

Type: `Object` Default:

    {
        "email": /^([a-zA-Z0-9._%+\-])+@([a-zA-Z0-9_.\-])+\.([a-zA-Z])+([a-zA-Z])+/,
        "tel": /^((([0-9]{1})*[\- .(]*([0-9]{3})[\- .)]*[0-9]{3}[\- .]*[0-9]{4})+)*$/,
        "number": /^[0-9]*/
    }

Regex patterns by input type.

### check

Type: `Array` Default: `[]`

Array of additional input fields to validate.

    "check": [
        "input[type='range']"
    ]

### ignore

Type: `Array` Default: `[]`

Array of input fields *not* to validate.

    "ignore": [
        "input[type='file']",
        "select"
    ]

### errorReport

Type: `Function` Default: `null`

If you want to circumvent Gauntlet's error handling, you can specify your own function. Passes on Gauntlet instance as context, and 2 parameters: array of elements that pass validation and array of elements that fail validation.

### ajaxSubmit

Type: `Function` Default: `null`

Runs function to submit form as AJAX rather than traditional form submission, then returns false.

### scrollToError

Type: `Boolean` Default: `true`

If `true`, will animate the scroll to the first error in the form.

### addTest

Type: `Array` Default: `[]`

If you want to run your inputs (or specific inputs) through some extra validation tests beyond what Gauntlet offers, add them to this array. Each test is structured as an `Object` with 2 keys:

#### condition

Type: `Function`

The condition that determins if this given input needs to run the provided test. (For example, if the input is `type="tel"`, we want to run a special test.) This *must* return `true` or `false` (`true` if we do want to run the test).

#### test

Type: `Function`

The actual validation test for this particular condition. Once again, *must* return `true` or `false` (`true` if it passes validation, false if not).

    $("form").gauntlet({
	    "addTest": [{
	        "condition": function ( elem ) {
	            // Context is GauntletInput instance
	            // Must return true or false
	        },
	        "test": function ( elem ) {
	            // Context is GauntletInput instance
	            // Must return true or false
	        }
	    }]
	});