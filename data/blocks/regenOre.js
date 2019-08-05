import core\mods\minecraft\*.js;
import core\mods\noppes\*.js;
import core\JavaScript\*.js;
import core\utils\ServerConfigHandler.js;
import core\players\executeCommand.js;
import core\players\tell.js;

var REGEN_BLOCK = '{id:"minecraft:iron_ore",Count:1b,Damage:0s}';
var MODEL_BLOCK = '{id:"minecraft:stone",Count:1b,Damage:0s}'
var COOLDOWN_BLOCK = '{id:"minecraft:cobblestone",Count:1b,Damage:0s}';
var LAST_REGEN = 0;
var LAST_BLOCK = null;
var REGEN_TIME = 5000;

var REGEN_SIDE = SideType_UP;

var sides = [
	"down",
	"up",
	"north",
	"south",
	"west",
	"east"
];



function updateBlockData(block) {
	var data = block.getStoreddata();
	data_register(data, {
		"REGEN_BLOCK": REGEN_BLOCK,
		"MODEL_BLOCK": MODEL_BLOCK,
		"COOLDOWN_BLOCK": COOLDOWN_BLOCK,
		"REGEN_TIME": REGEN_TIME,
		"REGEN_SIDE": REGEN_SIDE,
	});

	REGEN_BLOCK = data.get("REGEN_BLOCK");
	MODEL_BLOCK = data.get("MODEL_BLOCK");
	COOLDOWN_BLOCK = data.get("COOLDOWN_BLOCK");
	REGEN_TIME = data.get("REGEN_TIME");
	REGEN_SIDE = data.get("REGEN_SIDE");
}

function interact(e) {
	if(e.player.getGamemode() == 1) {
		var mItem = e.player.getMainhandItem();
		if(mItem.getName() == "minecraft:name_tag") {
			var cblock = nbtToItem(e.block.world, COOLDOWN_BLOCK);
			var rblock = nbtToItem(e.block.world, REGEN_BLOCK);
			var mblock = nbtToItem(e.block.world, MODEL_BLOCK);

			var data = e.block.getStoreddata();
			var cmd = mItem.getDisplayName();
			var opt = cmd.match(/(\w+)(?::([\w\W]+))?/)||[];
			var oItem = e.player.getOffhandItem();
			if(opt[1]) {
				var prop = opt[1];
				switch(prop) {
					case "REGEN": {
						LAST_REGEN = 0;
						break;
					}
					case "REGEN_SIDE": {
						data.put("REGEN_SIDE", e.side);
						break;
					}
					case "REGEN_BLOCK": {
						if(oItem.isBlock()) {
							data.put("REGEN_BLOCK", oItem.getItemNbt().toJsonString());
						}
						break;
					}
					case "COOLDOWN_BLOCK": {
						if(oItem.isBlock()) {
							data.put("COOLDOWN_BLOCK", oItem.getItemNbt().toJsonString());
						}
						break;
					}
					case "REGEN_TIME": {
						if(opt[2]) { data.put("REGEN_TIME", getStringTime(opt[2])); }
						break;
					}
					case "MODEL_BLOCK": {
						if(oItem.isBlock()) {
							data.put("MODEL_BLOCK", oItem.getItemNbt().toJsonString());
						}
						break;
					}
					case "INFO": {
						var infotxt = [
							"&l[======]&r &a&lRegen Ore Info &l[=======]",
							"&6Regen Time: &e"+getTimeString(REGEN_TIME),
						];
						tellPlayer(e.player, infotxt.join("\n"));
						break;
					}
					case "COPY": {
						var blockItem = e.player.world.createItem("customnpcs:npcscripted", 0, 1);
						blockItem.setCustomName(ccs("&3"+rblock.getDisplayName()+" ("+sides[REGEN_SIDE]+")"));
						blockItem.setLore([
							ccs("&6Regen Time: &e"+getTimeString(REGEN_TIME)),
							ccs("&6Cooldown Block: &e"+cblock.getDisplayName()),
							ccs("&6Model Block: &e"+mblock.getDisplayName()),
						]);

						blockItem.getNbt().setCompound("BlockEntityTag", e.block.getTileEntityNBT());
						e.player.giveItem(blockItem);
						break;
					}
				}

				tellPlayer(e.player, "&aChanged property '"+prop+"'!");
			}
		}
		updateBlockData(e.block);
	}
}

function nbtToItem(w, nbt) {
	return w.createItemFromNbt(API.stringToNbt(nbt));
}

function init(e) {
	updateBlockData(e.block)
	e.block.setHardness(999);
}

function timer(e) {
	if(e.id == 1) {
		var dropItems = e.block.world.getNearbyEntities(e.block.getPos(), 2, EntityType_ITEM);
		for(var d in dropItems) {
			if(dropItems[d].getName() == e.block.world.createItemFromNbt(e.API.stringToNbt(COOLDOWN_BLOCK)).getName()) {
				dropItems[d].despawn();
			}
		}

	}
}

function tick(e) {
	var blockPos = e.block.getPos().offset(REGEN_SIDE);
	var block = e.block.world.getBlock(blockPos.x, blockPos.y, blockPos.z);

	var cblock = nbtToItem(e.block.world, COOLDOWN_BLOCK);
	var rblock = nbtToItem(e.block.world, REGEN_BLOCK);
	var mblock = nbtToItem(e.block.world, MODEL_BLOCK);

	if(e.block.getModel().getName() != mblock.getName()) { e.block.setModel(mblock); }

	var now = new Date().getTime();

	if(block !=null) {
		if(now < LAST_REGEN+REGEN_TIME) {
			if(block.getName() != cblock.getName() && block.getName() != rblock.getName()) {
				e.block.world.setBlock(blockPos.x, blockPos.y, blockPos.z, cblock.getName(), cblock.getItemDamage());
			}
		} else {
			if(block.getName() != rblock.getName()) {
				e.block.world.setBlock(blockPos.x, blockPos.y, blockPos.z, rblock.getName(), rblock.getItemDamage());
				var rwblock = e.block.world.getBlock(blockPos.x, blockPos.y, blockPos.z);
				if(rblock.getNbt().getCompound("tag").has("BlockEntityTag")) {
					rwblock.setTileEntityNBT(rwblock.getTileEntityNBT().merge(rblock.getNbt().getCompound("tag").getCompound("BlockEntityTag")));
				}
			}

		}
	}
}


//When block next to it mines
function neighborChanged(e) {
	var now = new Date().getTime();
	if(now < LAST_REGEN+REGEN_TIME) {
		//e.block.getTimers().forceStart(1, 10, false);
		var dropItems = e.block.world.getNearbyEntities(e.block.getPos(), 2, EntityType_ITEM);
		for(var d in dropItems) {
			if(dropItems[d].getName() == e.block.world.createItemFromNbt(e.API.stringToNbt(COOLDOWN_BLOCK)).getName()) {
				dropItems[d].despawn();
			}
		}
	} else {
		LAST_REGEN = now;
	}
}
