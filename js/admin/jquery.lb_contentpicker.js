
function LB_ContentPicker(){
	this.pickerItems = new Array();
	
	this.init = function(key)
	{
		var JSONVAL = new Array();
		
		if($("#"+key+"").val()){
			JSONVAL = $.evalJSON($("#"+key+"").val());
		}

		for(var i=0; i<JSONVAL.length; i++){
			this.addContent(JSONVAL[i]);
		}
		
		this.renderContent(key);
		
	};
	
	this.saveValue = function(key)
	{
		var savedItems = new Array();
		for(var i=0; i<this.pickerItems.length; i++)
		{
			if(key == this.pickerItems[i].key){
				// matched keys, save item
				savedItems.push(this.pickerItems[i]);
			}
		}
		
		$("#"+key+"").val($.toJSON(savedItems));
		
	};
	
	this.addContent = function(jsonContent)
	{
		this.pickerItems.push(new LB_ContentPickerItem(jsonContent.key, decodeURIComponent(jsonContent.display), jsonContent.contentId));
		this.saveValue(jsonContent.key);
		this.renderContent(jsonContent.key);
	};
	
	this.removeContent = function(key, id)
	{
		for(var i=0; i<this.pickerItems.length; i++)
		{
			if(key == this.pickerItems[i].key && id == this.pickerItems[i].contentId){
				this.pickerItems.splice(i, 1);
				break;
			}
		}	
		
		this.saveValue(key);
		this.renderContent(key);
		
	};
	
	this.renderContent = function(key)
	{
		var html = "";
		
		var cnt = 0;
		
		html += "<table>";
			html += "<thead>";
			html += "<tr>";
				html += "<th scope='col'>Content</th>";
				html += "<th scope='col'>&nbsp;</th>";
			html += "</tr>";
			html += "</thead>";
			html += "<tbody>";
			if (this.pickerItems.length) {
				for(var i=0; i<this.pickerItems.length; i++)
				{
					if(key == this.pickerItems[i].key){
						// matched keys, render item
						html += "<tr>";
							html += "<td>" + this.pickerItems[i].display + "</td>";
							html += '<td><a title="Remove Content" class="mtm primer-text icon-button danger-hover" href="javascript:void(0);" data-icon="&#x2421;" data-icon-position="solo" onclick="LBCP.removeContent(\'' + this.pickerItems[i].key + '\', \'' + this.pickerItems[i].contentId + '\');"><b class="is-hidden">Remove Content</b></a></td>';
						html += "</tr>";
						cnt++;
					}
				}
			} else {
				html += "<tr><td colspan='2'>No Content Selected</td></tr>";
			}
		html += "</tbody>";
		html += "</table>";
		
		if(cnt >= parseInt($("#"+key+"_itemCount").val())){
			// hide content picker
			$("#pickContent_"+key).hide();
		}else{
			$("#pickContent_"+key).show();
		}
		
		$("#pickContentDisplay_"+key).html(html);
		$("#pickContentDisplay_"+key).show();
	};
}

function LB_ContentPickerItem(key, display, contentId){
	this.key = key;
	this.display = display;
	this.contentId = contentId;
}

var LBCP = new LB_ContentPicker();
