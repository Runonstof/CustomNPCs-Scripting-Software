import "core\utils\ServerConfigHandler.js";
import "core\JavaScript\*.js";
import "core\players\tell.js";
import "core\npcs\npcUpdater.js";

import "core\xcommandsAPI.js";

import "core\datahandlers\*.js";
import "core\commands\*.js";
import "core\PluginLoader.js";
import "core\utils\Random.js";
import "core\math.js";
import "core\mods\noppes\IPlayer.js";

////

var SLIME_TIERS = {
	"Green": "a",
	"Yellow": "e",
	"Orange": "6",
	"Red": "c",
	"Purple": "d",
	"Blue": "9"
};

function genSlimeKeyChance() {
	var chancePerc = 100;
	var chance = Math.random()*100;
	for(var i = 0; i < Object.keys(SLIME_TIERS).length; i++) {
		chancePerc /= 2;
		if(chance <= chancePerc) {
			return i;
		}
	}

	return 0;
}

function genSlimeKey(w, tier=1) {
	var item = w.createItem("customnpcs:scripted_item", 0, 1);
	var nbt = item.getNbt();
	nbt.setInteger("treasure_slime_tier", tier);
	var tiername = "Unknown";
	var tiercolor = "a";
	var c = 0;
	for(var i in SLIME_TIERS as st) {
		if(c === tier) {
			tiername = i;
			tiercolor = st;
		}

		c++;
	}
	item.setCustomName(ccs("&"+tiercolor+tiername+" Slime Key&r"));


	return item;
}
var DROP_KEYS_MIN = 3;
var DROP_KEYS_MAX = 6;

var GIVE_XP_LEVELS = 30;

var damageDone = {};

var damageGiven = {};

var abilityInterval = 20; //Every ~% HP lost will activate ability
var abilityLast = 1;

var huskSpawnCount = 2;

npcSettings.Stats = objMerge(npcSettings.Stats, {
	"MaxHealth": 500,
	"HealthRegen": 0,
	"AggroRange": 24,
	"CreatureType": 1, //Undede
	"RespawnType": 0, //"Yes",
	"RespawnTime": 86400,
	"HideDeadBody": true,
});
npcSettings.Ai = objMerge(npcSettings.Ai, {
	"WalkingSpeed": 4,
	"ReturnsHome": true,
});
npcSettings.Display = objMerge(npcSettings.Display, {
	"BossColor": 2,
	"Bossbar": 1
});

npcSettings.Display.Name = ccs('&6&lJabari&r');
npcSettings.Display.Title = ccs('&eThe Everliving&r');

var DIED_MSG = "&c{NpcName} &ahas been defeated! &c[View Raid Stats]{*|show_text:{HoverStats}}";
var MIN_DMG = 4;
var MAX_DMG = 6;
var ABILITY_RANGE = 30;
var ABILITY_DURATION = getStringTime('10s');
var NPC_NAME_RAW = "Jabari";
var ABILITY_MSGS = [
	"Rise, my Brothers of the sand"
];
var DAMAGED_MSGS = [
	"You pathetic mortals will never defeat me!",
	"Face the fury of the desert",
	"I am &r{NpcName}&c, the Everliving! Die by my hand!",
	"You will never defeat me &r{PlayerName}&c!",
];
var DAMAGED_MSG_CHANCE = 20;
var MUMMY_ROT_MSG = "&eYou contracted &cMummy Rot&e!";
var MUMMY_ROT_DUR = 4;
var MUMMY_ROT_STR = 2;
var LAST_ABILITY_USED = -1;
var AOE_CHANCE = 12.5;
var AOE_DMG = 5;
var AOE_RANGE = 4;

var hasTickInit = false;

function getBossMsg(msg) {
	return getChatMessage(NPC_NAME_RAW, "Boss", "dark_red", "&c"+msg);
}

function init(e) {
	e.npc.stats.melee.setStrength(rrandom_range(MIN_DMG, MAX_DMG));

}

function isInvis() {
	return new Date().getTime() < LAST_ABILITY_USED + ABILITY_DURATION && LAST_ABILITY_USED != -1;
}

function damaged(e) {
	//e.npc.say(e.npc.getHealth());
	if(e.source != null) {
		if(e.source.getType() == 1) {
			if(isInvis()) {
				e.damage = 0;
			} else {
				if(Math.random()*100 < DAMAGED_MSG_CHANCE) {
					var plrs = e.npc.world.getNearbyEntities(e.npc.pos, ABILITY_RANGE, 1);
					for(var p in plrs as plr) {
						tellPlayer(plr, getBossMsg(pick(DAMAGED_MSGS).fill({
							"NpcName": e.npc.display.name.replaceAll('§', '&'),
							"PlayerName": plr.getName()
						})));
					}
				}
				if(typeof damageDone[e.source.getName()] === typeof undefined) {
					damageDone[e.source.getName()] = 0;
				}
				if(typeof damageGiven[e.source.getName()] === typeof undefined) {
					damageGiven[e.source.getName()] = 0;
				}
				damageDone[e.source.getName()] += e.damage;
			}
		}
	}
}

