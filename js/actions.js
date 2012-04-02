$(document).ready(function() {
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
	
	$(".tabs > .section").armyKnife({
		sections	:	"> .tab",
		transition	:	"fade",
		autoResize	:	true,
		generateNav	:	true,
		navType		:	"text",
		navItemSource	:	function(section) {
			return section.attr("title");
		},
		navID		:	"tabs-nav",
		navClass	: "nav"
	});
});