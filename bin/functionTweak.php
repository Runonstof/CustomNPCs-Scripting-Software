<?php

function fnTweak($scr) {
	//Better Functions
	$fnRegex = $GLOBALS['config']['syntaxRegex']['functionTweak'];
	$argRegex = $GLOBALS['config']['syntaxRegex']['functionArgs'];
	$fns = [];
	
	preg_match_all($fnRegex, $scr, $fns);

	foreach($fns[0] as $i=>$fn_construct) {
		$fn_name = $fns[1][$i];
		$fn_args = $fns[2][$i];
		
		$fn_replace = $fn_construct;
		
		$fna = [];
		$aaa = preg_match_all($argRegex, $fn_args, $fna);
		//var_dump($fna);
		foreach($fna[0] as $j=>$fn_args) {
			$arg_name = $fna[1][$j];
			$arg_val = $fna[2][$j];
			$fn_replace = str_replace($fn_args, $fna[1][$j], $fn_replace);
			
			//Add optional argument encoding
			
			//Has default val given?
			if($fna[2][$j] != "") {
				$fn_replace .= "\n\tif(typeof({$arg_name}) == typeof(undefined)) { {$arg_name} = {$arg_val}; }";
			}
			
		}
		
		$scr = str_replace($fn_construct, $fn_replace, $scr);
		
		
	}
	
	return $scr;
}