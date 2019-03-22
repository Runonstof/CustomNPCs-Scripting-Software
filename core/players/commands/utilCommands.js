var _COINTABLE = {
	'c': 1,
	'g': 100,
	'k': 100000,
	'm': 100000000
};

var _COINITEMS = {
	'1c': 'variedcommodities:coin_iron',
	'5c': 'variedcommodities:coin_iron',
	'10c': 'variedcommodities:coin_iron',
	'20c': 'variedcommodities:coin_iron',
	'50c': 'variedcommodities:coin_iron',
	'1g': 'variedcommodities:coin_iron',
	'2g': 'variedcommodities:coin_iron',
	'5g': 'variedcommodities:money',
	'10g': 'variedcommodities:money',
	'20g': 'variedcommodities:money',
	'50g': 'variedcommodities:money',
	'100g': 'variedcommodities:money',
	'200g': 'variedcommodities:money',
	'500g': 'variedcommodities:money',
	'1k': 'variedcommodities:plans',
	'10k': 'variedcommodities:plans',
	'100k': 'variedcommodities:plans',
	'1m': 'variedcommodities:plans',
};


function genMoney(w, amount) {
	var am = amount
	var coinams = Object.keys(_COINITEMS);
	var nmItems = [];
	for(var i = coinams.length-1; i >= 0; i--) {
		var coincount = 0;
		var coinval = getCoinAmount(coinams[i]);
		if(coinval > 0) {
			while(am >= coinval) {
				coincount++;
				am -= coinval;
			}
		}
		if(coincount > 0) {
			var coinitem = w.createItem(_COINITEMS[coinams[i]], 0, coincount);
			coinitem.setCustomName(ccs('&2&lMoney&r'));
			coinitem.setLore([
				ccs('&e'+coinams[i].toUpperCase())
			]);
			nmItems.push(coinitem);
		}
	}
	
	
	return nmItems;
	
}

function getPlayerMessage(player, message, w, pname=null, fullraw=true, allowed=[]) {
	if(pname == null) {pname = player.getName();}
	var data = w.getStoreddata();
	var plo = new Player(player.getName()).init(data);
	var sb = w.getScoreboard();
	var ts = sb.getTeams();
	var t = sb.getPlayerTeam(pname);
	var notifySound = pick([
		'animania:cluck3',
		'animania:combo',
		'animania:crow3',
		'animania:moo2',
		'animania:ooooohh',
		'animania:reeee',
		'immersiveengineering:birthdayparty',
	]);
	var pcol = '';
	var pteam = '';
	var tcol = '';
	var teff = '';
	var colls = Object.keys(_RAWCOLORS);
	var effs = Object.keys(_RAWEFFECTS);
	if(t != null) {
		var ct = new Team(t.getName()).init(data);
		if(ct.data.chatcolor != null) {
			if(colls.indexOf(ct.data.chatcolor) > -1) {
				tcol = '&'+getColorId(ct.data.chatcolor);
			}
		}
		if(ct.data.chateffect != null) {
			if(effs.indexOf(ct.data.chateffect) > -1) {
				teff = '&'+getColorId(ct.data.chateffect);
			}
		}
		if(t.getColor() != null) {
			pcol = '&'+getColorId(t.getColor());
		}
		pteam = pcol+"&o"+t.getDisplayName()+" &r"+pcol;
	}
	
	//Override player specific
	if(plo.data.chatcolor != null) {
		tcol = '&'+getColorId(plo.data.chatcolor);
	}
	//var timestr = '';
	//var now = new Date();
	//timestr = '&l[&r'+pcol+now.getHours().toString().append('0', 2)+':'+now.getMinutes().toString().append('0', 2)+'&l]&r';
	
	//var newmsg = pcol+timestr+pcol+'&l[&r'+pteam+pname+'&r'+pcol+'&l] -> &r'+tcol+teff;
	var newmsg = pcol+'&l[&r'+pteam+pname+'&r'+pcol+'&l] -> &r'+tcol+teff;
	if(!fullraw) {
		newmsg = ccs(newmsg, allowed);
	}
	newmsg += message.rangeUpper(0, 1); //Concat message contents
	
	var plr = w.getAllPlayers();
	var mrx = /@(\w+)/g;
	var mplr = newmsg.match(mrx) || [];
	
	for(k in mplr) {
		var mtc = mplr[k].replace(mrx, '$1');
		var pmtc = null;
		for(p in plr) {
			if(occurrences(plr[p].getName().toLowerCase(), mtc.toLowerCase()) > 0) {
				pmtc = plr[p].getName();
				break;
			}
		}
		if(pmtc != null) {
			executeCommand(player, "/playsound "+notifySound+" hostile "+pmtc, pmtc);
			newmsg = ccs(newmsg.replace('@'+mtc, '&9&o&l@'+pmtc+'&r'));
		}
	}
	
	var trx = /\$(\w+)/g;
	var tlr = newmsg.match(trx) || [];
	var apl = (function(w){
		var pnames = [];
		var ps = w.getAllPlayers();
		for(psi in ps as iplayr) {
			pnames.push(iplayr.getName());
		}
		
		return pnames;
	})(w);
	for(t in tlr) {
		var tc = tlr[t].replace(trx, '$1');
		for(tt in ts as sbt) {
			if(occurrences(sbt.getDisplayName().toLowerCase(), tc.toLowerCase()) > 0) {
				//Team select
				var spl = sbt.getPlayers();
				var scol = sbt.getColor();
				var sscol = '&f';
				var stn = sbt.getDisplayName();
				if(scol != null) {
					sscol = "&"+getColorId(scol);
				}
				
				for(sp in spl as splayr) {
					if(apl.indexOf(splayr) > -1) {
						executeCommand(player, '/playsound '+notifySound+' hostile '+splayr, splayr);
					}
				}
				newmsg = ccs(newmsg.replace('$'+tc, sscol+'&l'+"$"+stn+'&r'));
			}
		}
	}
	
	return newmsg;
}



