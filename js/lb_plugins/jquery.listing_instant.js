(function($) {
	$.fn.listing_instant = function(customOptions)
	{
		var options = $.extend({}, $.fn.listing_instant.defaultOptions, customOptions);
		
		var listSearchItem = $("."+options.listResults);
		
		// add a keypress event on the input field
		$(this).keyup(function(){
			var searchTerm = $(this).val().toLowerCase();
						
			$(".list-item",$(listSearchItem)).each(function(){
				
				if(searchTerm == ""){
					$(this).removeClass('no-match');
					$(this).removeClass('has-match');
				}else{
				
					// first check if this is a link
					var val = "";
					
					if($("a",$(this))){
						val = $("a",$(this)).val();
					}
					
					var found = false;
					
					if(val){
						if (val.toLowerCase().indexOf(searchTerm) === -1){
							found = false;
						}
						else {
							found = true;
						}
					}else{
						// check non a tags
						val = $(this).html();
						if(val){
							if (val.toLowerCase().indexOf(searchTerm) === -1){
								found = false;
							}
							else {
								found = true;
							}
						}
					}
					
					if (!found){
						$(this).addClass('no-match');
						$(this).removeClass('has-match');
					}
					else {
						$(this).removeClass('no-match');
						$(this).addClass('has-match');
					}
				}
				
			});
			
		});
		
		
	};
	
	$.listing_instant = function(action)
	{
		
	};

	$.fn.listing_instant.defaultOptions = {
		listResults: ""
	};
})(jQuery);