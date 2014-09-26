/*!
 * PLUGIN v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 * 
 * @author AUTHOR <EMAIL>
 */
;(function (window, document, undefined) {

    "use strict";

    var Temple = function (id, values, target) {

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

    Temple.prototype.html = function (values) {
        var self = this;

        [].forEach.call( this.tmpl.querySelectorAll("[data-id]"), function (elem) {
            var key = elem.getAttribute("data-id");

            if (values.hasOwnProperty(key)) {

                // If the current value is actually an object...
                if (values[key].constructor === Object) {

                    // Let's populate this element's attributes instead
                    self.attribute(elem, values[key]);

                // Otherwise if it's an array...
                } else if (values[key].constructor === Array) {

                    // Let's iterate over the array with this elem
                    self.iterator(elem, values[key]);

                // Otherwise
                } else {

                    if (elem.tagName === "BR" || elem.hasAttribute("data-replace")) {
                        elem.parentNode.replaceChild(document.createTextNode(values[key]), elem);
                    } else {

                        // Populate this element's content
                        elem.textContent = values[key];
                    }
                }
            } else {
                this.tmpl.removeChild(elem);
            }
        });

        return this.tmpl;
    };

    Temple.prototype.iterator = function (elem, values) {
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

    Temple.prototype.attribute = function (elem, values) {
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
    Temple.prototype.appendTo = function (target) {
        var tar = document.getElementById(target);

        tar.appendChild(this.results);
    };

    window.Temple = Temple;

}(window, document));