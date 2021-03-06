<?php

debugClear();
/*
Created By: Runonstof

This file concatenates different files for programming languages where you can't
reference to other functions in other files in runtime like javascript.
The script prevents you from having to copy functions from file to file and update it everywhere etc.

NOTE: this file definetly needs improvement and some cleaning, because it contained alot of experimenting also
But it works fine
SCROLL BELOW FOR HOW TO USE AND CONFIG

|=========| HOW TO RUN THIS FILE?
Make sure you can run PHP from the command line.
Open CommandPrompt/PowerShell
and type:

php merge filename.js everything_in_this_folder\*.js

To have your code minified just add "-m" on the end

php merge npc_*.js -m

If you have set a profile in the config (an alias for multiple commands)
use it like this:
"-m" at the end will ofcourse also work
php merge @profile_name_one @profile_name_two

|=========| HOW TO USE IT IN MY CODE?

Let's say our workspace looks like this:

workspace(folder)
|----merge.php
|----core(folder)
|    |----functions.js
|    |----npc_functions(folder)
|    |    |----npc_trader.js

 - Importing file contents
Use "import dir\file.extension;" (without quotes) to import a files contents
and replace the import statement with the actual contents
Blocks, however do not get pasted also when you import the file containing the block
you can yield those blocks later if you want to surround it with some code

 - Defining Blocks
Use "
@block block_name
	Block contents
@endblock
" (without quotes) to define a block

 - Yielding Blocks
Use "yield block_name;" to import code from a block that has been imported from a file
this is handy because with this you can inject code from other files into your events
for example:

function init(event) {
	yield init_event; //This will paste all code from all blocks from all imported files here
	var your = "own";
	code("here");
}

 - Optional arguments in functions
A handy tweak that saves some time for you regarding optional arguments in functions
If you want to
 create a function called "cookie"
 have as first argument count that is required
 have as second argument taste that is optional and defaults to "chocolate"

Instead of typing:
function cookie(count, taste) {
	if(typeof(taste) == 'undefined') { var taste = "chocolate"; }
	//Your cookie code here
}

you can type:
function cookie(count, taste="chocolate") {
	//Your cookie code here
}

Version: 2.0

This file was intended to create an efficient working environment for the CustomNPCs mod for Minecraft,
so all the Regexes that handle the merge syntax is for JavaScript syntax.
But change it how you want for other languages (keep in mind that this is written for JS, never bothered to check other languages).
Regex101.com is a great tool.

*/

//print_r($argv);

require(__DIR__ . '\vendor\autoload.php');
require(__DIR__ . '\bin\functions.php');

$GLOBALS['workspace'] = __DIR__;
$WORKSPACE = &$GLOBALS['workspace'];
$GLOBALS['config'] = [
	'outputDirs' => '',
	'outputDirPrefix' => [
		__DIR__ . '\build',
	],
	'outputName' => '{FileName}.min.{FileExt}', //Name of merged file
	'minify' => false, //If the merged script is minified or not (Written for JS (Minify config per syntax soon) removes whitespace, newlines and comments, but requires a strict syntax)
	'compileOutput' => false,
	'buildDirs' => [],
	'debugMode' => false,
	'syntaxRegex' => null,
	/*What variables default to is they do not exists
	and the optional var statement is not used*/
	'defaultVar' => 'undefined',
	//Default files to handle if no files are given so only 'php merge' is called (works also with for example 'a_folder\a_word-*.js and profiles'
	'defaultFiles' => [],
	'profiles' => [
		'npcs' => [
			'data\npcs\*\*.js data\npcs\*.js', '-w:$outputDirs$=npcs\\'
		],
		'blocks' => [
			'data\blocks\*.js', '-w:$outputDirs$=blocks\\'
		],
		'players' => [
			'data\players\*.js', '-w:$outputDirs$=players\\'
		],
		'server' => [
			'data\players\CustomServerTools.js', '-w:$outputDirs$=players\\'
		],
		'items' => [
			'data\items\*.js', '-w:$outputDirs$=items\\'
		],
		'forge' => [
			'data\forge\*.js', '-w:$outputDirs$=forge\\'
		]
	],
	'addons' => []
];

$GLOBALS['blocks'] = [];

$defVars = [
	'npcs' => 'data\npcs',
	'blocks' => 'data\blocks',
	'players' => 'data\players',
	'items' => 'data\items',
	'forge' => 'data\forge',
];

