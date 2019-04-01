//===== CONFIG
var SERVER_NAME = "Gramados";
var SERVER_PREFIX = "&6&l"; //Color for output
var DEFAULT_TEAMS = [ //Default scoreboard teams that gets added when permission is created
	"Owner",
	"Developer"
];
var DEFAULT_PLAYERS = [ //Default players that gets added when permission is created

];
//Team that player autojoins when player has no team
//set to null to disable
var DEFAULT_TEAM_JOIN = "Player";
//var DEFAULT_TEAM_JOIN = null;

var SERVER_BAR_OPEN = "&r&l<-=======] &r"; //For output
var SERVER_BAR_CLOSE = "&r&l [=======->&r";
var BAR_OPEN = "&l[";
var BAR_CLOSE = "&l]";

//Currency settings
var _COINITEMNAME = '&2&lMoney&r';//Custom name of currency
var _COINITEM_PREFIX = '&e'; //Prefix showing before money value lore (used for color coding)

//Configure your own currency units
//Units of currency, with own names, with lowest unit being 1
var _COINTABLE = {//FROM LOW TO HIGH
	'c': 1,
	'g': 100,
	'k': 100000,
	'm': 100000000,
	'b': 100000000000,
}; //With this setup, the syntax for 223503 would be 2k235g3c (case-INSensitive)

//Your money items, and their values in money syntax
//"value": "item_id",
var _COINITEMS = { //FROM LOW TO HIGH
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
	'10m': 'variedcommodities:plans',
	'100m': 'variedcommodities:plans',
	'1b': 'variedcommodities:plans',
};

//Configure your own time units!
var msTable = {
	//Reallife time
	'y': 31556926000,
	'mon': 2629743830,
	'w': 604800000,
	'd': 86400000,
	'h': 3600000,
	'min': 60000,
	's': 1000,
	'ms': 1,
};

//LANGUAGE settings
var _MSG = {

	"cmdNotFound": "&cCould not find this command!",
	"cmdNoPerm": "&cYou don't have permission to this command!",
	"argNotValid": "&c'{argName}' is not a valid id/name! It can only contain: &o{allowed}",
	"argToShort": "&c'{argName}' is too short! (Min. {allowed} characters)",
	"argToShort": "&c'{argName}' is too long! (Max. {allowed} characters)",
	"argNoColor": "&c'{argName}' cannot contain colorcoding!",
	"argEnum": "&c'{argName}' must be one of the following: &o{allowed}!",
	"argNaN": "&c'{argName}' is not a number!",
	"argMax": "&c'{argName}' cannot be bigger than {allowed}!",
	"argMin": "&c'{argName}' cannot be smaller than {allowed}!",
	"argNotExists": "&c{dataType} '{argVal}' does not exists!",
	"argExists": "&c{dataType} '{argVal}' already exists!",
	"argColor": "&cColors must be one of the following: {allowed}!",
	"argColorEffect": "&cChat effects must be one of the following: {allowed}!",
	"argItemAttr": "&cItem attributes must be one of these {allowed}!",
	"argBool": "&c{dataType} must be true or false!",
	"undoBtnText": "&5&lUNDO",
};


//===== END CONFIG, DO NOT EDIT BELOW, UNLESS YOU KNOW WHAT TO DO


var SERVER_TITLE = SERVER_PREFIX+SERVER_NAME;
var SERVER_TAG = BAR_OPEN+"&r"+SERVER_TITLE+"&r"+BAR_CLOSE;

import core\functions.js;
import core\players\chatEmotes.js;
import core\players\executeCommand.js;
import core\players\tell.js;
import core\players\xcommands.js;
import core\players\moreEvents.js;
import packages\CompatSkills\compatskills.js;
var SCRIPT_VERSION = "2.0b";
var SLOWTICK_TIMER_ID = 1;
var SLOWTICK_TIMER = 100;

function init(e) {
	yield init_event;
	var w = e.player.world;
	var sb = w.getScoreboard();
	e.player.getTimers().forceStart(SLOWTICK_TIMER_ID, SLOWTICK_TIMER, true);

	if(DEFAULT_TEAM_JOIN != null) {
		var t = sb.getPlayerTeam(e.player.getName());
		if(t == null && sb.hasTeam(DEFAULT_TEAM_JOIN)) {
			sb.getTeam(DEFAULT_TEAM_JOIN).addPlayer(e.player.getName());
		}
	}

	tellPlayer(e.player, "[&6&lGramados&r] &9Make sure to join our &n&9Discord{open_url:https://discord.gg/zcjyXxK}&r &9server!");
}

function interact(e) {
	yield interact_event;
}

function slowTick(e) {
	yield slowTick_event;
}

function keyPressed(e) {
	yield keyPressed_event;
}

function build(e, placeblock) { //Custom event
	yield build_event;
}

function kill(e) {
	yield kill_event;
}

function login(e) {
	yield login_event;
}

function logout(e) {
	yield logout_event;
}

