// Improved version of JavaScript fix for the iOS viewport scaling bug. See https://gist.github.com/901295
(function (doc) {

    "use strict";

    // Variables
    var addEvent = "addEventListener",
        type = "gesturestart",
        qsa = "querySelectorAll",
        scales = [1, 1],
        meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

    // Functions
    function fix() {
        meta.content = "width=device-width,minimum-scale=" + scales[0] + ",maximum-scale=" + scales[1];
        doc.removeEventListener(type, fix, true);
    }

    // Create
    if ((meta = meta[meta.length - 1]) && addEvent in doc) {
        fix();
        scales = [0.25, 1.6];
        doc[addEvent](type, fix, true);
    }
}(document));