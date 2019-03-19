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
			if(t.teamExists(sb)) {
				if(args.color != null) {
					args.color = args.color.toLowerCase();
				}
				var acols = objArray(_RAWCOLORS);
				if(acols.indexOf(args.color) > -1) {
					t.data.chatcolor = args.color;
					t.save(data);
					tellPlayer(pl, "&aSet chatcolor for team ");
				} else {
					tellPlayer(pl, "&c'"+args.color+"' is not a valid value. Use one of the following: &o"+acols.join(', '));
				}
				
			} else {
				tellPlayer(pl, "&cTeam '"+args.teamname+"' does not exist!");
				t.remove(data);
			}
		}, 'teams.set.chatcolor']
	]);
@endblock