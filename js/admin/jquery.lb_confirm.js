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
						showClose : true,
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
				html = '<div class="label secondary-heading"><a href="'+ options.linkHref + '">' + options.linkText + '</a></div>';
			}


			if(options.content)
			{
				html += '<div class="museo-slab-300 petite-text mts">' + options.content + '</div>';
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
			html += '<form class="pal" id="contentRemovalForm" action="' + formTarget + '" method="post">';
				html += '<div class="alert secondary-heading paragon-text">' + title + '</div>';
				html += '<div class="bluebox panel">';
				   html += LoadTypeHtml();
				html += '</div>';
				html += '<div class="confirm">';
					html += '<div class="gm-row gt-row gd-row">';
						html += '<div class="gm-columns gm-half gt-columns gt-half gd-columns gd-half">';
							html += '<a href="' + options.url + '" id="lbDisableConfOk" class="closeConfirmBoxSubmit full-width large danger button">';
								html += 'Confirm';
							html += '</a>';
						html += '</div>';
						html += '<div class="gm-columns gm-half gt-columns gt-half gd-columns gd-half">';
							html += '<a href="javascript:void(0);" class="closeConfirmBoxCancel full-width large button">Cancel</a>';
						html += '</div>';
					html += '</div>';
				html += '</div>';
				html += '<p class="note">All data is still stored in your system, however disabling this item could cause other system features to become unavailable. Always verify before disabling.</p>';
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
