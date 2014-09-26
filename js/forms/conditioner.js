/*!
 * PLUGIN v0.1.0
 * A starter template for creating a jQuery plugin using Motif.
 * http://URL.com
 * 
 * @author AUTHOR <EMAIL>
 */
(function ( $, window, document, Motif, undefined ) {

    "use strict";

    var Conditioner = function ( elem ) {
            
            // Init Vars
            this.$elem = $( elem );
            this.elem = this.$elem[0];

            return this;
        },
        $document = $( document );

    Conditioner.prototype = {
        "defaults": {
            
        },

        "init": function ( userOptions ) {
            if ( !this.$elem.length ) {
                return;
            }

            this.initVars( userOptions );
            this.prepTargets();
            this.createRevealAttr();
            this.initReveal();

            return this;
        },

        "initVars": function ( userOptions ) {
            this.config = userOptions;
            this.metadata = this.$elem.data("conditioner-options");
            this.options = $.extend( true, {}, this.defaults, this.config, this.metadata );
            this.reveals = this.targetArray("data-conditional-reveal");
            this.conceals = this.targetArray("data-conditional-conceal");
            this.value = this.$elem.val();
            this.type = this.$elem.attr("type") ? this.$elem.attr("type") : "select";
        },

        "prepTargets": function () {
            $.each( this.reveals, function ( index, id ) {
                var elem = $("#" + id);

                if ( elem.length ) {
                    elem.attr("data-conditional-target", id );
                }
            });
            $.each( this.conceals, function ( index, id ) {
                var elem = $("#" + id);

                if ( elem.length ) {
                    elem.attr("data-conditional-target", id );
                }
            });
        },

        "createRevealAttr": function () {
            var revealItems = this.reveals.join(" "),
                concealItems = this.conceals.join(" "),
                revealAttr = $.trim(revealItems + " " + concealItems);

            this.$elem.attr("data-reveal", revealAttr);

            return revealAttr;
        },

        "targetArray": function ( attr ) {
            if ( this.$elem.attr( attr ) ) {
                return this.$elem.attr( attr ).split(" ");
            }
            return [];
        },

        "filterInputs": function ( elem ) {

            // Variables
            var allInputs = elem.find("input, select, textarea"),
                affectedElems = [];

            console.log(allInputs);

            // Loop through all nested form inputs...
            allInputs.each(function () {

                // ...find closest conditional...
                var closestTarget = $(this).closest("[data-conditional-target]").attr("data-conditional-target");

                // ...and if it matches the target element's ID...
                if (closestTarget === elem.attr("id")) {

                    // ...push it off into a special array
                    affectedElems.push($(this));
                }
            });

            console.log(affectedElems);

            // Return array of directly affected form elements
            return affectedElems;
        },

        "initReveal": function () {
            var self = this,
                elem;

            if ( this.$elem.is("option") ) {
                elem = this.$elem.parent();
                elem.attr("data-reveal", this.$elem.attr("data-reveal"));
            } else {
                elem = this.$elem;
            }
            elem.reveal({
                "trigger": "change",
                "beforeReveal": function ( elem, action, deferred ) {

                    if ( self.type === "select" ) {
                        if ( self.value === elem.val() ) {
                            action = "show";
                        } else {
                            action = "hide";
                        }
                        deferred.resolve(action);
                    }
                },
                "onShow": function ( elem ) {
                    $.each( this.reference.targets, function ( index, elem ) {
                        console.log(elem);
                        var inputs = self.filterInputs.call( self, elem );

                        $.each( inputs, function ( ind, el ) {
                            el.prop("disabled", false);
                        });
                    });
                }
            });
        },

        "selectTargets": function () {
            
        },

        "onShow": function () {
            $.each( this.reference.targets, function () {
                var elem = $(this),
                    type = self.determineType( elem.attr("id") );

                switch ( type ) {
                    case "reveal":

                        break;
                    case "conceal":
                        break;
                }
            });
        },

        "reveal": function () {
            
        },

        "determineType": function ( string ) {
            if ( $.inArray(string, this.reveals) > -1 ) {
                return "reveal";
            } else if ( $.inArray(string, this.conceals) > -1 ) {
                return "conceal";
            }
            return false;
        }
    };

    Conditioner.defaults = Conditioner.prototype.defaults;

    Motif.apps.Conditioner = Conditioner;

}( jQuery, window, document, window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
} ) );

$.createPlugin( "conditioner", window.Motif.apps.Conditioner );