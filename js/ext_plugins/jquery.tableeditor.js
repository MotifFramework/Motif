/*
 *
 * TableEditor - In place AJAX editing of TableSorter!
 *
 * Copyright (c) 2006 Brice Burgess (http://www.iceburg.net)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Date: 2006-11-30 03:43:23 +0000 
 * $Version: 0.4 (alpha)
 * 
 */
jQuery.fn.tableEditor = function(o) {

	/**
	 * Assign default parameters. 
	 *
	 * EDIT_HTML : HTML/TEXT that EVENT_LINK changes to when converted to a "edit link".
	 *   Default : Uses the link's previous html
	 *
	 * SAVE_HTML : HTML/TEXT that EVENT_LINK changes to when converted to a "save link".
	 *   Default : "Save"
	 *
	 * EVENT_LINK_SELECTOR : // Selector used within a row's table cells to assign the EDIT ROW EVENT. 
	 *   Default: Assign to links with a class of "tsEditLink" (matches: <a class="tsEditLink">Edit</a>)
	 *
	 * ROW_KEY_SELECTOR: Selector used within a row's table cells to get the row key/id. 
	 *  This is used to associate a row with an underlying ID which is especially useful when updating
	 *  a table with data fetched from a database (assigned as the PRIMARY_KEY of a recordset).
	 *   Default: Assign to the text contained between the "key tag" (matches: <key>1202</key>)
	 *
	 * COL_NOEDIT_SELECTOR: Selector used against the table head elements <th>. If matched, this column
	 *   will be ignored and not made into a editable field nor available in the passed object (o.row)
	 * 
	 * COL_APPLYCLASS: (bool) TRUE/FALSE. If true, all classes found in <th> will be inherrited by
	 *   the edit row (<td>) columns when the EDIT_EVENT is fired.
	 * 
	 * ---------------
	 *  NOTE: These can be overriden and passed during runtime via;
	 *  $().ready(function() {	
	 *    $("#editableTable").tableSorter().tableEditor({
	 *      EDIT_HTML: 'EDIT2',
	 *      SAVE_HTML: 'Save'
	 *    });
	 *  }); 
	 * 
	 * ===CALLBACK FUNCTIONS===
	 *   Every callback function is passed an object (o) containing:
	 *    o.row: jQuery object consisting of the row's editable cells
	 *    o.key: the row key (extracted via ROW_KEY_SELECTOR)
	 *    
	 *   The Update callback function is additionally passed the following:
	 *    o.changed: Array representing the changed/updated values of a row (name:value) 
	 *    o.original: The original value of updated cells from o.update (name:value)
	 *      this is used to restore value if the update failed/was rejected by server side validation.
	 *   
	 *   FUNC_PRE_EDIT: Executed before a row's cells are made editable
	 *     Example Use: Switch a regular text cell to a multiple-choice <select> 
	 * 
	 *   FUNC_POST_EDIT: Executed after a row's cells are made editable
	 *     Example Use: Inject client side validation on the newly made input fields
	 * 
	 *   FUNC_PRE_SAVE: Executed before a row's cells are made not editable
	 *     Example Use: Sanitize/Normalize user input
	 * 
	 *   FUNC_UPDATE: Executed after a row's cells are made not editable
	 *     Example Use: Update the datasource through an AJAX call
	 */
	  
	var defaults =  {		
		EDIT_HTML: null,
		SAVE_HTML: "Save",
		EVENT_LINK_SELECTOR: "a.tsEditLink", 
		ROW_KEY_SELECTOR: "key",
		COL_NOEDIT_SELECTOR: ".noEdit",
		COL_APPLYCLASS: false,
		FUNC_PRE_EDIT: false,
		FUNC_POST_EDIT: false,
		FUNC_PRE_SAVE: false,
		FUNC_UPDATE: false,
		
		// not to be configured -->
		COLUMN_NAMES: new Array(), // holds the name (assigned via <th name="...">) of each column
		COLUMN_NOEDIT: new Array(), // holds the column index of columns to ignore/not edit
		COLUMN_CLASSES: new Array()
	};
	jQuery.extend(defaults, o);
	
	// DEFAULT CONSTRUCTOR
	return this.each(function(){
		
		var firstRow = this.rows[0];
		var secondRow = this.rows[1];
		var l = firstRow.cells.length;
		
		// populate names, classes, and noEdit
		for( var i=0; i < l; i++ ) {		
			var name = jQuery(firstRow.cells[i]).attr('name');
			defaults.COLUMN_NAMES.push((name) ? name : 'column'+i);
			
			// check for noEdit selector
			if (jQuery(firstRow.cells[i]).is(defaults.COL_NOEDIT_SELECTOR))
				defaults.COLUMN_NOEDIT[i] = true;
			
			// check for class inheritance
			if (defaults.COL_APPLYCLASS) 
				defaults.COLUMN_CLASSES[i] = jQuery(firstRow.cells[i]).attr('class');
		}
		
		// store a reference to this table's options -- function sets and returns table ID
		var id = jQuery.tableEditor.vault.store(defaults,this);
		
		// define & assign edit event to each "edit link"
		jQuery(defaults.EVENT_LINK_SELECTOR, this).each(function() {	
			jQuery(this).click(function() {				
				jQuery.editRow(this,id);
				return false;
			});
		});
	});
};

