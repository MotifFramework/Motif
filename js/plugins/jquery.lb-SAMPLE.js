/**
 * LB_PLUGIN_NAME
 * DESC
 * 
 * @version	0.X (MM/DD/YY)
 * @author	FULL_NAME (NAME@lifeblue.com)
 * 
 * Copyright 2013 Lifeblue
 */

(function ($) {

	"use strict";

	// Variables
	var vars	=	{

			// System Variables
			"pluginName"	:	"lb_PLUGIN",

			// On Init
			"onInit"		:	null,

			// On Trigger
			"onTrigger"		:	null,

			// On Complete
			"onComplete"	:	null
		},

		// Methods
		methods	=	{

			// Init method, run on initialization
			"init"	:	function (o) {

				// Loop through each instance of this plugin and return it
				return this.each(function () {
					var $this			=	$(this),
						s				=	$.extend(true, {}, vars, o),

						// Grab variables
						orig_data		=	$this.data(),

						// Plugin settings
						data			=	{
							"origData"	:	orig_data
						};

					// Add settings to data object
					$this.data("PLUGIN_SETTINGS", data);

					// If onInit callback...
					if (typeof s.onInit === "function") {
						s.onInit($this);
					}
				});
			}
		};

	// Initialize plugin
	$.fn[vars.pluginName] = function (m) {

		// If a method is called by name...
		if (methods[m]) {

			// ...return specified method.
			return methods[m].apply(this, Array.prototype.slice.call(arguments, 1));

		// ...else if no method is called or an object is passed...
		} else if (!m || typeof m === "object") {

			// ...return the "init" method.
			return methods.init.apply(this, arguments);

		// ...otherwise...
		} else {

			// ...log an error.
			console.log(vars.pluginName + ": Invalid method passed");
		}
	};

}(jQuery));