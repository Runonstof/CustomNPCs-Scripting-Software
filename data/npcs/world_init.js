import mods\compatskills.js;
import core\functions.js;
import core\npcs\npc.js;
import core\npcs\homeSpawn.js;
import core\npcs\makeInvulnerable.js;

//add xp objectives
var xp_stats = [];
for(s in _SKILLS) {
	xp_stats.push(_SKILLS[s].replace(/[\w]+\.([\w]+)/g, "$1_xp"));
}

function init(e) {
	yield init_event;
	var w = e.npc.world;
	var sb = w.getScoreboard();
	
	//Add parent objectives
	if(!sb.hasObjective("skill_xp")) {
		e.npc.executeCommand("/scoreboard objectives add skill_xp dummy Skill XP");
		e.npc.executeCommand("/scoreboard objectives setdisplay sidebar skill_xp");
	}
	
	for(i in xp_stats) {
		var stat = xp_stats[i];
		//e.npc.say(xp_stats[i]+': '+sb.hasObjective(xp_stats[i]).toString());
		if(!sb.hasObjective(stat)) {
			e.npc.executeCommand("/scoreboard objectives add "+stat+" dummy");
			
			var ostat = sb.getObjective(stat);
			var statbase = stat.replace(/([\w]+?)_xp/g, "$1");
			var displayName = statbase.rangeUpper(0, 1)+" XP";
			ostat.setDisplayName(displayName);
		}
	}
}

function tick(e) {
	yield tick_event;
}

function load(e) {
	yield load_event;
}

function interact(e) {
	yield interact_event;
	if(e.player.isSneaking()) {
		for(i in xp_stats) {
			var stat = xp_stats[i];
			if(e.npc.world.getScoreboard().hasObjective(stat)) {
				e.npc.executeCommand("/scoreboard objectives remove "+stat);
			}
		}
		e.npc.executeCommand("/scoreboard objectives remove skill_xp");
	}
}