jQuery.editRow = function(link, tid) {
	// get this tables options (defaults)
	var o = jQuery.tableEditor.vault.get(tid);
	
	// initialize row state
	var action = (jQuery(link).is('.tsToggleEdit')) ? 'save' : 'edit';
	var row = jQuery("../../td",link);
	var key = jQuery(o.ROW_KEY_SELECTOR,row).text();
	
	// get a row filtered of "noEdit" and "edit link" columns
	var fRow = jQuery.tableEditor.lib.filterRow(row,o.COLUMN_NOEDIT,o.EVENT_LINK_SELECTOR);
	
	// initialize object passed to the callback functions
	p = {"row": fRow, "key" : key };
	
	if (action == 'edit') {
		if (o.FUNC_PRE_EDIT) eval (o.FUNC_PRE_EDIT+"(p)");
		
		jQuery(link).addClass('tsToggleEdit').html(o.SAVE_HTML);
		
		// Disable sorting on table
		jQuery.tableSorter.active.set(true);
		
		// Convert table row cells into editable form fields.
		row.each(function(i) {
			if (fRow.index(this) < 0)
				return;
					
			var html = jQuery.tableEditor.lib.makeEditable(jQuery(this), o.COLUMN_NAMES[i], key);
			if (html !== false)
				jQuery(this).html(html);
			
			if (o.COL_APPLYCLASS)
				if (typeof(o.COLUMN_CLASSES[i]) != 'undefined' && o.COLUMN_CLASSES[i].toString() != '')
					jQuery('input, select',this).addClass(o.COLUMN_CLASSES[i]); 
		});
		
		if (o.FUNC_POST_EDIT) eval (o.FUNC_POST_EDIT+"(p)");
	}
	
	if (action == 'save') {
		if (o.FUNC_PRE_SAVE)
			eval (o.FUNC_PRE_SAVE+"(p)");
		
		jQuery(link).removeClass('tsToggleEdit').html(o.EDIT_HTML);
		
		// Enable sorting on table
		jQuery.tableSorter.active.set(true);
		
		// Make cells non editable, update their value.
		row.each(function(i) {	
			if (fRow.index(this) < 0)
				return;
				
			var html = jQuery.tableEditor.lib.makeStatic(jQuery(this), o.COLUMN_NAMES[i], key);
			if (html !== false)
				jQuery(this).html(html);
		});
	
		// Clear tableSorter's cache (so that ir re-reads row's new/updated values)
		// TODO: RE-DO this using tS's new bind event -- preferably only update cache for only this row
		jQuery.tableSorter.clearCache.set(true);
					
		p.changed = jQuery.tableEditor.cache.row[key];
		p.original = jQuery.tableEditor.cache.original[key];
		if (o.FUNC_UPDATE)
			eval (o.FUNC_UPDATE+"(p)");	
	}
	return;
}


