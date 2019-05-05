<?php

function forLoopTweak($scr) {
	$rgx = $GLOBALS['config']['syntaxRegex']['forLoopTweak'];
	$m = [];
	preg_match_all($rgx, $scr, $m);
	foreach($m[0] as $i=>$lcode) {
		$lindex = $m[1][$i];
		$larr = $m[2][$i];
		$litem = $m[3][$i];

		$newlcode = "for(var $lindex in $larr) {\nvar $litem = $larr"."[$lindex];";
		$scr = str_replace($lcode, $newlcode, $scr);
	}
	return $scr;
}
