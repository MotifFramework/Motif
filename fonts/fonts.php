<?php

##
## GDFont Renderer
## Version 2.0
## Copyright 2008 Nick Schaffner
## http://53x11.com
##

function gdfont_global() {

/*
##		Here you can preset all of the default variables for the script.
##		The first 4 variables can also be overidden via $_GET when calling the script
*/

	$gdfont['image_type']			= 'png';					// (png | gif) image type output
	$gdfont['cache'] 				= true;						// (true | false) enables or disables image caching
	$gdfont['font_dir'] 			= 'fonts';					// Set path to fonts
	$gdfont['style_file'] 			= 'font_styles.php';			// Set relative path from font.php to your font style file (if you plan on using it)

/*#*/

	$gdfont['cache_path']			= 'cache';					// Set relative path from font.php to your cache directory

/*
##		These are the default values for text, these options should be set and overidden via your style file and through $_GET variables
*/

	$gdfont['text']					= '';
	$gdfont['font']					= 'verdana';
	$gdfont['size']					= 12;
	$gdfont['color']				= '#FFF';
	$gdfont['background']			= '#000';
	$gdfont['transparent']			= false;
	$gdfont['alias']				= false;
	$gdfont['max_width']			= false;
	$gdfont['alignment']			= 'left';
	$gdfont['leading']				= 0;
	$gdfont['padding']				= 0;
	$gdfont['vadj']					= 0;
	$gdfont['hadj']					= 0;

################################
################################ PHP Magic Below, Avoid editing if you don't know what you are doing :)
################################

	$gdfont['test_chars']			= 'abcdefghijklmnopqrstuvwxyz' .
									'ABCDEFGHIJKLMNOPQRSTUVWXYZ' .
									'1234567890' .
									'!@#$%^&*()\'"\\/;.,`~<>[]{}-+_-=';
	$gdfont['get_array'] = array('text','font','size','color','background','transparent','alias','max_width','alignment','leading','padding','vadj','hadj');

	if($_GET['style'] and file_exists($gdfont['style_file']))
		$gdfont = gdfont_style_sheet($gdfont['style_file'],$_GET['style'],$gdfont);

	foreach ($gdfont['get_array'] as $value) {
		if($_GET[$value]) {
			$gdfont[$value] = stripslashes($_GET[$value]);
			if($_GET[$value] == 'false')
				unset($gdfont[$value]);
		}
	}

	## Legacy support for $alpha = $transparent and $maxwidth = $max_width
	if($_GET['alpha'])
		$gdfont['transparent'] = false;
	if($_GET['maxwidth'])
		$gdfont['max_width'] = $_GET['maxwidth'];

	## Format the text
	if(get_magic_quotes_gpc())
    	$gdfont['text'] = stripslashes($gdfont['text']);
	$gdfont['text'] = javascript_to_html($gdfont['text']) ;

	## Extra $_GET variables
	if($_GET['style'])
		$gdfont['style'] = $_GET['style'];
	if($_GET['image_type'])
		$gdfont['image_type'] = $_GET['image_type'];
	if($_GET['cache']) {
		$gdfont['cache'] = $_GET['cache'];
		if($_GET['cache'] == 'false')
			unset($gdfont['cache']);
	}
	if($_GET['font_dir'])
		$gdfont['font_dir'] = $_GET['font_dir'];
	if($_GET['style_file'])
		$gdfont['style_file'] = $_GET['style_file'];

	if(substr($gdfont['cache_path'],-1) != '/')
		$gdfont['cache_path'] .= '/';
	if(substr($gdfont['font_dir'],-1) != '/')
		$gdfont['font_dir'] .= '/';
	if(substr($gdfont['font'],-4) != '.ttf')
		$gdfont['font'] .= '.ttf';

	return $gdfont;
}

function gdfont($debug_mode = false) {

	$gdfont = gdfont_global();

	## Set dem values
	if($debug_mode) {
		$gdfont['text'] = 'GDFont Renderer v2.0 - Copyright '. date('Y') .' Nick Schaffner, http://53x11.com.';
		$gdfont['text'] .= ' ## '. cache_clear($gdfont['cache_path']);
		$gdfont['size'] = 12;
		$gdfont['color'] = 'FFF';
		$gdfont['background'] = '000';
		$gdfont['padding'] = 20;
		$gdfont['cache'] = false;
		$gdfont['max_width'] = '600';
		$gdfont['leading'] = 10;
		$gdfont['alignment'] = 'center';
	}

	if($gdfont['cache']) {
		## Check if image exists
		if(!file_exists($gdfont['cache_path'].gdfont_filename($gdfont).'.'.$gdfont['image_type'])) {
			gdfont_image_create($gdfont,gdfont_filename($gdfont),true);
		}

		if(!headers_sent()) {
			## Write headers and image if script is called from img tag
			if($gdfont['image_type'] == 'png') {
				header("Content-type: image/png");
				$image = imagecreatefrompng($gdfont['cache_path'].gdfont_filename($gdfont).'.'.$gdfont['image_type']);
				imagepng($image);
			}
			elseif($gdfont['image_type'] == 'gif') {
				header("Content-type: image/gif");
				$image = imagecreatefromgif($gdfont['cache_path'].gdfont_filename($gdfont).'.'.$gdfont['image_type']);
				imagegif($image);
			}
		} else
			echo '<img alt="'. $gdfont['text'] .'" src="'. $gdfont['cache_path'].gdfont_filename($gdfont).'.'.$gdfont['image_type'] .'" />';

	}else {
		if($gdfont['image_type'] == 'png')
			header("Content-type: image/png");
		if($gdfont['image_type'] == 'gif')
			header("Content-type: image/gif");
		gdfont_image_create($gdfont,gdfont_filename($gdfont),false);
	}
}

