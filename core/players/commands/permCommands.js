var PERMISSION_REGEX = /permission_([\w.\-]+)/g;
registerDataHandler("permission", Permission);
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




@block register_commands_event
	//REGISTER PERMISSION COMMANDS
	var permCommands = new CommandFactory("permission", "perms");

	permCommands
		.addInfoText(function(perm){
			var infoText = "&6&lEnabled: "+(perm.data.enabled ? "&atrue" : "&cfalse");
			infoText += "&r ["+
				(perm.data.enabled ?
					"&c:cross: Disable{run_command:!perms setEnabled "+perm.name+" false|show_text:$cClick to disable permission.}"
				:
					"&a:check: Enable{run_command:!perms setEnabled "+perm.name+" true|show_text:$aClick to enable permission.}"
				)
			+"&r]\n";
			infoText += "&6&lPermitted Teams: &r(&a:check: Add Teams{suggest_command:!perms addTeams "+perm.name+" }&r)\n";
			for(var t in perm.data.teams as permteam) {
				infoText += "&e - &r"+permteam+"&r (&c:cross: Remove{run_command:!perms removeTeams "+perm.name+" "+permteam+"|show_text:$cClick to remove team $o"+permteam+"$c from permission $o"+perm.name+"}&r)\n";
			}

			infoText += "&6&lPermitted Players: &r(&a:check: Add Players{suggest_command:!perms addPlayers "+perm.name+" }&r)\n";

			return infoText;
		})
		.genDefault()
		.addSettable("enabled", function(enabled){
			return (enabled.toString() === "true");
		}, [
			{
				"argname": "enabled",
				"type": "bool",
			}
		], {
			"val": "{enabled}"
		})
		.register();
	registerXCommands([
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
	]);
@endblock
