import "core\utils\ServerConfigHandler.js";
import "core\JavaScript\*.js";
import "core\players\tell.js";
import "core\npcs\npcUpdater.js";

import "core\xcommandsAPI.js";
import "core\mods\noppes\*.js";
import "core\datahandlers\*.js";
import "core\commands\*.js";
import "core\PluginLoader.js";
import "core\utils\Random.js";
import "core\math.js";
import "core\mods\noppes\IPlayer.js";

////

var stats = {
	"level": 1,
};

function init(e) {
	yield npc_init_event;

	data_register(stats, e.npc.getStoreddata());-
}

function tick(e) {
	yield npc_tick_event;
}

function calcMaxHp(lvl) {
	return Math.round(10+((lvl-1)*2));
}

function calcDamage(lvl) {
	return roundByNum(3+(lvl/5), .5);
}

npcSettings.Stats = objMerge(npcSettings.Stats, {
	"MaxHealth": calcMaxHp(1)
});
