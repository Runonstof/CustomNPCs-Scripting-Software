import "core\players\commands\menuCommands.js";
import "core\players\commands\playerCommands.js";
import "core\functions.js";
import "core\config\minerim\chatEmotes.js";

@block init_event
    if(config)
        (function(e, config){
            var data = e.block.getStoreddata();
            if(!data.has("config")){
                data.put("config", JSON.stringify(config));
            }
        })(e, config);
@endblock

@block interact_event
	(function(e){
		var pl = e.player, data = e.block.getStoreddata();
        if(pl.getGamemode()==1 && pl.isSneaking() && data.has("config")){
            openMenu(pl, generateConfigMenu(data));
        }
	})(e);
@endblock

@block customChestClicked_event
    yield customChestClicked_event;
@endblock

var _ConfigMenuTypes = {
    "bool": {
        "id": "minecraft:stained_glass_pane",
        "clickActions": [
            {
                "type": "run_file",
                "value": "menuscripts/booleanToggle.js"
            }
        ]
    },
    "string": {
        "id": "minecraft:writable_book",
		"lore": [
			"&aClick and send string as chat message"
		],
        "clickActions": [
            {
                "type": "script",
                "value": "tellPlayer(e.player, '&cWIP')"
            }
        ]
    },
    "item": {
        "id": "minecraft:item_frame",
        "lore": [
			"&aClick with item to change"
		],
        "clickActions": [
            {
                "type": "run_file",
                "value": "menuscripts/itemSlot.js"
            }
        ]
    }
}

function generateConfigMenu(data){
    var config = JSON.parse(data.get("config")), lastSlot = 0;
    var menu = {
        "displayName": "&2&lBlock config",
        "rows": 4,
        "items": []
    };
    //For each parameter in config
    for(var prop in config){
        var propParts = config[prop].split("|"),
        item = _ConfigMenuTypes[propParts[0]];

        if(propParts[0] == "bool"){
            item.damage = (propParts[1] ? 5 : 14);
            item.lore = ["&3Click to toggle"];
        }

        item.name = "&2["+propParts[0]+"] " + prop;
        item.slot = lastSlot;
        lastSlot +=1;

        menu.items.push(item);
    }
	return menu;
}
