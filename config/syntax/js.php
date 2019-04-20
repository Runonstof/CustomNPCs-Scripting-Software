<?php


$GLOBALS['config']['syntaxRegex'] = [
	//Regexes regarding import, yield and block
	/*
		Regex for importing a file, where 1st caputure group is filename (including extension)
		2nd optional group extra vars in JSON format
	*/
	'importFile' => '/import\s+([-\w.\\\*]+\.[a-zA-Z\\*]+)(?:\s+with\s+({[\w:\s\'\",\[\]]*}))?(?:\s+as\s+([\w]+))?;/',
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
	'defineVar' => '/\/\*set ([\%\w]+)=([\w\\\]+)\*\//',
	/* Regex for getting a var, 1st group is varname */
	'getVar' => '/%([\w]+)%/',
	/* Regex for getting a var, but optional, 1st group is varname, 2nd group is value if var does not exist */
	'optionalVar' => '/%([\w]+)[\s]*\|\|[\s]*((?:.|[\s])+)%/',
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
$GLOBALS['config']['addons'][] = 'fnTweak';
$GLOBALS['config']['addons'][] = 'forLoopTweak';
//$GLOBALS['config']['addons'][] = 'mcp_deobf';

?>
