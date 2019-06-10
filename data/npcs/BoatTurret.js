import core\functions.js;

import core\math.js;

import core\mods\noppes\Java.js;

import core\mods\noppes\IPos.js;

import core\players\executeCommand.js;

function damaged(e) {
	yield damaged_event;
	e.npc.world.broadcast("IM HIT");
	e.setCanceled(true);
}

function interact(e){
	//the npc is fat, so player can also interact while inside boat
	yield interact_event;

	var mount = e.npc.getMount();

	if(mount != null) {//if Npc is in boat
		if(e.player.getMount() == null) {
			//The turret is a bit fat, so when player tries to get in boat
			//He can accidentely click the npc, so npc places player in boat in that case
			e.player.setMount(mount);
		} else {
			//Shoot
			var raypos = normalizePos(e.npc.getPos());
			var shoot = e.npc.shootItem(
				raypos.x,
				raypos.y-2,
				raypos.z,
				e.npc.world.createItem("variedcommodities:spell_fire", 0, 1),
				100
			);
			shoot.setHasGravity(false);
			shoot.setHeading(mount.getRotation(), 9);

			//executeCommand(e.player, "/tellraw @a "+strf("&cPew!"));
		}
	} else {
		var newMount = e.npc.world.createEntity("minecraft:boat");
		newMount.setPos(e.npc.getPos());
		var nmnbt = newMount.getEntityNbt();
		nmnbt.setBoolean("Invulnerable", true);
		newMount.setEntityNbt(nmnbt);
		newMount.spawn();
		e.npc.setMount(newMount);
	}
}
