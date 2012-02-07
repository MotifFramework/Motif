Forms plugin for TineMCE, by Jason McInerney, 2007.

A work in progress, but fulfills a great need for the TinyMCE community.

INSTALLATION:
Locate your tinyMCE.init() initialization function.
Add "jmform" to your plugins control and the individual buttons (see below) in the theme_advanced_buttons control (or wherever you indicate what buttons).
This will produce five buttons:
    Insert/edit form
    Insert/edit input elements
    Insert/edit select elements
    Insert/edit textarea elements
    Delete form.
 
You can optionally insert each icon individually. To do this replace "jmformcontrols" in the buttons control with one or more of the following:

    "jmform,jmform_insert_input,jmform_insert_select,jmform_insert_textarea,jmform_delete"

This might help if you wanted to limit end user access to one or more of the buttons.

To enable form HTML tags you must include the following in your tinyMCE.init() for "extended_valid_elements" and probably to "valid_elements" in your main tiny_mce.js file.  If you add more attributes in the code, don't forget to add them here, too.

form[name|id|action|method|enctype|accept-charset|onsubmit|onreset|target],input[id|name|type|value|size|maxlength|checked|accept|src|width|height|disabled|readonly|tabindex|accesskey|onfocus|onblur|onchange|onselect|onclick|onkeyup|onkeydown|required|style],textarea[id|name|rows|cols|maxlength|disabled|readonly|tabindex|accesskey|onfocus|onblur|onchange|onselect|onclick|onkeyup|onkeydown|required|style],option[name|id|value|selected|style],select[id|name|type|value|size|maxlength|checked|width|height|disabled|readonly|tabindex|accesskey|onfocus|onblur|onchange|onselect|onclick|multiple|style]

If you do wish to limit end user access to certain form elements, be sure to remove the related tags from your "extended_valid_elements" and/or "valid_elements".

You might want to add onkeyup|onkeydown|maxlength to your init() and to your tiny_mce.js files for this to work.
Word Count requires that you add a call to the function in the onchange and onkeyup attributes of the textarea or input text box and a separate div element or text box for updating the number of words.

For example, if my form has the name PublishingForm, and I created a div with the id PublishingCount, and I wanted a maximum of 600 words, I would add the following to my textarea onchange and onkeyup attributes:

WordCount('PublishingForm',this,'PublishingCount',600);

So the full code for the textarea and output div ends up as (after using JMForms to edit and after TinyMCE processes it):

<textarea name="Summary" rows="12" cols="55" onchange="WordCount('PublishingForm',this,'PublishingCount',600);" onkeyup="WordCount('PublishingForm',this,'PublishingCount',600);" required="true"></textarea>
<br>
<div id="PublishingCount" style="width: 208px; height: 15px; text-align: left; font-family: arial,helvetica,sans-serif black; font-style: normal; font-variant: normal; font-weight: normal; font-size: 9pt; line-height: normal; font-size-adjust: none; font-stretch: normal;">Words in summary: </div>


FEATURES:
 -- No restrictions on naming or attributes.  If there is another you need, just add it.
 -- You can designate target, action, onsubmit, onclick, onwhatever ...
 -- Included input elements are text, checkbox, radio, file, button, submit, reset, and hidden.
 -- Select and multiple select, with options editing and default selected option.
 -- Textareas are included.
 -- All elements have style attributes, so style at will.
 -- Attribute "required" added to enable processing of forms.  Just check for this attribute in your form processor to see if the field is required.
 -- Simple form validation script included to verify elements set as "required".
 -- Simple word counter for input and textarea elements.
 -- Finicky, but can pick up existing form elements and update them.
 
NOT INCLUDED:
 -- Some attributes which I haven't needed may be left out, and there may be attributes included that are superfluous or non-functional.
 -- Not thoroughly tested on older browsers or all browsers - let me know what you experience!
 -- The validation script does not check formatting, just whether something is entered or selected.
 -- No context menu.

TIPS:
Because some browsers break forms with beginning or ending paragraph tags (<p> and </p>, Firefox 2.0.02 for example), you should add the following to your TinyMCE.init to avoid any issues with forms:

	force_br_newlines : true,
	force_p_newlines : false,		

Otherwise each newline could break or re-insert your form (the latter is odd behavior, perhaps a TinyMCE bug).
You might find this makes editing much better overall, too, since it won't double-space.

AUTO-VALIDATION:
If you insert a form with the auto-validation checked, be sure you check "required" in the "advanced" tab for each element you wish the form to verify.
Also, on your page that ultimately displays the form you must include the jmformproc.js file, in a manner similar to the way you include the tinymce.js file.
For example:

    <script type="text/javascript" src="tiny_mce/plugins/jmform/jscripts/jmformproc.js" />
    
Feel free to modify the validation script to suit your needs (e.g. add email format verification, password 1 & 2 comparison, etc.).

Enjoy!