$GLOBALS['vars'] = $defVars;
require(__DIR__ . '\config\outputDirectories.php');

//replace args with profiles
$argvstring = implode(" ", $argv);
$profiles = &$GLOBALS['config']['profiles'];

foreach($profiles as $k=>$profile) {//Loop profiles
	$argvstring = str_replace("@".$k, implode(" ", $profile), $argvstring);
}

$argv = explode(" ", $argvstring);


//Arg options
$arg_opts = [
	'-m' => ['minify', true],
	'-o' => ['compileOutput', true],
	'-d' => ['debugMode', true],
	'-s' => function($argv, $i, $arg) {
		//Set syntax
		$syntaxID = explode(':', $arg)[1];
		$sf = __DIR__ . "\config\syntax\\" . $syntaxID . ".php";

		if(file_exists($sf)) {
			$WORKSPACE = __DIR__;
			require($sf);
		}
		array_splice($argv, $i, 1);

		return $argv;
	},
	'-a' => function($argv, $i) {
		//Extra operations for file
		if(isset($argv[$i+1])) {

			array_splice($argv, $i, 2);
		}
		return $argv;
	},
	'-fname' => function($argv, $i, $arg) {
		array_splice($argv, $i, 1);
		$a = explode(":", $arg);
		if(isset($a[1])) {
			$GLOBALS['config']['outputName'] = $a[1];
		}
		return $argv;

	},
	/*'-clear-cache' => function($argv, $i) {
		//Clear compile cache
		$dirs = $GLOBALS['config']['outputDirPrefix'];
		if(is_string($dirs)) { $dirs = [$dirs]; }

		foreach($dirs as $dir) {
			emptyDir($dir, true);
		}
		array_splice($argv, $i, 1);
		return $argv;
	},*/
	'-x' => function(){exit;},
	'-w' => function($argv, $i, $arg) {
		echo ">>>>>>>$arg\n";
		$vars = substr($arg, 3, strlen($arg)-3);
		
		$varsReg = '/(?:([%\w]+)=([:%$.\/*+\-\/\w]+))*/';
		$fileOptReg = '/(?:\$([\w]+)\$=([:{}%$.\/*+\-\w\\\]+))*/';
		$allowedOptions = [
			'outputDirs',
			'outputDirPrefix',
			'outputName'
		];
		$f = [];
		preg_match_all($fileOptReg, $vars, $f);
		if(isset($f[1])) {
			if(is_array($f[1])) {
				foreach($f[1] as $fi=>$key) {
					$val = $f[2][$fi];
					if(indexOf($allowedOptions, $key) != -1) {
						echo "$key\n";
						$GLOBALS['config'][$key] = $val;
					}

				}
			}
		}
		$v = [];
		preg_match_all($varsReg, $vars, $v);
		if(is_array($v[1])) {
			foreach($v[1] as $vi=>$key) {
				$val = $v[2][$vi];
				$GLOBALS['vars'][$key] = $val;
			}
			array_splice($argv, $i, 1);
		}

		return $argv;
	}

];

function sec($ms) { return $ms/1000000; }
echo "\n";

function emptyDir($dir, $recursive=true) {
	echo "Scanning directory \033[33m$dir\033[0m...\n";
	$files = glob($dir . '\*');
	foreach($files as $d) {
		if(is_dir($d)) {
			if($recursive) { emptyDir($d, $recursive); }
		} else {
			echo "Deleting file \033[33m$d\033[0m\n";
			unlink($d);
		}
	}
}

if(count($argv) == 1) {
	if(count($GLOBALS['config']['defaultFiles']) > 0) {
		echo "There are no files to compile given. Using the default files.";
		$argv = array_merge($argv, $GLOBALS['config']['defaultFiles']);
	} else {
		echo "There are no files and default files to compile given.\n";
	}
}

//Add arg profiles

