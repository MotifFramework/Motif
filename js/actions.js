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
			
			$.ajax({
				type: "POST",
				url: "test.php",
				data: dataString,
				cache: false,
				success: function(result){
					$this.result=result;
					respond($this);
				}
			});
						
            return false;  
	        
		}
	});
	function respond($form){
	
		if($form.result){
		
			$form.find(':input').each(function() {
				
		        switch(this.type) {
	
					case 'email':
		            case 'password':
		            case 'select-multiple':
		            case 'select-one':
		            case 'tel':
		            case 'text':
		            case 'textarea':
		                $(this).val('');
		                break;
			        
			        case 'checkbox':
					case 'radio':
		                this.checked = false;
		                break;		
		        }
		        
		
		    });
		    $("html, body").animate({scrollTop:0},200);
		    
		    
		    $form.prepend('<div id="form-response" class="success-message">Thank you for filling out the Contact Form</div>');
			
		} else{
		
		    $form.append('<div id="form-response" class="fail-message">This form could not be submitted.</div>');

		}
		
		setTimeout(function(){$('#form-response').hide();},5000,function(){$('#form-response').remove();});
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