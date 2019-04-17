var PERMISSION_REGEX = /permission_([\w.\-]+)/g;

import core\players\Permittable.js;

function Permission(name) {
	extends function DataHandler('permission', name);

	this.data = {
		"enabled": true,
		"teams": DEFAULT_TEAMS,
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
		for(p in pjobs as pjob) {
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
		for(pid in permids as permid) {
			var pidarr = permid.split(".");
			if(idarr.length > pidarr.length && permid != this.name) {
				var pidmatch = true;
				for(pai in pidarr as piditem) {
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




@block register_commands_event
	//REGISTER PERMISSION COMMANDS
	registerXCommands([
		['!perms setEnabled <permission_id> <value>', function(pl, args, data){
			var perm = new Permission(args.permission_id).init(data);
			perm.data.enabled = (args.value == 'true');
			perm.save(data);
			tellPlayer(pl, "&a"+(args.value == 'true' ? 'Enabled' : 'Disabled')+" permission '"+args.permission_id+"'! &r[&5&lUndo{run_command:!perms setEnabled "+perm.name+" "+(args.value == 'true' ? 'false' : 'true')+"}&r]");
		}, 'perms.setEnabled', [
			{
				"argname": "value",
				"type": "bool"
			},
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]],
		['!perms addTeams <permission_id> <...teams>', function(pl, args, data){
			var w = pl.world;
			var p = new Permission(args.permission_id).init(data);
			p.addTeams(args.teams).save(data);
			tellPlayer(pl, "&aAdded teams \""+args.teams.join(", ")+"\" to "+p.name+"!&r [&5&lUndo{run_command:!perms removeTeams "+p.name+" "+args.teams.join(" ")+"}&r]");
		}, 'perms.addTeams', [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]],
		['!perms removeTeams <permission_id> <...teams>', function(pl, args, data){
			var w = pl.world;
			var p = new Permission(args.permission_id).init(data);
			if(p.load(data)) {
				p.removeTeams(args.teams).save(data);
				tellPlayer(pl, "&aRemoved teams \""+args.teams.join(", ")+"\" from "+p.name+"!&r [&5&lUndo{run_command:!perms addTeams "+p.name+" "+args.teams.join(" ")+"}&r]");
				return true;
			} else {
				tellPlayer(pl, "&c"+args.permission_id+" does not exists!");
			}
			return false;
		}, 'perms.removeTeams', [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]],
		['!perms addPlayers <permission_id> <...players>', function(pl, args, data){
			var w = pl.world;
			var p = new Permission(args.permission_id).init(data);
			p.addPlayers(args.players).save(data);
			tellPlayer(pl, "&aAdded players \""+args.players.join(", ")+"\" to "+p.name+"!&r [&5&lUndo{run_command:!perms removePlayers "+p.name+" "+args.players.join(" ")+"}&r]");
		}, 'perms.addPlayers', [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]],
		['!perms removePlayers <permission_id> <...players>', function(pl, args, data){
			var w = pl.world;
			var p = new Permission(args.permission_id).init(data);
			p.removePlayers(args.players).save(data);
			tellPlayer(pl, "&aRemoved players \""+args.players.join(", ")+"\" from "+p.name+"!&r [&5&lUndo{run_command:!perms addPlayers "+p.name+" "+args.players.join(" ")+"}&r]");
		}, 'perms.removePlayers', [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]],
		['!perms remove <permission_id>', function(pl, args, data){
			var data = pl.world.getStoreddata();
			var p = new Permission(args.permission_id).init(data);
			//Cache data for undo-action
			var undocmds = [
				'!perms create '+p.name,
				'!perms setEnabled '+p.name+' '+p.data.enabled.toString(),
			];
			if(p.data.teams.length > 0) { undocmds.push('!perms addTeams '+p.name+' '+p.data.teams.join(" ")); }
			if(p.data.players.length > 0) { undocmds.push('!perms addPlayers '+p.name+' '+p.data.players.join(" ")); }
			p.remove(data);
			tellPlayer(pl, "&aRemoved permission '"+p.name+"'!&r [&5&lUndo{run_command:!chain "+undocmds.join(";")+"}&r]");
			return true;

		}, "perms.remove", [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]],
		['!perms create <permission_id>', function(pl, args){
			var w = pl.world;
			var data = w.getStoreddata();
			var p = new Permission(args.permission_id);
			tellPlayer(pl, "&aSaved new permission "+p.name+"!&r [&5&lUndo{run_command:!perms remove "+p.name+"}&r]");
			p.save(data);
		}, 'perms.create', [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": false,
			}
		]],
		['!perms list [...matches]', function(pl, args, data){
			var w = pl.world;
			var params = getArgParams(args.matches);
			var ids = new Permission().getAllDataIds(data);

			var page = (parseInt(params.page)||1)-1;

			var defaultShowLen = 10;
			var minShowLen = 4;
			var maxShowLen = 32;

			var showLen = Math.max(Math.min((parseInt(params.show)||defaultShowLen), maxShowLen), minShowLen);
			var minShow = page*showLen;
			var maxShow = minShow+showLen;

			var curShow = 0;

			if(ids.length > 0) {
				tellPlayer(pl, getTitleBar("Permission List"));
				var tellIds = [];
				var pagenum = Math.floor(minShow/showLen)+1;
				for(i in ids as id) {
					if((args.matches.length == 0 || arrayOccurs(id, args.matches, false, false))) {
						if(curShow >= minShow && curShow < maxShow && tellIds.indexOf(id) == -1){
							tellIds.push(id)
						}
						curShow++;
					}

				}

				var maxpages = Math.ceil(curShow/showLen);
				nxtPage = page+2;
				var navBtns =
					" &r"+(page > 0 ? "[&b<< Previous{run_command:!perms list "+args.matches.join(" ")+" -page:"+page+" -show:"+showLen+"}&r]" : "")+
					" "+(page < maxpages ? "[&aNext >>{run_command:!perms list "+args.matches.join(" ")+" -page:"+nxtPage+" -show:"+showLen+"}&r]" : "");
				tellPlayer(pl, "&6&lPage: &d&l"+pagenum+"/"+maxpages+navBtns);
				tellPlayer(pl,
					"[&cShow 5{run_command:!perms list "+args.matches.join(" ")+" -show:5}&r] "+
					"[&cShow 10{run_command:!perms list "+args.matches.join(" ")+" -show:10}&r] "+
					"[&cShow 15{run_command:!perms list "+args.matches.join(" ")+" -show:15}&r] "+
					"[&cShow 20{run_command:!perms list "+args.matches.join(" ")+" -show:25}&r]"
				);
				for(i in tellIds as id) {
					tellPlayer(pl, "&e - &b&l"+id+"&r (&6:sun: Info{run_command:!perms info "+id+"}&r) (&c:cross: Remove{run_command:!perms remove "+id+"}&r)");
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
				tellPlayer(pl, getTitleBar("Permission Info"));
				tellPlayer(pl, "&eID: &9&o"+p.name+"&r (&2:recycle: Refresh{run_command:!perms info "+p.name+"}&r) (&4:cross: Remove Perm{run_command:!perms remove "+p.name+"}&r)")
				tellPlayer(pl, "&eEnabled: &r"+
					(p.data.enabled ? "&a:check: Yes" : "&c:cross: No")+
					"&r ("+
					(p.data.enabled ?
						"&c:cross: Disable{run_command:!perms setEnabled "+p.name+" false|show_text:Click to disable.}"
						:
						"&a:check: Enable{run_command:!perms setEnabled "+p.name+" true|show_text:Click to enable.}"
					)+
					"&r)"
				);
				tellPlayer(pl, "&ePermitted Teams: &r(&a:check: Add{suggest_command:!perms addTeams "+p.name+" }&r) (&c:cross: Remove{suggest_command:!perms removeTeams "+p.name+" }&r)");
				for(i in p.data.teams as team) {
					tellPlayer(pl, "&e - &r&o"+team+"&r (&c:cross: Remove{run_command:!perms removeTeams "+p.name+" "+team+"}&r)");
				}
				tellPlayer(pl, "&ePermitted Players: &r(&a:check: Add{suggest_command:!perms addPlayers "+p.name+" }&r) (&cRemove{suggest_command:!perms removePlayers "+p.name+" }&r)");
				for(i in p.data.players as player) {
					tellPlayer(pl, "&e - &r&o"+player+"&r (&c:cross: Remove{run_command:!perms removePlayers "+p.name+" "+player+"}&r)");
				}

				tellPlayer(pl, p.getParentPerms(data).join(", "));
			} else {
				tellPlayer(pl, "&cCould not find any info for "+args.permission_id);
			}
		}, 'perms.info', [
			{
				"argname": "permission_id",
				"type": "datahandler",
				"datatype": "permission",
				"exists": true,
			}
		]]
	]);
@endblock