$profiles = &$GLOBALS['config']['profiles'];
foreach($profiles as $k=>$profile) {//Loop profiles
	if(indexOf($argv, '@'.$k) != -1) {//Has current profile in argument
		array_splice($argv, indexOf($argv, '@'.$k), 1);
		foreach($profile as $f=>$pfile) {
			if(is_string($pfile)) {
				array_push($argv, $pfile);
			}
			if(is_array($pfile)) {
				//Run new command and add exit
				$ao = [];
				foreach($arg_opts as $a=>$o) {
					foreach($argv as $j=>$varg) {
						$param = explode(':', $varg);
						if($param[0] == $a) {
							if(indexOf($ao, $param[0]) == -1) {
								$ao[] = $varg;
							}
						}
					}
				}
				$co = 'php '.basename(__FILE__) . ' ' . implode(' ', $pfile) . (count($ao) > 0 ? ' '.implode(' ', $ao) : '');
				//echo "$co\n";
				$oo = shell_exec($co);
				echo $oo; //echo command output

			}
		}
	}
}

//Handle Arguments
foreach($arg_opts as $a=>$o) {
	foreach($argv as $i=>$arg) {
		if(explode(':', $arg)[0] == $a) {

			if(is_callable($o)) {
				$argv = $o($argv, $i, $arg);
			} elseif(is_array($o)) {
				array_splice($argv, indexOf($argv, $a), 1);
				$GLOBALS['config'][$o[0]] = $o[1];
			}
		}
	}
}


if($GLOBALS['config']['syntaxRegex'] == null) {
	require(__DIR__ . '\\config\\syntax\\js.php');
}

$tabIndex = 1;

function indexOf($array, $value) {
	foreach($array as $i=>$a) {
		if($a == $value) { return $i; }
	}
	return -1;
}

function getTabs($j, $filler="\t", $filler_last=null) {
	$t = "";
	for($i = 0; $i < $j; $i++) {
		$t.= $filler_last == null ? $filler : ($i == $j-1 ? $filler_last : $filler);
	}
	return $t;
}

function getBlocks($scr, $fileName) {
	$syn = &$GLOBALS['config']['syntaxRegex'];
	$getBlockRegex = $syn['defineBlock'];
	$bMatches = [];



	preg_match_all($getBlockRegex, $scr, $bMatches);

	foreach($bMatches[1] as $i=>$match) {
		$blockname = $match;
		$blockcode = $bMatches[0][$i]; //code to replace
		$blockcontents = $bMatches[2][$i]; //code to yield

		if(!isset($GLOBALS['blocks'][$blockname])) {
			$GLOBALS['blocks'][$blockname] = [
				"yieldcode" => ""
			];
		}

		$block = &$GLOBALS['blocks'][$blockname];
		
		$block['yieldcode'] .= $blockcontents;
		$scr = str_replace($blockcode, "", $scr);

	}


	return $scr;
}


function getIgnited($filepath, &$imported) {
		$ifilescript = file_get_contents($filepath);
		$syn = &$GLOBALS['config']['syntaxRegex'];

		$sets = [];
		$setPattern = $syn['defineVar'];
		preg_match_all($setPattern, $ifilescript, $sets);

		foreach($sets[0] as $i=>$setcode) {
			$GLOBALS['vars'][$sets[1][$i]] = (is_numeric($sets[2][$i]) ?intval($sets[2][$i]) : strval($sets[2][$i]));
			$ifilescript = str_replace($setcode, '', $ifilescript);
		}


		//Handle vars
		$gv = [];
		$varPattern = $syn['getVar'];
		preg_match_all($varPattern, $ifilescript, $gv);


		foreach($gv[0] as $i=>$getvar) {

			if(isset($GLOBALS['vars'][$gv[1][$i]])) {

				//echo "{$gv[0][$i]}\n";
				$ifilescript = str_replace($getvar, $GLOBALS['vars'][$gv[1][$i]], $ifilescript);
			}
		}


		//Handle optional vars
		$ov = [];
		$oVarPattern = $syn['optionalVar'];
		preg_match_all($oVarPattern, $ifilescript, $ov);
		//debug(print_r($ov,true));
		
		foreach($ov[0] as $i=>$optvar) {
			$useVar = isset($GLOBALS['vars'][$ov[1][$i]]);
			$newvar = ($useVar ? $GLOBALS['vars'][$ov[1][$i]] : $ov[2][$i]);
			//debug(print_r($newvar,true));
			if(is_string($newvar) && $useVar) {
				$newvar = '"'.$newvar.'"';
			}
			if(is_array($newvar)) {
				$newvar = json_encode($newvar, JSON_PRETTY_PRINT);
			}

			$ifilescript = str_replace($optvar, $newvar, $ifilescript);


		}

		$im = [];
		$ignitePattern = $syn['importFile'];

		$igniteRegex = preg_match_all($ignitePattern, $ifilescript, $im);


		//Handle Imports
		//$importCode = "";
		foreach($im[1] as $i=>$subIgnPath) {//Loop all Imports
			if($GLOBALS['config']['debugMode']) {
				echo "IMPORT $subIgnPath {$im[2][$i]}\n";
			}
			if($im[2][$i] != '') {//With vars
				echo "DECODING\n";
				$withVars = json_decode($im[2][$i]);
				foreach($withVars as $w=>$v) {
					echo "NEW WITH VAR: $w => ".print_r($v,true)."\n";
					$GLOBALS['vars'][$w] = $v;
				}
			
			}
			if($im[3][$i] != '') {//As var WIP

			}


			$ignPath = __DIR__ . '\\' . str_replace("/", "\\", $subIgnPath);
			$addIgn = '';

			foreach(glob($ignPath) as $gIgnPath) {
				if(!in_array($gIgnPath, $imported)) {
					array_push($imported, $gIgnPath);

					if($GLOBALS['config']['debugMode']) {
						echo "Imported file \033[33m".$subIgnPath."\033[0m\n";
					}

					$importContent = getIgnited($gIgnPath, $imported);

					$importContent = getBlocks($importContent, $gIgnPath);


					$addIgn .= $importContent;



				}/* elseif($GLOBALS['config']['debugMode']) {
					echo "Skipped import of file \033[33m".$gIgnPath."\033[0m in file \033[33m".$filepath."\033[0m.\n";
				}*/



			}
			//$importCode = $addIgn;
			$ifilescript = str_replace($im[0][$i], $addIgn, $ifilescript);



		}


		return $ifilescript;
}

