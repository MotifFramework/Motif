
(function($) {
	$.fn.lb_box = function(customOptions)
	{
		var $this = this;
		//var element = this[0];
		//var id = this[0].id;
		var $html;
		var $interior;
		var $overlay;
		
		var options = $.extend({}, $.fn.lb_box.defaultOptions, customOptions);

		return $this.each(function()
			{
				var $box = $(this);
				$html = GetHtml($box);

				$(this).click(function()
					{
						$overlay = Init();

						$interior = LoadBox();
						$interior = LoadData($interior);

						if($.isFunction(options.Open))
						{
							options.Open.apply(this);
						}
						
						$(options.closeSelector).click(
							function() {
								var scRes = StartClose($interior);
								if(scRes != false)
								{
									Close($interior);
								}
							}
						);

						return false;
					}
				);
			}
		);

		// Lightbox Events
		function Init() {

			if($(".boxOverlay").length == 0) {
				var id = "";
				if(options.id){
					id = ' id="'+options.id+'_BoxOverlay"';
				}
				return $("<div"+id+"></div>").addClass("boxOverlay").css("z-index", options.zindex).appendTo("body").fadeIn("slow");
			} 
			else
			{
				return $(".boxOverlay").css("z-index", options.zindex).fadeTo("slow", .5);
			}
		}

		function StartClose($interior)
		{
			if($.isFunction(options.StartClose))
			{
				return options.StartClose.apply(this);
			}
		}

		function Close($interior)
		{
			$interior.remove();

			$overlay.fadeOut({duration : 400});

			if($.isFunction(options.EndClose))
			{
				options.EndClose.apply(this);
			}
		}

		// Loading functions
		function LoadBox()
		{
			var width = options.width;
			var height = options.height;

			var id = "";
			if(options.id){
				id = ' id="'+options.id+'"';
			}
			
			return $("<div"+id+"></div>")
				.addClass("boxContainer")
				.addClass("alertwindow")
				.css("width", width)
				.css("height", height)
				.css("z-index", options.zindex + 1)
				.appendTo("body");
		}

		function LoadData($interior)
		{
			var titleHtml = "";
			var innerHtml = "";
			var closeButton = "";
			
			if(options.showClose == true || options.type == "iframe")
			{
				var closeSelector,
					classes = "",
					ids = "";

				if(options.closeSelector.charAt(0) == ".")
				{
					classes = "class='" + options.closeSelector.substr(1) + " float-right icon-button inverse-hover'";
				}
				else
				{
					id = "id='" + options.closeSelector.substr(1) + "'";
					classes = 'class="float-right icon-button inverse-hover"';
				}
				
				closeButton = '<a href="javascript:void(0)" ' + ids + ' ' + classes + ' data-icon="&#xe003;" data-icon-position="solo"><b class="is-hidden">Close Modal</b></a>';
			}

			
			if(options.blank == false)
			{
				if(options.title != "")
				{
					titleHtml = "<div class='title panel thin dark mtn pal'><div class='proxima-nova-thin paragon-text'>" + closeButton + options.title + "</div></div>";
				}
				innerHtml = "<div class='alertpad panel thin light mtn pal'>" + $html.html() + "</div>";
			}
			else
			{
				innerHtml = $html.html();
			}

			$interior.html(titleHtml)
				.append(innerHtml).show();

			if(options.height)
			{
				$interior.css("height", options.height);
			}
			{
				$interior.css("height", $(".alertpad", $interior).height() + 70);
			}
			
			if(options.width)
			{
				$interior.css("width", options.width);
			}
			else
			{
				$interior.css("width", $(".alertpad", $interior).height() + 30);
			}
			
			if(options.noPad == true)
			{
				$(".alertpad", $interior).css("padding", "0px");
				$interior.css("width", $(".alertpad", $interior).width()-40);
				$interior.css("height", $(".alertpad", $interior).height()+38);
			}
			
			var viewport = GetViewport();
			var leftMargin = Math.round( (viewport.width / 2) - ($interior.width() / 2) );
			var topMargin = Math.round( ( (viewport.height / 2) - ($interior.height() / 1.8) ) + $(window).scrollTop());

			$interior.css("margin-left", leftMargin + "px");
			$interior.css("margin-top", topMargin + "px");
			
			return $interior;
		}

		// Data loading functions
		function GetHtml($box) 
		{
			if(options.dataSource)
			{
				href = options.dataSource;
			}
			else
			{
				var href = $box.attr("href");
			}
			
			if(options.type == "iframe")
			{
				var iframeHtml;
				if(options.blank == true)
				{
					iframeHtml = "<iframe src='" + href + "' frameborder='0' height='" + options.height + "' width='" + options.width + "'></iframe>";
				}
				else
				{
					iframeHtml = "<iframe src='" + href + "' frameborder='0' height='" + (options.height-70) + "' width='" + (options.width-40) + "'></iframe>";
				}
				return $("<div class='alertpad panel thin light mtn pbm'></div>").html(iframeHtml);
			}
			else
			{
				if(options.message != "")
				{
					return $("<div class='alertpad panel thin light mtn pbm'></div>").html(options.message);
				}

				if(options.dataSource == "")
				{
					if(href.charAt(0)=="#")
					{
						return $(href);
					}
					else
					{
						return $("<div class='alertpad panel thin light mtn pbm'></div>").load(href);
					}
				}
				else
				{
					if(options.dataSource.charAt(0)=="#")
					{
						return $(options.dataSource);
					}
					else
					{
						return $("<div class='alertpad panel thin light mtn pbm'></div>").load(options.dataSource);
					}
				}
			}
		}

		// Helper functions
		function GetViewport() {
			return {
				width : $(window).width(),
				height : $(window).height(),
				scrollLeft : $(document).scrollLeft(),
				scrollTop : $(document).scrollTop()
			}
		}
	}

	$.lb_box = function(action)
	{
		if(action == "close")
		{
			$('.boxOverlay').fadeOut({duration : 400});
			$(".boxContainer").remove();
		}
	}

	$.fn.lb_box.defaultOptions = {
		width : '470',
		height : '',
		zindex : 1100,
		dataSource : '',
		message : '',
		type : '',
		animate : false,
		showClose : false,
		blank : false,
		title : 'Title',
		closeSelector : '.closeBox',
		Open : '',
		StartClose : '',
		EndClose : '',
		id : '',
		noPad: false
	}
})(jQuery);