jQuery.tableEditor = {
	cache: {
		// When "edit" is clicked; holds a the values of cells in row[key].
		// Upon "save", name/value pair is removed if UNCHANGED, or left alone if changed. 
		//   The object can then be sent as JSON via an AJAX request to the datasource updater
		row: { },
		original: { },
		add: function(key, name, val) {
			if (!this.row[key]) { this.row[key] = { }; }
			this.row[key][name] = val;
		},
		update: function(key, name, val) {
			this.remember(key,name); // todo -> remember only changed?
			// remove from cache upon "match" -- filters row{} of unchanged data
			if (this.row[key][name] == val)
				delete this.row[key][name];	
			else 
				this.row[key][name] = val;
		},
		remember: function(key,name) {
			// copy a rows values
			//  (remembers original value to fall back to in case update fails)
			if (!this.original[key]) { this.original[key] = { }; }
			this.original[key][name] = this.row[key][name];
		}
	},
	lib: {		
		// filters a row of "noEdit" and "edit link" columns
		//   (returns a cloned row)
		filterRow: function(row, noEdits, editLink) {
			var o = jQuery(row);
			var remove = new Array();
			o.each(function(i) { if(noEdits[i] === true) remove.push(this); });
			for (i=0; i < remove.length; i++)
				o.not(remove[i]);
			o.not(jQuery(editLink, o).parent()[0]);
			return o;	
		},

		// makes a table cell editable
		// accepts a jQ object (content of cell)
		// accepts a name (str) [will be used as INPUT name attribute]
		// accepts a row key (str) [passed to cache function, so that we have unique row(key):name pairs]
		// returns HTML (editable cell content)
		makeEditable: function(html, name, key) { 
			// determine if html is already a form element
			if (jQuery("input,select,textarea",html).size() > 0) {			
				html = html.find("input,select,textarea"); // constrains jQ object to INPUT vs TD			
				var val = (html.attr('type') == 'checkbox') ? 
					html[0].checked :
					html.val();
				// add preserve class, remove disabled (if set)
				html.attr("disabled", false).addClass("tsPreserve");
				jQuery.tableEditor.cache.add(key, name, val);
				return false;
			}			
			
			var val = html.html().replace(/[\"]+/g,'&quot;'); // replace " with HTML entity to behave within value=""
			html = '<input type="text" name="'+name+'" value="'+val+'"></input>';
			jQuery.tableEditor.cache.add(key, name, val);
			return html;	
		},
		// makes a table cell static (non editable)
		// accepts a jQ object (content of cell)
		// accepts a name (str) [will be used as INPUT name attribute]
		// accepts a row key (str) [passed to cache function, so that we have unique row(key):name pairs]
		// returns HTML (non editable cell content)
		makeStatic: function(html, name, key ) {
			html = html.find("input,select,textarea"); // constrains jQ object to INPUT vs TD			
			html.attr('disabled', true);
			var val = (html.attr('type') == 'checkbox') ? 
				html[0].checked :
				html.val();
			// update the cache with new value.
			jQuery.tableEditor.cache.update(key, name, val);
			
			return (html.is(".tsPreserve")) ? false : val;
		},
		// restores a row to originalj
		restoreRow: function(row, original) {
			var values = new Array();
			for (j in original) 
				values.push(original[j]);
			
			row.each(function(i) { 
				if (jQuery("input,select,textarea",this).size() > 0) {			
					html = jQuery(this).find("input,select,textarea");
					if (html.attr('type') == 'checkbox')
						html[0].checked = values[i];
					else
						html.val(values[i]);
				}
				else
					jQuery(this).html(values[i]);			
			});
		},
		// -- THIS FUNCTION IS OPTIONAL! Not necessary for in place editing.
		// adds a row to the table (first row)
		// accepts a table (jQ reference to <table> element)
		// returns a jQ reference to the blank row (<tr>)
		appendRow: function(input) {
			var defaults =  {		
				TABLE: false, // jQ object containing table, else FALSE (use first tableEditor table)
				KEY: 0, // the key of newRow
				CLASS: '', // apply class to newRow (can add multiple "class1 class2")
				VALUES: { }, // populate newRow with these values
				COPY: false // keep values from cloned row
			};
			jQuery.extend(defaults, input);
			
			if (defaults.TABLE === false)
				defaults.TABLE = jQuery.tableEditor.vault.getTableByID(0);
			var o = jQuery.tableEditor.vault.getTableOptions(defaults.TABLE[0]);
			
			// clone second row in table
			var row = defaults.TABLE[0].rows[1];
			var newRow = jQuery(row).clone();
			
			// bind the event link, change key, add class, update values
			newRow.find(o.EVENT_LINK_SELECTOR).each(function() { 
				jQuery(this).click(function() {				
					jQuery.editRow(this,o.tid);
					return false;
				});
			}).end()
			.find(o.ROW_KEY_SELECTOR).html(defaults.KEY).end()
			.addClass(defaults.CLASS)
			.find('td').each(function(i) { 
				if (jQuery(o.EVENT_LINK_SELECTOR+','+o.EVENT_LINK_SELECTOR, this).size() > 0)
					return;
				if (defaults.COPY === false) {
					var name = o.COLUMN_NAMES[i];
					var val = (typeof(defaults.VALUES[name]) == 'undefined') ? '' : defaults.VALUES[name];
					jQuery(this).html(val);
				}
			}).end(); 
			
			// add row before secondRow
			jQuery(row).before(newRow);
			
			return;
		}
	},
	vault: {  // TODO -- add some closures here
		vault: [],
		// stores the options for a table in a vault (defaults)
		// returns the ID of storage
		store: function(options, table) {
			var id = this.vault.length;
			jQuery.extend(options, {tid: id});
			this.vault.push(options);
			
			// set the table ID
			jQuery(table).attr('teID',id.toString());
			return id;
		},
		get: function(id) {
			return this.vault[id];
		},
		getTableID: function(table) {
			return jQuery(table).attr('teID');
		},
		getTableByID: function(id) {
			return jQuery('table[@teID='+id+']');
		},
		getTableOptions: function(table) {
			return this.get(this.getTableID(table));
		}
	}
};