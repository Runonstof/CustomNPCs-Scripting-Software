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
		"emotes": [],
		"chatcodes": [],//Unlockables for color coding
		"chatcolor": null,//Default chatcolor (NOT FOR UNLOCKS)
		"badges": [],
		"showbadge": null,
		"chateffect": null,
		"color": null,
		"firstLogin": new Date().getTime(),
		"lastLogin": 0,
		"color": null,
		"UUID": null,
		"money": 0,
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
	this.hasEmote = function(name, sb, data) { //Checks if player has emote
		var em = new Emote(name).init(data,false);
		return (this.data.emotes.indexOf(name) > -1
		|| em.getPermission().init(data, false).permits(this.name, sb, data)
		|| em.data.default
		);
	};
	this.getAllowedEmotes = function(sb, data) {
		var ems = [];
		for(c in CHAT_EMOTES as ce) {
			var ec = new Emote(c);
			ec.load(data);
			if(this.hasEmote(ec.name, sb, data)) {
				ems.push(ec.name);
			}
		}
		return ems;
	};
}

@block init_event
	(function(e){
		var pl = e.player;
		var w = pl.world;
		var data = w.getStoreddata();
		var plo = new Player(pl.getName()).init(data).sync(pl);
		var sb = w.getScoreboard();

		if(!sb.hasObjective("bounty")) {
			sb.addObjective("bounty", "dummy");
		}
		var sbbounty = sb.getObjective("bounty");
		if(!sbbounty.hasScore(pl.getName())) {
			sbbounty.createScore(pl.getName()).setValue(0);
		}
	})(e);
@endblock

@block login_event
	(function(e){
		var pl = e.player;
		var data = pl.world.getStoreddata();
		var plo = new Player(pl.getName()).init(data).sync(pl);


		var pchats = plo.getChats(data);
		if(pchats.length == 0) {
			tellPlayer(pl, "["+SERVER_TITLE+"&r] &eYou are not in a chatchannel yet! &6&nClick here{run_command:!chat list|show_text:$6!chat list}&r&e to join one!");
		} else {
			var tellchannels = "";
			pchats.forEach(function(pc){
				tellchannels += pc.getTag('{run_command:!chat leave '+pc.name+'|show_text:$eClick to leave channel.}')+'&r ';
			});

			tellPlayer(pl, "["+SERVER_TITLE+"&r] &eYou are talking in channels: &r"+tellchannels);
		}

		plo.data.lastLogin = new Date().getTime();
		plo.save(data);
	})(e);
@endblock

