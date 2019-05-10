
{%set SERVER_CONFIG=alteria%}

import core\config\%SERVER_CONFIG%\*.js;

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
	//e.player.getTimers().forceStart(SLOWTICK_TIMER_ID, SLOWTICK_TIMER, true);

	if(DEFAULT_TEAM_JOIN != null) {
		var t = sb.getPlayerTeam(e.player.getName());
		if(t == null && sb.hasTeam(DEFAULT_TEAM_JOIN)) {
			sb.getTeam(DEFAULT_TEAM_JOIN).addPlayer(e.player.getName());
		}
	}


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

function blockinteract(e) {//Custom event
	yield blockinteract_event;
}

function build(e, placeblock) { //Custom event
	yield build_event;
}

function kill(e) {
	yield kill_event;
}

function login(e) {
	yield login_event;
	var pl = e.player;
	tellPlayer(pl, "["+SERVER_TITLE+"&r] &eIf you dont see cookies and cake &r:cookie::cake::cookie:&e you dont have our resourcepack! Click &6here{open_url:https://drive.google.com/file/d/1hCfvORqn0ghXVV8I_mToDTsvpSSnFups/view?usp=sharing|show_text$e$oDownload Resource Pack}&r&e to download.");
	tellPlayer(e.player, "["+SERVER_TITLE+"&r] &9Make sure to join our &n&9Discord{open_url:https://discord.gg/Mrjh9s}&r &9server!");

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
	var prgx = /@([\w\-]+)/g;
	var trgx = /\$([\w\-\.]+)/g;
	var crgx = /#([\w\-\.]+)/g;
	var mentioned = [];

	var tmatch = escmsg.match(trgx) || [];
	for(var tm in tmatch as tmt) {
		for(var tmi in teams as team) {
			if(occurrences(team.getName().toLowerCase(), tmt.replace(trgx, '$1').toLowerCase()) > 0) {
				for(var ply in players as plyr) {
					var pteam = sb.getPlayerTeam(plyr.getName());
					if(pteam != null) {
						if(pteam.getName() == team.getName()) {
							if(mentioned.indexOf(plyr.getName()) == -1) {
								plyr.sendNotification(ccs('&'+getColorId(team.getColor())+'&o$'+team.getName()), ccs(dpl.getNameTag(sb)), 2);
								mentioned.push(plyr.getName());
							}
						}
					}
				}
				escmsg = escmsg.replace(tmt, '&'+getColorId(team.getColor())+'&o$'+team.getName()+prefcol);
			}
		}
	}

	var pmatch = escmsg.match(prgx) || [];
	for(var pm in pmatch as pmt) {
		for(var ply in players as plyr) {
			if(occurrences(plyr.getName().toLowerCase(), pmt.replace(prgx, '$1').toLowerCase()) > 0) {
				var pmpl = new Player(plyr.getName()); //Dont have to init, only using scoreboard
				if(mentioned.indexOf(plyr.getName()) == -1) {
					plyr.sendNotification(ccs("&9&l&o@"+plyr.getName()), ccs(dpl.getNameTag(sb)), 2);
					mentioned.push(plyr.getName());
				}
				escmsg = escmsg.replace(pmt, '&9&o@'+plyr.getName()+'{suggest_command:/msg '+plyr.getName()+' |show_text:'+pmpl.getNameTag(sb, '', '', '', '$')+'}'+prefcol);
			}
		}
	}


	var cmatch = escmsg.match(crgx) || [];
	for(var cm in cmatch as cmt) {
		for(var cmi in allChats as chat) {
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

	var pbounty = 0;
	var pobj = sb.getObjective("bounty");
	if(pobj != null) {
		pbounty = pobj.getScore(e.player.getName()).getValue();
	}
	//Concat new message
	var newmsg = parseEmotes(dpl.getNameTag(sb, ' -> ', '{suggest_command:/msg '+dpl.name+' |show_text:$6$lBounty: $r:money:$e'+getAmountCoin(pbounty)+'}'))+prefcol+escmsg;
	var toldPlayers = [];
	var wp = w.getAllPlayers();

	if(chats.length > 0) {
		for(var c in chats as ch) {
			for(var ww in wp as wpl) {
				if(toldPlayers.indexOf(wpl.getName()) == -1 && ch.data.players.indexOf(wpl.getName()) > -1) {
					var wchats = [];
					var wcnames = [];
					new Player(wpl.getName()).init(data).getChats(data).forEach(function(wchat){
						wchats.push(wchat.getTag('', '$'));
						wcnames.push(wchat.name);
					});
					var ccpref = parseEmotes('&l[:lang:]{run_command:!chat list '+wcnames.join(" ")+'|show_text:'+wchats.join("\n")+'}&r ');
					executeCommand(wpl, "/tellraw "+wpl.getName()+" "+strf(ccpref+newmsg));
					toldPlayers.push(wpl.getName());
				}
			}
		}


	} else {
		for(var ww in wp as wpl) {
			var wplo = new Player(wpl.getName()).init(data);
			if(toldPlayers.indexOf(wpl.getName()) == -1 && wplo.getChats(data).length == 0) {


				executeCommand(wpl, "/tellraw "+wpl.getName()+" "+strf(newmsg));
				toldPlayers.push(wpl.getName());
			}
		}
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
