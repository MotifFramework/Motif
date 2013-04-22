
function LB_CurriculumChart(key){
	this.years = new Array();
	this.key = key;
	
	this.saveYear = function(id)
	{
		var year = this.getYear(id);
		
		if(year){
			var name = $('#year-input-name-'+year.id+'').val();
			year.name = name;
		}
		
		this.renderValue();
		this.saveValue();
	}
	
	this.addYear = function(id, name)
	{
		this.years.push(new LB_CurriculumYear(id, name));
	};
	
	this.getYear = function(yearId)
	{
		for(var i=0; i<this.years.length; i++){
			if(this.years[i].id == yearId){
				return this.years[i];
			}
		}
	}
	
	this.saveTerm = function(id)
	{
		var term = this.getTerm(id);
		
		if(term){
			var name = $('#term-input-name-'+term.id+'').val();
			term.name = name;
		}
		
		this.renderValue();
		this.saveValue();
	}
	
	this.getTerm = function(termId)
	{
		for(var i=0; i<this.years.length; i++){
			if(this.years[i].getTerm(termId)){
				return this.years[i].getTerm(termId);
			}
		}
	}
	
	this.addTerm = function(yearId, id, name)
	{
		var year = this.getYear(yearId);
		
		if(year){
			year.addTerm(id, name);
		}
	}
	
	this.addTitle = function(yearId, termId, titleId, title, credit_hour)
	{
		var year = this.getYear(yearId);
		
		if(year){
			var term = year.getTerm(termId);
			if(term){
				term.addTitle(titleId, title, credit_hour)
			}
		}	
	}
	
	this.saveTitle = function(id)
	{
		var title = this.getTitle(id);
		
		if(title){
			var name = $('#title-input-name-'+title.id+'').val();
			var credit_hour = $('#title-input-credit-'+title.id+'').val();
			title.title = name;
			title.credit_hour = credit_hour;
		}
		
		this.renderValue();
		this.saveValue();
	}
	
	this.getTitle = function(titleId)
	{
		for(var i=0; i<this.years.length; i++){
			if(this.years[i].getTitle(titleId)){
				return this.years[i].getTitle(titleId);
			}
		}
	}
	
	this.refresh = function(){
		this.renderValue();
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
	
	this.getFullRowCount = function(yearId)
	{
		var cnt = 0;
		
		var year = this.getYear(yearId);
		
		if(year){
			for(var j=0; j<year.terms.length; j++){
				cnt += year.terms[j].titles.length+1;
			}
		}
		
		return cnt;	
	}
	
	this.getTermRowCount = function(termId)
	{
		var term = this.getTerm(termId);
		if(term){
			return term.titles.length;
		}
	}
	
	this.confirmRemoveYear = function(yearId)
	{
		this.years = jQuery.grep(this.years, function(value){return value.id != yearId});
		
		this.refresh();
		
	}
	
	this.confirmRemoveTerm = function(yearId, termId)
	{
		var year = 	this.getYear(yearId);
		
		if(year){
			year.terms = jQuery.grep(year.terms, function(value){return value.id != termId});
		}
		
		this.refresh();
		
	}
	
	this.confirmRemoveTitle = function(yearId, termId, titleId)
	{
		var term = 	this.getTerm(termId);
		
		if(term){
			term.titles = jQuery.grep(term.titles, function(value){return value.id != titleId});
		}
		
		this.refresh();
		
	}
	
	this.sortDropYear = function(event, ui, obj){
		
		var tmpYears = new Array();
		
		var data = obj.sortable('toArray');
		if(data){
			for(var i=0; i<data.length; i++){
				var yearId = data[i].replace("year-row-", "");
				var year = this.getYear(yearId);
				if(year){
					tmpYears.push(year);
				}
			}
			
			this.years = tmpYears;
		}
		
		this.saveValue();
		
		//console.log($("#"+this.key+"_input").val());
	}
	
	this.sortDropTerm = function(event, ui, obj){
		
		var yearId = obj.attr("id").replace("cur-ul-term-"+this.key+"-", "");
		var year = this.getYear(yearId);
		var tmpTerms = new Array();
		
		var data = obj.sortable('toArray');
		if(data && year){
			for(var i=0; i<data.length; i++){
				var termId = data[i].replace("term-row-", "");
				var term = year.getTerm(termId);
				if(term){
					tmpTerms.push(term);
				}
			}
			
			year.terms = tmpTerms;
		}
		
		this.saveValue();
		
		//console.log($("#"+this.key+"_input").val());
	}
	
	this.sortDropTitle = function(event, ui, obj){
		
		var termId = obj.attr("id").replace("cur-ul-title-"+this.key+"-", "");
		var term = this.getTerm(termId);
		var tmpTitles = new Array();
		
		var data = obj.sortable('toArray');
		if(data && term){
			for(var i=0; i<data.length; i++){
				var titleId = data[i].replace("title-row-", "");
				var title = term.getTitle(titleId);
				tmpTitles.push(title);
			}
			
			term.titles = tmpTitles;
		}
		
		this.saveValue();
		
	}
	
	this.renderValue = function()
	{
		var html = "";
		
		/*html += '<table width="100%" class="cur_table" cellpadding="0" cellspacing="0" border="0">';
			html += '<tr class="year add" id="new-year-row-add">';
				html += '<th width="10%"><img src="/resources/images/admin/icon_add_small.png" /></th><td width="90%" valign="top" colspan="3">Add a new year</td>';
			html += '</tr>';
		html += "</table>";*/
			
		html += '<ul id="cur-ul-year-'+this.key+'" class="cur-ul">';
		
			html += '<li id="year-row-add-'+this.key+'" class="year-li add">';
				html += '<div class="title"><div><img src="/resources/images/admin/icon_add_small.png" /></div></div><div class="name"><div>Add A New Year</div></div><div class="edit"><div></div></div>';
				html += '<div class="clear"></div>';
			html += '</li>';
		
		for(var i=0; i<this.years.length; i++)
		{
			var year = this.years[i];
			
			html += '<li id="year-row-'+year.id+'" class="year-li">';
			
				html += '<div id="year-row-selector-'+year.id+'"><div class="title"><div>Year</div></div><div class="name"><div>'+year.name+'</div></div><div class="edit edit-year"><div><img src="/resources/images/admin/icon_temp_code.gif" id="year-edit-icon-'+year.id+'" /> <img src="/resources/images/admin/icon_error.gif" id="year-remove-icon-'+year.id+'" style="width:15px;" /></div></div></div>';
				html += '<div id="year-inline-edit-'+year.id+'" class="edit-row">';
					html += '<div class="title"><div>Year</div></div><div class="edit-it"><div class="edit-it-div">';
						html += '<div style="padding:15px;"><div class="cur_table_edit_head">Edit Year</div><div class="cur_table_edit_desc">Use the form below to edit your year</div><div class="cur_table_edit_input_heading">Year Title</div><div class="cur_table_edit_input"><input type="text" id="year-input-name-'+year.id+'" value="'+year.name+'" /></div><div class="cur_table_edit_submit"><a href="javascript:void(0);" style="font-size:12px; font-weight:bold;" id="year-button-save-'+year.id+'">Save Changes</a> or <a href="javascript:void(0);" style="font-size:11px; font-weight:normal;" id="year-button-cancel-'+year.id+'">cancel</a></div></div>';
					html += '</div></div>';							
				html += '</div>';
				html += '<div class="clear"></div>';
			
				html += '<ul id="cur-ul-term-'+this.key+'-'+year.id+'" class="cur-ul">';
				
					html += '<li id="term-row-add-'+year.id+'" class="term-li add">';
						html += '<div class="title"><div><img src="/resources/images/admin/icon_add_small.png" /></div></div><div class="name"><div>Add A New Term</div></div><div class="edit"><div></div></div>';
						html += '<div class="clear"></div>';
					html += '</li>';
				
					for(var j=0; j<this.years[i].terms.length; j++){
						var term = this.years[i].terms[j];
						
						html += '<li id="term-row-'+term.id+'" class="term-li">';
							html += '<div id="term-row-selector-'+term.id+'"><div class="title"><div>Term</div></div><div class="name"><div>'+term.name+'</div></div><div class="edit edit-term"><div><img src="/resources/images/admin/icon_temp_code.gif" id="term-edit-icon-'+term.id+'" /> <img src="/resources/images/admin/icon_error.gif" style="width:15px;" id="term-remove-icon-'+term.id+'" /></div></div></div>';
							html += '<div id="term-inline-edit-'+term.id+'" class="edit-row">';
								html += '<div class="title"><div>Term</div></div><div class="edit-it"><div class="edit-it-div">';
									html += '<div style="padding:15px;"><div class="cur_table_edit_head">Edit Term</div><div class="cur_table_edit_desc">Use the form below to edit your term</div><div class="cur_table_edit_input_heading">Term Title</div><div class="cur_table_edit_input"><input type="text" id="term-input-name-'+term.id+'" value="'+term.name+'" /></div><div class="cur_table_edit_submit"><a href="javascript:void(0);" style="font-size:12px; font-weight:bold;" id="term-button-save-'+term.id+'">Save Changes</a> or <a href="javascript:void(0);" style="font-size:11px; font-weight:normal;" id="term-button-cancel-'+term.id+'">cancel</a></div></div>';
								html += '</div></div>';							
							html += '</div>';
							html += '<div class="clear"></div>';
							
							html += '<ul id="cur-ul-title-'+this.key+'-'+term.id+'" class="cur-ul">';
							
								html += '<li id="title-row-add-'+term.id+'" class="title-li add">';
									html += '<div class="title"><div><img src="/resources/images/admin/icon_add_small.png" /></div></div><div class="name"><div>Add A New Course</div></div><div class="credit"><div></div></div><div class="edit"><div></div></div>';
									html += '<div class="clear"></div>';
								html += '</li>';
							
								for(var m=0; m<term.titles.length; m++){
									var title = term.titles[m];
									
									html += '<li id="title-row-'+title.id+'" class="title-li">';
										html += '<div id="title-row-selector-'+title.id+'"><div class="title"><div>Title</div></div><div class="name"><div>'+title.title+'</div></div><div class="credit"><div>'+title.credit_hour+'</div></div><div class="edit"><div><img src="/resources/images/admin/icon_temp_code.gif" id="title-edit-icon-'+title.id+'" /> <img src="/resources/images/admin/icon_error.gif" id="title-remove-icon-'+title.id+'" style="width:15px;" /></div></div></div>';
										html += '<div id="title-inline-edit-'+title.id+'" class="edit-row">';
											html += '<div class="title"><div>Title</div></div><div class="edit-it"><div class="edit-it-div">';
												html += '<div style="padding:15px;"><div class="cur_table_edit_head">Edit Title</div><div class="cur_table_edit_desc">Use the form below to edit your title</div><div class="cur_table_edit_input_heading">Title</div><div class="cur_table_edit_input"><input type="text" id="title-input-name-'+title.id+'" value="'+title.title+'" /></div><div class="cur_table_edit_input_heading">Credit Hours</div><div class="cur_table_edit_input"><input type="text" id="title-input-credit-'+title.id+'" value="'+title.credit_hour+'" /></div><div class="cur_table_edit_submit"><a href="javascript:void(0);" style="font-size:12px; font-weight:bold;" id="title-button-save-'+title.id+'">Save Changes</a> or <a href="javascript:void(0);" style="font-size:11px; font-weight:normal;" id="title-button-cancel-'+title.id+'">cancel</a></div></div>';
											html += '</div></div>';							
										html += '</div>';
										html += '<div class="clear"></div>';
									html += '</li>';
									
									
									html += '<script type="text/javascript">';
										html += '$("#title-button-save-'+title.id+'").click(function(){';
											html += '$("#title-row-selector-'+title.id+'").slideDown();';
											html += '$("#title-inline-edit-'+title.id+'").slideUp();';
											html += 'LBCC'+this.key+'.saveTitle("'+title.id+'");';
										html += '});';
									html += '</script>';
									
									html += '<script type="text/javascript">';
										html += '$("#title-button-cancel-'+title.id+'").click(function(){';
											html += '$("#title-row-selector-'+title.id+'").slideDown();';
											html += '$("#title-inline-edit-'+title.id+'").slideUp();';
										html += '});';
									html += '</script>';
									
									html += '<script type="text/javascript">';
										html += '$("#title-edit-icon-'+title.id+'").click(function(){';
											html += '$("#title-row-selector-'+title.id+'").slideUp();';
											html += '$("#title-inline-edit-'+title.id+'").slideDown();';
										html += '});';
									html += '</script>';
									
									html += '<script type="text/javascript">';
										html += '$("#title-remove-icon-'+title.id+'").click(function(){';
											html += '$("<a></a>").lb_confirm({';
												html += 'type : "disable",';
												html += 'title : "You Are About To Remove :",';
												html += 'content : "Title Name: '+title.title+'",';
												html += 'linkText : "",';
												html += 'linkHref : "",';
												html += 'url : "javascript:LBCC'+this.key+'.confirmRemoveTitle(\''+year.id+'\', \''+term.id+'\', \''+title.id+'\');"';
											html += '}).click();';
										html += '});';
									html += '</script>';
									
									html += '<script type="text/javascript">$("#title-row-selector-'+title.id+'").mouseenter(function(){$("#title-row-'+title.id+' .edit img").show(); $("#title-row-selector-'+title.id+'").addClass("hoverRow");}).mouseleave(function(){$("#title-row-'+title.id+' .edit img").hide(); $("#title-row-selector-'+title.id+'").removeClass("hoverRow");});</script>';
										
								}
							
							html += '</ul>';
							
							html += '<script type="text/javascript">';
								html += '$("#term-button-save-'+term.id+'").click(function(){';
									html += '$("#term-row-selector-'+term.id+'").slideDown();';
									html += '$("#term-inline-edit-'+term.id+'").slideUp();';
									html += 'LBCC'+this.key+'.saveTerm("'+term.id+'");';
								html += '});';
							html += '</script>';
							
							html += '<script type="text/javascript">';
								html += '$("#term-button-cancel-'+term.id+'").click(function(){';
									html += '$("#term-row-selector-'+term.id+'").slideDown();';
									html += '$("#term-inline-edit-'+term.id+'").slideUp();';
								html += '});';
							html += '</script>';
							
							html += '<script type="text/javascript">';
								html += '$("#term-edit-icon-'+term.id+'").click(function(){';
									html += '$("#term-row-selector-'+term.id+'").slideUp();';
									html += '$("#term-inline-edit-'+term.id+'").slideDown();';
								html += '});';
							html += '</script>';
							
							html += '<script type="text/javascript">$("#cur-ul-title-'+this.key+'-'+term.id+'").sortable({';
								html += 'items: "li:not(.add)",';
								html += 'update: function(event, ui){LBCC'+this.key+'.sortDropTitle(event, ui, $(this))}';
							html += '}).disableSelection();</script>';
							html += '<script type="text/javascript">$("#cur-ul-title-'+this.key+'-'+term.id+'").bind("mousedown", function(e) {   e.stopPropagation(); });</script>';
							
							html += '<script type="text/javascript">';
								html += '$("#title-row-add-'+term.id+'").click(function(){';
									html += '$("<a></a>").lb_box({';
										html += 'dataSource : "/admin/content/dialog/createTitle.html?term='+encodeURI(term.name)+'&termId='+term.id+'&yearId='+year.id+'&key='+this.key+'",';
										html += 'title : "Create A Course",';
										html += 'width : 470,';
										html += 'height : 420,';
										html += 'type: "iframe",';
										html += 'animate : true';
									html += '}).click();';
								html += '});';
							html += '</script>';
							
							html += '<script type="text/javascript">';
								html += '$("#term-remove-icon-'+term.id+'").click(function(){';
									html += '$("<a></a>").lb_confirm({';
										html += 'type : "disable",';
										html += 'title : "You Are About To Remove :",';
										html += 'content : "Term Name: '+term.name+'",';
										html += 'linkText : "",';
										html += 'linkHref : "",';
										html += 'url : "javascript:LBCC'+this.key+'.confirmRemoveTerm(\''+year.id+'\', \''+term.id+'\');"';
									html += '}).click();';
								html += '});';
							html += '</script>';
							
							html += '<script type="text/javascript">$("#term-row-selector-'+term.id+'").mouseenter(function(){$("#term-row-'+term.id+' .edit-term img").show(); $("#term-row-selector-'+term.id+'").addClass("hoverRow");}).mouseleave(function(){$("#term-row-'+term.id+' .edit-term img").hide(); $("#term-row-selector-'+term.id+'").removeClass("hoverRow");});</script>';
							
						html += '</li>';
					}
				html += '</ul>';
				
				html += '<script type="text/javascript">';
					html += '$("#year-button-save-'+year.id+'").click(function(){';
						html += '$("#year-row-selector-'+year.id+'").slideDown();';
						html += '$("#year-inline-edit-'+year.id+'").slideUp();';
						html += 'LBCC'+this.key+'.saveYear("'+year.id+'");';
					html += '});';
				html += '</script>';
				
				html += '<script type="text/javascript">';
					html += '$("#year-button-cancel-'+year.id+'").click(function(){';
						html += '$("#year-row-selector-'+year.id+'").slideDown();';
						html += '$("#year-inline-edit-'+year.id+'").slideUp();';
					html += '});';
				html += '</script>';
				
				html += '<script type="text/javascript">';
					html += '$("#year-edit-icon-'+year.id+'").click(function(){';
						html += '$("#year-row-selector-'+year.id+'").slideUp();';
						html += '$("#year-inline-edit-'+year.id+'").slideDown();';
					html += '});';
				html += '</script>';
				
				html += '<script type="text/javascript">$("#cur-ul-term-'+this.key+'-'+year.id+'").sortable({';
					html += 'items: "li:not(.add)",';
					html += 'update: function(event, ui){LBCC'+this.key+'.sortDropTerm(event, ui, $(this))}';
				html += '}).disableSelection();</script>';
				html += '<script type="text/javascript">$("#cur-ul-term-'+this.key+'-'+year.id+'").bind("mousedown", function(e) {   e.stopPropagation(); });</script>';
				
				html += '<script type="text/javascript">';
					html += '$("#term-row-add-'+year.id+'").click(function(){';
						html += '$("<a></a>").lb_box({';
							html += 'dataSource : "/admin/content/dialog/createTerm.html?year='+encodeURI(year.name)+'&yearId='+year.id+'&key='+this.key+'",';
							html += 'title : "Create A Term",';
							html += 'width : 470,';
							html += 'height : 350,';
							html += 'type: "iframe",';
							html += 'animate : true';
						html += '}).click();';
					html += '});';
				html += '</script>';
				
				html += '<script type="text/javascript">';
					html += '$("#year-remove-icon-'+year.id+'").click(function(){';
						html += '$("<a></a>").lb_confirm({';
							html += 'type : "disable",';
							html += 'title : "You Are About To Remove :",';
							html += 'content : "Year Name: '+year.name+'",';
							html += 'linkText : "",';
							html += 'linkHref : "",';
							html += 'url : "javascript:LBCC'+this.key+'.confirmRemoveYear(\''+year.id+'\');"';
						html += '}).click();';
					html += '});';
				html += '</script>';
				
				html += '<script type="text/javascript">$("#year-row-selector-'+year.id+'").mouseenter(function(){$("#year-row-'+year.id+' .edit-year img").show(); $("#year-row-selector-'+year.id+'").addClass("hoverRow");}).mouseleave(function(){$("#year-row-'+year.id+' .edit-year img").hide(); $("#year-row-selector-'+year.id+'").removeClass("hoverRow");});</script>';
				
			html += '</li>';
			
		}
		
		html += '</ul>';
		
		html += '<script type="text/javascript">$("#cur-ul-year-'+this.key+'").sortable({';
			html += 'items: "li:not(.add)",';
			html += 'update: function(event, ui){LBCC'+this.key+'.sortDropYear(event, ui, $(this))}';
		html += '}).disableSelection();</script>';
		html += '<script type="text/javascript">$("#cur-ul-year-'+this.key+'").bind("mousedown", function(e) {   e.stopPropagation(); });</script>';
		
		html += '<script type="text/javascript">';
			html += '$("#year-row-add-'+this.key+'").click(function(){';
				html += '$("<a></a>").lb_box({';
					html += 'dataSource : "/admin/content/dialog/createYear.html?key='+this.key+'",';
					html += 'title : "Create A Year",';
					html += 'width : 470,';
					html += 'height : 350,';
					html += 'type: "iframe",';
					html += 'animate : true';
				html += '}).click();';
			html += '});';
		html += '</script>';
		
		
		$("#"+this.key+"_output").html(html);
	}
	
	this.saveValue = function()
	{
		$("#"+this.key+"_input").val($.toJSON(this.years));
	};
}

function LB_CurriculumYear(id, name){
	this.id = id;
	this.name = name;
	this.terms = new Array();
	
	this.addTerm = function(id, name)
	{
		this.terms.push(new LB_CurriculumTerm(id, name));
	};
	
	this.getTitle = function(titleId)
	{
		for(var i=0; i<this.terms.length; i++){
			for(var j=0; j<this.terms[i].titles.length; j++){
				if(this.terms[i].titles[j].id == titleId){
					return(this.terms[i].titles[j]);
				}
			}
		}
	}
	
	this.getTerm = function(termId)
	{
		for(var i=0; i<this.terms.length; i++){
			if(this.terms[i].id == termId){
				return this.terms[i];
			}
		}
	}
}

function LB_CurriculumTerm(id, name){
	this.id = id;
	this.name = name;
	this.titles = new Array();
	
	this.getTitle = function(titleId)
	{
		for(var j=0; j<this.titles.length; j++){
			if(this.titles[j].id == titleId){
				return(this.titles[j]);
			}
		}
	}
	
	this.addTitle = function(titleId, title, credit_hour)
	{
		this.titles.push(new LB_CurriculumTitle(titleId, title, credit_hour));
	};
}

function LB_CurriculumTitle(id, title, credit_hour){
	this.id = id;
	this.title = title;
	this.credit_hour = credit_hour;
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
