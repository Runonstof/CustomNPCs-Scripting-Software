import core\utils\StringFormat.js;

registerDataHandler("chatchannel", ChatChannel);

function getColorPermId(colorId) {
	return 'chat.color.'+getColorName(colorId);
}

@block init_event
	//GEN PLAYER PERMISSIONS
	(function(e){
		var w = e.player.world;
		var data = w.getStoreddata();
		var playerperms = [
			"chat",
			"chat.color",
			"chat.command",
			"chat.hover",
		];
		for(var i in _RAWCOLORS as rawc) {
			playerperms.push('chat.color.'+rawc);
		}
		for(var i in _RAWEFFECTS as rawc) {
			playerperms.push('chat.color.'+rawc);
		}
		//Register if not exists
		for(var p in playerperms as plperm) {
			var pperm = new Permission(plperm);
			if(!pperm.exists(data)) {
				pperm.save(data);
			}
		}

	})(e);

	//END GEN PLAYER PERMISSIONS
@endblock

@block register_commands_event
	//REGISTER CHAT CHANNEL COMMANDS

	registerXCommands([
		//['', function(pl, args){}, ''],
		['!chat create <name>', function(pl, args){
			var data = pl.world.getStoreddata();
			var cc = new ChatChannel(args.name);
			cc.save(data);
			tellPlayer(pl, "&aCreated chat channel '"+cc.name+"'!");

			return false;
		}, 'chat.create', [
			{
				"argname": "name",
				"type": "id",
				"minlen": 3
			},
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": false,
			}
		]],
		['!chat remove <name>', function(pl, args, data){
			var cc = new ChatChannel(args.name);
			cc.remove(data);
			tellPlayer(pl, "&aRemoved chat channel '"+cc.name+"'!");

			return false;
		}, 'chat.remove', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": true
			}
		]],
		['!chat list [...matches]', function(pl, args, data){
			var cids = new ChatChannel().getAllDataIds(data);
			tellPlayer(pl, getTitleBar("Chat Channels"));
			for(var ci in cids as cid) {
				var cc = new ChatChannel(cid);
				if(args.matches.length == 0 || arrayOccurs(cid, args.matches) > 0) {
					if(cc.load(data) && cc.getPermission().init(data).permits(pl.getName(), pl.world.getScoreboard(), data)) {
						var onlinePlayers = [];
						var offPlayers = []
						for(var cpli in cc.data.players as cpl) {
							if(playerIsOnline(pl.world, cpl)) {
								onlinePlayers.push(cpl);
							} else {
								offPlayers.push(cpl);
							}
						}
						var onlineText = "$eOnline Players:$r\n"+
							onlinePlayers.join("\n")+
							"\n$eOffline Players:$r\n"+
							offPlayers.join("\n");
						var ontxt = "&r&e"+onlinePlayers.length+"/"+cc.data.players.length+" Online{*|show_text:"+onlineText+"}&r";
						var opttxt = (cc.data.players.indexOf(pl.getName()) > -1 ? "&c&nLeave{run_command:!chat leave "+cc.name+"}&r":"&a&nJoin{run_command:!chat join "+cc.name+"}&r");
						tellPlayer(pl, cc.getTag()+"&r ("+cc.name+") "+opttxt+" "+ontxt);
					}
				}
			}
			return false;
		}, 'chat.list'],
		['!chat setColor <name> <color>', function(pl, args, data){
			var cc = new ChatChannel(args.name);
			cc.load(data);
			cc.data.color = args.color.toLowerCase();
			cc.save(data);
			tellPlayer(pl, '&aSet color of chatchannel '+cc.getName()+'&a to '+cc.data.color+'!');
			return true;
		}, 'chat.setColor', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": true
			},
			{
				"argname": "color",
				"type": "color",
			}
		]],
		['!chat setDisplayName <name> [...displayName]', function(pl, args, data){
			var cc = new ChatChannel(args.name).init(data);

			cc.data.displayName = (args.displayName.length > 0 ? args.displayName.join(' ') : cc.name);
			cc.save(data);
			tellPlayer(pl, '&aSet display name to: '+cc.getName());
			return true;
		}, 'chat.setDisplayName', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": true
			},
			{
				"argname": "displayName",
				"type": "string",
				"noColor": true
			}
		]],
		['!chat setDesc <name> [...desc]', function(pl, args, data){
			var cc = new ChatChannel(args.name).init(data);
			cc.data.desc = args.desc.join(' ');
			cc.save(data);
			tellPlayer(pl, '&aSet description of '+cc.getName()+'&r&a to: '+cc.data.desc);
			return true;
		}, 'chat.setDisplayName', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": true
			},
		]],
		['!chat join <name>', function(pl, args, data){
			var cc = new ChatChannel(args.name).init(data);
			var plo = new Player(pl.getName()).init(data);
			if(cc.getPermission().init(data).permits(pl.getName(), pl.world.getScoreboard(), data)) {
				if(cc.data.players.indexOf(pl.getName()) == -1) {
					cc.data.players.push(pl.getName());
					plo.data.talkchat = cc.name;
					plo.save(data);
					cc.save(data);
					cc.broadcast(pl.world, plo.getNameTag(pl.world.getScoreboard())+"&r &ehas joined "+cc.getName(), [pl.getName()]);
					tellPlayer(pl, "&eJoined chat-channel "+cc.getTag()+(cc.data.desc != '' ? "&r\n&e"+cc.data.desc:""));
					return true;
				} else {
					tellPlayer(pl, "&cYou are already in this chat!");
				}


			} else {
				tellPlayer(pl, "&cYou are not allowed to join this channel!");
			}
			return false;
		}, 'chat.join', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": true
			}
		]],
		['!chat leave <name>', function(pl, args, data){
			var cc = new ChatChannel(args.name).init(data);
			var plo = new Player(pl.getName()).init(data);

			if(cc.data.players.indexOf(pl.getName()) > -1) {
				cc.data.players = removeFromArray(cc.data.players, pl.getName());
				cc.save(data);
				tellPlayer(pl, "&eLeaved channel "+cc.getName());
				cc.broadcast(pl.world, plo.getNameTag(pl.world.getScoreboard())+"&r &ehas left "+cc.getName(), [pl.getName()]);
				return true;
			} else {
				tellPlayer(pl, "&cYou can't leave a channel that you're not in!");
			}
			return false;
		}, 'chat.leave', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "chatchannel",
				"exists": true
			}
		]],
	]);
@endblock
