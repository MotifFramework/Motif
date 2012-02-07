/**
 * Form validation script included with the JMForm plugin for TinyMCE
 * @author Jason McInerney
 */
    //does the actual checking
    function CheckForm(theform) {
        var form_err = '';
        for (var i=0;i<theform.elements.length;i++) {
            theform.elements[i].disabled = 'true';
            if (theform.elements[i].getAttribute('required') != undefined && theform.elements[i].getAttribute('required') == 'true') {
                if (theform.elements[i].value == undefined || theform.elements[i].value == '') {
                    //for "select" type elements
                    if (theform.elements[i].length != undefined)
                    {
                        if (theform.elements[i].selectedIndex == undefined || theform.elements[i].options[theform.elements[i].selectedIndex] == undefined || theform.elements[i].options[theform.elements[i].selectedIndex].value == '' ) {
                            form_err = form_err + '\n  -- ' + theform.elements[i].name;
                        }
                    }
                    else form_err = form_err + '\n  -- ' + theform.elements[i].name;
                 }
            }
        }
        for (var i=0;i<theform.elements.length;i++) theform.elements[i].disabled = '';		
        
        if (form_err != '') {
            form_err = "The following fields are required:" + form_err;
            alert(form_err);
            return false;
        } else return true;
    }
    
    //for full browser compatibility, instead of javascript: void or similar
    function doNothing() { }
    
    //holds the form action attribute
    var actTemp = '';
    
    //called onsubmit
    function SendRequest(theform,ajax) {
        var the_err = '';
        if (theform.action != 'javascript: doNothing();' && theform.action != '') actTemp = theform.action;
        theform.action = 'javascript: doNothing();';
        var formConf = CheckForm(theform);
        if (formConf) {
            if (ajax) {
                // coming soon...
            }
            else {
                theform.action = actTemp;
                theform.onsubmit = '';
                theform.submit();
            }
        }
    }