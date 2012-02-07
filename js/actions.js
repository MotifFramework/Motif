$(document).ready(function() {
	$(".alert .close").click(function() {
		$(this).parents(".alert").fadeOut();
		return false;
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
		//navID		:	"tabs-nav",
		navClass	: "nav"
	});
});