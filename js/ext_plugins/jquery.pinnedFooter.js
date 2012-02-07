/******************************************************
	* jQuery plug-in
	* Easy Pinned Footer
	* Developed by J.P. Given (http://johnpatrickgiven.com)
	* Useage: anyone so long as credit is left alone
******************************************************/
(function($) {
	// plugin definition
	$.fn.pinFooter = function(options) {		
		// Get the height of the footer and window + window width
		var wH = $(window).height();
		var wW = getWindowWidth();
		var fH = $(this).outerHeight(true);
		var bH = $("body").outerHeight(true);
		var mB = parseInt($("body").css("margin-bottom"));
		var oT = $("#"+options.anchor+"").offset().top-getWindowHeight();
		
		if (options.type == 'relative') {
			if (bH > getWindowHeight()) {
				$(this).css("position","absolute");
				$(this).css("width",wW + "px");
				$(this).css("top",bH - fH + "px");
				$("body").css("overflow-x","hidden");
			} else {
				$(this).css("position","fixed");
				$(this).css("width",wW + "px");
				$(this).css("top",wH - fH + "px");
			}
		} else { // Pinned option
			// Set CSS attributes for positioning footer
			$(this).css("position","fixed");
			$(this).css("width",wW + "px");
			$(this).css("top",wH - fH + "px");
			$(this).addClass("relative-save-footer");
			$(this).removeClass("fixed-save-footer");
		}
				
		var $elem = $(this);
		
		$(window).resize(function(){
	
			var wH = $(window).height();
			var wW = getWindowWidth();
			var fH = $elem.outerHeight(true);
			var bH = $("body").outerHeight(true);
			var mB = parseInt($("body").css("margin-bottom"));
			var oT = $("#"+options.anchor+"").offset().top-getWindowHeight();
			
			var windowScrollTop = $(window).scrollTop();
			
			if(windowScrollTop >= oT){
				$elem.css("position","relative");
				$elem.css("width","auto");
				$elem.css("top","0px");
				$elem.css("height","auto");
				$elem.addClass("fixed-save-footer");
				$elem.removeClass("relative-save-footer");
			}else{
				$elem.css("position","fixed");
				$elem.css("width",wW + "px");
				$elem.css("top",wH - fH + "px");
				$elem.addClass("relative-save-footer");
				$elem.removeClass("fixed-save-footer");
			}
			
			
		});
		
		$(window).scroll(function(){
	
			var wH = $(window).height();
			var wW = getWindowWidth();
			var fH = $elem.outerHeight(true);
			var bH = $("body").outerHeight(true);
			var mB = parseInt($("body").css("margin-bottom"));
			var oT = $("#"+options.anchor+"").offset().top-getWindowHeight();
			
			var windowScrollTop = $(window).scrollTop();
			
			if(windowScrollTop >= oT){
				$elem.css("position","relative");
				$elem.css("width","auto");
				$elem.css("top","0px");
				$elem.css("height","auto");
				$elem.addClass("fixed-save-footer");
				$elem.removeClass("relative-save-footer");
			}else{
				$elem.css("position","fixed");
				$elem.css("width",wW + "px");
				$elem.css("top",wH - fH + "px");
				$elem.addClass("relative-save-footer");
				$elem.removeClass("fixed-save-footer");
			}
			
			
		});
		
	};

	// private function for debugging
	function debug($obj) {
		if (window.console && window.console.log) {
			window.console.log('Window Width: ' + $(window).width());
			window.console.log('Window Height: ' + $(window).height());
		}
	};

	

	// Dependable function to get Window Width
	function getWindowWidth() {
		var windowWidth = 0;
		if (typeof(window.innerWidth) == 'number') {
			windowWidth = window.innerWidth;
		}
		else {
			if (document.documentElement && document.documentElement.clientWidth) {
				windowWidth = document.documentElement.clientWidth;
			}
			else {
				if (document.body && document.body.clientWidth) {
					windowWidth = document.body.clientWidth;
				}
			}
		}
		return windowWidth;
	};
})(jQuery);

// Dependable function to get Window Height
function getWindowHeight() {
	var windowHeight = 0;
	if (typeof(window.innerHeight) == 'number') {
		windowHeight = window.innerHeight;
	}
	else {
		if (document.documentElement && document.documentElement.clientHeight) {
			windowHeight = document.documentElement.clientHeight;
		}
		else {
			if (document.body && document.body.clientHeight) {
				windowHeight = document.body.clientHeight;
			}
		}
	}
	return windowHeight;
};