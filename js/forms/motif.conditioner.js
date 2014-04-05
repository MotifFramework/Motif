/**
 * Conditioner by Motif v0.3.0 (2013-01-02)
 * Conditionally enable and disable form elements.
 * http://getmotif.com
 * 
 * @author Jonathan Pacheco <jonathan@lifeblue.com>
 */
(function ( $ ) {

	"use strict";

	// Variables
	var vars	=	{

			// System Variables
			"pluginName"	:	"conditioner",

			// Automatically group radios/checkboxes
			"autoGroup"		:	true, // Does nothing right now

			// Class Names and Hooks
			"activeClass"	:	"is-active",
			"disabledClass"	:	"is-disabled",
			"dataReveal"	:	"conditional-reveal",
			"dataConceal"	:	"conditional-conceal",
			"dataGroup"		:	"conditional-group", // Does nothing right now

			// On Init
			"onInit"		:	null,

			// On Enable
			"onEnable"		:	null,

			// On Disable
			"onDisable"		:	null
		},

		// Methods
		methods	=	{

			// Init method, run on initialization
			"init"	:	function (o) {

				// Before we can bind events, we need to set a few things
				this.each(function () {
					var $this					=	$(this),
						s						=	$.extend(true, {}, vars, o),

						// Grab variables
						trigger_elem			=	$this,
						reveal_target			=	$("#" + trigger_elem.attr("data-" + s.dataReveal)),
						conceal_target			=	$("#" + trigger_elem.attr("data-" + s.dataConceal));

					// Add new attribute to target
					reveal_target.attr("data-conditional-target", reveal_target.attr("id"));
					conceal_target.attr("data-conditional-target", conceal_target.attr("id"));
				});

				// Dirty business of binding events and logic
				return this.each(function () {

					// Variables
					var $this					=	$(this),
						s						=	$.extend(true, {}, vars, o),

						// Grab variables
						trigger_elem			=	$this,
						orig_data				=	trigger_elem.data(),
						reveal_target_id		=	trigger_elem.attr("data-" + s.dataReveal),
						conceal_target_id		=	trigger_elem.attr("data-" + s.dataConceal),
						reveal_target			=	$("#" + reveal_target_id),
						conceal_target			=	$("#" + conceal_target_id),
						conditional_group_id	=	trigger_elem.attr("data-" + s.dataGroup),
						conditional_group		=	$("[data-" + s.dataGroup + "='" + conditional_group_id + "']"),
						trigger_value			=	trigger_elem.val(),
						group_check				=	false,
						select_trigger,
						select_value,

						// Plugin settings
						data					=	{
							"origData"			:	orig_data,
							"triggerElem"		:	trigger_elem,
							"conditionalGroup"	:	conditional_group,
							"revealTargetID"	:	reveal_target_id,
							"concealTargetID"	:	conceal_target_id,
							"revealTarget"		:	reveal_target,
							"concealTarget"		:	conceal_target,
							"activeClass"		:	s.activeClass,
							"disabledClass"		:	s.disabledClass,
							"dataReveal"		:	s.dataReveal,
							"dataConceal"		:	s.dataConceal,
							"autoGroup"			:	s.autoGroup,
							"onInit"			:	s.onInit,
							"onEnable"			:	s.onEnable,
							"onDisable"			:	s.onDisable
						};

					function checkGroup(group, trigger_value) {
						// Variables
						var checked_radio	=	group.filter(function () {
								return $(this).is(":checked");
							}),
							group_check		=	false,
							box_value;

						// ...each checked box...
						checked_radio.each(function () {

							// ...get this box's value...
							box_value		=	$(this).val();

							// ...if the value equals the trigger's `value`...
							if (box_value === trigger_value) {

								// ...note that something in the group is checked
								group_check	=	true;
							}
						});

						return group_check;
					}

					// Add settings to data object
					$this.data("conditionalSettings", data);

					// If onInit callback...
					if (typeof s.onInit === "function") {
						s.onInit($this);
					}

					// Select Boxes
					if (trigger_elem.is("option")) {

						// Get the value of the trigger `<option>`
						select_trigger		=	trigger_elem.parent();
						select_value		=	select_trigger.val();

						// On load, iff the `<select>` value equals our trigger element's value...
						if (select_value === trigger_value) {

							// ...enable
							methods.evaluate.call($this, "active");
						}

						// When the parent `<select>` changes...
						select_trigger.on("change", function () {

							// ...get the new `<select>` value
							select_value	=	$(this).val();

							// If the new `<select>` value equals our trigger element's value...
							if (select_value === trigger_value) {

								// ...enable
								methods.evaluate.call($this, "active");

							// ...if it does not equal...
							} else {

								// ...disable the revealing and enable the concealing
								methods.evaluate.call($this, "inactive");
							}
						});

					// Checkbox/Radios
					} else if (trigger_elem.is("input[type='checkbox']") || trigger_elem.is("input[type='radio']")) {

						// Get the value of the trigger radio/checkbox
						trigger_value			=	trigger_elem.val();

						// Find the entire radio/checkbox group
						conditional_group_id	=	trigger_elem.attr("name");
						conditional_group		=	$("input[name='" + conditional_group_id + "']");
						group_check				=	checkGroup(conditional_group, trigger_value);

						// If anything in the group is checked...
						if (group_check === true) {

							// ...enable
							methods.evaluate.call($this, "active");

						}

						// If any in the box group changes...
						conditional_group.on("change", function () {

							group_check			=	checkGroup(conditional_group, trigger_value);

							// If anything in the group is checked...
							if (group_check === true) {

								// ...enable
								methods.evaluate.call($this, "active");

							// ...if nothing is checked...
							} else {

								// ...disable
								methods.evaluate.call($this, "inactive");
							}
						});

					// Text inputs and textareas
					} else {

						if (trigger_elem.val().trim() !== "") {

							// ...enable
							methods.evaluate.call($this, "active");
						}

						// On input change...
						trigger_elem.on("change", function () {

							// If it's not empty...
							if (trigger_elem.val().trim() !== "") {

								// ...enable
								methods.evaluate.call($this, "active");

							// ...if it is empty...
							} else {

								// ...disable
								methods.evaluate.call($this, "inactive");
							}
						});
					}
				});
			},

			// Filter Inputs method to find only the directly affected form elements
			"filterInputs"	:	function (o) {

				// Variables
				var	target_elem			=	o,
					all_elems			=	target_elem.find("input, select, textarea"),
					target_elem_id		=	target_elem.attr("id"),
					affected_elems		=	[];

				// Loop through all nested form inputs...
				all_elems.each(function () {

					// ...find closest conditional...
					var closest_cond	=	$(this).closest("[data-conditional-target]").attr("data-conditional-target");

					// ...and if it matches the target element's ID...
					if (closest_cond === target_elem_id) {

						// ...push it off into a special array
						affected_elems.push($(this));
					}
				});

				// Return array of directly affected form elements
				return affected_elems;
			},

			// Gather all triggers for any given target
			"gatherTriggers"	:	function (trigger_type) {

				// Variables
				var $this				=	$(this),
					data				=	$this.data("conditionalSettings"),
					all_triggers		=	"",
					trigger_class		=	"",
					trigger_target_id	=	"";

				// Set variables for "reveal" type
				if (trigger_type === "reveal") {
					trigger_class		=	data.dataReveal;
					trigger_target_id	=	data.revealTargetID;

				// Set variables for "conceal" type
				} else if (trigger_type === "conceal") {
					trigger_class		=	data.dataConceal;
					trigger_target_id	=	data.concealTargetID;
				}

				// Build CSS string based on variables
				all_triggers			=	"[data-" + trigger_class + "='" + trigger_target_id + "']";

				// Return triggers as an object
				return $(all_triggers);
			},
			"evaluate"		:	function (state) {

				// Variables
				var	$this			=	$(this),
					data			=	$this.data("conditionalSettings"),

					// Filter affected form elements
					revealElems		=	methods.filterInputs.call($this, data.revealTarget),
					concealElems	=	methods.filterInputs.call($this, data.concealTarget),

					// Gather all triggering elements
					revealObject	=	{
						"targetElem"	:	data.revealTarget,
						"allTriggers"	:	methods.gatherTriggers.call($this, "reveal"),
						"affectedElems"	:	revealElems,
						"state"			:	state
					},
					concealObject	=	{
						"targetElem"	:	data.concealTarget,
						"allTriggers"	:	methods.gatherTriggers.call($this, "conceal"),
						"affectedElems"	:	concealElems,
						"state"			:	state
					};

				if (state === "active") {
					if (typeof data.revealTargetID !== "undefined") {
						methods.enable.call($this, revealObject);
					}
					if (typeof data.concealTargetID !== "undefined") {
						methods.disable.call($this, concealObject);
					}
				} else if (state === "inactive") {
					if (typeof data.revealTargetID !== "undefined") {
						methods.disable.call($this, revealObject);
					}
					if (typeof data.concealTargetID !== "undefined") {
						methods.enable.call($this, concealObject);
					}
				}
			},
			"disable"	:	function (o) {

				var	$this			=	$(this),
					data			=	$this.data("conditionalSettings"),
					anyTriggered	=	false,
					i;

				// Disable target
				o.targetElem
					.removeClass(data.activeClass)
					.addClass(data.disabledClass);

				data.triggerElem.attr("data-conditional-enabled", "false");

				if (o.state === "inactive") {

					// Loop through all triggers, see if any are still enabled
					for (i = o.allTriggers.length; i >= 0; i -= 1) {
						if ($(o.allTriggers[i]).attr("data-conditional-enabled") === "true") {
							anyTriggered	=	true;
						}
					}

					// If none are still enabled...
					if (!anyTriggered) {

						// ...disable all sub-form elements
						$(o.affectedElems).each(function () {
							$(this).prop("disabled", true);
						});
					}
				} else if (o.state === "active") {
					$(o.affectedElems).each(function () {
						$(this).prop("disabled", true);
					});
				}

				// If onDisable callback...
				if (typeof data.onDisable === "function") {
					data.onDisable($this);
				}
			},
			"enable"	:	function (o) {

				var	$this			=	$(this),
					data			=	$this.data("conditionalSettings"),
					anyTriggered	=	false,
					i;

				// Enable target
				o.targetElem
					.removeClass(data.disabledClass)
					.addClass(data.activeClass);

				data.triggerElem.attr("data-conditional-enabled", "true");

				if (o.state === "inactive") {

					// Loop through all triggers, see if any are still disabled
					for (i = o.allTriggers.length; i >= 0; i -= 1) {
						if ($(o.allTriggers[i]).attr("data-conditional-enabled") === "false") {
							anyTriggered	=	true;
						}
					}

					// If none are still disabled...
					if (!anyTriggered) {

						$(o.affectedElems).each(function () {
							$(this).prop("disabled", false);
						});
					}
				} else if (o.state === "active") {
					$(o.affectedElems).each(function () {
						$(this).prop("disabled", false);
					});
				}

				// If onEnable callback...
				if (typeof data.onEnable === "function") {
					data.onEnable($this);
				}
			}
		};

	// Initialize plugin
	$.fn[vars.pluginName] = function (m) {

		// If a method is called by name...
		if (methods[m]) {

			// ...return specified method.
			return methods[m].apply(this, Array.prototype.slice.call(arguments, 1));

		// ...else if no method is called or an object is passed...
		} else if (!m || typeof m === "object") {

			// ...return the "init" method.
			return methods.init.apply(this, arguments);

		// ...otherwise...
		} else {

			// ...log an error.
			console.log(vars.pluginName + ": Invalid method passed");
		}
	};

}(jQuery));