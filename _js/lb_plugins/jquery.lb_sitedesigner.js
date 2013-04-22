
function LB_SiteDesigner(){
	this.blocks = new Array();
		
	this.addBlock = function(id, name){
		this.blocks.push(new LB_SiteDesignerBlock(id, name));
	}
	
	this.addControl = function(blockId, id, order, name, control, configuration, description, overrideId)
	{
		var block = this.getBlock(blockId);
		
		if(block)
		{
			block.addControl(id, order, name, control, configuration, description, overrideId);	
		}
	}
	
	this.removeControl = function(blockId, controlId)
	{
		var block = this.getBlock(blockId);
		
		if(block)
		{
			block.controls = jQuery.grep(block.controls, function(value){return value.id != controlId});
			this.saveValue();
			$("#control_"+controlId).remove();
		}
	}
	
	this.getNextOrder = function(blockId){
		var block = this.getBlock(blockId);
		var maxOrder = 0;
		
		if(block){
			for(var i=0; i<block.controls.length; i++){
				if(block.controls[i].order > maxOrder){
					maxOrder = block.controls[i].order;
				}
			}
		}
		
		return maxOrder+1;
	}
	
	this.getBlock = function(blockId)
	{
		for(var i=0; i<this.blocks.length; i++){
			if(this.blocks[i].id == blockId){
				return this.blocks[i];
			}
		}
	}
	
	this.init = function()
	{
		
	};
	
	this.saveValue = function()
	{
		$("#SiteDesignerInput").val($.toJSON(this.blocks));
		//console.log($("#SiteDesignerInput").val());
	};
}

function LB_SiteDesignerBlock(id, name){
	this.id = id;
	this.name = name;
	this.controls = new Array();
	
	this.addControl = function(id, order, name, control, configuration, description, overrideId)
	{
		this.controls.push(new LB_SiteDesignerBlockControl(id, order, name, control, configuration, description, overrideId));
	}
	
	this.getControl = function(controlId)
	{
		for(var i=0; i<this.controls.length; i++){
			if(this.controls[i].id == controlId){
				return this.controls[i];
			}
		}
	}
	
}

function LB_SiteDesignerBlockControl(id, order, name, control, configuration, description, overrideId)
{
	this.id = id;
	this.order = parseInt(order);
	this.name = name;
	this.control = control;
	this.configuration = configuration;
	this.description = description;
	this.overrideId = overrideId;
}

var LBSD = new LB_SiteDesigner();