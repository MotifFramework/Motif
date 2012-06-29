$(document).ready(function() {
	//(function($) {
		$.fn.spin = function(opts, color) {
			var presets = {
				"tiny": { lines: 8, length: 2, width: 2, radius: 3 },
				"small": { lines: 8, length: 4, width: 3, radius: 5 },
				"large": { lines: 10, length: 8, width: 4, radius: 8 }
			};
			if (Spinner) {
				return this.each(function() {
					var $this = $(this),
						data = $this.data();
	
					if (data.spinner) {
						data.spinner.stop();
						delete data.spinner;
					}
					if (opts !== false) {
						if (typeof opts === "string") {
							if (opts in presets) {
								opts = presets[opts];
							} else {
								opts = {};
							}
							if (color) {
								opts.color = color;
							}
						}
						data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
					}
				});
			} else {
				throw "Spinner class not available.";
			}
		};
	//})(jQuery);
	
	// Close alert boxes
	$(".alert .close").click(function() {
		$(this).parents(".alert").fadeOut();
		return false;
	});

	// Insert Icons
	$("[data-icon]").each(function(){
		var	target			=	$(this),
			iconPosition	=	target.attr("data-icon-position"),
			icon			=	$("<i>" + target.attr("data-icon") + "</i>");

		icon.attr("aria-hidden", "true");
		if (iconPosition === "append") {
			icon.addClass("icon-appended");
			target.append(icon);
		} else {
			target.prepend(icon);
		}
	});

	// Placeholder text for form inputs
	$("input, textarea").placeholder();

	// Validation
	$("#contact-form").lb_validation({
		ajaxSubmit	:	function () {
			var $this 		= $(this),
				dataString	=	decodeURIComponent($this.serialize());
			$('#contact-form input').attr("disabled", "disabled");
			$('#contact-form fieldset').addClass('disabled');
			$('#contact-form input').addClass('disabled');
			$("#contact-form").spin();
			
			$.ajax({
				type: "POST",
				url: "test.php",
				data: dataString,
				cache: false,
				success: function(result){
					$('#contact-form input').removeAttr("disabled");
					$("#contact-form").spin(false);
					$('.disabled').removeClass('disabled');
					$this.result=result;
					respond($this);
					
				}
			});
						
            return false;  
	        
		}
	});
	function respond($form){
	
		if($form.result){

			$form[0].reset();
			$form.find('label').removeClass('success');
		    $("html, body").animate({scrollTop:0},200);
		    $form.prepend('<div id="form-response" class="success alert">Thank you for filling out the Contact Form</div>');

		} else{

		    $form.append('<div id="form-response" class="error alert">This form could not be submitted.</div>');

		}
		
		setTimeout(function(){$('#form-response').slideUp();},5000,function(){$('#form-response').remove();});
	}

	// Tabbed widget
	$("[data-tabs]").lb_tabs();

	// Modals
	$("[data-modal]").lb_modal({
		position	:	"absolute"
	});

	// Simple Wireframing
	var	wireframeBlock	=	$(".wireframe").find(".block");
	wireframeBlock.each(function () {
		var	baseHeight	=	20,
			blockHeight	=	$(this).attr("data-height") * baseHeight;
		$(this).css("height", blockHeight + "px");
	});
});