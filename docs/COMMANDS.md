# Command Documentation

**FUNCTIONS**    
Location: `core\players\xcommands.js`

```js
void registerXCommand(String commandUsage, Function(IPlayer, Object, IData) callback, String permissionId, Array rules=[]);
void registerXCommands(Array commands);
void parseUsageRgx(Object commandObject, String str=null); //Parses command usage to regex
//And if str is given, it will match that command

```    

***

**EXAMPLES**    

Creating your own commands

1) Create a `.js`-file in `core\players\commands\`
2) Make a `block` called `register_commands_event` (This will put the code in the right place in compiled file)
3) Use this code for creating a command
```js
@block register_commands_event
	//Custom commands
	registerXCommand('!my custom command <argument_one> [argument_two] [...argument_three]', function(player, args, wdata){
		tellPlayer(player, "&aYou said "+args.argument_one+"!");
		if(args.argument_two != null) {
			tellPlayer(player, "&aYou also said "+args.argument_two+"!");
			for(var i in argument_three as argt) {
				tellPlayer(pl, "&aAnd you said "+argt);
			}
		}
	}, 'my.custom.command');
	
@endblock
```

Using argument rules
```js
	registerXCommand('!my custom command <permission_id> <color>', function(player, args, wdata){
		//Function that needs an existing Permission and color (aqua, blue, red, ...)
	}, 'my.custom.command', [
		{
			"argname": "permission_id",
			"type": "datahandler",
			"datatype": "permission",
			"exists": true //Set to false if it MUST NOT exists
		},
		{
			"argname": "color",
			"type": "color",
		}
	]);
	
	/*
	When player tries
	!my custom command workingPermission aquaa
	Then player will see
	"'Aquaa' is not an valid color. (Accepted: aqua, dark_aqua, red, blue, ...)"
	
	if workingPermission does not exists, then
	player sees message
	"Permission 'workingPermission' does not exists" or "does exists!"
	*/
```

Key | Values | Description
--- | --- | ---
`argname` | * | For what argument you want a rules
`as` | `string` | Optional. If argument is an array (`<...arg>` and `[...arg]`), check for each value
`type` | `id\|string\|currency\|time\|number\|datahandler\|color\|coloreffect` | What type argument must be


*Extra rules for specific types*    
**Type:** string    

Key | Values | Description
--- | --- | ---
`argname` | * | ...
`type` | `string` | ...
`minlen` | `number` | Optional. Checks if string `length >= minlen`
`maxlen` | `number` | Optional. Checks if string `length <= maxlen`
`noColor` | `true|false` | Optional. If color coding is allowed in this argument


**Type:** currency, time, number`    

Key | Values | Description
--- | --- | ---
`argname` | * | ...
`type` | `currency|time|number` | When type is one of these
`min` | `number` | Optional. Checks if `arg >= min`
`max` | `number` | Optional. Checks if `arg <= max`


**Type:** datahandler    

Key | Values | Description
--- | --- | ---
`argname` | * | ...
`type` | `datahandler` | When type is datahandler
`datatype` | `chatchannel|permission|job|...` | All types used by `DataHandler`
`exists` | `true|false` | Optional. When true, datahandler has to exists, when false, datahandler must not exists


**Type:** color, coloreffect   
 
Key | Values | Description
--- | --- | ---
`argname` | * | ...
`type` | `color|coloreffect` | When color, checks if arg is aqua, blue, etc..., when coloreffect, checks for bold, italic, etc....

