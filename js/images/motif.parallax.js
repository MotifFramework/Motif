/* Motif Parallax Plugin, v. 0.1 (6/21/12) */
(function($) {
	var _v	=	{

			// System Variables
			"pluginName"	:	"parallax",
			"horizontal"	:	"50%",
			"adjustment"	:	0,
			"inertia"		:	0.1,

			// On Init
			"onInit"		:	function () {}
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var $this			=	$(this),
						s				=	$.extend(true, _v, o),

						// Grab Variables
						elem			=	$this,
						allData			=	elem.data(),
						browserWindow	=	$(window),
						windowHeight	=	browserWindow.height(),
						scrollPosition	=	browserWindow.scrollTop(),
						elemPosition	=	elem.offset().top,
						elemHeight		=	elem.outerHeight(),

						settings		=	{
												"origData"		:	allData,
												"windowHeight"	:	windowHeight,
												"elemPosition"	:	elemPosition,
												"elemHeight"	:	elemHeight,
												"horizontal"	:	s.horizontal,
												"adjustment"	:	s.adjustment,
												"inertia"		:	s.inertia,
												"onInit"		:	s.onInit
											};

					// Add settings to data object
					$this.data("parallaxSettings", settings);

					// If onInit callback...
					if(typeof s.onInit === "function") {
						s.onInit($this);
					}

					// If window is being resized...
					browserWindow.resize(function () {

						// Update window height variable
						windowHeight	=	browserWindow.height();

						// Update data object with new height
						$this.data("windowHeight", windowHeight);
					});

					// On scroll...
					browserWindow.bind("scroll", function () {

						// Call update method
						_m.update.call($this);
					});
				});
			},

			// Trigger reveal
			"update"	:	function () {
				var	$this			=	$(this),
					data			=	$this.data("parallaxSettings"),
					scrollPosition	=	$(window).scrollTop();

				// If element is not in view...
				if (data.elemPosition + data.elemHeight < scrollPosition || data.elemPosition > scrollPosition + data.windowHeight) {
					return;
				}

				// Update background position with equation
				$this.css({
					"background-position"	:	data.horizontal + " " + ((data.adjustment - scrollPosition + data.elemPosition) * data.inertia) + "px"
				});
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