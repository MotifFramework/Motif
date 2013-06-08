
function LB_Workflow(){
	this.paths = new Array();
	this.AllowedRoles = new Array();
	
	this.AddAllowedRoles = function(id, name)
	{
		this.AllowedRoles.push({id:id,name:name});	
	}
	
	this.RemovePath = function(index)
	{
		this.paths.splice(index, 1);
		this.renderValue(false);
	};
	
	this.AddPath = function(id, role, action, publish)
	{
		this.paths.push(new LB_WorkflowPath(id, role, action, publish));
	};
	
	this.GetPath = function(id)
	{
		for(var i=0; i<this.paths.length; i++){
			if(this.paths[i].id == id){
				return this.paths[i];
			}
		}
	};
	
	this.CreatePath = function()
	{
		this.AddPath(randomID(10), this.AllowedRoles[0].id, "Both", "Always");
		this.renderValue(false);
	}
	
	this.renderValue = function(showManage, activateId)
	{
		var html = "";
		
		html += '<table class="mtn">';
			html += '<thead>';
				html += '<tr class="group-heading">';
					html += '<th scope="col" colspan="4">Workflow Paths</td>';
				html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			for(var i=0; i<this.paths.length; i++){
				var num = i+1;
				var path = this.paths[i];
				html += '<tr id="'+path.id+'">';
					html += '<td width="5%" class="workflow-path-num align-top proxima-nova-thin meridian-text">'+num+'</td>';
					html += '<td width="90%">';
						html += '<div class="workflow-path group media-grid">';
							html += '<div class="pln pvs prm gm-columns gt-columns gd-columns object mtn">';
								html += '<select name="role" class="role">';
									for(var j=0; j<this.AllowedRoles.length; j++){
										if(this.AllowedRoles[j].id == path.role){
											html += '<option value="'+this.AllowedRoles[j].id+'" selected="selected">'+this.AllowedRoles[j].name+'</option>';
										}else{
											html += '<option value="'+this.AllowedRoles[j].id+'">'+this.AllowedRoles[j].name+'</option>';
										}
									}
								html += '</select>';
							html += '</div>';
							html += '<div class="phm pvs gm-columns gt-columns gd-columns object mtn">';
								html += ' can ';
							html += '</div>';
							html += '<div class="phm pvs gm-columns gt-columns gd-columns object mtn">';
								html += '<select class="action"><option value="Both">Publish & Unpublish</option><option value="Publish">Publish</option><option value="Unpublish">Unpublish</option></select>';
							html += '</div>';
							html += '<div class="phm pvs gm-columns gt-columns gd-columns object mtn">';
								html += ' content ';
							html += '</div>';
							html += '<div class="phm pvs gm-columns gt-columns gd-columns object mtn">';
								html += '<select class="publish"><option value="Always">Always</option><option value="Never">Never</option><option value="When">When</option></select>';
							html += '</div>';
							
							var peopleString = "";
							for(var j=0; j<path.people.length; j++){
								var person = path.people[j];
								
								if(person.id != 0){
									if(peopleString != ""){
										peopleString += " " + person.operator + " ";
									}
									
									peopleString += "" + person.name + "";
								}
								
							}
							
							if(peopleString == ""){
								peopleString = "(Manage People Who Can)";
							}
							
							var peStyle = "";
							var mnStyle = "";
							if(showManage){
								if(activateId == path.id){
									mnStyle = " style=\"display:block;\"";
								}
							}else{
								peStyle = " style=\"display:inline;\"";
							}
							
							html += '<div class="plm prn pvs gm-columns gt-columns gd-columns object mtn">';
								html += '<span class="workflow-path-people"'+peStyle+'><a href="javascript:void(0);">'+peopleString+'</a> approve(s) it.</span>';
							html += '</div>';
						html += '</div>';
							
						html += '<div class="workflow-people-manage hide" id="'+path.id+'-workflow-people-manage" '+mnStyle+'>';
							html += '<div class="subfieldset subfieldset-conditional">';
								// html += '<h2>Manage People</h2>';
								// html += '<div style="clear:both;"></div>';
								
								for(var j=0; j<path.people.length; j++){
									var person = path.people[j];
									html += '<div class="workflow-people-item gm-row gt-row gd-row pbl media-grid" id="'+person.internalId+'-workflow-people-item">';
										html += '<span class="gm-columns gt-columns gd-columns pts object mtn"><b class="workflow-path-operator meridian-text proxima-nova-bold">'+person.operator+'</b></span> ';
										if(person.id == 0){
											html += '<div class="gm-columns gt-columns gd-columns object mtn">';
												html += '<input type="text" placeholder="Type a User or Role..." id="" class="input-l">';
										}else{
											html += '<div class="gm-columns gt-columns gd-columns pts object mtn">';
												html += '<a href="javascript:void(0);" class="person-edit">'+person.name+'</a>';	
										}
										html += '</div>';
										html += '<div class="gm-columns gt-columns gd-columns pts object mtn">';
										html += 'approve(s) It.';
										html += '</div>';
										html += '<div class="workflow-people-remove gm-columns gt-columns gd-columns pts object mtn"><a class="person-remove mtn primer-text icon-button danger-hover" data-icon="&#x2421;" data-icon-position="solo" href="javascript:void(0);" title="Remove"><b class="is-hidden">Remove</b></a></div>';
									html += '</div>';
								}
								html += '<div class="conversion"></div>';
								html += '<ul class="nav mtn"><li class="conversion"><a class="mtn small button button-inverted" href="javascript:void(0);" data-icon="&#x1f4dd;" data-icon-position="before">Add a User or Role</a></li><li class="save-and-close"><a class="mtn small secondary button" href="javascript:void(0);" data-icon="&#x2B07;" data-icon-position="before">Save & Close</a></li></ul>';
							html += '</div>';
							html += '</div>';
						html += '</div>';
					html += '</td>';
					html += '<td width="5%" class="align-top"><a class="small danger button mtn" href="javascript:void(0);" onclick="LBW.RemovePath(\''+i+'\')">Remove</a></td>';
				html += '</tr>';
			}
		html += '</tbody>';
		html += '</table>';
		html += '<div class="workflow-add"><a class="button" data-icon="&#x1f4dd;" data-icon-position="before" href="javascript:void(0);" onclick="LBW.CreatePath();">Add Another Workflow Path</a></div>';
		
		$("#workflowPathsHolder").html(html);	
		
		for(var i=0; i<this.paths.length; i++){
			var path = this.paths[i];
						
			
			$('#'+path.id+'-workflow-people-manage input').click(function(){
				if($(this).val() == "Start Typing A User or Role..."){
					$(this).val("");
				}
			});
			
			$('#'+path.id+'-workflow-people-manage .conversion a').bind('click', {path:path}, function(e){
				e.data.path.addPeople(randomID(10), "", "", "AND", "");
				LBW.renderValue(true, e.data.path.id);
			});
			
			for(var j=0; j<path.people.length; j++){
				var person = path.people[j];
				
				$("#" + path.id + "-workflow-people-manage #"+person.internalId+"-workflow-people-item .workflow-path-operator").bind('click', {path:path, person: person}, function(e){
					if(e.data.person.operator == "AND"){
						e.data.person.operator = "OR";
					}else{
						e.data.person.operator = "AND";
					}
					LBW.renderValue(true, e.data.path.id);
				});
				
				$('#'+path.id+'-workflow-people-manage #'+person.internalId+'-workflow-people-item .person-remove').bind('click', {path: path, person:person, index:j}, function(e){
					e.data.path.people.splice(e.data.index, 1);
					LBW.renderValue(true, e.data.path.id);
				});
				
				$('#'+path.id+'-workflow-people-manage #'+person.internalId+'-workflow-people-item .person-edit').bind('click', {path: path, person:person}, function(e){
					e.data.person.id = 0;
					LBW.renderValue(true, e.data.path.id);
					$('#'+e.data.person.internalId+'-workflow-people-item input').val("");
					$('#'+e.data.person.internalId+'-workflow-people-item input').focus();
				});
				
				$('#'+path.id+'-workflow-people-manage #'+person.internalId+'-workflow-people-item input').lb_autocomplete_2_1({
					dataSets : 'UserManagement/UserAndRoleAuto',
					onKeyPress: function(){
						//console.log($(this));
					},
					select: function ( event, ui ){
						var person = $(this).data( "extraData" ).person;
						var path = $(this).data( "extraData" ).path;
						
						// update our person
						person.id = ui.item.id;
						person.name = ui.item.label;
						person.type = ui.item.type;
						
						LBW.renderValue(true, path.id);
					},
					// renderItem: function( ul, item ) {
				
					// 	if (!$("."+item.type, ul).length ) {
					// 	    // we need to make this type before adding it
					// 		$( "<li class=\"" + item.type + " auto-item-clear\"></li>" ).append("<div class=\"auto-item-heading\">"+item.type+"</div>").appendTo(ul);	
					// 	}		
						
					// 	$( "<li></li>" )
					// 			.data( "item.autocomplete", item )
					// 			.append( "<a class=\"auto-item\"><div class=\"auto-item-padding\"><div class=\"auto-item-wrapper\" style=\"padding-left:0px;\"><strong>" + item.label + "</strong><div class=\"auto-item-desc\">Description: " + item.desc + "</div></div></div></a>" )
					// 			.insertAfter( $("."+item.type, ul));
					
					// },
					extraData: {path: path, person: person}
				});
			}
			
			$("#" + path.id + " .role").bind('change', {path:path}, function(e){
				e.data.path.role = $(this).val();
				LBW.renderValue(false);
			});
			
			$("#" + path.id + " .publish").bind('change', {path:path}, function(e){
				e.data.path.publish = $(this).val();
				LBW.renderValue(false);
			});
			
			$("#" + path.id + " .action").bind('change', {path:path}, function(e){
				e.data.path.action = $(this).val();
				LBW.renderValue(false);
			});
			
			$("#"+path.id+"-workflow-people-manage .save-and-close a").bind('click', {path:path}, function(e){
				LBW.renderValue(false);
			});
			
			$("#"+path.id+" .workflow-path-people").bind('click', {path:path}, function(e){
				if ($(this).hasClass("current")) {
					$('#'+e.data.path.id+'-workflow-people-manage').slideUp();
					$(this).removeClass("current");
				} else {
					$(this).addClass("current");
					$('#'+e.data.path.id+'-workflow-people-manage').slideDown();
				}
			});
			
			$("#" + path.id + " .action").val(path.action);
			$("#" + path.id + " .publish").val(path.publish);
		
			if(path.publish == "When"){
				$("#" + path.id + " .workflow-path-people").show();
			}else{
				$("#" + path.id + " .workflow-path-people").hide();
			}
				
		}
		
		this.saveValue();
	}
		
	this.refresh = function(){
		this.renderValue(false);
		this.saveValue();
	}
	
	this.init = function(curVal)
	{
		if(curVal){
			for(var i=0; i<curVal.length; i++){
				this.addYear(curVal[i].id, curVal[i].name);
				for(var j=0; j<curVal[i].terms.length; j++){
					this.addTerm(curVal[i].id, curVal[i].terms[j].id, curVal[i].terms[j].name);
					for(var m=0; m<curVal[i].terms[j].titles.length; m++){
						this.addTitle(curVal[i].id, curVal[i].terms[j].id, curVal[i].terms[j].titles[m].id, curVal[i].terms[j].titles[m].title, curVal[i].terms[j].titles[m].credit_hour);
					}
				}
			}
		}
		
		this.renderValue();
		this.saveValue();
	};
	
	this.saveValue = function()
	{
		$("#workflowData").val($.toJSON(this.paths));
	};
}

function LB_WorkflowPath(id, role, action, publish){
	this.id = id;
	this.role = role;
	this.action = action;
	this.publish = publish;
	this.people = new Array();
	
	this.addPeople = function(internalId, id, name, operator, type)
	{
		this.people.push(new LB_WorkflowPathPeople(internalId, id, name, operator, type));
	};
}

function LB_WorkflowPathPeople(internalId, id, name, operator, type){
	this.internalId = internalId;
	this.id = id;
	this.name = name;
	this.operator = operator;
	this.type = type;
}

function getRandomNumber(range)
{
	return Math.floor(Math.random() * range);
}

function getRandomChar()
{
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr( getRandomNumber(62), 1 );
}

function randomID(size)
{
	var str = "";
	for(var i = 0; i < size; i++)
	{
		str += getRandomChar();
	}
	return str;
}
