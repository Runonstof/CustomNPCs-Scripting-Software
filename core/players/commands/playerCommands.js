function Player(name) {
	extends function DataHandler('player', name);
	
	this.data = {
		"lastPayed": 0,
		"pay": getCoinAmount('5g'),
		"payTime": getStringTime('20min'),
		"maxJobs": 2,
		"maxHomes": 1,
		"homes": {},
		"jobs": {},
		"inventories": [],
		"chatcolor": null,
		"chateffect": null,
		"color": null,
		"firstLogin": new Date().getTime(),
		"lastLogin": 0,
		"color": null,
		"UUID": null,
	};
	this.sync = function(ipl) {
		this.data.UUID = ipl.getUUID();
		this.name = ipl.getName();
		return this;
	};
	this.getChatColorPref = function(sb, data) {
		var pref = '';
		var prefeff = '';
		var t = sb.getPlayerTeam(this.name);
		if(t != null) {
			var td = new Team(t.getName()).init(data);
			if(td.data.chatcolor != null) {
				pref = '&'+getColorId(td.data.chatcolor);
			}
			if(td.data.chateffect != null) {
				prefeff = '&'+getColorId(td.data.chateffect);
			}
		}
		if(this.data.chatcolor != null) {
			pref = '&'+getColorId(this.data.chatcolor);
		}
		if(this.data.chateffect != null) {
			prefeff = '&'+getColorId(this.data.chateffect);
		}
		return pref+prefeff;
	};
	this.getNameTag = function(sb, prefix, namesuff, teamsuff, ccChar) {
		var t = sb.getPlayerTeam(this.name);
		var dc = ccChar||'&';
		var ccol = '';
		var ctm = '';
		if(this.data.color != null) {
			var cId = getColorId(this.data.color);
			ccol = dc+cId;
		} else if(t != null) {
			ccol = dc+getColorId(t.getColor());
		}
		
		if(t != null) {
			ctm = ccol+dc+'o'+t.getDisplayName()+' ';
		}
		return ccol+dc+'l['+ccol+ctm+(teamsuff||'')+dc+'r'+ccol+this.name+(namesuff||'')+ccol+dc+'l'+']'+(prefix||'')+dc+'r';
	};
	
	this.delJob = function(name) {
		if(this.hasJob(name)) {
			delete this.data.jobs[name];
		}
		return this;
	};
	this.getJob = function(name) {
		if(this.hasJob(name)) {
			return this.data.jobs[name];
		}
		return null;
	};
	this.getJobs = function(data) {
		var jobs = [];
		for(i in this.data.jobs as job) {
			pjob = new Job(i);
			if(pjob.load(data)) {
				jobs.push(pjob);
			}
		}
		return jobs;
	};
	this.getJobCount = function() {
		return Object.keys(this.data.jobs).length;
	};
	this.addJob = function(name) {
		this.data.jobs[name] = {
			"lastPayed": 0
		};
		return this;
	};
	this.hasJob = function(name) {
		return Object.keys(this.data.jobs).indexOf(name) > -1;
	};
	this.hasMaxJobs = function() {
		return (this.data.maxJobs != -1 && this.getJobCount() >= this.data.maxJobs);
	};
	this.addHome = function(name, x, y, z) {
		this.data.homes[name] = {
			x: x,
			y: y,
			z: z,
		};
		return this;
	};
	this.delHome = function(name) {
		if(this.data.homes.hasOwnProperty(name)) {
			delete this.data.homes[name];
		}
		return this;
	};
	this.hasHome = function(name) {
		return (this.data.homes.hasOwnProperty(name));
	};
	this.getChats = function(data) {
		var chats = [];
		var dkeys = data.getKeys();
		for(d in dkeys as dkey) {
			if(dkey.cmatch(/chatchannel_([\w]+)/g) > 0) {
				var cc = new ChatChannel(dkey.replace(/chatchannel_([\w]+)/g, "$1"));
				if(cc.load(data)) {
					if(cc.data.players.indexOf(this.name) > -1) {
						chats.push(cc);
					}
				}
			}
		}
		
		return chats;
	}
	this.getAllowedColors = function(data, sb) {
		var ac = [];
		//Check individual colors
		for(i in _RAWCOLORS as rc) {
			var cp = new Permission(getColorPermId(getColorId(rc))).init(data);
			if(cp.permits(this.name, sb, data)) {
				ac.push(getColorId(rc));
			}
		}
		for(i in _RAWEFFECTS as rc) {
			var cp = new Permission(getColorPermId(getColorId(rc))).init(data);
			if(cp.permits(this.name, sb, data)) {
				ac.push(getColorId(rc));
			}
		}
		if(new Permission('chat.command').init(data).permits(this.name, sb, data)) {
			ac.push('x');
		}
		if(new Permission('chat.hover').init(data).permits(this.name, sb, data)) {
			ac.push('y');
		}
	
		
		return ac;
	};


	this.getInventory = function(name){
		for(invName in this.data.inventories as inv){
			if(inv[0] == name) return inv[1];
		}
		return;
	};
	this.removeInventory = function(name){
		for(invName in this.data.inventories){
			this.data.inventories.splice(invName, 1);
			return true;
		}
		return false;
	};
}

