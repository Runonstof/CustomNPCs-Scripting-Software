<?php

function parse_template($script, $delete_tempmemory=true) {
	$vars = &$GLOBALS['vars'];
	$conf = &$GLOBALS['config'];
	$syn = &$conf['syntaxRegex'];
	$getVarRegex = $syn['getVar'];
	//Handle array-vars
	$arVarRegex = $syn['defineVarArray'];
	$avr = [];
	//echo $arVarRegex."\n";
	preg_match_all($arVarRegex, $script, $avr);
	//var_dump($avr);
	foreach($avr[0] as $i=>$varCode) {
		$varName = $avr[1][$i];
		$varItems = explode(';', $avr[2][$i]);
		foreach($varItems as $varItem) {
			if(isset($vars[$varName])) {if(!is_array($vars[$varName])) { $vars[$varName] = []; }} else {$vars[$varName] = [];}
			
			$vars[$varName] = json_decode($varItem, true);
		}
		
		$script = str_replace($varCode, '', $script);
	}
	//var_dump($vars);
	
	//Handle for-loops
	$forLoopRegex = $syn['templateForLoop'];
	$flr_m = [];
	
	preg_match_all($forLoopRegex, $script, $flr_m);
	//Loop all matched for-loops
	foreach($flr_m[0] as $i=>$forLoopCode) {
		
		//Prepare for-loop
		$forLoopItem = $flr_m[1][$i];
		$forLoopVar = $flr_m[2][$i];
		$forLoopName = $flr_m[3][$i];
		$forLoopContent = $flr_m[4][$i];
		$newForCode = '';
		
		
		
		//Loop items
		$val = getRecVar($vars, $forLoopVar);
		//var_dump($val, $forLoopVar);
		if(is_array($val)) {
			$vars[$forLoopName] = [];

			$for = $vars[$forLoopName];
			$for['index'] = 0;
			$for['index1'] = 1;
			$for['key'] = 'undefined';
			
				
			foreach($val as $j=>$vv) {
				$for['key'] = $j;
				$vars[$forLoopItem] = $vv;
				//var_dump($forLoopItem, $vars[$forLoopItem]);
				$cc = $forLoopContent;
				//echo "FLNAME: $forLoopName\n";
				
				//Handle vars only from toplevel
				$vm = [];
				preg_match_all($getVarRegex, $cc, $vm);
				
				foreach($vm[0] as $ri=>$rvar_replace) {
					$rvar_name = $vm[1][$ri];
					$rvar = getRecVar($vars, $rvar_name);
					//var_dump($rvar_replace, $rvar_name, $rvar);
					$rvar = str_replace(["\t", "\r", "\n"], '', $rvar);
					if(strval($rvar) != '') {
						$cc = str_replace($rvar_replace, $rvar, $cc);
					}
					
				}
				//Hande evals
				$em = [];
				preg_match_all($syn['codeParser'], $cc, $em);
				
				foreach($em[0] as $ei=>$code_replace) {
					$code_inner = $em[1][$ei];
					$code_r = null;
					$runcode = "
						\$vars = ".var_export(array_merge($vars, [$forLoopName=>$for]), true).";
						
						return isset(".$code_inner.") ? (".$code_inner."):null;
					";
					//Validate runcode
					if(preg_match($getVarRegex, $runcode) == 0) {
						$code_r = eval($runcode);
					}
					
					if($code_r != null) {
						$cc = str_replace($code_replace, $code_r, $cc);
					}
				}
				
				$for['index']++;
				$for['index1']++;
				$vars[$forLoopName] = $for;
				$newForCode .= parse_template($cc);
			}
		}
		
		
		$script = str_replace($forLoopCode, $newForCode, $script);
		//Destroy Loop from memory
		if(isset($vars[$forLoopName])) {unset($vars[$forLoopName]);}
		if(isset($vars[$forLoopItem])) {unset($vars[$forLoopItem]);}
	
	
	}
	
	//var_dump($vars);
	//$script = str_replace(["\r\n\r\n"], "", $script);
	return $script;
}

function getRecVar($obj, $sel, $deli='.') {
	$items = explode($deli, $sel);
	
	//var_dump($items);
	foreach($items as $s) {
		$obj = isset($obj[$s]) ? $obj[$s] : false;
	}
	return $obj;
}

function parse_calc($calc_string) {
	$conf = &$GLOBALS['config'];
	$syn = &$conf['syntaxRegex'];
	
	$calcRegex = $syn['calcParser'];
	
	
	return $calc_string;
}

?>