/*
\/\*ignite ([\w\\\]+\.js)\*\/

([\w\\\]+)\.([a-zA-Z]+)
*/



$args = array_take($argv, 1, count($argv));
$ii = 0;




//$dFiles = $GLOBALS['config']['defaultFiles'];
//loop given arguments, filter options and files out
foreach($args as $key_arg=>$arg) {
	$gPath = is_array($args[$key_arg]) ? $key_arg : $arg;
	$doesMinify = $GLOBALS['config']['minify'];
	$outputName = $GLOBALS['config']['outputName'];
	$outputDirs = $GLOBALS['config']['outputDirs'];
	if(is_array($arg)) {
		$doesMinify = isset($arg['minify']) ? $arg['minify'] : $doesMinify;
		$outputDirs = isset($arg['outputDirs']) ? $arg['outputDirs'] : $outputDirs;
		$outputName = isset($arg['outputName']) ? $arg['outputName'] : $outputName;
	}
	//Loop compile files
	foreach(glob(__DIR__ .'\\'. $gPath) as $curpath) {
		$GLOBALS['blocks'] = [];
		$GLOBALS['vars'] =  $defVars;
		$ev = explode('\\', $curpath);
		$v = $ev[count($ev)-1];
		echo "Compiling\033[33m $v\033[0m...\n";
		$tabIndex = 1;
		$finfo = [];
		$fregex = preg_match('/([-\w\\\]+)\.([a-zA-Z]+)/', $v, $finfo);
		$fpath = __DIR__ . '\\'. $v;

		if($fregex) {
			$fname = $finfo[1];
			$fext = $finfo[2];


			$replaces = [
				"FileName" => $fname,
				"FileExt" => $fext
			];
			$newName = $outputName;

			foreach($replaces as $replace_what=>$replace_to) {
				$newName = str_replace('{'.$replace_what.'}', $replace_to, $newName);
			}

			$GLOBALS['vars']['__FILENAME__'] = $newName;

			$odirs = $GLOBALS['config']['outputDirPrefix'];
			if(is_string($odirs)) { $odirs = [$odirs]; }
			//Loop output dirs
			foreach($odirs as $io=>$iodir) {
				$nf = $iodir . '\\' . $outputDirs . $newName;
				//echo "!!!$outputDirs\n";
				$imported = [
					$curpath
				];
				$newFile = fopen($nf, 'w+');

				$scr = getIgnited($curpath, $imported);

				//Handle Yields
				$yieldRegex = '/yield ([\w-]+);/';
				$ym = [];
				preg_match_all($yieldRegex, $scr, $ym);

				$c = 0;
				foreach($ym[1] as $yy=>$getblock) {
					//echo "Yielding ".$getblock."\n";
					$rcode = '';
					if(isset($GLOBALS['blocks'][$getblock])) { $rcode = $GLOBALS['blocks'][$getblock]['yieldcode']; }

					$scr = str_replace($ym[0][$yy], $rcode, $scr);

					$c++;
				}

				//Addons
				foreach($GLOBALS['config']['addons'] as $addon) {
					if(is_string($addon)) {
						if(function_exists($addon)) {
							echo "Loading Addon: ".$addon."\n";
							$scr = call_user_func_array($addon, [$scr]);
						}
					} elseif(is_callable($addon)) {
						$scr = $addon($scr);
					} elseif(is_array($addon)) {
						switch($addon['type']??"") {
							case "static_class_call":
								$scr = $addon['class']::{$addon['method']}($scr);
								break;
						}
					}
				}


				/*
				if($doesMinify) {
					echo "Minifying \033[33m$v\033[0m...\n";
					$cRegex = '/\/\/[^\r\n]*]/';

					$cc = [];
					preg_match_all($cRegex, $scr, $cc);
					foreach($cc[0] as $r) {
						$scr = str_replace($r, '', $scr);
					}
					$scr = str_replace("\r", '', $scr);
					$scr = str_replace("\n", '', $scr);
					$scr = str_replace("	", '', $scr);
					$scr = str_replace("  ", '', $scr);

					//$scr = minify_js($scr);

				}*/
				echo "Saving\033[33m $v\033[0m to\033[33m $nf\033[0m...\n";
				fwrite($newFile, $scr);
				fclose($newFile);
				foreach($GLOBALS['config']['buildDirs'] as $buildDir) {
					$buildf = $buildDir . '\\' . $outputDirs . $newName;
					echo "Copying\033[33m $v\033[0m to\033[33m $buildf\033[0m\n";
					copy($nf, $buildf);
				}
				//echo json_encode($GLOBALS['blocks']);
				//echo json_encode($imported);
			}
		}
	}

	$ii++;
}


