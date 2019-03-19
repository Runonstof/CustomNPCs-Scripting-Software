<?php


function genId($length=10, $ids=[], $charset="abcdefghijklmnopqrstuvwxyz0123456789") {
	$id = '';
	do {
		$id = '';
		for($i = 0; $i < $length; $i++) {
			$id .= substr($charset, rand(0, strlen($charset)-1), 1);
		}
	} while(indexOf($ids, $id) != -1);
	
	return $id;
}

function zsRelTables($script) { //Preprocess Relational Tables
	$g = $GLOBALS['config']['syntaxRegex'];
	
	$VALUE_LISTS = [];
	
	$IDS = [];
	
	$relations = [];
	preg_match_all($g['matchRelation'], $script, $relations);
	//Get all relations
	foreach($relations[0] as $i=>$relcode) {
		
		$relval = $relations[1][$i];
		$reltype = $relations[2][$i];
		$relname = $relations[3][$i];
		
		//Create Relation Name if not exists
		if(!isset($VALUE_LISTS[$relname])) {
			$VALUE_LISTS[$relname] = [
				'type' => $reltype,
				'values' => []
			];
		}
		
		$id = null;
		$hasValue = false;
		//Check if there is already an ID for value
		foreach($VALUE_LISTS[$relname]['values'] as $j=>$v) {
			if($v['value'] == $relval) {
				$hasValue = true;
				$id = $v['id'];
			}
		}
		//No ID Given
		if(!$hasValue) {
			$id = '"'.genId(18, $IDS).'"';
			$VALUE_LISTS[$relname]['values'][] = [
				'value' => $relval,
				'id' => $id
			];
		}
		
		//Replace code
		if(!is_null($id)) {
			$script = str_replace($relcode, $id, $script);
		}
	}
	//Create relation getters
	//var_dump($VALUE_LISTS);
	foreach($VALUE_LISTS as $val=>$vl) {
		$getter = "function get_$val(id as string) as {$vl['type']} {\n";
		foreach($vl['values'] as $jj=>$value) {
			$getter .= "\tif(id == {$value['id']}) { return {$value['value']}; }\n";
			if($jj == count($vl['values'])-1) {
				$getter .= "\treturn {$value['value']};\n";
			}
		}
		$getter.= "}\n";
		$script .= "\n".$getter;
	}
	
	
	
	return $script;
}