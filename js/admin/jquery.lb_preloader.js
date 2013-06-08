/**
 * lifeBLUE plugin to autoload images
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
	$.lb_preloader = function(images) {
		var imgObj = new Image();
		$.each(images, function(i, value) {
			imgObj.src = value;
		});
	}
})(jQuery);