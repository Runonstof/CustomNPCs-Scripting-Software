<?php


function mcp_deobf($script) {
	$WP = &$GLOBALS['workspace'];
	$m_csv = file_get_contents($WP . '\\bin\\MCP\\methods.csv');
	$m_arr = parse_csv($m_csv);
	$keywords = [];
	foreach($m_arr['name'] as $i=>$k) {
		$k_words = [];
		foreach($m_arr['searge'] as $ii=>$s) {
			if($m_arr['name'][$ii] == $k) {
				$k_words[] = $s;
			}
		}
		if(count($k_words) > 0) {
			$keywords[$k] = $k_words;
		}
	}
	
	$deobf_m = [];
	$ttt = 0;
	do {
	
		$var_id = uniqid();
		$nscr = "var obf_name_$var_id = null;\n";
		
		preg_match('/{{([\w.(){}\[\]\'\"+=\-*\/]+)\.([#\s\w(){}.\[\]]+)}}/', $script, $deobf_m);
		//var_dump($keywords);
		
		if(count($deobf_m) > 0) {
			$fullcode = $deobf_m[0];
			$getobj = $deobf_m[1];
			$getdeobf = $deobf_m[2];//keywords to get
			$gdeobf_m = [];
			
			preg_match_all('/#([\w]+)(?:\([\w#.()\[\]{}]+\))?/', $getdeobf, $gdeobf_m);
			//var_dump($gdeobf_m);
			$nscr = "(function(val){\n";
			
			//Get all obf names
			foreach($gdeobf_m[1] as $kw) {
				if(isset($keywords[$kw])) {
					$nscr .= "\t//Get $kw\n";
					foreach($keywords[$kw] as $obfname) {
						$nscr .= "\tif(typeof(val['$obfname']) != typof(undefined)) { val = val.$obfname; }\n";
					}
				}
			}
			
			$nscr .= "\treturn val;\n})($getobj)";
			
			$script = str_replace($fullcode, $nscr, $script);;
		}
		
		$ttt++;
	} while($deobf_m != [] && $ttt < 150);
	

	
	//preg_replace("/\.\(/g");
	return $script;
}


function parse_csv($csv) {
	$a = explode("\n", $csv);
	$t = explode(',', $a[0]);
	$r = [];
	foreach($t as $i=>$tt) { $t[$i] = str_replace("\r", '', $tt); }
	foreach($t as $tt) { $r[$tt] = []; }
	
	$a = array_slice($a, 1);
	foreach($a as $aa) {
		$b = explode(',', $aa, 4);
		if(count($b) == count($t)) {
			foreach($t as $i=>$tt) {
				$r[$tt][] = $b[$i];
			}
		}
	}
	
	
	
	
	return $r;
}