var PERMISSION_REGEX = /permission_([\w.\-]+)/g;
function getAllPermissionIds(data) {
	var dk = data.getKeys();
	var ids = [];
	for(d in dk as dkey) {
		if(dkey.cmatch(PERMISSION_REGEX) > 0) {
			var perm_id = dkey.replace(PERMISSION_REGEX, '$1');
			ids.push(perm_id);
		}
	}
	
	return ids;
}

function getParentPermissionIds(data, permId) {
	var pIds = [];
	var idArr = permId.split(".");
	var tid = this.id;
	getAllPermissionIds(data).forEach(function(pId){
		var pIdArr = pId.split(".");
		var isPar = true;
		for(i in pIdArr as _p) {
			if(_p != idArr[i]) {
				isPar = false;
			}
		}
		
		if(isPar && pIds.indexOf(pId) == -1 && pId != tid) {
			pIds.push(pId);
		}
	});
	
	return pIds;
};

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
		"meta": {}
	};
	
	this.addTeams = function(teams) {
		if(typeof(teams) == 'string') { teams = [teams]; }
		for(t in teams as team) {
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
		for(t in this.data.teams as team) {
			if(teams.indexOf(team) == -1) {
				nteams.push(team);
			}
		}
		this.data.teams = nteams;
		return this;
	};
	this.addPlayers = function(players) {
		if(typeof(players) == 'string') { players = [players]; }
		for(p in players as player) {
			if(this.data.players.indexOf(player) == -1) {
				this.data.players.push(player);
			}
		}
		
		return this;
	};
	this.removePlayers = function(players) {
		if(typeof(players) == 'string') { players = [players]; }
		var nplayers = [];
		for(p in this.data.players as player) {
			if(players.indexOf(player) == -1) {
				nplayers.push(player);
			}
		}
		this.data.players = nplayers;
		return this;
	}
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
			if(this.data.teams.indexOf(team.getDisplayName()) != -1) {
				permitted = true;
			}
		}
		//Check player
		if(this.data.players.indexOf(player) != -1) {
			permitted = true;
		}
		//Check jobs
		var pjobs = p.getJobs(data);
		for(p in pjobs as pjob) {
			if(this.data.jobs.indexOf(pjob.name) != -1) {
				permitted = true;
			}
		}
		
		
		return permitted;
	};
	
	return this;
}


@block register_commands_event
	//REGISTER PERMISSION COMMANDS
	registerXCommands([
		['!perms setEnabled <permission_id> <value>', function(pl, args){
			var perm = new Permission(args.permission_id);
			var data = pl.world.getStoreddata();
			if(perm.exists(data)) {
				if(args.value == 'true' || args.value == 'false') {
					perm.data.enabled = (args.value == 'true');
					perm.save(data);
					tellPlayer(pl, "&a"+(args.value == 'true' ? 'Enabled' : 'Disabled')+" permission '"+args.permission_id+"'!");
				} else {
					tellPlayer(pl, "&c<value> must be &ntrue&r&c or &nfalse&r&c!");
				}
			} else {
				tellPlayer(pl, "&c"+args.permission_id+" does not exists!");
			}
		}, 'perms.setEnabled'],
		['!perms addTeams <permission_id> <...teams>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			if(p.load(data)) {
				p.addTeams(args.teams).save(data);
				tellPlayer(pl, "&aAdded teams \""+args.teams.join(", ")+"\" to "+p.name+"!");
				return true;
			} else {
				tellPlayer(pl, "&c"+args.permission_id+" does not exists!");
			}
			return false;
		}, 'perms.addTeams'],
		['!perms removeTeams <permission_id> <...teams>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			if(p.load(data)) {
				p.removeTeams(args.teams).save(data);
				tellPlayer(pl, "&aRemoved teams \""+args.teams.join(", ")+"\" to "+p.name+"!");
				return true;
			} else {
				tellPlayer(pl, "&c"+args.permission_id+" does not exists!");
			}
			return false;
		}, 'perms.removeTeams'],
		['!perms addPlayers <permission_id> <...players>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			if(p.load(data)) {
				p.addPlayers(args.players).save(data);
				tellPlayer(pl, "&aAdded players \""+args.players.join(", ")+"\" to "+p.name+"!");
				return true;
			} else {
				tellPlayer(pl, "&c"+args.permission_id+" does not exists!");
			}
			return false;
		}, 'perms.addPlayers'],
		['!perms removePlayers <permission_id> <...players>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			if(p.load(data)) {
				p.removePlayers(args.players).save(data);
				tellPlayer(pl, "&aRemoved players \""+args.players.join(", ")+"\" to "+p.name+"!");
				return true;
			} else {
				tellPlayer(pl, "&c"+args.permission_id+" does not exists!");
			}
			return false;
		}, 'perms.removePlayers'],
		['!perms remove <permission_id>', function(pl, args){
			var data = pl.world.getStoreddata();
			var p = new Permission(args.permission_id);
			if(p.load(data)) {
				if(p.remove(data)) {
					tellPlayer(pl, "&aRemoved "+p.name+"!");
					return true;
				} else {
					tellPlayer(pl, "&cCould not remove "+p.name+"!");
					return false;
				}
			}
		}, "perms.remove"],
		['!perms add <permission_id>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			if(!p.exists(data)) {
				tellPlayer(pl, "&aSaved new permission "+p.name);
				p.save(data);
			} else {
				tellPlayer(pl, "&cPermission already exists!");
			}
			
			return true;
		}, 'perms.add'],
		['!perms list [...matches]', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var ids = getAllPermissionIds(data);
			if(ids.length > 0) {
				tellPlayer(pl, "&l<-====- &6&lGramados Permission Ids&r&l -====->");
				for(i in ids as id) {
					isMatch = false;
					args.matches.forEach(function(el){
						if(occurrences(id, el) > 0) { isMatch = true; }
					});
					if(args.matches.length == 0 || isMatch) {
						tellPlayer(pl, "&e - &9&l"+id);
					}
				}
			} else {
				tellPlayer(pl, "&cThere are no registered permissions");
			}
			return true;
		}, ['perms.list']],
		['!perms info <permission_id>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			if(p.load(data)) {
				tellPlayer(pl, "&l[=======] &6&lGramados Permission Info&r&l [=======]");
				tellPlayer(pl, "&eID: &9&o"+p.name)
				tellPlayer(pl, "&eEnabled: &r"+(p.data.enabled ? '&atrue' : '&cfalse'))
				tellPlayer(pl, "&ePermitted Teams:");
				for(i in p.data.teams as team) {
					tellPlayer(pl, "&e - &r&o"+team);
				}
				tellPlayer(pl, "&ePermitted Players:");
				for(i in p.data.players as player) {
					tellPlayer(pl, "&e - &r&o"+player);
				}
			} else {
				tellPlayer(pl, "&cCould not find any info for "+args.permission_id);
			}
		}, 'perms.info']
	]);
@endblock