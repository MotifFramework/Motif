(function($) {
	$.fn.listing_application = function(customOptions)
	{
		this.options = $.extend({}, $.fn.listing_application.defaultOptions, customOptions);
		
		var $this = this;
		var listSearchItem = $("#"+this.options.listResults);
		
		$(this).click(function(){
			if(!$(".department-search .results").hasClass("current")){
				$(".department-search .results").addClass("current");
			}
		});
		
		$("#"+this.options.toggleOption+"").change(function(){
			// when the option changes, change the data feed
			$this.options.dataFeed = $this.options[$(this).val()];
			$this.PerformSearch();
		});
				
		$(this).keyup(function(){
			
			$this.PerformSearch();
			//console.log(matches);
			
		});
		
		this.PerformSearch = function()
		{
			var listSearchItem = $("#"+this.options.listResults);
			var searchTerm = $(this).val().toLowerCase();
							
			for(var i=0; i<$this.options.dataFeed.length; i++){
				$this.options.dataFeed[i].found = false;
				if($this.options.dataFeed[i].title.toLowerCase().indexOf(searchTerm) !== -1){
					$this.options.dataFeed[i].found = true;
					if($this.options.dataFeed[i].parentId){
						$this.AddParent($this.options.dataFeed[i].parentId);
					}
				}
			}
			
			var html = "";
			var matches = new Array();
			$.each($this.options.dataFeed, function(i,v){
				if(v.found){
					matches.push(v);
					//html += "<li><a href=\"#\">" + v.title + "</a></li>";
				}
			});
			
			// find the row lengths
			var resultsPerRow = Math.ceil(matches.length/3);
			var row1 = resultsPerRow;
			var row2 = resultsPerRow+resultsPerRow;
			var row3 = matches.length;
			
			// find out how many cols
			if(matches.length >= 30){
				// 3 cols
				resultsPerRow = Math.ceil(matches.length/3);
				row1 = resultsPerRow;
				row2 = resultsPerRow+resultsPerRow;
				row3 = matches.length;
			}else if(matches.length >= 20){
				// 2 cols
				resultsPerRow = Math.ceil(matches.length/2);
				row3 = 0;
				row1 = resultsPerRow;
				row2 = matches.length;
			}else{
				row1 = matches.length;
				row2 = 0;
				row3 = 0;
			}
			
			if(matches.length == 0){
				$(".department-search .results").removeClass("current");
			}else{
				$(".department-search .results").addClass("current");
			}
			
			
			html += "<ul class=\"results-list no-margin\">";
			for(var i=0; i<row1; i++)
			{
				var link = "" + matches[i].title + "";
				if(matches[i].link){
					link = "<a href=\"javascript:void(0);\" onclick=\"window.location.href='"+matches[i].link+"';\">" + matches[i].title + "</a>";
				}
				html += "<li class=\"results-list-tier"+matches[i].tier+"\">"+link+"</li>";	
			}
			html += "</ul>";
			
			if(row2 != 0){
				html += "<ul class=\"results-list\">";
				for(var i=row1; i<row2; i++)
				{
					var link = "" + matches[i].title + "";
					if(matches[i].link){
						link = "<a href=\"javascript:void(0);\" onclick=\"window.location.href='"+matches[i].link+"';\">" + matches[i].title + "</a>";
					}
					html += "<li class=\"results-list-tier"+matches[i].tier+"\">"+link+"</li>";	
				}
				html += "</ul>";
			}
			
			if(row3 != 0){
				html += "<ul class=\"results-list\">";
				for(var i=row2; i<row3; i++)
				{
					var link = "" + matches[i].title + "";
					if(matches[i].link){
						link = "<a href=\"javascript:void(0);\" onclick=\"window.location.href='"+matches[i].link+"';\">" + matches[i].title + "</a>";
					}
					html += "<li class=\"results-list-tier"+matches[i].tier+"\">"+link+"</li>";	
				}
				html += "</ul>";
			}
			
			listSearchItem.html(html);
		}
		
		this.Init = function()
		{
			var listSearchItem = $("#"+$this.options.listResults);
			
			// setup the datafeed
			var feedItem = $("#"+this.options.toggleOption+"").val();
			$this.options.dataFeed = $this.options[feedItem];
			
			// find the row lengths
			var matches = $this.options.dataFeed;
			var resultsPerRow = Math.ceil($this.options.dataFeed.length/3);
			var row1 = resultsPerRow;
			var row2 = resultsPerRow+resultsPerRow;
			var row3 = matches.length;	
			
			var html = "";
			html += "<ul class=\"results-list no-margin\">";
			for(var i=0; i<row1; i++)
			{
				var link = "" + matches[i].title + "";
				if(matches[i].link){
					link = "<a href=\"javascript:void(0);\" onclick=\"window.location.href='"+matches[i].link+"'\">" + matches[i].title + "</a>";
				}
				html += "<li class=\"results-list-tier"+matches[i].tier+"\">"+link+"</li>";	
			}
			html += "</ul>";
			
			if(row2 != 0){
				html += "<ul class=\"results-list\">";
				for(var i=row1; i<row2; i++)
				{
					var link = "" + matches[i].title + "";
					if(matches[i].link){
						link = "<a href=\"javascript:void(0);\" onclick=\"window.location.href='"+matches[i].link+"'\">" + matches[i].title + "</a>";
					}
					html += "<li class=\"results-list-tier"+matches[i].tier+"\">"+link+"</li>";	
				}
				html += "</ul>";
			}
			
			if(row3 != 0){
				html += "<ul class=\"results-list\">";
				for(var i=row2; i<row3; i++)
				{
					var link = "" + matches[i].title + "";
					if(matches[i].link){
						link = "<a href=\"javascript:void(0);\" onclick=\"window.location.href='"+matches[i].link+"'\">" + matches[i].title + "</a>";
					}
					html += "<li class=\"results-list-tier"+matches[i].tier+"\">"+link+"</li>";	
				}
				html += "</ul>";
			}
			
			listSearchItem.html(html);	
		}
		
		this.LookupItem = function(id)
		{
			for(var i=0; i<$this.options.dataFeed.length; i++){
				if($this.options.dataFeed[i].id == id){
					return $this.options.dataFeed[i];
				}
			}
		}
		
		this.AddParent = function(parentId)
		{
			for(var i=0; i<$this.options.dataFeed.length; i++){
				if($this.options.dataFeed[i].id == parentId){
					$this.options.dataFeed[i].found = true;
					if($this.options.dataFeed[i].parentId){
						$this.AddParent($this.options.dataFeed[i].parentId);
					}
				}
			}
		}
		
		$this.Init();
		
	};
	
	$.listing_application = function(action)
	{
		
	};

	$.fn.listing_application.defaultOptions = {
		listResults: "",
		toggleOption: "",
		dataFeed: []
	};
})(jQuery);