@block died_event
	(function(e){
		var pl = e.player;
		var data = pl.world.getStoreddata();
		var plo = new Player(pl.getName()).init(data).sync(pl);
		var w = pl.world;
		var sb = w.getScoreboard();
		if(e.source != null) { //has source
			if(e.source.getType() == 1) { //Is source a player
				if(e.source.getName() != pl.getName()) {
					var objbounty = sb.getObjective("bounty");
					if(objbounty != null) {
						var pscore = objbounty.getScore(pl.getName());
						var pbounty =pscore.getValue()

						if(pbounty > 0) {
							var sco = new Player(e.source.getName()).init(data, false);
							executeCommand(pl, "/tellraw @a "+parseEmotes(strf(sco.getNameTag(sb)+"&a received &r:money:&e"+getAmountCoin(pbounty)+"&a for killing "+pl.getName()+"!")));
							givePlayerItems(e.source, genMoney(w, pbounty));
							pscore.setValue(0);
						}
					}
				}
			}
		}
		var loseMoney = Math.ceil(plo.data.money/2);
		if(loseMoney > 0) {
			plo.data.money -= loseMoney;
			var lm = genMoney(w, loseMoney);
			for(l in lm as lsm) {
				pl.dropItem(lsm);
			}
			plo.save(data);
			tellPlayer(pl, "&cYou lost &r:money:&e"+getAmountCoin(loseMoney)+"&c from your money pouch!");
		}


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
				tellPlayer(pl, "&aYou have earned &r:money:&e"+getAmountCoin(plo.data.pay)+"&a!");
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
					tellPlayer(pl, "&aYou have earned &r:money:&e"+getAmountCoin(jobpay)+"&a from job '"+job.getDisplayName(data)+"'&r&a!");
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
			tellPlayer(pl, "&ePermissions for player:&r "+args.player);
			var shownperms = 0;
			for(p in permids as pid) {
				if(args.matches.length == 0 || arrayOccurs(pid, args.matches, false, false) > 0) {
					var perm = new Permission(pid).init(data);
					if(perm.permits(args.player, sb, data)) {
						tellPlayer(pl, "&6 - Has permission: &b&l"+perm.name+"&r (&ePerm Info{run_command:!perms info "+perm.name+"}&r)");
						if(perm.data.players.indexOf(args.player) > -1) {
							tellPlayer(pl, "&e    - By player&r (&c - Revoke{run_command:!perms removePlayers "+perm.name+" "+args.player+"|show_text:$cClick to revoke permission "+perm.name+" for player "+args.player+".}&r)");
						}
						if(tm != null) {
							if(perm.data.teams.indexOf(tm.getName()) > -1) {
								var tcol = '&'+getColorId(tm.getColor());
								tellPlayer(pl, "&e    - By team "+tcol+"&o"+tm.getName()+"&r (&c:cross: Revoke Team{run_command:!perms removeTeams "+perm.name+" "+tm.getName()+"|show_text:$cClick to revoke permission "+perm.name+" for team "+tm.getName()+".}&r)");
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
			tellPlayer(pl, "&aSet pay amount of player '"+p.name+"' to &r:money:&e"+getAmountCoin(am)+'&a!');

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
			var po = null;
			tellPlayer(pl, getTitleBar("Player Info", false));
			tellPlayer(pl, "&e&lPlayer Info For: &r"+p.getNameTag(sb));
			var now = new Date().getTime();
			tellPlayer(pl, "&eFirst Login: &6&o"+getTimeString(now - p.data.firstLogin, ['ms'])+"&r &eago.");
			tellPlayer(pl, "&eLast Login: &6&o"+getTimeString(now - p.data.lastLogin, ['ms'])+"&r &eago.");
			tellPlayer(pl, "");
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
		['!nickname <player> <name>', function(pl, args, data){
			pl.setName(args.name);
		}, 'nickname'],
		['!bounty add <player> <amount>', function(pl, args, data){
			var plo = new Player(pl.getName()).init(data);
			var tplo = new Player(args.player).init(data);
			var ba = getCoinAmount(args.amount);
			var w = pl.world;
			var sb = w.getScoreboard();
			var sbo = sb.getObjective("bounty");
			if(sbo != null) {
				if(plo.data.money >= ba) {
					plo.data.money -= ba;
					var btax = Math.ceil(ba/100*5);
					var nb = ba-btax;
					if(sbo.hasScore(args.player)) {
						sbo.getScore(args.player).setValue(sbo.getScore(args.player).getValue()+ba);
					} else {
						sbo.createScore(args.player).setValue(ba);
					}
					plo.save(data);
					tellPlayer(pl, "&r:money:&e"+getAmountCoin(btax)+"&a has been taken as bounty tax!")
					if(tplo.name != plo.name) {
						executeCommand(pl, "/tellraw @a "+parseEmotes(strf(plo.getNameTag(sb)+"&a has put a bounty of &r:money:&e"+getAmountCoin(nb)+"&a on &r"+tplo.getNameTag(sb)+"&a!")));
					} else {
						executeCommand(pl, "/tellraw @a "+parseEmotes(strf(plo.getNameTag(sb)+"&a is so stupid, he gave himself a bounty of &r:money:&e"+getAmountCoin(nb)+"&a!")));
					}

				} else {
					tellPlayer(pl, "&cYou don't have enough money in your pouch to add the bounty!&r [&2Money Pouch{run_command:!myMoney}&r]");
				}
			} else {
				tellPlayer(pl, "&cScoreboard objective 'bounty' does not exists!");
			}

		}, 'bounty.add', [
			{
				"argname": "player",
				"type": "datahandler",
				"datatype": "player",
				"exists": true,
			},
			{
				"argname": "amount",
				"type": "currency",
				"min": 0,
			},
		]],
		['!topBounty', function(pl, args, data){
			var sb = pl.world.getScoreboard();
			var bo = sb.getObjective("bounty");
			var scores = [];
			if(bo != null) {
				var bos = bo.getScores();
				for(b in bos as bscore) {
					scores.push({
						name: bscore.getPlayerName(),
						value: bscore.getValue(),
					});
				}
			}
			scores = scores.sort(function(a,b){
				return b.value-a.value;
			});
			tellPlayer(pl, getTitleBar("Top Bounties"))
			for(s in scores as score) {
				var spl = new Player(score.name);
				spl.load(data);
				var pnum = parseInt(s)+1;
				tellPlayer(pl, " - "+pnum+". "+spl.getNameTag(sb)+"&r :money:&e"+getAmountCoin(score.value));
			}
		}, 'topBounty', []],
		['!withdraw <amount>', function(pl, args, data){
			var p = new Player(pl.getName()).init(data);
			var w = pl.world;
			var wamount = getCoinAmount(args.amount);
			if(wamount <= p.data.money) {
				var moneyItems = genMoney(w, wamount);
				p.data.money -= wamount;
				givePlayerItems(pl, moneyItems);
				p.save(data);
				tellPlayer(pl, "&aWithdrawed &r:money:&e"+getAmountCoin(wamount)+"&r&a from money pouch!");
				return true;
			} else {
				tellPlayer(pl, "&cYou dont have that much money in your pouch!");
			}
			return false;
		}, 'withdraw', [
			{
				"argname": "amount",
				"type": "currency",
				"min": 1,
			}
		]],
		['!deposit', function(pl, args, data){
			var p = new Player(pl.getName()).init(data);
			var w = pl.world;
			var mItem = pl.getMainhandItem();
			if(isItemMoney(mItem, w)) {
				var mval = getCoinAmount(mItem.getLore()[0]||"0C")*mItem.getStackSize();
				pl.setMainhandItem(null);
				p.data.money += mval;
				tellPlayer(pl, "&aAdded &r:money:&e"+getAmountCoin(mval)+"&a to money pouch.&r [&2:money: Money Pouch{run_command:!myMoney|show_text:Click here or do $o!myMoney}&r]");
				p.save(data);
			} else {
				tellPlayer(pl, "&cYou don't have valid money in your hand!");
			}
			return false;
		}, 'deposit'],
		['!myMoney', function(pl, args, data){
			var pnbt = pl.getEntityNbt();
			var p = new Player(pl.getName()).init(data);
			var mp = p.data.money;
			var mi = getMoneyItemCount(pnbt, pl.world);
			var total = mp+mi;
			tellPlayer(pl, getTitleBar('Money Pouch'));
			tellPlayer(pl, ":danger: &4&oYou will lose 50% of your money pouch on death.&r :danger:");
			tellPlayer(pl, "&6Money Pouch: &r:money:&e"+getAmountCoin(mp)+"&r [&aWithdraw{suggest_command:!withdraw }&r]");
			tellPlayer(pl, "&6Inventory: &r:money:&e"+getAmountCoin(mi)+"&r [&aDeposit{run_command:!deposit}&r]");
			tellPlayer(pl, "&cYou carry a total of &r:money:&e"+getAmountCoin(total));
			tellPlayer(pl, "&9You will lose &r:money:&e"+getAmountCoin(mi+Math.round(mp/2))+"&9 on death!");
			return true;
		}, 'myMoney'],
		['!myIncome', function(pl, args, data){
			var p = new Player(pl.getName());
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
		['!myEmotes [...matches]', function(pl, args, data){
			var plo = new Player(pl.getName()).init(data);
			var sb = pl.world.getScoreboard();
			var showStr = "";
			var showEmotes = [];
			var unlocked = [];
			var showWidth = 10;

			for(var c in CHAT_EMOTES as ce) {
				if(args.matches.length == 0 || arrayOccurs(c, args.matches, false, false) > 0) {
					var ec = new Emote(c).init(data, false);
					showEmotes.push(ec);
					if(plo.hasEmote(ec.name, sb, data)) {
						unlocked.push(ec);
					}
				}
			}

			tellPlayer(pl, getTitleBar('Emotes'));
			tellPlayer(pl, "&6"+unlocked.length+"/"+showEmotes.length+" Unlocked.");
			tellPlayer(pl, "&eHover emoji for info.");
			var tellStr = "";
			for(var i in showEmotes as em) {
				var plHas = plo.hasEmote(em.name, sb, data);
				var plHasPerm = em.getPermission().init(data, false).permits(plo.name, sb, data);
				var infoStr = ":"+em.name+":\n$eName: $r"+em.name+"\n";
				var lockStr = (
					em.data.default ?
						"$6$lDEFAULT EMOTE$r":
						(plHasPerm ?
							"$5$lUNLOCKED WITH PERM$r":
							(plHas ?
								"$a$lUNLOCKED$r":
								"$c$lLOCKED$r"
							)
						)
					);
				var sellStr = (plHas ? "" : (!em.data.forSale ? "\n$cThis emote is not for sale." : "\n$cClick to buy "+em.name+" for $r:money:$e"+getAmountCoin(em.data.price)));
				var descStr = (em.data.desc != "" ? em.data.desc.replaceAll('&', '$')+"\n" : "");
				if(em.data.hidden && !plHas) { continue; }

				tellStr += (plHas ? "&r":"&8")+"[:"+em.name+":]{*|show_text:"+infoStr+descStr+lockStr+sellStr+"}&r ";
				if(parseInt(i) > 0 && (parseInt(i)+1) % showWidth === 0) {
					tellStr += "\n";
				}


			}

			tellPlayer(pl, tellStr);

		}, 'myEmotes'],
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
		['!myHomes', function(pl, args){
			var plo = new Player(pl.getName());
			var data = pl.world.getStoreddata();
			plo.load(data);
			if(Object.keys(plo.data.homes).length > 0) {
				tellPlayer(pl, "&l[=======] &6&lGramados Homes &r&l[=======]");
				tellPlayer(pl, "[&a:check: Add{suggest_command:!setHome }&r]");
				for(i in plo.data.homes as home) {
					tellPlayer(pl, "&e - &9&o"+i+"&r&r [&bTeleport{run_command:!home "+i+"|show_text:Click to TP\n$eX:$c"+home.x+" $eY:$c"+home.y+" $eZ:$c"+home.z+" }&r] [&c:cross: Remove{run_command:!delHome "+i+"|show_text:Click to remove home.}&r]");
				}
				return true;
			} else {
				tellPlayer(pl, "&cYou don't have any homes!");
			}

			return false;
		}, 'myHomes'],
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
