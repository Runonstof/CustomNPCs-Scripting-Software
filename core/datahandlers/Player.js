registerDataHandler("player", Player);
function Player(name) {
	DataHandler.apply(this, ['player', name]);

	this.data = {
		"lastPayed": 0,
		"pay": CONFIG_SERVER.DEFAULT_PAY,
		"payTime": getStringTime('20min'),
		"maxJobs": 2,
		"maxHomes": 2,
		"homes": {},
		"defaultHome": null,
		"jobs": {},
		"inventories": [],
		"emotes": [],
		"chatcolors": [],//Unlockables for color coding
		"chatcolor": null,//Default chatcolor (NOT FOR UNLOCKS)
		"badges": [],
		"showbadges": [],
		"chateffect": null,
		"firstLogin": new Date().getTime(),
		"lastLogin": 0,
		"color": null,
		"UUID": null,
		"money": DEFAULT_MONEY,
	};
	if(PluginAPI) {
		PluginAPI.DataHandlers.run("player", this);
	}


	for(var v in VIRTUAL_CURRENCIES as crncy) {
		this.data[crncy.name] = crncy.default||0;
	}


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
			pref = '&'+getColorId(this.data.chatColor);
		}


		if(this.data.chateffect != null) {
			prefeff = '&'+getColorId(this.data.chateffect);
		}
		return pref+prefeff;
	};
	this.getNameTag = function(sb, prefix, namesuff, teamsuff, ccChar, data=null) {
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

		var badgestr = "";
		var badges = data != null ? this.getBadges(data) : [];
		var st;
		for(var i in badges as badge) {
			if(i < 3) {
				st = (badge.data.displayName+"&r\n"+badge.data.desc).replaceAll("&", "$");
				badgestr += ":"+badge.data.emote+":{*|show_text:"+st+"}&r";
			}
		}

		return ccol+dc+'l['+ccol+ctm+(teamsuff||'')+dc+'r'+badgestr+ccol+this.name+(namesuff||'')+ccol+dc+'l'+']'+(prefix||'')+dc+'r';
	};
	this.getBadges = function(data) {
		var badges = new Badge().getAllDataEntries(data);
		var retbadges = [];
		for(var i in badges as badge) {
			if(this.data.badges.indexOf(badge.name) > -1) {
				//has badge
				retbadges.push(badge);
			}
		}

		return retbadges;
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
		for(var i in this.data.jobs as job) {
			var pjob = new Job(i);
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
		return (this.data.maxJobs != -1 && this.getJobCount() >= this.getMaxJobs());
	};
	this.getMaxJobs = function(sb) {
		//check this.getMaxHomes()
		return this.data.maxJobs;
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
	this.getMaxHomes = function(sb) {
		//WILL be edited later for handling the desision maxHome setting in teams
		return this.data.maxHomes;
	};

	this.getChats = function(data) {
		var chats = [];
		var dkeys = data.getKeys();
		for(var d in dkeys as dkey) {
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
		for(var i in _RAWCOLORS as rc) {
			var cp = new Permission(getColorPermId(getColorId(rc))).init(data);
			if(cp.permits(this.name, sb, data, true, false)) {
				ac.push(getColorId(rc));
			}
		}
		for(var i in _RAWEFFECTS as rc) {
			var cp = new Permission(getColorPermId(getColorId(rc))).init(data);
			if(cp.permits(this.name, sb, data, true, false)) {
				ac.push(getColorId(rc));
			}
		}

		return ac;
	};
	this.canCreateCommandText = function(data, sb) {
		return new Permission('chat.command').init(data).permits(this.name, sb, data);
	};
	this.getBounty = function(sb){
		var sbo = sb.getObjective("bounty");
		if(sbo != null) {
			var sbs = sbo.getScore(this.name);
			if(sbs != null) {
				return sbs.getValue();
			}
		}
		return 0;
	};


	this.getInventory = function(name){
		for(var invName in this.data.inventories as inv){
			if(inv[0] == name) return inv[1];
		}
		return;
	};
	this.removeInventory = function(name){
		for(var invName in this.data.inventories){
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
		for(var c in CHAT_EMOTES as ce) {
			var ec = new Emote(c);
			ec.load(data);
			if(this.hasEmote(ec.name, sb, data)) {
				ems.push(ec.name);
			}
		}
		return ems;
	};
}
