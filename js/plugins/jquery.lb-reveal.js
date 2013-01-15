/* LB Reveal Plugin, v. 0.1 (5/16/12) */
(function ($) {

	"use strict";

	// Variables
	var vars	=	{

			// System Variables
			"pluginName"		:	"lb_reveal",
			"trigger"			:	"click",
			"exclusive"			:	"no",

			// Class Name
			"activeClass"		:	"is-current",
			"visitedClass"		:	"is-visited",

			"hoverIntent"		:	{
				"sensitivity"	:	10,
				"interval"		:	50,
				"timeout"		:	0
			},

			// On Init
			"onInit"			:	null,

			// On Reveal
			"onReveal"			:	null,

			// On Hide
			"onHide"			:	null
		},

		// Methods
		methods	= {
			"init"	:	function (o, callback) {

				return this.each(function () {
					var $this				=	$(this),
						s					=	$.extend(true, {}, vars, o),

						// Grab Variables
						trigger_elem		=	$this,
						all_data			=	trigger_elem.data(),
						reveal_target_id	=	trigger_elem.attr("data-reveal"),
						reveal_target		=	$("#" + reveal_target_id),
						reveal_group_id		=	trigger_elem.attr("data-reveal-group"),
						reveal_group		=	$("[data-reveal-group='" + reveal_group_id + "']"),

						data				=	{
							"origData"		:	all_data,
							"triggerElem"	:	trigger_elem,
							"revealTarget"	:	reveal_target,
							"revealGroup"	:	reveal_group,
							"trigger"		:	s.trigger,
							"activeClass"	:	s.activeClass,
							"visitedClass"	:	s.visitedClass,
							"exclusive"		:	s.exclusive,
							"onInit"		:	s.onInit,
							"onReveal"		:	s.onReveal,
							"onHide"		:	s.onHide
						};

					// Add settings to data object
					$this.data("revealSettings", data);

					// If onInit callback...
					if (typeof s.onInit === "function") {
						s.onInit($this, $(this));
					}

					// On Hover...
					if (s.trigger === "hover") {

						// If the Hover Intent plugin is available...
						if ($.fn.hoverIntent && s.hoverIntent) {

							// ...use it!
							$this.hoverIntent({
								sensitivity	:	s.hoverIntent.sensitivity,
								interval	:	s.hoverIntent.interval,
								over		:	function () {
									methods.revealTarget.call($this);
								},
								timeout		:	s.hoverIntent.timeout,
								out			:	function () {
									methods.hideTarget.call($this);
								}
							});

						// Otherwise...
						} else {

							// ...bind on `mouseenter` and `mouseleave`
							$this.on({
								mouseenter:	function () {
									methods.revealTarget.call($this);
								},
								mouseleave:	function () {
									methods.hideTarget.call($this);
								}
							});
						}

					// On Click...
					} else if (s.trigger === "click") {
						$this.on("click", function () {

							// If it has the active class...
							if ($this.hasClass(s.activeClass)) {

								// If it's not set to "radio", hide it
								if (data.exclusive !== "radio") {
									methods.hideTarget.call($this);
								}

							// If it's not active...
							} else {

								// If it's exclusive or radio...
								if (data.exclusive === "yes" || data.exclusive === "radio") {

									// ...cycle through the group and hide all the others
									reveal_group.each(function () {
										methods.hideTarget.call($(this));
									});
								}

								// Then, reveal this current target
								methods.revealTarget.call($this);
							}
							return false;
						});
					}
				});
			},

			// Trigger reveal
			"revealTarget"	:	function () {
				var	$this			=	$(this),
					o				=	$this.data("revealSettings");

				$this.addClass(o.activeClass);
				o.revealTarget.addClass(o.activeClass);

				if (typeof o.onReveal === "function") {
					o.onReveal.call($this, $(this));
				}
			},

			// Trigger hide
			"hideTarget"	:	function () {
				var	$this			=	$(this),
					o				=	$this.data("revealSettings");

				// Add visited class
				if (!$this.hasClass(o.visitedClass)) {
					$this.addClass(o.visitedClass);
				}

				// Remove Active Class
				$this.removeClass(o.activeClass);

				// Add visited class
				if (!o.revealTarget.hasClass(o.visitedClass)) {
					o.revealTarget.addClass(o.visitedClass);
				}

				// Remove Active Class
				o.revealTarget.removeClass(o.activeClass);

				if (typeof o.onHide === "function") {
					o.onHide.call($this, $(this));
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