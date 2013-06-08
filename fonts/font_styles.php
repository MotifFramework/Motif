<?php

##
## GDFont Renderer STYLE SHEET
## Version 2.0
## Copyright 2008 Nick Schaffner
## http://53x11.com
##


/*
##		All variables are optional.
##		To create make more styles, copy/paste and rename the IF statement
##
##		If you have a working knowledge of PHP, the style possiblities are endless.
##		You could create mutilple styles that reference the same properties (e.g. if ($style == "heading" or "$style == "type"))
*/

if ($style == 'title') {

	$font 							= 'punk_s_not_dead';		// Font name, this should match a font.ttf filename (matching case)
	$size 							= 16;						// Size of your text in pixels
	$color 							= '#666633';				// Color in HEX format (#003300,FFF)
	$background 					= '#CCCC99';				// Background Color in HEX format
	$transparent					= true;						// FALSE will output the background color
	$alias							= false;					// TRUE will unsmooth the fonts
	$alignment 						= 'center';					// (left | center | right)
	$leading 						= 10; 						// Leading (line-height) in pixels
	$padding 						= 20;						// Total padding around all sides of the text box, in pixels
	$vadj 							= 0;						// Adjust the final height of the text box in pixels (can be negative
	$hadj 							= 0;						// Adjust the final width of the text box in pixels (can be negative)
	$maxwidth 						= 400;						// Width of your text area in pixels, if text goes
																// beyond this length, a new line will be started.
																// If left undefined or zero, the image will be whatever
																// length necessary to accommodate the text.
}

if ($style == 'text') {

	$font 							= 'verdana';				// Font name, this should match a font.ttf filename (matching case)
	$size 							= 10;						// Size of your text in pixels
	$color 							= '#666699';				// Color in HEX format (#003300,FFF)
	$background 					= '#CCCC99';				// Background Color in HEX format
	$transparent					= true;						// FALSE will output the background color
	$alias							= true;						// TRUE will unsmooth the fonts
	$alignment 						= 'left';					// (left | center | right)
	$leading 						= 5; 						// Leading (line-height) in pixels
	$padding 						= 0;						// Total padding around all sides of the text box, in pixels
	$vadj 							= -2;						// Adjust the final height of the text box in pixels (can be negative
	$hadj 							= 20;						// Adjust the final width of the text box in pixels (can be negative)
	$maxwidth 						= 0;						// Width of your text area in pixels, if text goes
																// beyond this length, a new line will be started.
																// If left undefined or zero, the image will be whatever
																// length necessary to accommodate the text.
}

if ($style == 'your_style_name') {

	$font 							= 'visitor';				// Font name, this should match a font.ttf filename (matching case)
	$size 							= 10;						// Size of your text in pixels
	$color 							= '#000';					// Color in HEX format (#003300,FFF)
	$background 					= '#FFF';					// Background Color in HEX format
	$transparent					= true;						// FALSE will output the background color
	$alias							= true;						// TRUE will unsmooth the fonts
	$alignment 						= 'right';					// (left | center | right)
	$leading 						= 5; 						// Leading (line-height) in pixels
	$padding 						= 0;						// Total padding around all sides of the text box, in pixels
	$vadj 							= -2;						// Adjust the final height of the text box in pixels (can be negative
	$hadj 							= 20;						// Adjust the final width of the text box in pixels (can be negative)
	$maxwidth 						= 200;						// Width of your text area in pixels, if text goes
																// beyond this length, a new line will be started.
																// If left undefined or zero, the image will be whatever
																// length necessary to accommodate the text.
}



?>