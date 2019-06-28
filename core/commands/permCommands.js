var PERMISSION_REGEX = /permission_([\w.\-]+)/g;
registerDataHandler("permission", Permission);
import core\players\Permittable.js;

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
			for(var p in perm.data.players as permpl) {
				infoText += "&e - &r"+permpl+"&r (&c:cross: Remove{run_command:!perms removePlayers "+perm.name+" "+permpl+"}&r)";
			}
			return infoText;
		})
		.setListTransformer(
			function(perm, pl, args, data){
				var sb = pl.world.getScoreboard();

				var canInfo = new Permission("perms.info").init(data).permits(pl.getName(), sb, data);
				var canRemove = new Permission("perms.remove").init(data).permits(pl.getName(), sb, data);

				var tdata = {
					"INFOBTN": canInfo ? "&5[Info]{run_command:!perms info "+perm.name+"|show_text:$dClick to show permission info.}&r" : "",
					"REMOVEBTN": canRemove ? "&c[Remove]{run_command:!perms remove "+perm.name+"|show_text:$cClick to remove permission.}&r" : "",
				}

				return ("&e - &b"+perm.name+"&r {INFOBTN} {REMOVEBTN}\n").fill(tdata);
			}
		)
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