@block init_event
	(function(e){
		var pl = e.player;
		var plo = new Player(pl.getName());
		var data = pl.world.getStoreddata();
		
		if(!plo.exists(data)) {
			plo.save(data);
		}
		plo.load(data);
		
		var pchats = plo.getChats(data);
		if(pchats.length == 0) {
			tellPlayer(pl, "[&6&lGramados&r] &eYou are not in a chatchannel yet! &6&nClick here{run_command:!chat list|show_text:$6!chat list}&r&e to join one!");
		} else {
			var tellchannels = "";
			pchats.forEach(function(pc){
				tellchannels += pc.getTag('{run_command:!chat leave '+pc.name+'|show_text:$eClick to leave channel.}')+'&r ';
			});
			
			tellPlayer(pl, "[&6&lGramados&r] &eYou are talking in channels: &r"+tellchannels);
		}
		
		plo.data.lastLogin = new Date().getTime();
		plo.save(data);
	})(e);
@endblock

@block tick_event
	//CHECK MONEY PAY
	(function(e){
		var pl = e.player;
		var plo = new Player(pl.getName());
		var data = pl.world.getStoreddata();
		plo.load(data);
		
		if(new Date().getTime() > (plo.data.lastPayed+plo.data.payTime)) {
			if(plo.data.pay > 0) {
				var pm = genMoney(pl.world, plo.data.pay);
				for(p in pm as pii) {
					pl.giveItem(pii);
				}
				tellPlayer(pl, "&aYou have earned "+getAmountCoin(plo.data.pay)+"!");
				plo.data.lastPayed = new Date().getTime();
				plo.save(data);
			}
		}
		
		//CHECK JOB PAY
		for(j in plo.data.jobs as pjob) {
			var job = new Job(j);
			if(!job.exists(data)) {
				plo.delJob(j);
				plo.save(data);
				continue;
			}
			job.load(data);
			var jobpay = job.data.pay;
			var jobpayTime = job.data.payTime;
			var joblastPayed = pjob.lastPayed;
			if(jobpay > 0) {
				var now = new Date().getTime();
				if(now >= joblastPayed+jobpayTime) {
					var pm = genMoney(pl.world, jobpay);
					for(p in pm as pii) {
						pl.giveItem(pii);
					}
					tellPlayer(pl, "&aYou have earned "+getAmountCoin(jobpay)+" from job '"+job.getDisplayName(data)+"'&r&a!");
					plo.data.jobs[j].lastPayed = now;
					plo.save(data);
				}
			}
		}
		
		
	})(e);
@endblock

