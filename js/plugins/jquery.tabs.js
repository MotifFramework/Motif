/* LB Tabbed Module Plugin, v. 0.1 (4/4/12) */
(function($) {
	var _v	=	{

			// System Variables
			"pluginName"	:	"tabs",
			
			// Class Name
			"activeClass"	:	"is-current"
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var $this			=	$(this),
					    s				=	$.extend(true, _v, o),
						
						// Grab Tab Variables
					    module				=	$this,
					    moduleID			=	module.attr("data-tabs"),
					    nav					=	module.find("[data-tabs-nav='" + moduleID + "']"),
					    navItems			=	nav.find("li"),
					    navFirst			=	navItems.filter(function() {
				    								return $(this).is(":first-child");
				    							}),
					    navCurrent			=	navItems.filter(function() {
				    								return $(this).hasClass(s.activeClass);
				    							}),
					    navCurrentTargetID	=	navCurrent.find("a").attr("href"),
					    navCurrentTarget	=	module.find(navCurrentTargetID),
					    sections			=	module.find("[data-tabs-section='" + moduleID + "']"),
					    sectionFirstID		=	navFirst.find("a").attr("href"),
					    sectionFirst		=	module.find(sectionFirstID),
					    sectionCurrent		=	sections.filter(function() {
				    								return $(this).hasClass(s.activeClass);
				    							}),
				    							
				    	// Put current nav and section in an object literal for easy refreshing later on
				    	t					=	{
				    		"navCurrent"		:	navCurrent,
				    		"sectionCurrent"	:	sectionCurrent
				    	};
					
					// In fact, let's refresh the current nav and section items right now
					_m.refresh.call($this, {
						"s"			:	s,
						"t"			:	t,
						"navItems"	:	navItems,
						"sections"	:	sections
					});

					// If there's no nav item labeled as current..
					if (t.navCurrent.length < 1) {
					
						// If, however, a section is labeled as current...
						if (t.sectionCurrent.length > 0) {
						
							// Find the corresponding nav item and label it as current
							nav.find("a[href='#" + t.sectionCurrent.attr("id") + "']").closest("li").addClass(s.activeClass);
						} else {
						
							// Otherwise label the first nav item and its corresponding section as current
							navFirst.addClass(s.activeClass);
							sectionFirst.addClass(s.activeClass);
						}
					
					// If, however, there is a nav item labeled as current...
					} else {
					
						// If the corresponding section doesn't already have a current class...
						if (!navCurrentTarget.hasClass(s.activeClass)) {
						
							// Go through the sections, make sure none of those still have a current class
							t.sectionCurrent.each(function () {
								$(this).removeClass(s.activeClass);
							});
							
							// Then add class to the current nav item's target section
							navCurrentTarget.addClass(s.activeClass);
						}
					}
					
					// Once again, refresh current items
					_m.refresh.call($this, {
						"s"			:	s,
						"t"			:	t,
						"navItems"	:	navItems,
						"sections"	:	sections
					});
					
					// Watch nav items for click
					navItems.on("click", "a", function () {
						var $this	=	$(this);
						
						// Trigger tab change method
						_m.triggerTab.call($this, {
							"s"			:	s,
							"t"			:	t,
							"module"	:	module,
							"navItems"	:	navItems,
							"sections"	:	sections
						});
						
						return false;
					});
					
				});
			},
			
			// Refresh current nav and section items
			"refresh"	:	function (o) {
				$.extend(true, o.t, {
					"sectionCurrent"	:	o.sections.filter(function() {
												return $(this).hasClass(o.s.activeClass);
											}),
					"navCurrent"		:	o.navItems.filter(function() {
												return $(this).hasClass(o.s.activeClass);
											})
				});
			},
			
			// Trigger tab change
			"triggerTab"	:	function (o) {
				var	$this			=	$(this),
					triggerItem		=	$this.closest("li"),
					targetID		=	$this.attr("href"),
					targetSection	=	o.module.find(targetID);
				
				// If the trigger item isn't the "current" nav item...
				if (!triggerItem.hasClass(o.s.activeClass)) {
				
					// Remove current class on other nav items
					o.t.navCurrent.each(function () {
						$(this).removeClass(o.s.activeClass);
					});
					
					// Add class to trigger item
					triggerItem.addClass(o.s.activeClass);
				}
				
				// If the target of the trigger item doesn't have the current class...
				if (!targetSection.hasClass(o.s.activeClass)) {
				
					// Remove current class from other section items
					o.t.sectionCurrent.each(function () {
						$(this).removeClass(o.s.activeClass);
					});
					
					// Add class to target section item
					targetSection.addClass(o.s.activeClass);
				}
				
				// Refresh current nav and section items
				_m.refresh.call($this, {
					"s"			:	o.s,
					"t"			:	o.t,
					"navItems"	:	o.navItems,
					"sections"	:	o.sections
				});
				
			}
		};

	$.fn[_v.pluginName] = function(m) {
		if (_m[m]) {
            return _m[m].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!m || typeof m == "object") {
            return _m.init.apply(this, arguments);
        } else {
            console.log(_v.pluginName + ": Invalid method passed");
        }
	};

})(jQuery);