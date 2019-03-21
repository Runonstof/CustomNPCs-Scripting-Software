# Player Functions

Location: `core\players\`    
```js
String executeCommand(IPlayer player, String command, String as_player=null) //as_player is optional
String tellPlayer(IPlayer player, String text) //Uses /tellraw and converts &2Color &4&oCode to raw JSON string for tellraw

tellPlayer(e.player, "&cThis is a red message!");

//Using clickEvent
tellPlayer(e.player, "&cThis is a red message and please &nclick{run_command:Hello there!}&r &chere!"
//Using hoverEvent and clickEvent (hoverText uses '$' for color coding)
tellPlayer(e.player, "&cThis is a red message and please &nclick{run_command:Hello there!|show_text:$2This is$3hovertext!}&r &chere!"
//using hoverEvent only
tellPlayer(e.player, "&cThis is a red message with &nhover{*|show_text:HOVERTEXT}&r &ctext!");
/*
In clickEvent
run_command, suggest_command, open_url is allowed

working on show_item for hoverEvent
*/

```
