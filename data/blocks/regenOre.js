import "core/mods/minecraft/*.js";
import "core/mods/noppes/*.js";
import "core/JavaScript/*.js";
import "core/players/executeCommand.js";
import "core/players/tell.js";
import "core/utils/GenBook.js";
import "core/utils/RunDelay.js";

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
					//Force regeneration
					case "REGEN": {
						LAST_REGEN = 0;
						break;
					}
					//Set side
					case "REGEN_SIDE": {
						data.put("REGEN_SIDE", e.side);
						break;
					}
					//Set block to regen
					case "REGEN_BLOCK": {
						if(oItem.isBlock()) {
							data.put("REGEN_BLOCK", oItem.getItemNbt().toJsonString());
						}
						break;
					}
					//Set model of block when its still waiting for cooldown
					case "COOLDOWN_BLOCK": {
						if(oItem.isBlock()) {
							data.put("COOLDOWN_BLOCK", oItem.getItemNbt().toJsonString());
						}
						break;
					}
					//Cooldown time
					case "REGEN_TIME": {
						if(opt[2]) { data.put("REGEN_TIME", getStringTime(opt[2])); }
						break;
					}
					//Set model of block when cooldown reached
					case "MODEL_BLOCK": {
						if(oItem.isBlock()) {
							data.put("MODEL_BLOCK", oItem.getItemNbt().toJsonString());
						}
						break;
					}
					//Info about regen ore
					case "INFO": {
						var infotxt = [
							"&l[======]&r &a&lRegen Ore Info &l[=======]",
							"&6Regen Time: &e"+getTimeString(REGEN_TIME),
							"&6Cooldown Block: &e"+cblock.getDisplayName(),
							"&6Model Block: &e"+mblock.getDisplayName(),
							"&6Regen Block: &e"+rblock.getDisplayName()
						];
						tellPlayer(e.player, infotxt.join("\n"));
						break;
					}
					//Get regen ore block as item
					case "COPY": {
						var blockItem = e.player.world.createItem("customnpcs:npcscripted", 0, 1);
						blockItem.setCustomName(ccs("&3"+rblock.getDisplayName()+" ("+sides[REGEN_SIDE]+")"));
						blockItem.setLore([
							ccs("&6Regen Time: &e"+getTimeString(REGEN_TIME)),
							ccs("&6Cooldown Block: &e"+cblock.getDisplayName()),
							ccs("&6Model Block: &e"+mblock.getDisplayName()),
							ccs("&6Regen Block: &e"+rblock.getDisplayName())
						]);

						blockItem.getNbt().setCompound("BlockEntityTag", e.block.getTileEntityNBT());
						e.player.giveItem(blockItem);
						break;
					}
					//Gen help book
					case "HELP": {
						var helptxt = 
							"#TITLE &6&lRegen Ore Manualll\n"+
							"#AUTHOR &2&oRunonstof\n"+
							"&0&lREGEN BLOCK\n\n"+
							"\&0This is the manual of how\n"+
							"to configure your regen block\n\n"+
							"Goto next page to get started\n"+
							"#ENDPAGE \n"+
							"&0&lCONFIGURATION\n"+
							"&0Rename a &0&oName Tag&0 with\n"+
							"One of these: (and right click)\n\n"+
							"&8&oHELP &4&l[?]{*|show_text:$7Gives you this book...}&0\n"+
							"&8&oREGEN &4&l[?]{*|show_text:$7Sets the cooldown back to 0, block regens.\nI assume if you wanna test things youre not gonna wait ;-)}&0\n"+
							"&8&oREGEN_SIDE &4&l[?]{*|show_text:$7Sets this side of the block the side where the block regens\n$7$oMulti sides support in 2.0}&0\n"+
							"&0&o\nMore on next page\n"+
							"#ENDPAGE\n"+
							"&8&oREGEN_BLOCK &4&l[?]{*|show_text:$7Sets the $7$oblock in your offhand$7 as regen block, like iron ore.}&0\n"+
							"&8&oCOOLDOWN_BLOCK &4&l[?]{*|show_text:$7Sets the $7$oblock in your offhand$7 as cooldown block.\nThis block will be in the place of regen block when its waiting for cooldown.}&0\n"+
							"&8&oREGEN_TIME:&8&o&lTIME &4&l[?]{*|show_text:$7Sets regen time.\n\n$7$lTIME NOTATION\n$7$o2y4mon3d6h8min3s800ms\n$7or can be as simple as $7$o5min}&0\n"+
							"&8&oMODEL_BLOCK &4&l[?]{*|show_text:$7Sets the $7$oblock in your offhand$7 as model of $7$oregen block itself}&0\n"+
							"&8&oINFO &4&l[?]{*|show_text:$7Outputs info about regen block in chat}&0\n"+
							"&8&oCOPY &4&l[?]{*|show_text:$7Gives the regen block to you as item so you can place more blocks with the same settings!}&0\n"
							;
						var helpbook = generateBook(e.block.world, helptxt);
						e.player.giveItem(helpbook);
						break;
					}

				}

				tellPlayer(e.player, "&aChanged property '"+prop+"'!");
			}
		} else {
			tellPlayer(e.player, "&eUse a nametag &e&othat is renamed to HELP{*|show_text:$6Hey you found me, madlad\n$6$oMade by Runonstof}&r&e to see more details for regen ore.");
		}
		updateBlockData(e.block);
	}
}
/*
{"extra":[{"bold":true,"color":"black","text":"REGEN BLOCK\n\n"},{"color":"black","text":"This is the manual of how\nto configure your regen block\n\nGoto next page to get started"}],"text":""}
*/
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
var placeFired = false;
function tick(e) {
	var blockPos = e.block.getPos().offset(REGEN_SIDE);
	var block = e.block.world.getBlock(blockPos.x, blockPos.y, blockPos.z);

	var cblock = nbtToItem(e.block.world, COOLDOWN_BLOCK);
	var rblock = nbtToItem(e.block.world, REGEN_BLOCK);
	var mblock = nbtToItem(e.block.world, MODEL_BLOCK);

	if(e.block.getModel().getName() != mblock.getName()) { e.block.setModel(mblock); }

	var now = new Date().getTime();
	

	if(block !=null) {
		if(now < LAST_REGEN+REGEN_TIME) {//cooldown block
			if(block.getName() != cblock.getName() && block.getName() != rblock.getName()) {
				e.block.world.setBlock(blockPos.x, blockPos.y, blockPos.z, cblock.getName(), cblock.getItemDamage());
			}
		} else {//regen block
			if(rblock.getNbt().has("BlockEntityTag")) {

				var bet = rblock.getItemNbt().getCompound("tag").getCompound("BlockEntityTag");

				if(!placeFired && (!block.hasTileEntity()||!bet.isEqual(block.getTileEntityNBT())||false)) {
					//
				
					var rwblock = e.API.getIBlock(e.block.world.getMCWorld(), blockPos.getMCBlockPos());
					placeFired = true;
					//execute 30 ticks later
					//TODO: set blockentity nbt
					runDelay(e.block.getTimers(), 1.5, function(){
							placeFired = false;
							var _rwblock = e.API.getIBlock(e.block.world.getMCWorld(), blockPos.getMCBlockPos());
							//print("NAME "+_rwblock.getName());
							//print("REGEN4");
							if(_rwblock&&_rwblock.hasTileEntity()) {
								var newNbt = _rwblock.getTileEntityNBT();
								newNbt.merge(bet);
								_rwblock.setTileEntityNBT(newNbt);
							}
								
						
					});
					//set the block
					rwblock.setBlock(rblock.getName());

					
					
				}
			} else {
				var rwblock = e.API.getIBlock(e.block.world.getMCWorld(), blockPos.getMCBlockPos());
				rwblock.setBlock(rblock.getName());
			}
		}
	}
}
//Test
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


function timer(e) {
	yield timer_event;
}