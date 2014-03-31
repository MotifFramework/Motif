function loadScript(url, callback, leave) {

	"use strict";

	var done = false,
		head = document.documentElement,
		script = document.createElement("script");

	script.src = url;

	// Attach handlers for all browsers
	script.onload = script.onreadystatechange = function () {
		if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
			done = true;

			if (typeof callback === "function") {
				callback();
			}

			if (!leave) {

				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;
				if (head && script.parentNode && !leave) {
					head.removeChild(script);
				}
			}
		}
	};

	// Use `insertBefore` instead of `appendChild` to circumvent an IE6 bug. This arises when a base node is used.
	head.insertBefore(script, head.firstChild);

	// We handle everything using the script element injection
	return 'Script Injected.';
}