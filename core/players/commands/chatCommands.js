function ChatChannel(name) {
	extends function DataHandler('chatchannel', name);
	extends function Permittable; //add getPermission etc
	
	this.data = {
		"displayName": name,
		"players": [],
		"color": "blue",
		"desc": "",
	};
	this.addPlayers = function(players){
		for(p in players as player) {
			this.data.players.push(player);
		}
		return this;
	};
	this.getColor = function(cr) {
		cr = cr||'&';
		return cr+getColorId(this.data.color);
	};
	this.getName = function() {
		return this.getColor()+this.data.displayName+"&r";
	};
	this.getTag = function(prefix, cr) {
		cr = cr||'&';
		return this.getColor(cr)+cr+"l[#"+this.data.displayName+(prefix||'')+"]"+cr+"r";
	};
	this.removePlayers = function(players) {
		var np = [];
		for(p in this.data.players as player) {
			if(players.indexOf(player) == -1) {
				np.push(player);
			}
		}
		this.data.players = np;
		return this;
	};
	this.getPlayers = function(world) { //returns all online IPlayers
		var plr = world.getAllPlayers();
		var plrs = [];
		for(p in plr as pl) {
			if(this.data.players.indexOf(pl.getName()) > -1) {
				plrs.push(pl);
			}
		}
		return plrs;
	};
	this.broadcast = function(w, msg, exc) {
		if(typeof(exc) == typeof(undefined)) { exc = []; }
		var plrs = w.getAllPlayers();
		for(p in plrs as pl) {
			if(this.data.players.indexOf(pl.getName()) > -1 && exc.indexOf(pl.getName()) == -1) {
				tellPlayer(pl, msg);
			}
		}
		return this;
	};
}

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
		for(i in _RAWCOLORS as rawc) {
			playerperms.push('chat.color.'+rawc);
		}
		for(i in _RAWEFFECTS as rawc) {
			playerperms.push('chat.color.'+rawc);
		}
		//Register if not exists
		for(p in playerperms as plperm) {
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
		
			var ccp = cc.getPermission(data);
			ccp.data.enabled = false;
			ccp.save(data);
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
		['!chat remove <name>', function(pl, args){
			var data = pl.world.getStoreddata();
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
			tellPlayer(pl, "&l[=======] &6&lGramados Chat Channels&r &l[=======]");
			for(ci in cids as cid) {
				var cc = new ChatChannel(cid);
				if(args.matches.length == 0 || arrayOccurs(cid, args.matches) > 0) {
					if(cc.load(data) && cc.getPermission(data).permits(pl.getName(), pl.world.getScoreboard(), data)) {
						var onlinePlayers = [];
						for(var cpli in cc.data.players as cpl) {
							if(playerIsOnline(pl.world, cpl)) {
								onlinePlayers.push(cpl);
							}
						}
						var ontxt = "&r&e"+onlinePlayers.length+"/"+cc.data.players.length+" Online{*|show_text:"+onlinePlayers.join("\n")+"}&r";
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
			if(cc.getPermission(data).permits(pl.getName(), pl.world.getScoreboard(), data)) {
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