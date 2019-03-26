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
	registerXCommands([
		['!teams set chatcolor <team_name> [color]', function(pl, args){
			var w = pl.world;
			var sb = w.getScoreboard();
			var t = new Team(args.team_name);
			var data = w.getStoreddata();
			t.data.chatcolor = args.color;
			t.save(data);
			tellPlayer(pl, "&aSet chatcolor for team ");
		}, 'teams.set.chatcolor', [
			{
				"argname": "color",
				"type": "color"
			},
			{
				"argname": "team_name",
				"type": "datahandler",
				"datatype": "team",
				"exists": true
			}
		]]
	]);
@endblock