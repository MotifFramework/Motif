(function($) {
	$.fn.fis_hover = function(customOptions)
	{
		var $this = this;
		var options = $.extend({}, $.fn.fis_hover.defaultOptions, customOptions);
		
		return $this.each(function()
		{
			$(".faculty-hover",$(this)).each(function(){
				var facultyId = $(this).attr("id");
				var topElement = $(this);
				$("span", $(this)).hoverIntent({
					over:function(){
						var tmpData = "<div class=\"loading\"><img src=\"/resources/images/fis-hover-loader.gif\" alt=\"Loading...\" /></div>";
						if($.fn.fis_hover.cachedResponse[facultyId]){
							tmpData = $.fn.fis_hover.cachedResponse[facultyId];
						}else{
							$.get('/ajax/facultyHover.html?id='+facultyId+'', function(data) {
								$.fn.fis_hover.cachedResponse[facultyId] = data;
								$("#fisHoverResult_" + facultyId + "").html(data);
							});
						}
						$(".appendFISHover").remove();
						$(this).append("<div class='appendFISHover' id='appendHover_"+facultyId+"'><div class='details'><p class='close'><a href='javascript:void(0);' onclick=\"$.fis_hover('close');\">Close Window</a></p><span id=\"fisHoverResult_" + facultyId + "\">"+tmpData+"</span></div></div>");
						

					},
					timeout: 1000,
					out:function(){
						$("#appendHover_"+facultyId+"").remove();
					}
				});
			});
		});
		
	};
	
	$.fn.fis_hover.cachedResponse = new Array();

	$.fis_hover = function(action)
	{
		if(action == "close"){
			$(".appendFISHover").remove();
		}
	};

	$.fn.fis_hover.defaultOptions = {
		
	};
})(jQuery);