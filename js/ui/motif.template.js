/*!
 * PLUGIN v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 * 
 * @author AUTHOR <EMAIL>
 */
;(function (window, document, undefined) {

    "use strict";

    var Template = function (id, values, target) {

        // Get the desired template by ID
        this.original = id.nodeName ? id : document.getElementById(id);
        this.tmpl = this.original.content.cloneNode(true);

        // Populate this template with the values
        this.html(values);

        // If a target was provided
        if (target) {
            // Append it to the target
            this.appendTo(target);
        }

        // Return the cloned node
        return this.tmpl;
    };

    Template.prototype.html = function (values) {
        var key;

        // Looping through the object values...
        for (key in values) {
            if (values.hasOwnProperty(key)) {

                // Get the sub-target of this key from the template
                this[key] = this.tmpl.querySelector("[data-id='" + key + "']");

                // If the current value is actually an object...
                if (values[key].constructor === Object) {

                    // Let's populate this element's attributes instead
                    this.attribute(this[key], values[key]);

                // Otherwise
                } else if (values[key].constructor === Array) {

                    // Let's populate this element's attributes instead
                    this.iterator(this[key], values[key]);

                // Otherwise
                } else {


                    if (this[key].tagName === "BR" || this[key].hasAttribute("data-replace")) {
                        this[key].parentNode.replaceChild(document.createTextNode(values[key]), this[key]);
                    } else {

                        // Populate this element's content
                        this[key].textContent = values[key];
                    }
                }
            }
        }

        return this.tmpl;
    };

    Template.prototype.iterator = function (elem, values) {
        var key = 0,
            valuesLength = values.length,
            elemCopy;

        for ( ; key < valuesLength; key += 1) {
            elemCopy = elem.cloneNode();

            if (values[key].constructor === Object) {

                // Let's populate this element's attributes instead
                this.attribute(elemCopy, values[key]);
            } else {
                elemCopy.textContent = values[key];
            }
            elem.parentNode.insertBefore(elemCopy, elem);
        }
        elem.parentNode.removeChild(elem);
    };

    Template.prototype.attribute = function (elem, values) {
        var key;

        // Looping through the object of attribute values...
        for (key in values) {
            if (values.hasOwnProperty(key)) {

                // If the attribute is "html"
                if (key === "html") {

                    // Just replace the elem's content
                    elem.textContent = values[key];

                // Otherwise
                } else {

                    // Set the attribute based on the key/value pair
                    elem.setAttribute(key, values[key]);
                }
            }
        }

        return elem;
    };
    Template.prototype.appendTo = function (target) {
        var tar = document.getElementById(target);

        tar.appendChild(this.results);
    };

    window.Template = Template;

}(window, document));