function damagedEntity(e) {
	e.npc.stats.melee.setStrength(MIN_DMG, MAX_DMG);

	if(e.target&&e.target.getType() == 1) {
		if(typeof damageGiven[e.target.getName()] === typeof undefined) {
			damageGiven[e.target.getName()] = 0;
		}
		damageGiven[e.target.getName()] += e.damage;
	}

	if(Math.random()*100 <= AOE_CHANCE) {
		//Area of Effect dmg
		var plrs = e.npc.world.getNearbyEntities(e.npc.pos, AOE_RANGE, 1);
		for(var p in plrs as plr) {
			tellPlayerTitle(plr, '&c -'+AOE_DMG+' Health!');
			plr.knockback(1, fixAngle(plr.getRotation()-180));
			plr.setMotionY(0.2);
			plr.damage(AOE_DMG);
		}
	}
}

function died(e) {
	if(e.source&&e.source.getType() == 1) {
		var hoverStats = "&r"+npcSettings.Display.Name.replaceAll("§", "&")+" &adefeated by &c"+Object.keys(damageDone).length+" &aplayers.&r\n\n";
		var _stats = [];
		for(var plname in damageDone as dmgCount) {
			_stats.push([plname, dmgCount]);
		}

		_stats.sort(function(a,b){
			return b[1]-a[1];
		});



		var data = e.npc.world.storeddata;
		for(var s in _stats as stat) {
			hoverStats += "&e"+(parseInt(s)+1)+". &r"+new Player(stat[0]).init(data).getNameTag(e.npc.world.scoreboard)+"&r &c"+Math.round(stat[1])+" damage done.&r\n";
		}
		hoverStats += "\n";
		
		var data = e.npc.world.storeddata;
		tellTarget(e.source, '@a', DIED_MSG.fill({
			"NpcName": npcSettings.Display.Name.replaceAll('§','&'),
			"HoverStats": hoverStats.replaceAll("&", "$")
		}));

		for(var pname in damageDone as dmgCount) {
			var plr = e.npc.world.getPlayer(pname);
			if(plr != null) {
				executeCommand(plr, "/playsound minecraft:entity.player.levelup master "+plr.getName());
				plr.setExpLevel(plr.getExpLevel() + GIVE_XP_LEVELS);
			}
		}

		var keyCount = rrandom_range(DROP_KEYS_MIN, DROP_KEYS_MAX);

		for(var i = 0; i < keyCount; i++) {
			e.npc.dropItem(genSlimeKey(e.npc.world, genSlimeKeyChance()));
		}
	}


	damageDone = {};
	damageGiven = {};
	LAST_ABILITY_USED = -1;
	abilityLast = 1;
	npcSettings.Display.BossColor = 2;
}

function interact(e) {
	yield npc_interact_event;
}

function tick(e) {
	yield npc_tick_event;
	if(!hasTickInit) {
		e.npc.setHealth(parseFloat(npcSettings.Stats.MaxHealth));

		hasTickInit = true;
	}

	//If its time for ability again
	if(e.npc.getHealth() < npcSettings.Stats.MaxHealth - (npcSettings.Stats.MaxHealth/100*abilityInterval*abilityLast) && e.npc.getHealth() > 0) {

		//Get all players that are in a range
		var plrs = e.npc.world.getNearbyEntities(e.npc.pos, ABILITY_RANGE, 1);
		for(var p in plrs as plr) {//Loop through all players
			//if Player has at least damaged boss once
			if(Object.keys(damageDone).indexOf(plr.getName()) > -1) { //If player at least damaged the npc once
				tellPlayer(plr, getBossMsg(pick(ABILITY_MSGS)));

				//tell player that they contracted mummy rot
				tellPlayer(plr, MUMMY_ROT_MSG);
				//Add wither effect
				plr.addPotionEffect(20, MUMMY_ROT_DUR, MUMMY_ROT_STR, true);
				//Knockback player
				plr.knockback(1, fixAngle(plr.getRotation()-180));
				//Launch player a bit in the air (not high, but is for knockback)
				plr.setMotionY(0.2);
			}
		}


		for(var i = 0; i < huskSpawnCount; i++) {
			//Summon husk
			executeCommandGlobal("/summon minecraft:husk "+e.npc.x+" "+e.npc.y+" "+e.npc.z, 0);
		}
		abilityLast++;
		LAST_ABILITY_USED = new Date().getTime();
	}
	if(isInvis()) {
		npcSettings.Display.BossColor = 4;
	} else {
		npcSettings.Display.BossColor = 2;
	}
}
