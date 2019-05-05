registerDataHandler("team", Team);
function Team(name) {
	DataHandler.apply(this, ['team', name]);
	this.data = {
		"chatcolor": null,
		"chateffect": null,
	};
	this.teamExists = function(sb) {
		return sb.hasTeam(this.name);
	};
}

@block register_commands_event
	//REGISTER TEAM COMMANDS
	var teamCommands = new CommandFactory("team");


	registerXCommands([
		['!team syncAll [removeNonExistend]', function(pl, args, data){
			var w = pl.world;
			var sb = w.getScoreboard();
			var sbteams = sb.getTeams();
			var dhteams = new Team().getAllDataIds(data);
			for(var s in sbteams as sbt) {
				if(dhteams.indexOf(sbt.getName()) == -1) {
					tellPlayer(pl, "&cScoreboard team '"+sbt.getName()+"' has no synced data! Syncing...");
				}
			}

		}, 'team.syncAll', [
				{
					"argname": "removeNonExistend",
					"type": "bool"
				}
			]
		]
	]);
@endblock
