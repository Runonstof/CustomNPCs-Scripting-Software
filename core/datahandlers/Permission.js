function Permission(name) {
	extends function DataHandler('permission', name);

	this.data = {
		"enabled": true,
		"teams": CONFIG_SERVER.DEFAULT_PERM_TEAMS,
		"players": [],
		"jobs": [],
		"meta": {}
	};

	this.addTeams = function(teams) {
		if(typeof(teams) == 'string') { teams = [teams]; }
		for(var t in teams as team) {
			var teamname = team;
			if(this.data.teams.indexOf(teamname) == -1) {
				this.data.teams.push(teamname);
			}
		}

		return this;
	};
	this.removeTeams = function(teams) {
		if(typeof(teams) == 'string') {
			teams = [teams];
		}

		var nteams = [];
		for(var t in this.data.teams as team) {
			if(teams.indexOf(team) == -1) {
				nteams.push(team);
			}
		}
		this.data.teams = nteams;
		return this;
	};
	this.addPlayers = function(players) {
		if(typeof(players) == 'string') { players = [players]; }
		for(var p in players as player) {
			if(this.data.players.indexOf(player) == -1) {
				this.data.players.push(player);
			}
		}

		return this;
	};
	this.removePlayers = function(players) {
		if(typeof(players) == 'string') { players = [players]; }
		var nplayers = [];
		for(var p in this.data.players as player) {
			if(players.indexOf(player) == -1) {
				nplayers.push(player);
			}
		}
		this.data.players = nplayers;
		return this;
	};
	this.permits = function(player, sb, data) {
		///String player
		///IScoreboard sb
		///IData data
		var team = sb.getPlayerTeam(player);
		var permitted = false;
		var p = new Player(player);
		p.load(data);

		//Check enabled
		if(!this.data.enabled) { return true; }

		//Check team
		if(team != null) {
			if(this.data.teams.indexOf(team.getName()) != -1) {
				permitted = true;
			}
		}
		//Check player
		if(this.data.players.indexOf(player) != -1) {
			permitted = true;
		}
		//Check jobs
		var pjobs = p.getJobs(data);
		for(var p in pjobs as pjob) {
			if(this.data.jobs.indexOf(pjob.name) != -1) {
				permitted = true;
			}
		}


		return permitted;
	};
	this.getParentPerms = function(data) {
		var parents = [];
		var permids = this.getAllDataIds(data);
		var idarr = this.name.split(".");
		for(var pid in permids as permid) {
			var pidarr = permid.split(".");
			if(idarr.length > pidarr.length && permid != this.name) {
				var pidmatch = true;
				for(var pai in pidarr as piditem) {
					if(piditem != idarr[pai]) {
						pidmatch = false;
					}
				}
				if(pidmatch && parents.indexOf(permid) == -1) {
					parents.push(permid);
				}
			}
		}

		return parents;
	}
}
