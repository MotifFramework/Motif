/* LB Scrolling Plugin, v. 0.1 (1/23/12) */
(function($) {
	var _v	=	{

			// System Variables
			"pluginName"	:	"lb_scrolling",
			"speed"			:	350,
			"offset"		:	20,
			"onInit"		:	function () {}
		},

		// Methods
		_m	= {
			"init"	:	function(o, callback) {

				return this.each(function() {
					var	$this			=	$(this),
						s				=	$.extend(true, _v, o),

						// Get the top offset of the target anchor
						target			=	$this.attr("id"),
						targetOffset	=	$("#" + target).offset(),
						targetTop		=	targetOffset.top,
						
						// Check for duplicate callback runs
						callbackRun		=	false;

					if(typeof s.onInit === "function") {
						s.onInit();
					}

					// Go to that anchor by setting the body scroll top to anchor top
					$("html, body").animate({
						scrollTop	:	targetTop - s.offset
					}, s.speed, function() {

						// If there's a callback function, run it
						if(typeof callback === "function") {

							// Unless it has already been run
							if(!callbackRun) {
								callback();
								callbackRun	=	true;
							}
						}
					});
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