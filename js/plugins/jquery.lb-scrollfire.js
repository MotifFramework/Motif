/**
 * jQuery Scrollfire
 * Fire off events based on scroll position and direction.
 * 
 * @version 0.5 (12/07/12)
 * @author Jonathan Pacheco (jonathan@lifeblue.com)
 * 
 * Copyright 2012- Lifeblue
 */

(function ($) {

	"use strict";

	// Variables
	var vars	=	{

			// System Variables
			"pluginName"	:	"lb_scrollfire",

			// On Init
			"onInit"		:	null,

			// Events to Fire
			"events"	:	[
				/*
				{
					"trigger"	:	200,
					"event"		:	function () {},
					"repeat"	:	false
				}
				*/
			]
		},

		// Methods
		methods	=	{

			// Init method, run on initialization
			"init"	:	function (o) {

				// Loop through each instance of this plugin and return it
				return this.each(function () {

					// Variables
					var $this			=	$(this),
						s				=	$.extend(true, {}, vars, o),

						old_scroll_pos	=	0,

						// Plugin settings
						settings		=	{
							"events"		:	s.events
						};

					// Add settings to data object
					$this.data("scrollfireSettings", settings);
					$this.data("scrollfirePosition", old_scroll_pos);

					// If onInit callback...
					if (typeof s.onInit == "function") {
						s.onInit($this);
					}

					// On scroll...
					$(window).on("scroll", function () {

						// Call update method
						methods.update.call($this);

					});
				});
			},

			// Update method, updates scroll position and fires off events if applicable
			"update"	:	function () {

				// Variables
				var	$this			=	$(this),
					data			=	$this.data("scrollfireSettings"),
					old_scroll_pos	=	$this.data("scrollfirePosition"),
					scroll_position	=	$(window).scrollTop(),
					i,
					direction;

				// For each object in the events array...
				for (i = data.events.length - 1; i >= 0; i -= 1) {

					// If the event has *not* been fired or `repeat` is true...
					if ((typeof data.events[i].fired === "undefined" || !data.events[i].fired) || data.events[i].repeat) {

						// If the scroll position equals our target...
						if (
							(
								data.events[i].trigger <= scroll_position && data.events[i].trigger >= old_scroll_pos
							) || (
								data.events[i].trigger >= scroll_position && data.events[i].trigger <= old_scroll_pos
							)
						) {
							// ...determine direction...
							if (scroll_position > old_scroll_pos) {
								direction	=	"down";
							} else if (scroll_position < old_scroll_pos) {
								direction	=	"up";
							}

							// ...fire off our event
							data.events[i].event(direction);

							// Extend the object to reflect that the event has been fired
							data.events[i].fired	=	true;
						}
					}
				}

				// Re-set data settings and last-known scroll position
				$this.data("scrollfireSettings", data);
				$this.data("scrollfirePosition", scroll_position);
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