@block register_commands_event
	//REGISTER PLAYER COMMANDS
	registerXCommands([
		//PLAYER MANAGE
		['!player perms <player> [...matches]', function(pl, args, data){
			var permids = new Permission().getAllDataIds(data);
			
			var w = pl.world;
			var sb = w.getScoreboard();
			var tm = sb.getPlayerTeam(args.player);
			tellPlayer(pl, "&l[=======] &6&lGramados Player Perms&r &l[=======]");
			tellPlayer(pl, "&ePermissions for player: "+args.player);
			var shownperms = 0;
			for(p in permids as pid) {
				if(args.matches.length == 0 || arrayOccurs(pid, args.matches, false, false) > 0) {
					var perm = new Permission(pid).init(data);
					if(perm.permits(args.player, sb, data)) {
						tellPlayer(pl, "&6 - Has permission: &b&l"+perm.name+"&r (&ePerm Info{run_command:!perms info "+perm.name+"}&r)");
						if(perm.data.players.indexOf(args.player) > -1) {
							tellPlayer(pl, "&e    - By player&r (&c - Revoke Perm{run_command:!perms removePlayers "+perm.name+" "+args.player+"}&r)");
						}
						if(tm != null) {
							if(perm.data.teams.indexOf(tm.getName()) > -1) {
								var tcol = '&'+getColorId(tm.getColor());
								tellPlayer(pl, "&e    - By team "+tcol+"&o"+tm.getName()+"&r (&c - Revoke Team Perm{run_command:!perms removeTeams "+perm.name+" "+tm.getName()+"}&r)");
							}
						}
						shownperms++;
					}
				}
				
			}
			if(shownperms == 0) {
				tellPlayer(pl, "&cNo permissions found for player "+args.player);
			}
		}, 'player.perms'],
		['!player setPay <player> <amount>', function(pl, args, data){
			var am = getCoinAmount(args.amount);
			var p = new Player(args.player).init(data);
			
			p.data.pay = am;
			p.save(data);
			tellPlayer(pl, "&aSet pay amount of player '"+p.name+"' to "+getAmountCoin(am)+'!');
		
			return true;
		}, 'player.setPay', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
			{
				"argname": "amount",
				"type": "currency",
				"min": 0
			}
		]],
		['!player setPayTime <player> <time>', function(pl, args, data){
			var am = getStringTime(args.time);
			var p = new Player(args.player).init(data);
			p.data.payTime = am;
			p.save(data);
			tellPlayer(pl, "&aSet pay time of player '"+p.name+"' to "+getTimeString(am)+'!');
		
			return true;
		}, 'player.setPayTime', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
			{
				"argname": "time",
				"type": "time"
			}
		]],
		['!player setMaxJobs <player> <amount>', function(pl, args, data){
			var p = new Player(args.player).init(data);
			p.data.maxJobs = parseInt(args.amount) || 1;
			p.save(data);
			
			tellPlayer(pl, "&aSet maxhomes of player '"+p.name+"' to "+(parseInt(args.amount) || 1)+'!');
			return true;
		
		}, 'player.setMaxJobs', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
			{
				"argname": "amount",
				"type": "number"
			}
		]],		
		['!player setMaxHomes <player> <amount>', function(pl, args, data){
			var p = new Player(args.player).init(data);
			p.data.maxHomes = parseInt(args.amount) || 1;
			p.save(data);
			tellPlayer(pl, "&aSet maxhomes of player '"+p.name+"' to "+(parseInt(args.amount) || 1)+'!');
			return true;
		
		}, 'player.setMaxHomes', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
			{
				"argname": "amount",
				"type": "number"
			}
		]],
		['!player setChatColor <player> <color>', function(pl, args, data){
			var plo = new Player(args.player).init(data);
			plo.data.chatcolor = args.color;
			plo.save(data);
			tellPlayer(pl, "&aChanged chatcolor to "+args.color+"!");
			return true;
		}, 'player.setChatColor', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
			{
				"argname": "color",
				"type": "color"
			}
		]],
		['!player resetChatColor <player>', function(pl, args, data){
			var plo = new Player(args.player).init(data);
			plo.data.chatcolor = null;
			plo.save(data);
			tellPlayer(pl, "&aReset chatcolor of player "+plo.name+"!");
			return true;
		}, 'player.resetChatColor', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
		]],
		['!player setChatEffect <player> <effect>', function(pl, args, data){
			var plo = new Player(args.player).init(data);
			plo.data.chatcolor = args.effect;
			plo.save(data);
			tellPlayer(pl, "&aChanged chateffect to "+args.effect+"!");
			return true;
		}, 'player.setChatColor', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
			{
				"argname": "effect",
				"type": "coloreffect"
			}
		]],
		['!player resetChatEffect <player>', function(pl, args, data){
			var plo = new Player(args.player).init(data);
			plo.data.chateffect = null;
			plo.save(data);
			tellPlayer(pl, "&aReset chateffect of player "+plo.name+"!");
			return true;
		}, 'player.resetChatEffect', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			},
		]],
		['!player income <player>', function(pl, args, data){
			var p = new Player(args.player).init(data);
			var sb = pl.world.getScoreboard();
			tellPlayer(pl, "&l[=======] &r&6&lGramados Income&r &l[=======]");
			tellPlayer(pl, "&ePlayer: &r"+p.getNameTag(sb));
			tellPlayer(pl, "&eBasic income: &6&o"+getAmountCoin(p.data.pay)+"&r&e per &6&o"+getTimeString(p.data.payTime));
			var tleft = (p.data.lastPayed+p.data.payTime) - new Date().getTime();
			tellPlayer(pl, "&6&o"+getTimeString(tleft, ['ms'])+"&r&e until next pay.");
			var pjobs = p.getJobs(data);
			
			if(pjobs.length > 0) {
				for(pj in pjobs as pjob) {
					tellPlayer(pl, "&eJob income for &r"+pjob.getDisplayName(data));
					tellPlayer(pl, "&e - Job salary: &6&o"+getAmountCoin(pjob.data.pay));
					var jleft = (p.getJob(pjob.name).lastPayed+pjob.data.payTime) - new Date().getTime();
					tellPlayer(pl, "&e - &6&o"+getTimeString(jleft, ['ms'])+"&r&e until next pay for &r"+pjob.getDisplayName(data));
				}
			}
			
			
			//print(p.toJson());
			return true;
		}, 'player.income', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			}
		]],
		['!player info <player>', function(pl, args, data){
			var p = new Player(args.player).init(data);
			var sb = pl.world.getScoreboard();
			tellPlayer(pl, "&e&lPlayer Info For: &r"+p.getNameTag(sb));
			var now = new Date().getTime();
			tellPlayer(pl, "&eFirst Login: &6&o"+getTimeString(now - p.data.firstLogin, ['ms'])+"&r &eago.");
			tellPlayer(pl, "&eLast Login: &6&o"+getTimeString(now - p.data.lastLogin, ['ms'])+"&r &eago.");
			return true;
		}, 'player.info', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true
			}
		]],
		
		
		
		//PLAYER UTILITY
		['!myIncome', function(pl, args){
			var p = new Player(pl.getName());
			var data = pl.world.getStoreddata();
			p.load(data);
			tellPlayer(pl, "&l[=======] &r&6&lGramados Income&r &l[=======]");
			tellPlayer(pl, "&eBasic income: &6&o"+getAmountCoin(p.data.pay)+"&r&e per &6&o"+getTimeString(p.data.payTime));
			var tleft = (p.data.lastPayed+p.data.payTime) - new Date().getTime();
			tellPlayer(pl, "&6&o"+getTimeString(tleft, ['ms'])+"&r&e until next pay.");
			var pjobs = p.getJobs(data);
			
			if(pjobs.length > 0) {
				for(pj in pjobs as pjob) {
					tellPlayer(pl, "&eJob income for &r"+pjob.getDisplayName(data));
					tellPlayer(pl, "&e - Job salary: &6&o"+getAmountCoin(pjob.data.pay));
					var jleft = (p.getJob(pjob.name).lastPayed+pjob.data.payTime) - new Date().getTime();
					tellPlayer(pl, "&e - &6&o"+getTimeString(jleft, ['ms'])+"&r&e until next pay for &r"+pjob.getDisplayName(data));
				}
			}
			
			
			//print(p.toJson());
			return true;
			
		}, 'myIncome'],
		['!myStats [...matches]', function(pl, args, data){
			var pskills = getSkills(pl);
			var maxLvl = 32;
			tellPlayer(pl, "&l[=======] &6&lGramados Stats&r &l[=======]");
			var lmatches = arrayTransform(args.matches, function(arr_el){return arr_el.toLowerCase();});
			for(var p in pskills as pskill) {
				if(arrayOccurs(pskill.name.toLowerCase(), lmatches) || args.matches.length == 0) {
					var proc = Math.round(pskill.xp/pskill.maxXp*100);
					skillBar = progressBar(pskill.xp, pskill.maxXp, 10);
					tellPlayer(pl, "&e&l"+pskill.level+" &3&l"+pskill.name+" "+(pskill.level < maxLvl ? (skillBar+" "+proc+"%&e - "+pskill.xp+"/"+pskill.maxXp) : "&r&a&lMAX LEVEL&r"));
				}
			}
			
			return true;
		}, 'myStats'],
		['!setHome <name>', function(pl, args){
			var plo = new Player(pl.getName());
			var data = pl.world.getStoreddata();
			var ppos = pl.getPos();
			plo.load(data);
		
			if(plo.data.maxHomes == -1 || Object.keys(plo.data.homes).length < plo.data.maxHomes) {
				plo.addHome(args.name, ppos.getX(), ppos.getY(), ppos.getZ());
				tellPlayer(pl, "&aAdded home '"+args.name+"'!");
				plo.save(data);
				return true;
			} else {
				tellPlayer(pl, "&cYou have reached maximum amount of homes! ("+plo.data.maxHomes+")");
			}
		
			return false;
		}, 'setHome'],
		['!delHome <name>', function(pl, args){
			var plo = new Player(pl.getName());
			var data = pl.world.getStoreddata();
			var ppos = pl.getPos();
			plo.load(data);
			if(plo.hasHome(args.name)) {//remove home
				plo.delHome(args.name);
				tellPlayer(pl, "&aRemoved home '"+args.name+"'!");
				plo.save(data);
				return true;
			} else {//Add new home
				tellPlayer(pl, "&cHome '"+args.name+"' does not exist!");
			}
			return false;
		}, 'delHome'],
		['!listHomes', function(pl, args){
			var plo = new Player(pl.getName());
			var data = pl.world.getStoreddata();
			plo.load(data);
			if(Object.keys(plo.data.homes).length > 0) {
				tellPlayer(pl, "&l[=======] &6&lGramados Homes &r&l[=======]");
				for(i in plo.data.homes as home) {
					tellPlayer(pl, "&e - &9&o"+i+"{run_command:!home "+i+"}&r&e (X: &c"+home.x+"&e,Y: &c"+home.y+"&e,Z: &c"+home.z+"&e)&r");
				}
				return true;
			} else {
				tellPlayer(pl, "&cYou don't have any homes!");
			}
			
			return false;
		}, 'listHomes'],
		['!home <name>', function(pl, args){
			var plo = new Player(pl.getName());
			var data = pl.world.getStoreddata();
			var ppos = pl.getPos();
			plo.load(data);
			if(plo.hasHome(args.name)) {
				var h = plo.data.homes[args.name];
				pl.setPosition(h.x, h.y, h.z);
			} else {
				tellPlayer(pl, "&cHome '"+args.name+"' does not exist!");
			}
			return false;
		}, 'home'],
		['!heal', function(pl, args){
			pl.setHealth(parseFloat(pl.getMaxHealth()));
			pl.setHunger(20);
			tellPlayer(pl, "&aYou have been healed!");
		}, 'heal'],
	]);
@endblock