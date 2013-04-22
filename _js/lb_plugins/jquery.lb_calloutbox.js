
function LB_CallOutBox(){
	this.boxItems = new Array();
	
	this.removeBox = function(id, key)
	{
		// remove our box
		$("#"+id).remove();
		
	}
	
	this.addBox = function(key, value)
	{
		html = "";

		var cnt = parseInt($("#"+key+"_itemCount").val());
		
		html += '<div style="margin:0px 15px 15px;" id="box' + key + '_'+cnt+'"><textarea style="width:100%; height:380px;" name="editor' + key + '_'+cnt+'" id="editor' + key + '_'+cnt+'">'+value+'</textarea><div style="font-size:10px;padding-top:3px; text-align:right;"><a href="javascript:void(0);" onclick="LBCOB.removeBox(\'box' + key + '_'+cnt+'\', \''+key+'\');"><img src="/resources/images/admin/icon_delete_sm.gif" alt="Delete" border="0" align="absmiddle" /> Remove Box</a></div></div>';
		html += '<script type="text/javascript">$(\'#editor' + key + '_'+cnt+'\').lb_editor("full");</script>';
		
		$("#"+key+"_Fields").append(html);	
		cnt++;
		$("#"+key+"_itemCount").val(cnt);
	};
}

var LBCOB = new LB_CallOutBox();