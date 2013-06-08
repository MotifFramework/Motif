/*
 * lifeBLUE Media jQuery plugin to open up a jQuery UI dialog that is modal
 * uses an overlay and cannot be closed by the user.
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
    $.fn.lb_overlay = function(customOptions)
    {
        // Handle messages passed first
        if(customOptions=="close")
        { // closes all dialogs
            this.each(function()
                {
                    //$("#lbOverlay").dialog("close");
                    $(".closeOverlayBox").click();
                    //$.lb_box("close");
                    return true;
                }
            );
        }

        // load in options
        var options = $.extend({},$.fn.lb_overlay.defaultOptions, customOptions);

        // create the overlay in the dom if it does not exist
//        if($("#lbOverlay").length==0)
//        {
//            $("body").append("<div id='lbOverlay' style='display:none;'></div>");
//        }

        //$("#lbOverlay").html("<div class='ui-dialog-waiting'>&nbsp;</div><div class='note'>" + options.message + "</div>");
        $("#lbOverlay").html("<div class='alertwindow-loader mvs'>&nbsp;</div><div class='note mbs'>" + options.message + "</div>");

        return this.each(
                function()
                {
                var $overlay = $(this);
                $overlay.click(
                    function() {
                        $("<a></a>").lb_box(
                            {
                                width : 320,
                                height : 120,
                                zindex : 1900,
                                animate : true,
                                showClose : false,
                                title : options.title,
                                message : "<div class='alertwindow-loader mvs'>&nbsp;</div><div class='note mbs'>" + options.message + "<a class='closeOverlayBox'></a></div>",
                                closeSelector : '.closeOverlayBox',
                                id : "LBOVERLAY_WINDOW"
                            }
                        ).click();
                        /*
                        $("#lbOverlay").dialog({
                            modal : true,
                            closeOnEscape : false,
                            draggable : false,
                            resizable : false,
                            title : options.title,
                            width : 320,
                            height : 120,
                            open : function() {
                                if(parseInt(options.duration)) {
                                    setTimeout(function() {
                                        $(this).dialog("close");
                                    }, options.duration);
                                }
                            }
                        });
                        $('.ui-dialog-titlebar-close').hide();
                        */
                    }
                );
            }
        );
    };
    $.fn.lb_overlay.defaultOptions = {
        title : 'Why am I waiting?',
        message : 'You are dealing with a very complex system.  Therefore some processing is required.  Please sit back, relax, and enjoy the view.  This will only take a second.',
        duration : ''
    };
})(jQuery);
