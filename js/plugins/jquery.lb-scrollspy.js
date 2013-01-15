/* LB Scrollspy Plugin, v. 0.1 (8/22/12) */
(function($) {
	var _v	=	{

			// System Variables
			"pluginName"	:	"lb_scrollspy",
			
			// Other Variables
			"activeClass"	:	"is-current",
			"threshold"		:	100,
			
			// On Init
			"onInit"		:	function () {},
			
			// On Change
			"onChange"		:	function () {},

			// On Complete
			"onComplete"	:	function () {}
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var $this			=	$(this),
						s				=	$.extend(true, _v, o),

						// Grab Variables
						nav				=	$this,
						allData			=	nav.data(),
						browserWindow	=	$(window),						
						
						settings		=	{
												"origData"		:	allData,
												"activeClass"	:	s.activeClass,
												"threshold"		:	s.threshold
											};

					// Add settings to data object
					$this.data("scrollspySettings", settings);

					_m.refresh.call($this);

					// If onInit callback...
					if(typeof s.onInit === "function") {
						s.onInit($this);
					}

					// On scroll...
					browserWindow.on("scroll", function () {

						// Call update method
						_m.update.call($this);
					}).on("resize", function () {

						// Call update method
						_m.refresh.call($this);
					});
				});
			},

			"refresh"	: 	function ()	{
				var	$this				=	$(this),
					data				=	$this.data("scrollspySettings"),
					navLinks			=	$this.find("a"),
					targetElems			=	[];

				navLinks.each(function () {
					var	navTargetID		=	$(this).attr("href"),
						navTarget		=	$(navTargetID),
						navTargetOffset;
						
					
					if (!navTarget.length) {
						return;
					}
					
					navTargetOffset		=	navTarget.offset().top;
					
					var	navTargetObject	=	{
												"href"		: 	navTargetID,
												"topOffset"	: 	navTargetOffset,
												"elem"		: 	navTarget
											};
					
					targetElems.push(navTargetObject);
				});
				targetElems.sort(function (a, b) {
					return a.topOffset-b.topOffset;
				});
				$this.data("scrollspyTargets", targetElems);
				_m.update.call($this);
			},

			// Trigger reveal
			"update"	:	function () {
				var	$this			=	$(this),
					data			=	$this.data("scrollspySettings"),
					targetData		=	$this.data("scrollspyTargets"),
					scrollPosition	=	$(window).scrollTop(),
					currentElem		=	false;

				for (var i = 0; i < targetData.length; i++) {
					if (targetData[i].topOffset >= scrollPosition && targetData[i].topOffset < scrollPosition + data.threshold)	{
						currentElem	=	targetData[i];
					} else if (targetData[i].topOffset < scrollPosition)	{
						currentElem	=	targetData[i];
					}
				};
				$this.data("scrollspyCurrent", currentElem);
				_m.updateNav.call($this);
			},
			
			"updateNav"	: 	function ()	{
				var	$this			=	$(this),
					data			=	$this.data("scrollspySettings"),
					currentElemData	=	$this.data("scrollspyCurrent"),
					updatedNavItem	=	$this.find("a[href='" + currentElemData.href + "']");

				if (!updatedNavItem.hasClass(data.activeClass) || currentElemData === false)	{
					$this.find("." + data.activeClass).removeClass(data.activeClass);

					if (currentElemData !== false)	{
						updatedNavItem.addClass(data.activeClass);
					}
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