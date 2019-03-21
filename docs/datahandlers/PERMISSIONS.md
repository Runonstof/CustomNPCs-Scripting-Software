`Permission` object `extends DataHandler`    
Location: `core\players\commands\permCommands.js`
```js
//String[]* means that if
//variable is String, then
//variable = [variable];

function Permission(name) {
	DataHandler.apply(this, ['permission', name]);
	this.data = {
		"enabled": true,
		"teams": [
			"Owner",
			"Developer"
		],
		"players": [],
		"jobs": [],
		"meta": {} //Gonna be removed soon, was to log allowed breakable blocks on regions, but is gonna be implemented different
	};
	
	this.addTeams = function(String[]* teams) { /***/ }; //Hmmmmmmmmmmm
	this.removeTeams = function(String[]* teams) { /***/ };
	this.addPlayers = function(String[]* players) { /***/ };//Pushes players to this.data.players
	this.removePlayers = function(String[]* players) { /***/ }; //Filters players from this.data.players
	this.permits = function(String player, IScoreboard sb, IData data) { /***/ }; //Checks if player has permission
	
}
```

**EXAMPLE**    

Check if player is allowed to do something    
Lets permit an NPC Trader
```js
//NPC SCRIPT
function interact(e) { //When player right clicks
	var w = e.player.world;
	var sb = w.getScoreboard();
	var data = w.getStoreddata();
	var perm = new Permission("trader.trade").init(data); //I take the name "trader.trade" as an example, creates permission if not exists, loads data afterwards
	//If permission "trader" exists, all its rules applies to "trader.trade"
	
	if(!perm.permits(e.player.getName(), sb, data) {
		tellPlayer(e.player, "&cYou cannot trade with this player!");
		e.setCanceled(true); //Cancel opening trade GUI or other things
	}
}
```