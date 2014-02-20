(function ( $, window, document, LB, undefined ) {

	"use strict";

	var Reveal = function ( elem, userOptions ) {
			
			// Init Vars
			$document = $( document );
			this.$elem = $( elem );
            this.elem = this.$elem[0];
            this.identity = this.$elem.attr("id");
            this.group = this.$elem.attr("data-reveal-group") || false;
            this.reference = false;
            this.config = userOptions;
            this.metadata = this.$elem.data("reveal-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
		},
		$document = $( document );

	Reveal.prototype = {
		"defaults": {
			"trigger": "click",
			"type": "default",

			// Classes
			"activeClass": "is-current",
			"visitedClass": "is-visited",

			// Hover Intent
			"hoverIntent": {
			    "sensitivity": 10,
			    "interval": 50,
			    "timeout": 0
			},

			// Callbacks
			"onInit": null,
			"onShow": null,
			"onHide": null
		},

		"newReferenceTarget": function ( elem ) {
			return {
				"elem": elem,
				"targets": [],
				"for": [],
				"current": false
			};
		},

		"init": function () {
			this.createReference.call( this );
			this.bindCallbacks.call( this );
			this.bindTrigger.call( this );
			this.bindTargets.call( this );
			this.initTrigger.call( this );
			// this.gatherGroup.call( this );
			// this.gatherTargets.call( this );

			return this;
		},

		"createReference": function () {
			if ( !window.Reveal ) {
				window.Reveal = {
					"triggers": [],
					"groups": []
				};
			}
		},

		"bindCallbacks": function () {
			var self = this;

			if ( typeof this.options.onInit == "function" ) {
				$document.on("reveal/" + this.identity + "/init", function onRevealInit () {
					this.options.onInit.call( this );
				});
			}
			if ( typeof this.options.onShow == "function" ) {
				$document.on("reveal/" + this.identity + "/show", function onRevealShow () {
					this.options.onShow.call( this );
				});
			}
			if ( typeof this.options.onHide == "function" ) {
				$document.on("reveal/" + this.identity + "/hide", function onRevealHide () {
					this.options.onHide.call( this );
				});
			}
		},

		"bindTrigger": function () {
			var self = this;

			this.$elem.on( "click", function () {
				self.processTrigger.call( self );
				return false;
			});
		},

			"processTrigger": function () {
				var reference = window.Reveal,
					referenceObject = this.group ? reference[ this.group ][ this.identity ] : reference[ this.identity ];

				if ( this.options.type === "radio" && referenceObject.current === true ) {
					return;
				}

				console.log( this.group );

				if ( this.group ) {
					this.processGroup.call( this );
				}

				// if ( referenceObject.current === false ) {
				// 	this.show.call( this );
				// }
			},

				"processGroup": function () {
					var self = this,
						reference = window.Reveal,
						referenceGroup = reference[ this.group ],

						// get old current, turn it off
						oldCurrents = this.getCurrent( referenceGroup );

					for ( var key in oldCurrents ) {
						$document.trigger("reveal/" + key + "/hide");
					}

					// turn new current on
					$document.trigger("reveal/" + this.identity + "/show");
				},

		"bindTargets": function () {
			var self = this;

			$document.on("reveal/" + self.identity + "/show", function onRevealShow () {
				// alert("in");
				self.makeCurrent.call( self );
				self.showTrigger.call( self );
				self.showTargets.call( self );
			});
			$document.on("reveal/" + self.identity + "/hide", function onRevealHide () {
				self.unmakeCurrent.call( self );
				self.hideTrigger.call( self );
				self.hideTargets.call( self );
			});
		},

		"makeCurrent": function () {
			
		},

		"getCurrent": function ( group ) {
			var currents = [],
				i = 0;

			for ( i in group ) {
				if ( group[ i ].current ) {
					currents.push( group[ i ] );
				}
			}

			return currents;
		},

		"initTrigger": function () {
			this.updateReference.call( this, {
				"targets": this.gatherTargets.call( this ),
				"for": this.gatherForTriggers.call( this )
			});
		},

		"gatherTargets": function () {
			var targetStrings = this.$elem.data("reveal").split(" "),
				targets = [];

			$.each( targetStrings, function eachTarget ( i, v ) {
				var target = $( "#" + targetStrings[i] );

				if ( !target.length ) {
					target = function () {
						var elem = $( "#" + targetStrings[i] );

						if ( elem.length ) {
							return elem;
						} else {
							return false;
						}
					};
				}

				targets.push( target );
			});

			return targets;
		},

		"gatherForTriggers": function () {
			var allFors = $("[data-reveal-for='" + this.identity + "']"),
				fors = [];

			$.each( allFors, function eachFor ( i, v ) {
				fors.push( allFors[i] );
			});

			return fors;	
		},

		"gatherGroup": function () {
			var groupID = this.$elem.data("reveal-group");

			if ( groupID ) {
				this.$group = $("[data-reveal-group='" + groupID + "']");
			} else {
				this.$group = false;
			}
		},

		"show": function ( elem ) {
			elem.addClass( this.options.activeClass );
		},

			"showTargets": function () {
				// alert("show targets");
				var self = this,
					reference = window.Reveal,
					targets = this.group ? reference[ this.group ][ this.identity ].targets : reference[ this.identity ].targets;

				$.each( targets, function hideEachTarget () {
					self.show.call( self, this );
				});
			},

			"showTrigger": function () {
				// alert("showtrigger");
				this.show.call( this, this.$elem );
			},

		"hide": function ( elem ) {
			elem.removeClass( this.options.activeClass );

			if ( elem.hasClass( this.options.visitedClass ) ) {
				elem.addClass( this.options.visitedClass );
			}
		},

			"hideTargets": function () {
				var self = this,
					reference = window.Reveal,
					targets = this.group ? reference[ this.group ][ this.identity ].targets : reference[ this.identity ].targets;

				$.each( targets, function hideEachTarget () {
					self.hide.call( self, this );
				});
			},

			"hideTrigger": function () {
				this.hide.call( this, this.$elem );
			},

		"updateReference": function ( config ) {
			var self = this,
				updates = config || {},
				reference = window.Reveal,
				referenceGroup = self.group ? reference.groups[ self.group ] : false,
				referenceTrigger = reference.triggers[ self.identity ];
				// referenceGroup = reference[ self.group ] || false,
				// referenceGroupTrigger = referenceGroup[ self.identity ] || false,
				// referenceTrigger = reference[ self.identity ] || false;

			// if this.group
				// find reference group
					// find identity in group


			// This updates the reference with the current
			// trigger

			// If it is part of a group
			if ( self.group ) {

				// if Group exists
				if ( referenceGroup ) {

					// If 
					if ( !referenceGroup[ self.identity ] ) {
						referenceGroup[ self.identity ] = 0;
					}
				}
			}

			// First, find if it's part of a group
			if ( this.group ) {

				// If it is, find if the group is already
				// registered
				if ( referenceGroup ) {

					// If it is, check if the current trigger
					// is also registered
					if ( referenceGroupTrigger ) {

						// If so, extend the current trigger object
						// with the updates
						$.extend( true, referenceGroupTrigger, updates );

					// If it is not, register the current trigger
					} else {
						reference[ this.group ][ this.identity ] = $.extend( true, {}, this.newReferenceTarget.call( this, this.$elem ), updates );
					}

				// If the group does not yet exist in the
				// reference, create it, and add this trigger
				// as an entry
				} else {
					reference[ this.group ] = {};
					reference[ this.group ][ this.identity ] = $.extend( true, {}, this.newReferenceTarget.call( this, this.$elem ), updates );
				}

				this.reference = reference[ this.group ][ this.identity ];

			// If the trigger is not part of a group
			} else {

				// Check if the trigger is already registered
				if ( referenceTrigger ) {

					// If it is, extend the current trigger
					// object with the updates
					$.extend( true, referenceTrigger, updates );

				// If the trigger does not yet exist in
				// the reference, create it
				} else {

					// Then make sure the updates are applied
					reference[ this.identity ] = $.extend( true, {}, this.newReferenceTarget.call( this, this.$elem ), updates );
				}

				this.reference = reference[ this.identity ];
			}
		},

		"setCurrent": function () {
			var referenceObject = this.group ? window.Reveal[ this.group ][ this.identity ] : window.Reveal[ this.identity ];

			referenceObject.current = true;

			$document.trigger("reveal/" + this.identity + "/show");
		},

		"checkReference": function ( updates ) {
		},

		"referenceTargets": function () {
			
		}
	};

	Reveal.defaults = Reveal.prototype.defaults;

	$.fn.reveal = function ( userOptions ) {
		return this.each( function ( index, elem ) {
			new Reveal( this, userOptions ).init();
		});
	};

	LB.apps.Reveal = Reveal;

}( jQuery, window, document, window.LB = window.LB || {
	"apps": {}
} ) );

/*

On initialization, go to each reveal
	- bind callbacks to global document event emitter
		- On init
		- on show
		- on hide
	- check the exclusivity
	- find the reveal's target(s)
		- if the target exists on the page
			- push that to an array
		- if it does not exist on the page
			- push that to a limbo array
		- return that array
	- check if reveal is part of a group
		- if it is
			- check the global reference to see if the group has been documented
				- if it has
					- make sure this reveal is in the group
						- if it's not
							- add this reveal to the group
				- if it has not
					- create a new group in the reference
			- add each found reveal as a part of that group
			- for the current reveal, add the target array and limbo array
		- if it is not
			- add the reveal id to the object
			- add the target array and limbo array
	- bind interactive events
		- switch
			- hover
			- hover w/ hoverIntent
			- click
	
	Emit event HIDE WHEN:
	- if is current && exclu«sivity !== radio

	Emit event SHOW WHEN:
	- is not current

	Emit NOTHING when:
	- is current && exclusivity === radio

	GROUP DYNAMICS:
	- if EXCLUSIVE or RADIO:
		- reference group
			- find all NOT new current
				- current = false
				- emit reveal/:id/hide
			- find new current
				- current = true
				- emit reveal/:id/show
	- otherwise show regular

	- on hide:
		- get trigger
			- remove current class
			- ?? Add hidden class??
			- if used to be current
				- add visited class
		- get targets
			- each
				- remove current class
				- ?? Add hidden class??
				- if used to be current
					- add visited class
	- on show:
		- get trigger
			- add current class
		- get targets
			- each
				- add current class





window: {
	Reveal: {
		"triggers": {
			"GROUP": {
				"TRIGGER": {
					"elem": $object,
					"targets": [
						"TARGET",
						"TARGET",
						"TARGET"
					],
					"for": [
						$object
					],
					"current": true
				},
				"TRIGGER": {
					"elem": $object,
					"targets": [
						"TARGET",
						"TARGET",
						"TARGET"
					],
					"for": null,
					"current": false
				},
				"type": exclusive
			}
		}
	}
}


window: {
	Reveal: {
		"triggers": {
			"TRIGGER": {
				"elem": $object,
				"targets": [
					"TARGET",
					"TARGET",
					"TARGET"
				],
				"for": [
					$object
				],
				"current": true
			},
			"TRIGGER": {
				"elem": $object,
				"targets": [
					"TARGET",
					"TARGET",
					"TARGET"
				],
				"for": null,
				"current": false
			}
		},
		"groups": {
			"GROUPNAME": {
				"type": exclusive,
				"triggers": [
					"TRIGGER",
					"TRIGGER",
					"TRIGGER",
					"TRIGGER"
				]
			}
		}
	}
}

It's about the triggers
	trigger is what holds the current state
	group exclusivity is based on trigger, purely
	if two triggers share the same 

Tabbed group example {
	
}

*/
