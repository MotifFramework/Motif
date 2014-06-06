(function ( Motif ) {

    "use strict";

    Motif.utils.extend = function () {
        var newObject = {},
            i,
            key;
        for ( i = 0; i < arguments.length; i += 1 ) {

            for ( key in arguments[i] ) {
                try {
                    // Property in destination object set; update its value.
                    if ( arguments[i][key].constructor === Object ) {
                        newObject[key] = Motif.utils.extend( newObject[key], arguments[i][key] );
                    } else {
                        newObject[key] = arguments[i][key];
                    }
                } catch ( e ) {
                    // Property in destination object not set;
                    // create it and set its value.
                    newObject[key] = arguments[i][key];
                }
            }
        }
        return newObject;
    };

}( window.Motif = window.Motif || {
    "utils": {},
    "apps": {}
}));
