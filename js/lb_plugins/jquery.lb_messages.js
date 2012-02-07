/**
 * lifeBLUE Media jQuery plugin to output admin errors and messages.
 * @copyright 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
	$.lb_messages = function () {
		// get the json messages
		$.getJSON("/admin/messages.html?callback=?", "", function(data) {
			//process response
			var typeSelector = "#" + data.type + "Message";
			var textSelector = "#" + data.type + "Text";
			var messageText = "";
			for(i=0; i<=data.messages.length-1; i=i+1) {
				messageText = messageText + '<div style="padding-top:3px;"><span>' + data.messages[i].title + '</span><br />' + data.messages[i].message + "</div>";
			}
			
			$(textSelector).html(messageText);
			
			$(typeSelector).slideDown("slow");
			
			var tout1 = setTimeout(function() {
				$('#' + data.type + 'Icon').show();
			}, 500);
			
			/*var tout2 = setTimeout(function() {
				$('#' + data.type + 'Icon').hide();
				$(typeSelector).slideUp("slow");
			}, 10000);*/
		});
		return this;
	}
	
	$.lb_messagesAdd = function (customOptions) {
		
		var options = $.extend({},$.fn.lb_messages.defaultOptions, customOptions);
		
		if(options.title && options.message && options.type) {
			var typeSelector = "#" + options.type + "Message";
			var textSelector = "#" + options.type + "Text";
			var messageText = '<div style="padding-top:3px;"><span>' + options.title + '</span><br />' + options.message + "</div>";
		}
		$(textSelector).html(messageText);
		
		$(typeSelector).slideDown("slow");
		
		console.log($(textSelector));
		
		var tout4 = setTimeout(function() {
			$('#' + options.type + 'Icon').show();
		}, 500);
		
		clearTimeout(tout3);
		
		var tout3 = setTimeout(function() {
			$('#' + options.type + 'Icon').hide();
			$(typeSelector).slideUp("slow");
		}, 10000);
	}
	
	/*$.lb_messages = function(customOptions) {
		var options = $.extend({},$.fn.lb_messages.defaultOptions, customOptions);
		
		if(options.title && options.message && options.type)
		{
			var typeSelector = "#" + options.type + "Message";
			var textSelector = "#" + options.type + "Text";
			var messageText = '<div style="padding-top:3px;"><span>' + options.title + '</span><br />' + options.message + "</div>";
		}
		
		$(textSelector).html(messageText);
		
		$(typeSelector).slideDown("slow");
		
		var tout5 = setTimeout(function() {
			$('#' + options.type + 'Icon').show();
		}, 500);
		
		clearTimeout(tout6);
		
		var tout6 = setTimeout(function() {
			$('#' + options.type + 'Icon').hide();
			$(typeSelector).slideUp("slow");
		}, 10000);
	}*/
	
	$.fn.lb_messages = function(customOptions) {
		var options = $.extend({},$.fn.lb_messages.defaultOptions, customOptions);
		return this.each(function() {
			$(this).click(function() {
				if(options.title && options.message && options.type) {
					var typeSelector = "#" + options.type + "Message";
					var textSelector = "#" + options.type + "Text";
					var messageText = '<div style="padding-top:3px;"><span>' + options.title + '</span><br />' + options.message + "</div>";
				}
				$(textSelector).html(messageText);
				
				$(typeSelector).slideDown("slow");
				
				console.log($(textSelector));
				
				var tout4 = setTimeout(function() {
					$('#' + options.type + 'Icon').show();
				}, 500);
				
				clearTimeout(tout3);
				
				var tout3 = setTimeout(function() {
					$('#' + options.type + 'Icon').hide();
					$(typeSelector).slideUp("slow");
				}, 10000);
			});
		});
	}
	$.fn.lb_messages.defaultOptions = {
		'title' : '',
		'message' : '',
		'type' : 'success'
	}
})(jQuery);