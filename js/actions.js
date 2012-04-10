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