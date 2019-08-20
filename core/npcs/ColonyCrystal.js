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

var npcdata = {
    "level": 1,
    "clan_name": ""
};

function init(e) {
    yield npc_init_event;


}
