/*!
 * Motif Side-Scroller v0.1.0 (2012-07-02)
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $ ) {
	var _v	=	{

			// System Variables
			"pluginName"		:	"sideScroller",

			// Classes
			"maskClass"			:	"scroller-mask",
			"itemsClass"		:	"scroll",
			"directionClass"	:	"scroller-button",

			"speed"				:	200,

			// On Init
			"onInit"			:	function () {},

			// On Trigger
			"onTrigger"			:	function () {},

			// On Complete
			"onComplete"		:	function () {}
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var $this				=	$(this),
						_vCopy			=	$.extend(true, {}, _v),
						s				=	$.extend(true, _vCopy, o),

						// Grab Variables
						scrollerWrapper		=	$this.wrapInner('<div class="' + s.maskClass + '"></div>'),
						scrollerMask		=	scrollerWrapper.find("." + s.maskClass),
						scrolls				=	scrollerMask.find("." + s.itemsClass),

						scrollButton		=	$('<button class="' + s.directionClass + '"></button>'),
						leftButton			=	scrollButton.clone().addClass("left").html("Scroll Left"),
						rightButton			=	scrollButton.clone().addClass("right").html("Scroll Right"),

						scrollerWidth		=	scrollerWrapper.outerWidth(),
						maskWidth			=	0,
						pixelsPerSecond		=	s.speed,
						speed				=	0,
						distanceToScroll,
						settings;

					// If onInit callback...
					if(typeof s.onInit === "function") {
						s.onInit($this);
					}


					scrolls.each(function () {
						var $this			=	$(this),
							leftPosition	=	maskWidth,
							scrollWidth		=	$this.outerWidth(),
							scrollMargins	=	parseInt($this.css("margin-left"), 10) + parseInt($this.css("margin-right"), 10),
							scrollStats 	=	{
													"beginningPosition" : leftPosition,
													"endingPosition"	: leftPosition + scrollWidth
												};

						$this.data("scrollSettings", scrollStats);
						maskWidth			+=	scrollWidth + scrollMargins;
					});
					scrollerMask.css({
						"width"	:	maskWidth + "px"
					});
					distanceToScroll		=	maskWidth - scrollerWidth;

					// Plugin Settings
					settings				=	{
													"scrollerWidth"		:	scrollerWidth,
													"pixelsPerSecond"	:	pixelsPerSecond,
													"distanceToScroll"	:	distanceToScroll
												},
					currentPosition			=	parseInt(scrollerMask.css("left"), 10);

					// Add settings to data object
					$this.data("scrollerSettings", settings);
					$this.data("scrollPosition", currentPosition);

					// Insert Directional Buttons
					scrollerWrapper.after(rightButton).after(leftButton);

					rightButton.on({
						mouseenter			:	function () {
							_m.scrollLeft.call($this, scrollerMask);
						},
						mouseleave			:	function () {
							_m.stopScroll.call($this, scrollerMask);
						}
					});
					leftButton.on({
						mouseenter			:	function () {
							_m.scrollRight.call($this, scrollerMask);
						},
						mouseleave			:	function () {
							_m.stopScroll.call($this, scrollerMask);
						}
					});
				});
			},
			"scrollLeft"	:	function (o) {
				var	$this			=	$(this),
					data			=	$this.data("scrollerSettings"),
					scrollerMask	=	o,
					currentPosition	=	$this.data("scrollPosition"),
					speed			=	((data.distanceToScroll + currentPosition) / data.pixelsPerSecond) * 1000;

				scrollerMask.animate({
					left		:	"-" + data.distanceToScroll + "px"
				}, speed, "linear");
			},
			"scrollRight"	:	function (o) {
				var	$this			=	$(this),
					data			=	$this.data("scrollerSettings"),
					scrollerMask	=	o,
					currentPosition	=	$this.data("scrollPosition"),
					speed			=	((currentPosition * -1) / data.pixelsPerSecond) * 1000;

				scrollerMask.animate({
					left		:	"0px"
				}, speed, "linear");
			},
			"stopScroll"	:	function (o) {
				var	$this			=	$(this),
					scrollerMask	=	o,
					currentPosition	=	parseInt(scrollerMask.css("left"), 10);

				scrollerMask.stop();
				$this.data("scrollPosition", currentPosition);
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