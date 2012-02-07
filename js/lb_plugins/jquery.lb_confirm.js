/*
 *
 *
 */

(function($) {
	$.fn.lb_confirm = function(customOptions)
	{
		var $this = this;
		
		if(customOptions=="close")
		{
			this.each(function()
				{
					$(".closeConfirmBox").click();
					return true;
				}
			);
		}
		var options = $.extend({}, $.fn.lb_confirm.defaultOptions, customOptions);

		return $this.each(
			function()
			{
				var html = LoadHtml(options.formTarget, options.title);

				$(this).lb_box(
					{
						width : 440,
						height : '',
						zindex : 1500,
						animate : true,
						showClose : false,
						title : 'Wait just a second...',
						message : html + "<a class='closeConfirmBox'></a>",
						closeSelector : '.closeConfirmBoxFinal',
						Open : function()
						{
							$("#lbDisableConfOk").click(
								function()
								{
									if($.isFunction(options.OnSubmit))
									{
										options.OnSubmit.apply(this);
									}
									$(".closeConfirmBoxFinal").click();
								}
							);

							$(".closeConfirmBoxCancel").click(
								function()
								{
									if($.isFunction(options.OnCancel))
									{
										options.OnCancel.apply(this);
									}
									$(".closeConfirmBoxFinal").click();
								}
							);
						}
					}
				);
			}
		);

		function LoadTypeHtml()
		{
			var html = "";
			if(options.content != "" && options.type == "custom")
			{
				return options.content;
			}

			if(options.type == "contentRemoval")
			{
				if(options.content != "")
				{
					html = options.content;
				}
				html += '<p>What happens after this content is removed.</p>';
				html += '<select id="headerStatus" name="headerStatus"><option value="301">The content has moved permanently.</option><option value="303">The content has moved temporarily.</option><option value="404" selected>The content has been removed.</option></select>';
				html += '<p>Where does the content redirect to.</p>';
				html += '<input type="text" id="headerRedirect" name="redirect" value="" />';

				return html;
			}

			if(options.linkHref && options.linkText) {
				html = '<span class="label"><a href="'+ options.linkHref + '">' + options.linkText + '</a></span><br />';
			}


			if(options.content)
			{
				html += options.content;
			}
			else if(options.type == "disable")
			{
				html += "You are about to disable this selection, if you are sure press disable.";
			}
			else if(options.type == "enable")
			{
				html += "You are about to enable this selection, if you are sure press enable.";
			}
			else if(options.type == "delete")
			{
				html += "You are about to delete this selection, if you are sure press delete.";
			}

			return html;
		}

		function LoadHtml(formTarget, title)
		{
			var html = "";
			html += '<form id="contentRemovalForm" action="' + formTarget + '" method="post">';
				html += '<div class="alert">' + title + '</div>';
				html += '<div class="bluebox">';
				   html += LoadTypeHtml();
				html += '</div>';
				html += '<div class="confirm">'
					html += '<span class="button"><a href="' + options.url + '" id="lbDisableConfOk" class="closeConfirmBoxSubmit"><span>Confirm Disable</span></a></span> or <a href="javascript:void(0);" class="closeConfirmBoxCancel">cancel</a></div>';
				html += '<div class="note">All data is still stored in your system, however disabling this item could cause other system features to become unavailable. Always verify before disabling.</div>';
				html += '<a href="javascript:void(0);" class="closeConfirmBoxFinal"></a>';
			html += '</form>';

			return html;
		}
	}

	$.fn.lb_confirm.defaultOptions = {
		type : 'default',
		title : '',
		content : '',
		linkHref : '',
		linkText : '',
		url : '',
		OnSubmit : '',
		OnCancel : ''
	}
})(jQuery);