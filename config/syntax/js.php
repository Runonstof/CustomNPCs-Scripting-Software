<?php


$GLOBALS['config']['syntaxRegex'] = [
	//Regexes regarding import, yield and block
	/*
		Regex for importing a file, where 1st caputure group is filename (including extension)
		2nd optional group extra vars in JSON format
	*/
	'importFile' => '/import\s+(?:"|\')?([-\w.\\\*\/]+\.[a-zA-Z\\*]+)(?:"|\')?(?:\s+with\s+({[\s\S]*?}))?(?:\s+as\s+([\w]+))?;/',
	/*
		Regex for defining a block code to yield later, where
		1st capture group is for block name
		2nd group is for block contents
	*/
	'defineBlock' => '/@block ([\w]+)([\w\W\r\n]+?)@endblock/',
	/* Regex for yielding a block (1st group is block name) */
	'getBlock' => '/yield ([\w-]+);/',
	/* Regex for defining a var (1st group is varname, 2nd varvalue)
		Vars are handy but mostly you don't set them this way*/
	'defineVar' => '/{\%set ([\%\w]+)=([\w\\\]+)\%}/',
	/* Regex for getting a var, 1st group is varname */
	'getVar' => '/{{!\s*([\w]+)\s*!}}/',
	/* Regex for getting a var, but optional, 1st group is varname, 2nd group is value if var does not exist */
	'optionalVar' => '/{{!\s*([\w]+)\s*\|\|\s*(.+)\s+!}}/',
	/* Regex for adding default arguments to regular functions
		1st capture group is function name
		2nd group is for all arguments (including comma's and possible characters occuring in default values)
		*/
	'functionTweak' => "/(?<!extends )function(?:\s+([\w]+))?\(([\w\S\s]*?)\)[\s]*{/",
	'functionTransform' => "/function\s+([\w]+)\(([\w\s,]+)\)\s+{((?:.|\s)*)}/",
	'forLoopTweak' => "/for\s*\(\s*(?:var\s+)?(\w+)\s+in\s+([\w.()\[\]\"\',+\-\/*\s]+)\s+as\s+(\w+)\s*\)\s*{/",
	'varTransform' => "//",
	'functionArgs' => "/([\w]+)(?:[\s]*=[\s]*([\[\]\{\}\w\'\" ().\s:&^\/]+))?/",
	'extendFnTweak' => "/extends\s+function\s+([\w]+)\s*(?:\(\s*([\w\W]*?)\s*\)\s*)?;/",
];


require($WORKSPACE . "\\bin\\functionTweak.php");
require($WORKSPACE . "\\bin\\forLoopTweak.php");
require($WORKSPACE . "\\bin\\mcp_deobf.php");
require($WORKSPACE . "\\bin\\minifier.php");

$GLOBALS['config']['addons'][] = 'fnTweak';
$GLOBALS['config']['addons'][] = 'forLoopTweak';
if($GLOBALS['config']['minify']) {
	$GLOBALS['config']['addons'][] = [
		'type'=>'static_class_call',
		'class'=> 'JShrink\Minifier',
		'method'=> 'minify'
	];
	$GLOBALS['config']['addons'][] = function($script){
		return $script;//preg_replace('/\/(?:\*{2,}\s[\s\S]+?|\*[^\*]+?)\*\/|\/\/.*$/', '', $script);
	};

}



//$GLOBALS['config']['addons'][] = 'mcp_deobf';

?>
