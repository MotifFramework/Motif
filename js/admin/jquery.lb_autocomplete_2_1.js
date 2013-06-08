/**
 * lifeBLUE Media jQuery Plugin to do autocomplete calls
 * @copywrite 2010 lifeBLUE Media
 * @author LB
 */

(function($) {
    $.fn.lb_autocomplete_2_1 = function(customOptions) {
        // combine default and custom options
        var options = $.extend({}, $.fn.lb_autocomplete.defaultOptions, customOptions);
        return this.each(function() {
            $request = $(this);

            // construct the source
            sourceURL = "/autocomplete.html?callback=?&dataSets=" + options.dataSets+"&types="+options.contentTypes;
            $request.autocomplete({
                source : function(req, add) {
                    $.getJSON(sourceURL, req, function(data) {
                        //create array for response objects
                        var suggestions = [];
                        //process response
                        $.each(data, function(i, val){
                            suggestions.push(val);
                        });
                        //pass array to callback
                        add(suggestions);
                    });
                },
                minLength: 2,
                delay: 300
            }).keypress(function(e) {

                if (e.keyCode === 13)
                {
                    if ($.isFunction(options.onKeyPress))
                    {
                        options.onKeyPress();
                    }
                }

              });

           if(options.extraData){
            $(this).data( "extraData", options.extraData);
           }

            // add option functions
            if ($.isFunction(options.select)) { $(this).bind( "autocompleteselect", options.select); }
            if ($.isFunction(options.renderItem)) {$(this).data( "autocomplete" )._renderItem = options.renderItem;}

        });
    }
    $.fn.lb_autocomplete.defaultOptions = {
        source : '',
        select : function( event, ui ) {if(ui.item.url){window.location.href=ui.item.url}},
        renderItem: function( ul, item ) {

            if (!$("."+item.type, ul).length ) {
                // we need to make this type before adding it
                $( "<li class=\"" + item.type + " auto-item-clear\"></li>" ).append("<div class=\"auto-item-heading\"></div>").appendTo(ul);
            }

            var html = "<a class=\"auto-item pvs\">";
                html += "<div class=\"auto-item-padding\">";
                    html += "<div class=\"auto-item-wrapper\">";
                        html += "<strong>" + item.label + "</strong>";

                    if (item.fullURL && item.type !== "section") {
                        html += "<div class=\"minion-text museo-slab-300 ut grey-text\">" + item.fullURL + "</div>";
                    } else if (item.desc) {
                        html += "<div class=\"minion-text museo-slab-300 ut grey-text\">" + item.desc + "</div>";
                    }

                    html += "</div>";
                html += "</div>";
            html += "</a>";

            $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( html )
                    .insertAfter( $("."+item.type, ul));

            /*$( "<li></li>" )
                .data( "item.autocomplete", item )
                .append( "<a class=\"auto-item\"><div class=\"auto-item-padding\"><strong>" + item.fullURL + "</strong><div class=\"auto-item-desc\">Name: " + item.label + "</div><div class=\"auto-item-desc\">Description: " + item.desc + "</div></div></a>" )
                .appendTo( ul );*/
        },
        dataSets : '', // comma separated values,
        contentTypes : '',
        onKeyPress: '',
        extraData: ''
    }
})(jQuery);
