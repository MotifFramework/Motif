$(document).ready(function() {
	
	// Close alert boxes
	$(".alert .close").click(function() {
		$(this).parents(".alert").fadeOut();
		return false;
	});

	// Insert Icons
	$("[data-icon]").each(function(){
		var	target			=	$(this),
			iconPosition	=	target.attr("data-icon-position"),
			iconSet			=	target.attr("data-icon-set"),
			icon			=	$("<i class='icon'>" + target.attr("data-icon") + "</i>");
	
		icon.attr("aria-hidden", "true");

		if (iconSet === "social") {
			icon.addClass("social");
		} else if (iconSet === "social-circle") {
			icon.addClass("social-circle");
		}

		if (iconPosition === "append") {
			icon.addClass("appended");
			target.append(icon);
		} else if (iconPosition === "solo") {
			icon.addClass("solo");
			target.append(icon);
		} else {
			icon.addClass("prepended");
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
	$("[data-reveal-group='tabbed-widget']").lb_reveal({
		"trigger"	: 	"click",
		"exclusive"	: 	"radio"
	});

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