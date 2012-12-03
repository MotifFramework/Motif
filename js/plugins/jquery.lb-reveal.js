/* LB Reveal Plugin, v. 0.1 (5/16/12) */
(function($) {
	var _v	=	{

			// System Variables
			"pluginName"	:	"lb_reveal",
			"trigger"		:	"hover",
			"transition"	:	"fade",
			"exclusive"		:	"no",

			// Class Name
			"activeClass"	:	"is-current",
			"visitedClass"	:	"is-visited",
			
			"hoverIntent"	:	{
				"sensitivity"	:	10,
				"interval"		:	50,
				"timeout"		:	0
			},
			
			// On Init
			"onInit"		:	function () {},
			
			// On Reveal
			"onReveal"		:	function () {},

			// On Hide
			"onHide"		:	function () {}
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var $this			=	$(this),
						_vCopy			=	$.extend(true, {}, _v),
						s				=	$.extend(true, _vCopy, o),

						// Grab Variables
						triggerElem		=	$this,
						allData			=	triggerElem.data(),
						revealTargetID	=	triggerElem.attr("data-reveal"),
						revealTarget	=	$("#" + revealTargetID),
						revealGroupID	=	triggerElem.attr("data-reveal-group"),
						revealGroup		=	$("[data-reveal-group='" + revealGroupID + "']"),
						
						settings		=	{
												"origData"		:	allData,
												"triggerElem"	:	triggerElem,
												"revealTarget"	:	revealTarget,
												"revealGroup"	:	revealGroup,
												"trigger"		:	s.trigger,
												"transition"	:	s.transition,
												"activeClass"	:	s.activeClass,
												"visitedClass"	:	s.visitedClass,
												"exclusive"		:	s.exclusive,
												"onInit"		:	s.onInit,
												"onReveal"		:	s.onReveal,
												"onHide"		:	s.onHide
											},
						data;

					// Add settings to data object
					$this.data("revealSettings", settings);
					data				=	$this.data("revealSettings");
					
					// If onInit callback...
					if(typeof s.onInit === "function") {
						s.onInit($this, $(this));
					}

					// On Hover...
					if (s.trigger === "hover") {

						if ($.fn.hoverIntent && s.hoverIntent) {
							$this.hoverIntent({
								sensitivity	:	s.hoverIntent.sensitivity,
								interval	:	s.hoverIntent.interval,
								over		:	function () {
									_m.revealTarget.call($this);
								},
								timeout		:	s.hoverIntent.timeout,
								out			:	function () {
									_m.hideTarget.call($this);
								}
							});
						} else {
							$this.on({
								mouseenter:	function () {
									_m.revealTarget.call($this);
								},
								mouseleave:	function () {
									_m.hideTarget.call($this);
								}
							});
						}
					} 

					// On Click...
					else if (s.trigger === "click") {
						$this.on("click", function () {

							// If it has the active class...
							if ($this.hasClass(s.activeClass)) {
								
								// If it's not set to "radio", hide it
								if (data.exclusive !== "radio") {
									_m.hideTarget.call($this);
								}
							} else {
								if (data.exclusive === "yes" || data.exclusive === "radio") {
									revealGroup.each(function () {
										_m.hideTarget.call($(this));
									});
								}
								_m.revealTarget.call($this);
							}
							return false;
						});
					}
					
					// On Select...
					else if (s.trigger === "select") {
						$this.parent().on("change", function () {
					
							// If it has the active class...
							if ($(this).val() === $this.attr("data-reveal-value")) {
								
								_m.revealTarget.call($this);
							} else {
								_m.hideTarget.call($this);
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
				
				if(typeof o.onReveal === "function") {
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

				if(typeof o.onHide === "function") {
					o.onHide.call($this, $(this));
				}
			}
		};

	$.fn[_v.pluginName] = function(m) {
		if (_m[m]) {
            return _m[m].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!m || typeof m === "object") {
            return _m.init.apply(this, arguments);
        } else {
            console.log(_v.pluginName + ": Invalid method passed");
        }
	};

})(jQuery);