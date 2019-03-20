var SCRIPT_VERSION = '1.1a';

import core\functions.js;
import core\players\executeCommand.js;
import core\players\tell.js;
import core\players\xcommands.js;
import core\players\moreEvents.js;
import packages\CompatSkills\compatskills.js;


function init(e) {
	yield init_event;
	var w = e.player.world;
	var sb = w.getScoreboard();
	var t = sb.getPlayerTeam(e.player.getName());
	if(t == null && sb.hasTeam('Player')) {
		sb.getTeam('Player').addPlayer(e.player.getName());
	}
	
	tellPlayer(e.player, "[&6&lGramados&r] &9Make sure to join our &n&9Discord{open_url:https://discord.gg/zcjyXxK}&r &9server!");
}

function interact(e) {
	yield interact_event;
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
	
	var prgx = /@([\w]+)/g;
	var trgx = /\$([\w]+)/g;
	
	var pmatch = escmsg.match(prgx) || [];
	for(pm in pmatch as pmt) {
		for(ply in players as plyr) {
			if(occurrences(plyr.getName().toLowerCase(), pmt.replace(prgx, '$1').toLowerCase()) > 0) {
				escmsg = escmsg.replace(pmt, '&9&o@'+plyr.getName()+'{suggest_command:/msg '+plyr.getName()+'}'+prefcol);
			}
		}
	}
	
	var tmatch = escmsg.match(trgx) || [];
	for(tm in tmatch as tmt) {
		for(tmi in teams as team) {
			if(occurrences(team.getName().toLowerCase(), tmt.replace(trgx, '$1').toLowerCase()) > 0) {
				escmsg = escmsg.replace(tmt, '&'+getColorId(team.getColor())+'&o$'+team.getName()+prefcol);
			}
		}
	}
	//var chatchannels = new ChatChannel().getAllDataIds(data);
	
	
	
	//Concat new message
	var newmsg = dpl.getNameTag(sb, ' -> ', '{suggest_command:/msg '+dpl.name+' }')+prefcol+escmsg;

	
	if(chats.length > 0) {
		var toldPlayers = [];
		var wp = w.getAllPlayers();
		for(c in chats as ch) {
			for(ww in wp as wpl) {
				if(toldPlayers.indexOf(wpl.getName()) == -1 && ch.data.players.indexOf(wpl.getName()) > -1) {
					var wchats = [];
					new Player(wpl.getName()).init(data).getChats(data).forEach(function(wchat){
						wchats.push(wchat.name);
					});
					var ccpref = '&9&l[***]{*|show_text:'+wchats.join("\n")+'}&r ';
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