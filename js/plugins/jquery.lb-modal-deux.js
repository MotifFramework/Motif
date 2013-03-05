/**
 * LB Modal
 * An unobtrusive, minimally destructive modal triggering jQuery plugin.
 * 
 * @version	0.1 (MM/DD/YY)
 * @author	Jonathan Pacheco (jonathan@lifeblue.com)
 * 
 * Copyright 2013 Lifeblue
 */

(function ($) {

	"use strict";

	// Variables
	var vars	=	{

			// System Variables
			"pluginName"	:	"lb_modal",

			// Options
			"findOffsets"	:	true,
			"overlay"		:	true,
			"trigger"		:	"click",

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
			"init"			:	function (o) {

				// Loop through each instance of this plugin and return it
				return this.each(function () {
					var $this			=	$(this),
						s				=	$.extend(true, {}, vars, o),

						// Grab variables
						modal_value		=	$this.attr("data-modal"),
						modal_link		=	$this.attr("data-modal-href"),
						orig_data		=	$this.data(),
						modal_content,

						// Plugin settings
						data			=	{
							"modalValue"	:	modal_value,
							"origData"		:	orig_data
						};

					if (modal_value === "ajax" || modal_value === "img") {
						if (typeof modal_link === "undefined" || modal_link === "") {
							modal_link	=	$this.attr("href");
						}
						data.modalLink	=	modal_link;
					}

					// Add settings to data object
					$this.data("modalSettings", data);

					if (modal_value !== "ajax" && modal_value !== "img") {
						modal_content	=	methods.load.call($this, $(this));
					}
					$this.on(s.trigger, function () {
						if (modal_value === "ajax" || modal_value === "img") {
							modal_content	=	methods.load.call($this, $(this));
						}
						methods.activate.call($this, modal_content);
						return false;
					});

					// If onInit callback...
					if (typeof s.onInit === "function") {
						s.onInit($this);
					}
				});
			},
			"activate"		:	function (o) {
				var	$this			=	$(this),
					data			=	$this.data("modalSettings");

				$(o).removeClass("modal").prependTo("body");
			},
			"deactivate"	:	function (o) {

			},
			"load"			:	function (o) {
				var	$this			=	$(this),
					data			=	$this.data("modalSettings"),
					modal_content;

				if (data.modalValue === "ajax" || data.modalValue === "img") {
					if (data.modalValue === "img") {
						modal_content	=	$("<div class='modal'><img src='" + data.modalLink + "' /></div>");
					} else {
						modal_content	=	$("<div class='modal' />");
						modal_content
							.load(data.modalLink, function (response, status, xhr) {
								if (status === "error") {
									modal_content.html("Sorry, but there was an error: " + xhr.status + " " + xhr.statusText);
								}
							});
					}
				} else if ($("#" + data.modalValue).length) {
					modal_content	=	$("#" + data.modalValue).addClass("modal");
				} else {
					alert("gah!");
				}

				return modal_content;
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