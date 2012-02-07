var LBControls = {
	attributes: new Array(),
	isLBC: false,
	getAttribute: function(type){
		for(var i=0; i<LBControls.attributes.length; i++){
			if(LBControls.attributes[i].nodeName == type){
				return LBControls.attributes[i].nodeValue;
			}
		}
	},
	walkUp: function(node)
	{
		var originalNode = node;
		while(node.parentNode)
		{
			if(node.nodeName == "LBC"){
				return node;
			}
			node = node.parentNode;
		}
		return originalNode;
	},
	init : function(ed) {
		var ed = tinyMCEPopup.editor, dom = ed.dom;

		// find the control
		var node = LBControls.walkUp(ed.selection.getNode());
		
		// select entire control if needed
		if(node.nodeName == "LBC"){
			ed.selection.select(node);
		}
		
		var n = ed.selection.getNode();
				
		if(n.nodeName == "LBC")
		{
			LBControls.isLBC = true;
			LBControls.attributes = dom.getAttribs(n);
			$.each($("#controlSelection option"), function(index, value){
				if($(this).attr("name") == LBControls.getAttribute("type")){
					$(this).attr("selected", "selected");
					ControlSelectionChanged();
				}
			});
		}
	}
};

tinyMCEPopup.onInit.add(LBControls.init, LBControls);