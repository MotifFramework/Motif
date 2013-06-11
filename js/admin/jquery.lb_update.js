/*
 * lifeBLUE Media jQuery plugin to open up a jQuery UI dialog that is modal
 * uses an overlay and cannot be closed by the user.
 * @copywrite 2010 lifeBLUE Media
 * @author Joe Mills
 */

(function($) {
    $.fn.lb_update = function(customOptions) {
        var options = $.extend({},$.fn.lb_update.defaultOptions, customOptions);
        if(options.url=='' || options.formSelector=='') {
            return false;
        }
        return this.each(function(){
            $update = $(this);
            if($.isFunction(options.start)) {
                if(options.start.apply(this)==false) {
                    return false; // this means validation failed
                }
            }
            $update.click(function() {
                var hasErrors = false;
                if(options.validate==true) {
                    $(options.formSelector).lb_validator({
                        validateNow : true,
                        hasErrors : function() {
                            alert("You have errors");
                            hasErrors = true;
                        }
                    });
                }
                if(hasErrors) {
                    return false;
                }
                $("<a></a>").lb_overlay({
                    title : options.title,
                    message : options.message
                }).click();
                $.ajax({
                    url : options.url,
                    type : 'POST',
                    dataType : options.dataType,
                    data : $(options.formSelector).serialize(),
                    error : function(data) {
                        if($.isFunction(options.failure)) {
                            options.failure.apply(this);
                        }
                        $("<a></a>").lb_overlay("close");
                    },
                    success : function(data) {
                        if($.isFunction(options.start)) {
                            options.success.apply(this);
                        }
                        $("<a></a>").lb_overlay("close");
                        alert(data);
                    }
                });
                return false;
            });
        });
    }
    $.fn.lb_update.defaultOptions = {
        url : '',
        formSelector : '',
        dataType : 'html',
        title : 'Loading',
        message : '',
        validate : true,
        start : null,
        failure : null,
        success : null
    }
})(jQuery);