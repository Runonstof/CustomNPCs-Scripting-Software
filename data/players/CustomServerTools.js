import "core/xcommandsAPI.js";

import "core/utils/*.js";
import "core/math.js";
import "core/functions.js";
import "core/mods/noppes/*.js";
import "core/mods/minecraft/*.js";
import "core/players/chatEmotes.js";
import "core/players/executeCommand.js";
import "core/players/tell.js";
import "core/players/bots/*.js";

import "core/datahandlers/*.js";
import "core/commands/*.js";

import "core/players/moreEvents.js";
import "core/players/chat/bots/*.js";
import "packages/CompatSkills/compatskills.js";

import "core/PluginLoader.js";
import "core/CustomEnchantsLoader.js";

//

var SCRIPT_VERSION = "%__FILENAME__%";
var SLOWTICK_TIMER_ID = 1;
var SLOWTICK_TIMER = 100;

reloadConfiguration();

function init(e) {
	yield init_event;

	if(e.player != null) {

		var w = e.player.world;
		var sb = w.getScoreboard();
		//e.player.getTimers().forceStart(SLOWTICK_TIMER_ID, SLOWTICK_TIMER, true);

		if(CONFIG_SERVER.DEFAULT_TEAM_JOIN != null) {
			var t = sb.getPlayerTeam(e.player.getName());
			if(t == null && sb.hasTeam(CONFIG_SERVER.DEFAULT_TEAM_JOIN)) {
				sb.getTeam(CONFIG_SERVER.DEFAULT_TEAM_JOIN).addPlayer(e.player.getName());
			}
		}
	}

}

function interact(e) {
	yield interact_event;
}

function scriptCommand(e) {
	tellPlayer(e.player, "Args: "+Java.from(e.arguments).join(" "));
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

function customChestClicked(e){
	yield customChestClicked_event;
}

function customChestClosed(e){
	yield customChestClosed_event;
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

	if(!e.isCanceled()) {
		var w = e.player.world;
		var data = w.getStoreddata();
		var sb = w.getScoreboard();

		var dpl = new Player(e.player.getName()).init(data);
		var allwdcolors = dpl.getAllowedColors(data, sb);
		var esccolors = removeFromArray(_RAWCODES, allwdcolors);
		var escmsg = escCcs(e.message.toString(), esccolors);

		var logMsg = "["+e.player.getName()+"] -> "+escCcs(e.message.toString());

		var prefcol = dpl.getChatColorPref(sb, data);
		var chats = dpl.getChats(data);

		if(!dpl.canCreateCommandText(data, sb)) {
			escmsg = escmsg.replace(CHAT_CMD_RGX_G, '');
		}

		//Check @, $ and # mentions
		//@ - Player
		//$ - Team
		//# - Chatchannel

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
				if(cmp.permits(e.player.getName(), sb, data)) {
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
		//time
		var curTimeStr = new Date().toLocaleTimeString("us-US", {
			timeZone: "America/New_York"
		}).split(":");
		curTimeStr.pop();
		curTimeStr = curTimeStr.join(":");

		//Concat new message
		var hoverInfo = '$6$lBounty: $r:money:$e'+getAmountCoin(pbounty)+"\n";
		var newmsg = "["+curTimeStr+"] "+parseEmotes(dpl.getNameTag(sb, ' -> ', '{suggest_command:@'+dpl.name+' |show_text:'+hoverInfo+'}', '', '&', data))+prefcol+escmsg;
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
						var ccpref = parseEmotes('['+curTimeStr+']&l[:lang:]{run_command:!chat list '+wcnames.join(" ")+'|show_text:'+wchats.join("\n")+'}&r ');
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

		Logger.info(logMsg);
		e.setCanceled(true); //Cancel real message
	}
}

function containerOpen(e) {
	yield containerOpen_event;
}

function containerClose(e) {
	yield containerClose_event;
}

function damaged(e) {
	yield damaged_event;
}

function damagedEntity(e) {
	yield damagedEntity_event;


}

function died(e) {
	yield died_event;
}

function factionUpdate(e) {
	yield factionUpdate_event;
}
