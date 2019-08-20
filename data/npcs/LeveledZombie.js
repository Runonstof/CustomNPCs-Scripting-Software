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

function data_sync(data, obj) {
    data_register(data, obj);
    for(var i in obj as val) {
        obj[i] = data.get(i);
    }
}

var npcdata = {
    "level": 1,
    "name": "Zombie",
    "type": "NORMAL"
};

var nameTemplate = "&4&l[{LVL}]&r &6&l{NPCNAME}";

function updateSettings(npc) {
    npcSettings.Display.Name = nameTemplate.fill({
        "LVL": npcdata.level,
        "NPCNAME": npcdata.name
    });
}

function init(e) {
    yield npc_init_event;

    data_sync(e.npc.storeddata, npcdata);
}

function tick(e) {
    yield npc_tick_event;
}

function interact(e) {
    yield npc_interact_event;
}