//Converts int to string
function getAmountCoin(amount) {
	var rstr = '';
	var ams = sign(amount);
	if(ams == -1) { rstr = '-'; }
	amount = Math.abs(amount);
	var ckeys = Object.keys(_COINTABLE);
	for(var i = ckeys.length-1; i >= 0; i--) {
		
		var add = 0;
		while(amount >= _COINTABLE[ckeys[i]]) {
			add++;
			amount -= _COINTABLE[ckeys[i]];
		}
		if(add > 0) {
			rstr += add.toString()+ckeys[i].toUpperCase();
		}
	}
	
	if(rstr == '') { rstr = '0G'; }
	return rstr;
}
//converts string to int
function getCoinAmount(str) {
	var arx = /([\d]+)([a-zA-Z]+)/g;
	var amounts = str.match(arx) || [];
	var amount = 0;
	var sgn = 1;
	if(str.substr(0, 1) == '-') { sgn = -1; }
	
	for(a in amounts as _am) {
		var _amnum = parseInt(_am.replace(arx, '$1'));
		var _amunit = _am.replace(arx, '$2').toLowerCase();
		var coinkeys = Object.keys(_COINTABLE);
		if(coinkeys.indexOf(_amunit) > -1) {
			amount += _amnum*_COINTABLE[_amunit];
		}
	}
	return amount*sgn;
}

var REGISTRY = Java.type('net.minecraftforge.fml.common.registry.ForgeRegistries');

var ReskillableRegistry = Java.type('codersafterdark.reskillable.api.ReskillableRegistries');