function pickedUp(e) {
	yield pickedUp_event;
}

function rangedLaunched(e) {
	yield rangedLaunched_event;
}

function timer(e) {
	yield timer_event;
	if(e.id == SLOWTICK_TIMER_ID) {
		if(typeof(slowTick) != typeof(undefined)) {
			slowTick(e);
		}
	}
}

function toss(e) {
	yield toss_event;
}

function tick(e) {
	yield tick_event;
}

function attack(e) {
	yield attack_event;
}

function broken(e) {
	yield broken_event;
}

function chat(e) {
	yield chat_event;
	var w = e.player.world;
	var data = w.getStoreddata();
	var sb = w.getScoreboard();

	var dpl = new Player(e.player.getName()).init(data);
	var allwdcolors = dpl.getAllowedColors(data, sb);
	var esccolors = removeFromArray(_RAWCODES, allwdcolors);
	var escmsg = escCcs(e.message.toString(), esccolors);
	var prefcol = dpl.getChatColorPref(sb, data);
	var chats = dpl.getChats(data);

	//Check @, $ and # mentions
	//@ - Player
	//$ - Team
	//# - Chatchannel
	var notifySounds = [
		'animania:cluck3',
	];
	var players = w.getAllPlayers();
	var teams = sb.getTeams();
	var allChats = new ChatChannel().getAllDataIds(data);
	var prgx = /@([\w\-\.]+)/g;
	var trgx = /\$([\w\-\.]+)/g;
	var crgx = /#([\w\-\.]+)/g;


	var tmatch = escmsg.match(trgx) || [];
	for(tm in tmatch as tmt) {
		for(tmi in teams as team) {
			if(occurrences(team.getName().toLowerCase(), tmt.replace(trgx, '$1').toLowerCase()) > 0) {
				escmsg = escmsg.replace(tmt, '&'+getColorId(team.getColor())+'&o$'+team.getName()+prefcol);
			}
		}
	}

	var pmatch = escmsg.match(prgx) || [];
	for(pm in pmatch as pmt) {
		for(ply in players as plyr) {
			if(occurrences(plyr.getName().toLowerCase(), pmt.replace(prgx, '$1').toLowerCase()) > 0) {
				var pmpl = new Player(plyr.getName()); //Dont have to init, only using scoreboard
				escmsg = escmsg.replace(pmt, '&9&o@'+plyr.getName()+'{suggest_command:/msg '+plyr.getName()+' |show_text:'+pmpl.getNameTag(sb, '', '', '', '$')+'}'+prefcol);
			}
		}
	}


	var cmatch = escmsg.match(crgx) || [];
	for(cm in cmatch as cmt) {
		for(cmi in allChats as chat) {
			chat = new ChatChannel(chat).init(data);
			var cmm = cmt.replace(crgx, '$1');
			var cmp = chat.getPermission(data);
			if(chat.getPermission(data).permits(e.player.getName(), sb, data)) {
				if(occurrences(chat.name.toLowerCase(), cmm.toLowerCase()) > 0 || occurrences(chat.data.displayName.toLowerCase(), cmm.toLowerCase()) > 0) {
					escmsg = escmsg.replace(cmt, '&'+getColorId(chat.data.color)+'&l#'+chat.data.displayName+'{run_command:!chat list '+chat.name+'}'+prefcol);
				}
			}
		}
	}

	//Chat emotes
	escmsg = parseEmotes(escmsg, dpl.getAllowedEmotes(sb, data));


	//Concat new message
	var newmsg = dpl.getNameTag(sb, ' -> ', '{suggest_command:/msg '+dpl.name+' }')+prefcol+escmsg;


	if(chats.length > 0) {
		var toldPlayers = [];
		var wp = w.getAllPlayers();
		for(c in chats as ch) {
			for(ww in wp as wpl) {
				if(toldPlayers.indexOf(wpl.getName()) == -1 && ch.data.players.indexOf(wpl.getName()) > -1) {
					var wchats = [];
					var wcnames = [];
					new Player(wpl.getName()).init(data).getChats(data).forEach(function(wchat){
						wchats.push(wchat.getTag('', '$'));
						wcnames.push(wchat.name);
					});
					var ccpref = '&9&l[***]{run_command:!chat list '+wcnames.join(" ")+'|show_text:'+wchats.join("\n")+'}&r ';
					executeCommand(wpl, "/tellraw "+wpl.getName()+" "+strf(ccpref+newmsg, true));
					toldPlayers.push(wpl.getName());
				}
			}
		}


	} else {
		executeCommand(e.player, "/tellraw @a "+strf(newmsg, true));
	}
	e.setCanceled(true); //Cancel real message
}

function containerOpen(e) {
	yield containerOpen_event;
}

function containerClose(e) {
	yield damagedEntity_event;
}

function damaged(e) {
	yield damaged_event;
}

function died(e) {
	yield died_event;
}

function factionUpdate(e) {
	yield factionUpdate_event;
}
