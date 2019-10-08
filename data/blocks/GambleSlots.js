import "core/utils/FileUtils.js";
import "core/utils/CSON.js";
import "core/utils/RunDelay.js";
import "core/utils/Random.js";
import "core/mods/noppes/INbt.js";

var GS_CONFIG_PATH = "runon_scripts/GambleSlots.json";
var GS_CONFIG = new File(GS_CONFIG_PATH);

var GS_SETTINGS = {
    "slotItems": [
        {
            "id": "minecraft:wool",
            "damage": 0,
            "rewards": [
                {
                    "id": "minecraft:diamond",
                    "count": 3,
                    "damage": 0
                }
            ]
        },
        {
            "id": "minecraft:wool",
            "damage": 1,
            "rewards": [
                {
                    "id": "minecraft:diamond",
                    "count": 2,
                    "damage": 0
                }
            ]
        },
        {
            "id": "minecraft:wool",
            "damage": 2,
            "rewards": [
                {
                    "id": "minecraft:diamond",
                    "count": 1,
                    "damage": 0
                }
            ]
        }
    ]
};

if(!GS_CONFIG.exists()) {

    mkPath(GS_CONFIG_PATH);
    writeToFile(GS_CONFIG_PATH, JSON.stringify(GS_SETTINGS));
}

GS_SETTINGS = cson_parse(readFileAsString(GS_CONFIG_PATH));

function rollGamble(e, times=1) {
    if(times > 0) {
        var t = e.block.getTimers();
        
        var pos = e.block.pos.east();
        
        var item_id;
        do {
            item_id = pick([
                'minecraft:diamond_block',
                'minecraft:dirt',
                'minecraft:emerald_block',
                'minecraft:cobblestone',
            ]);
        } while(item_id == e.block.world.getBlock(pos.x,pos.y,pos.z).getName());

        
        times--;
        
        runDelay(1, function(){
            rollGamble(e, times);
        });
        e.block.world.setBlock(pos.x,pos.y,pos.z,item_id,0);
    }
}

function interact(e) {
    var mItem = e.player.getMainhandItem();
    if(mItem.getName() == "minecraft:name_tag") {
        if(mItem.getDisplayName() == "LINK") {
            if(e.player.isSneaking()) {
                var nbt = mItem.getNbt();
                var list = nbtGetList('LINKED')||[];
                var pos = e.block.pos;
                list.push(JSON.stringify({
                    'x': pos.x,
                    'y': pos.y,
                    'z': pos.z
                }))
            }
        }
    }
    rollGamble(e, 3);
}

function tick(e) {
    runDelayTick();
}

function customChestClicked(e) {
    yield customChestClicked_event;
}

function timer(e) {
    yield timer_event;
}