function putClosing($cc, $open='(', $close=')') {

}
function stripDeli($str) {
	return substr($str, 1, strlen($str)-2);
}
function getClosing($str, $open='(', $close=')', $delimeter='|', $include_tags=false, $regex_tags=false) {
	$open_i = 0;
	$l_open_i = 0;
	$max_levels = 0;
	$levels = [];
	$ss = [];
	$add_level = 0;
	$add_index = 0;
	//get max bracket level
	for($i = 0; $i < strlen($str); $i++) {
		$c_open = substr($str, $i, strlen($open));
		$c_close = substr($str, $i, strlen($close));
		$c = substr($str, $i, 1);
		$is_key = false;

		//OpenTag
		if( ($regex_tags ? preg_match($open, $c_open) === 1 : $c_open == $open) ) {
			$open_i++;

			//$i+=strlen($open)-1;
		}

		echo "O: $open_i  - C: $l_open_i\n";
		if(!isset($ss[$open_i])) {
			$ss[$open_i] = '';
		}

		if(($c_open != $open && $c_close != $close && $include_tags) || !$include_tags) {

			$ss[$open_i] .= $c;
		}

		//Close Tag
		if(($regex_tags ? preg_match($close, $c_close) === 1 : $c_close == $close)) {
			$open_i--;
			//$i+=strlen($close);

		}

		//echo substr($ss[$open_i], strlen($ss[$open_i])-1, 1)."\n";

		if(isset($ss[$open_i])
		&& $open_i != $l_open_i
		&& substr($ss[$open_i], strlen($ss[$open_i])-1, 1) != $delimeter
		&& strlen($ss[$open_i]) > 0)
		{

			$ss[$open_i] .= '|';
		}
		$max_levels=max($max_levels, $open_i);
		$l_open_i = $open_i;
	}
	//echo "MX:$max_levels\n";
	//var_dump($ss);
	return $ss;
}


function debugClear() {
	$debugFilePath = __DIR__ . "\\debug.txt";
	file_put_contents($debugFilePath, "");
}

function debug($str) {
	$debugFilePath = __DIR__ . "\\debug.txt";
	file_put_contents($debugFilePath, (file_get_contents($debugFilePath)??"").$str."\n");
}

?>