function gdfont_image_create ($gdfont,$filename,$cache = true) {

	## Determine baseline and base image height
	$box = imagettfbbox($gdfont['size'],0,$gdfont['font_dir'].$gdfont['font'],$gdfont['text']);
	$width = abs($box[0]) + abs($box[2]);

	$box = @imagettfbbox($gdfont['size'],0,$gdfont['font_dir'].$gdfont['font'],$gdfont['test_chars']);
	$dip = abs($box[3]);
	$box = imagettfbbox($gdfont['size'],0,$gdfont['font_dir'].$gdfont['font'],$gdfont['text']);
	$lowheight = abs($box[5]-$dip);
	$height = abs($box[5]);

	## Check for multiple lines, place each newline into array
	if (!$gdfont['leading'])
		$gdfont['leading'] = round($lowheight*.2);
	if ($gdfont['max_width']) {
		while ($width > ($gdfont['max_width']-($gdfont['padding']*2))) {

			$lines++;
			$i = $width;
			$t = strlen($gdfont['text']);

			while ($i > ($gdfont['max_width']-($gdfont['padding']*2))) {
				$t--;
				$box = imagettfbbox($gdfont['size'],0,$gdfont['font_dir'].$gdfont['font'],substr($gdfont['text'],0,$t));
			  	$i = abs($box[0]) + abs($box[2]);
			}

			$t = strrpos(substr($gdfont['text'], 0, $t),' ');
			$output[$lines-1] = substr($gdfont['text'],0,$t);

			$gdfont['text'] = ltrim(substr($gdfont['text'], $t));
			$output[] = $gdfont['text'];

			$box = imagettfbbox($gdfont['size'],0,$gdfont['font_dir'].$gdfont['font'],$output[$lines]);
			$width = abs($box[0]) + abs($box[2]);
		}
	}
	else {
		$gdfont['max_width'] = $width;
		$hpad = ($gdfont['padding']*2);
	}

	$lines++;

	if (!count($output))
		$output[] = $gdfont['text'];

	## Create total image size
	$im = imagecreate ($gdfont['max_width']+$gdfont['hadj']+$hpad,($lowheight*$lines) + ($gdfont['leading']*($lines-1)) + $gdfont['vadj'] + ($gdfont['padding']*2));

	## Color and Background Color
	$color = hex_to_rgb($gdfont['color']);
	$background = hex_to_rgb($gdfont['background']);
	$color1 = imagecolorallocate($im,$background['r'],$background['g'],$background['b']); ## Sets background color
	$color2 = imagecolorallocate($im,$color['r'],$color['g'],$color['b']);

	/*
	$gdfont['shadow_left'] = -5;
	$gdfont['shadow_top'] = -5;
	$gdfont['shadow_size'] = 5;
	$gdfont['shadow_opacity'] = 100;
	## Shadow Colors
  	for ($i=1;$i<=$gdfont['shadow_size'];$i++) {
  		$shadow = hex_to_rgb(hex_change($gdfont['background'],'darker',((100/($gdfont['shadow_size']+1))*$i)*($gdfont['shadow_opacity']*.01)));
  		$shadow_color[$i] = imagecolorallocate($im,$shadow['r'],$shadow['g'],$shadow['b']);
  	}
  	*/

	## Transparency and Alias
	if ($gdfont['transparent'])
		imagecolortransparent($im,$color1);
	if ($gdfont['alias'])
		$color2 = -$color2;

	## Output all the line of text as placed in array, configure alignment and padding
	$i = 2;
	$vpad = $gdfont['padding'];
	foreach ($output as $value) {
		$box = imagettfbbox($gdfont['size'],0,$gdfont['font_dir'].$gdfont['font'],$value);
		$w = abs($box[0]) + abs($box[2]);
		if ($gdfont['alignment'] == 'right')
			$x =  ($gdfont['max_width']-($gdfont['padding']*2))-$w;
		if ($gdfont['alignment'] == 'center')
			$x = (($gdfont['max_width']-($gdfont['padding']*2))-$w) / 2;

		## Shadow
		/*
  		for ($a=1;$a<=$gdfont['shadow_size'];$a++) {
  			$t = $a;
  			$l = $a;
  			if($gdfont['shadow_top'] < 0)
  				$t = -$a;
  			if($gdfont['shadow_left'] < 0)
  				$l = -$a;
	  		for($b=1;$b<=4;$b++) {
	  			if($b == 1) {
	  				$top = $t-1;
	  				$left = $l-1;
	  			}
	  			if($b == 2)
	  				$left = $l+1;
	  			if($b == 3)
	  				$top = $t+1;
	  			if($b == 4)
	  				$left = $l-1;
	  			imagettftext($im,$gdfont['size'],0,($x+$gdfont['padding'])+$gdfont['shadow_left']+($gdfont['shadow_size']-$left),($height*($i-1))+(($gdfont['leading']*($i-2))+$vpad)+$gdfont['shadow_top']+($gdfont['shadow_size']-$top),$shadow_color[$a],$gdfont['font_dir'].$gdfont['font'],$value);
	  		}
  		} */

		imagettftext($im,$gdfont['size'],0,$x+$gdfont['padding'],($height*($i-1))+($gdfont['leading']*($i-2))+$vpad,$color2,$gdfont['font_dir'].$gdfont['font'],$value);
		$i++;
	}

	if($gdfont['image_type'] == 'png') {
		if($cache)
			imagepng($im,$gdfont['cache_path'].$filename.'.png');
		else
			imagepng($im);
	}
	if($gdfont['image_type'] == 'gif') {
		if($cache)
			imagegif($im,$gdfont['cache_path'].$filename.'.gif');
		else
			imagegif($im);
	}
	imagedestroy($im);

}

