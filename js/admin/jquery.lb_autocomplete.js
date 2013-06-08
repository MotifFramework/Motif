/**
 * lifeBLUE Media jQuery Plugin to do autocomplete calls
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
	$.fn.lb_autocomplete = function(customOptions) {
		// combine default and custom options
		var options = $.extend({}, $.fn.lb_autocomplete.defaultOptions, customOptions);
		return this.each(function() {
			$request = $(this);
			// construct the source
			sourceURL = "/autocomplete.html?callback=?&dataSets=" + options.dataSets;
			$request.autocomplete({
				source : function(req, add) {
					$.getJSON(sourceURL, req, function(data) {
						//create array for response objects
						var suggestions = [];
						//process response
						$.each(data, function(i, val){
							suggestions.push(val);
						});
						//pass array to callback
						add(suggestions);
					});
				}
			});
		});
	}
	$.fn.lb_autocomplete.defaultOptions = {
		source : '',
		dataSets : '' // comma separated values
	}
})(jQuery);