@block register_commands_event
	//REGISTER UTIL COMMANDS
	registerXCommands([
		['!fakeleave [...players]', function(pl, args){
			var pcol = '&f';
			var sb = pl.world.getScoreboard();
			var spl = (args.players.length > 0 ? args.players : [pl.getName()]);
			for(ss in spl as sp) {
				var t = sb.getPlayerTeam(sp);
				if(t != null) {
					var tc = t.getColor();
					if(tc != null) {
						pcol = '&'+getColorId(tc);
					}
				}
				
				executeCommand(pl, '/tellraw @a '+strf(pcol+sp+' &r&eleft the game', true));
			}
		}, 'fakeleave'],
		['!fakejoin [...players]', function(pl, args){
			var pcol = '&f';
			var sb = pl.world.getScoreboard();
			var spl = (args.players.length > 0 ? args.players : [pl.getName()]);
			for(ss in spl as sp) {
				var t = sb.getPlayerTeam(sp);
				if(t != null) {
					var tc = t.getColor();
					if(tc != null) {
						pcol = '&'+getColorId(tc);
					}
				}
				
				executeCommand(pl, '/tellraw @a '+strf(pcol+sp+' &r&ejoined the game', true));
			}
		}, 'fakejoin'],
		['!version', function(pl, args){
			tellPlayer(pl, '&l[=======] &6&lRun\'s Server Software&r &l[=======]');
			tellPlayer(pl, '&e&lGramados Version: &c&l'+SCRIPT_VERSION);
			tellPlayer(pl, '&e&lSubscription: &9&lOriginal Edition');
			tellPlayer(pl, '&e&lProgrammed by: &r&lRunonstof&e and &r&lslava_110');
			tellPlayer(pl, '&e&lMade by: &r&lTheOddlySeagull&r&e and &r&lRunonstof');
			tellPlayer(pl, '&6Contact Runonstof for further questions.');
		}, 'version'],
		['!listEnchants [...matches]', function(pl, args){
			var ENCHANTS = REGISTRY.ENCHANTMENTS.getValues();
			tellPlayer(pl, "&l[=======] &r&aAll Registered Enchantments&r &l[=======]");
			for(i in ENCHANTS as ench) {
				var ename = REGISTRY.ENCHANTMENTS.getKey(ench);
				var eid = REGISTRY.ENCHANTMENTS.getID(ench);
				if(args.matches.length == 0 || arrayOccurs(ename, args.matches)) {
					tellPlayer(pl, "&e - &b"+ename+"&r (ID: "+eid+")");
				}
			}
		}, 'listEnchants'],
		['!listPotions [...matches]', function(pl, args){
			var POTIONS = REGISTRY.POTIONS.getValues();
			tellPlayer(pl, "&l[=======] &r&aAll Registered Potion Effects&r &l[=======]");
			for(i in POTIONS as pot) {
				var pname = REGISTRY.POTIONS.getKey(pot);
				var pid = REGISTRY.POTIONS.getID(pot);
				if(args.matches.length == 0 || arrayOccurs(pname, args.matches) > 0) {
					tellPlayer(pl, "&e - &b"+pname+"&r (ID: "+pid+")");
				}
			}
		}, 'listPotions'],
		['!listBiomes [...matches]', function(pl, args){
			var BIOMES = REGISTRY.BIOMES.getValues();
			tellPlayer(pl, "&l[=======] &r&aAll Registered Biomes&r &l[=======]");
			for(i in BIOMES as bio) {
				var bname = REGISTRY.BIOMES.getKey(bio);
				var bid = REGISTRY.BIOMES.getID(bio);
				if(args.matches.length == 0 || arrayOccurs(bname, args.matches) > 0) {
					tellPlayer(pl, "&e - &b"+bname+"&r (ID: "+bid+")");
				}
			}
		}, 'listBiomes'],
		['!listEntities [...matches]', function(pl, args){
			var ENTITIES = REGISTRY.ENTITIES.getValues();
			tellPlayer(pl, "&l[=======] &r&aAll Registered Entities&r &l[=======]");
			for(i in ENTITIES as ent) {
				var bname = REGISTRY.ENTITIES.getKey(ent);
				var bid = REGISTRY.ENTITIES.getID(ent);
				if(args.matches.length == 0 || arrayOccurs(bname, args.matches) > 0) {
					tellPlayer(pl, "&e - &b"+bname+"&r (ID: "+bid+")");
				}
			}
		}, 'listEntities'],
		['!listSkills [...matches]', function(pl, args){
			var SKILLS = ReskillableRegistry.SKILLS.getValues();
			tellPlayer(pl, "&l[=======] &r&aAll Registered Skills&r &l[=======]");
			for(i in SKILLS as skill) {
				var bname = ReskillableRegistry.SKILLS.getKey(skill);
				var bid = ReskillableRegistry.SKILLS.getID(skill);
				var obj = skill.getKey().replace(/\w+\.(\w+)/g, '$1_xp');
				if(args.matches.length == 0 || arrayOccurs(bname, args.matches) > 0) {
					tellPlayer(pl, "&e - &b"+bname+"&r (ID: "+bid+", Objective: "+obj+")");
				}
			}
		}, 'listSkills'],
		['!tellraw <player> <...message>', function(pl, args){
			var msg = args.message.join(' ');
			executeCommand(pl, '/tellraw '+args.player+' '+strf(msg, true));
			return true;
		}, 'tellraw'],
		['!setMagAmmo <amount>', function(pl, args){
			var mItem = pl.getMainhandItem();
			var am = parseInt(args.amount) || 0;
			if(!mItem.isEmpty()) {
				var mnbt = mItem.getNbt();
				if(mnbt.has('Ammo')) {
					mnbt.setInteger('Ammo', am);
					//Item.setNbt(mnbt);
					tellPlayer(pl, "&aSet ammo to "+am+"!");
					return true;
				}
			}
			tellPlayer(pl, "&cYou don't have an magazine in your hand!");
			
			return false;
		}, 'setMagAmmo'],
		['!convertNpcLoot <radius>', function(pl, args){
			var w = pl.world;
			var ents = w.getNearbyEntities(pl.getPos(), parseInt(args.radius) || 4, 2);
			for(ee in ents as ent) {
				if(ent.getType() == 2) {//Is NPC
					var entnbt = ent.getEntityNbt();
					var entinv = ent.getInventory();
					for(var i = 0; i < 9; i++) {
						var dc = getDropChance(entnbt, i);
						var di = entinv.getDropItem(i);
						if(di != null) {
							var diLore = di.getLore();
							if(diLore.length > 0) {
								var diAmount = getCoinAmount(diLore[0].replace(/\s+/g, ''));
								if(diAmount > 0) {
									di.setCustomName(ccs("&2&lMoney&r"));
									di.setLore([ccs('&e'+getAmountCoin(diAmount))]);
									
									entinv.setDropItem(i, di, dc);
								}
							}
						}
					}
				}
			}
			tellPlayer(pl, "&aAffected "+ents.length+" entities.");
			return true;
		}, 'convertNpcLoot'],
		['!convertTrader <radius>', function(pl, args){
			var radius = parseInt(args.radius) || null;
			var ppos = pl.getPos();
			if(radius != null) {
				if(radius >= 4 && radius <= 32) {
					var ents = pl.world.getNearbyEntities(ppos, radius, 2);
					var entcnt = 0; //Affected entity count
					for(en in ents as ent) {
						//print(ent.getPos().normalize());
						if(ent.getType() == 2) {//Is NPC
							var entrole = ent.getRole();
							if(entrole != null) {
								if(entrole.getType() == 1) {//Is Trader
									//Loop sellItems
									var newTrades = [];
									for(var i = 0; i < 18; i++) {
										newTrades.push([
											entrole.getCurrency1(i),
											entrole.getCurrency2(i),
											entrole.getSold(i),
										]);
										
										entrole.remove(i);
									}
									for(var i = 0; i < 18; i++) {
										//print('SLOT: '+i);amount
										
										for(ii in newTrades[i] as nItem) {
											if(!nItem.isEmpty()) {
												var nLore = nItem.getLore();
												if(nLore.length > 0) {
													var nAmount = getCoinAmount(nLore[0].replace(/\s+/g, ''));
													if(nAmount > 0) {
														nItem.setCustomName(ccs('&2&lMoney&r'));
														nItem.setLore([ccs('&e'+getAmountCoin(nAmount))]);
													}
												}
											}
											newTrades[i][ii] = nItem;
										}
										/*newTrades[i].forEach(function(nt){
											//print(nt.getItemNbt().toJsonString());
										});*/
										
										entrole.set(
											i,
											newTrades[i][0].isEmpty() ? null : newTrades[i][0],
											newTrades[i][1].isEmpty() ? null : newTrades[i][1],
											newTrades[i][2]
										);
									}
									//Add affected
									entcnt++;
								}
							}
						}
					}
					if(entcnt > 0) {
						tellPlayer(pl, "&aAffected "+entcnt+" NPC Traders in a radius of "+radius+" !")
					} else {
						tellPlayer(pl, "&cNo NPC Traders found in a radius of "+radius+" blocks.");
					}
				} else {
					tellPlayer(pl, "&cYou have a minimum of 4 blocks and a maximum of 32 block!");
				}
			} else {
				tellPlayer(pl, "&c<radius> is not a valid number!");
			}
			return false;
		}, 'convertTrader'],
		['!convertMoney', function(pl, args){
			var mItem = pl.getMainhandItem();
			if(!mItem.isEmpty()) {
				var mL = mItem.getLore();
				if(mL.length > 0) {
					var cAm = getCoinAmount(mL[0].replace(/\s/g, ''));
					if(cAm > 0) {
						mItem.setCustomName(ccs('&2&lMoney&r'));
						mItem.setLore([
							ccs('&e'+getAmountCoin(cAm))
						]);
						tellPlayer(pl, "&aConverted money!");
						return true;
					}
				}
				tellPlayer(pl, "&cYou don't have valid money in hand!");
			} else {
				tellPlayer(pl, "&cYou don't have anything in your hand!");
			}
			
			return false;
		}, 'convertMoney'],
		['!giveMoney <amount> [...players]', function(pl, args){
			var w = pl.world;
			var plrs = [];
			objArray(w.getAllPlayers()).forEach(function(wp){
				plrs.push(wp.getName());
			});
			var am = getCoinAmount(args.amount);
			if(args.players.length == 0) { args.players = [pl.getName()]; }
			var mn = genMoney(w, am);
			
			for(i in args.players as apl) {
				if(plrs.indexOf(apl) > -1) {
					for(m in mn as mi) {
						w.getPlayer(apl).giveItem(mi);
					}
				}
			}
			
			tellPlayer(pl, "&aGave "+getAmountCoin(am)+" to players: '"+args.players.join(', ')+"'");
			
			return true;
			
		}, 'giveMoney'],
		['!sayas <player> <...message>', function(pl, args, data){
			var w = pl.world;
			var ap = args.player;
			var apo = new Player(ap);
			apo.load(data);
			var msg = args.message.join(" ");
			var nmsg = getPlayerMessage(pl, msg, w, ap, true);
			executeCommand(pl, "/tellraw @a "+strf(nmsg, true, apo.getAllowedColors(data, w.getScoreboard())));
			return true;
			
		}, 'sayas'],
	]);
@endblock