function hex_to_rgb($hex) {
	## Convert HEX to RGB 255,255,255
	## remove '#'
	$hex = str_replace('#','',$hex);
	# expand short form ('fff') color
    if(strlen($hex) == 3)
       $hex .= $hex;
	if(strlen($hex) != 6)
		$hex == '000000';
	## convert
	$rgb['r'] = hexdec(substr($hex,0,2)) ;
	$rgb['g'] = hexdec(substr($hex,2,2)) ;
	$rgb['b'] = hexdec(substr($hex,4,2)) ;
	return $rgb ;
}

function hex_change($hex,$direction = 'darker',$factor = 30) {
	## Changes HEX to lighter or darker based on factor

	$rgb = hex_to_rgb($hex);

	if($direction == 'darker') {
        foreach ($rgb as $k => $v) {
        	$amount = $v / 100;
			$amount = round($amount * $factor);
			$new_decimal = $v - $amount;
			$new_hex_component = dechex($new_decimal);
			if(strlen($new_hex_component) < 2)
				$new_hex_component = "0".$new_hex_component;
			$new_hex .= $new_hex_component;
		}
	}
	else { #Lighter
		foreach ($rgb as $k => $v) {
			$amount = 255 - $v;
			$amount = $amount / 100;
			$amount = round($amount * $factor);
			$new_decimal = $v + $amount;
			$new_hex_component = dechex($new_decimal);
			if(strlen($new_hex_component) < 2)
				$new_hex_component = "0".$new_hex_component;
			$new_hex .= $new_hex_component;
		}
	}
	return $new_hex;
}

function javascript_to_html($text) {

	## Convert Javascript Unicode characters into embedded HTML entities
	## (e.g. '%u2018' => '&#8216;')
	$matches = null ;
	preg_match_all('/%u([0-9A-F]{4})/i',$text,$matches) ;
	if(!empty($matches)) for($i=0;$i<sizeof($matches[0]);$i++)
        $text = str_replace($matches[0][$i],'&#'.hexdec($matches[1][$i]).';',$text);
	return $text ;
}

function cache_clear($cache_path) {
	## clear cache
	if (is_dir($cache_path)) {

		$handle = opendir($cache_path);
		$cache = $cache_path;
		while ($file = readdir($handle)) {
			if ($file != '.' and $file != '..') {
				$delete[] = $file;
				$t++;
			}
		}
		closedir($handle);

		if(isset($delete)) {
			foreach ($delete as $i) {
				unlink("$cache/$i");
				if (!file_exists("$cache/$i"))
					$d++;
			}
			return  "CACHE EMPTIED: Total Files: $t | Total Deleted $d\n\n" . date('l, F jS Y @ g:ia');
		} else
			return 'CACHE: No files to delete, cache is empty.';
	} else
		return 'ERROR: Unable to access $cache_root, '. $cache;
}

function gdfont_filename($gdfont) {

	foreach ($gdfont['get_array'] as $value)
		$filename .= $gdfont[$value];
	return md5($filename);

}

function gdfont_style_sheet($style_file,$style,$gdfont) {

	include($style_file);
	foreach ($gdfont['get_array'] as $value) {
		if($$value)
			$gdfont[$value] = $$value;
	}
	## Legacy support for $alpha = $transparent and $maxwidth = $max_width
	if($alpha)
		$gdfont['transparent'] = false;
	if($maxwidth)
		$gdfont['max_width'] = $maxwidth;
	return $gdfont;
}

if(basename(__FILE__) == basename($_SERVER['SCRIPT_NAME'])) {
	if(!$_GET) {
		gdfont(true);
	}
	else
		gdfont();
}

?>