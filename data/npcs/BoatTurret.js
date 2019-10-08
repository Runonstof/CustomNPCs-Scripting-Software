import "core\functions.js";

import "core\math.js";

import "core\mods\noppes\Java.js";

import "core\mods\noppes\IPos.js";

import "core\players\executeCommand.js";

var NPC_TYPE = "MINIGAME_BOAT_TURRET";

function init(e) {
	var data = e.npc.getStoreddata();
	if(!data.has("NPC_TYPE")) {
		data.put("NPC_TYPE", NPC_TYPE);
	}
}

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
		if(e.player.getMount() == null && mount.getRiders().length < 2) {
			//The turret is a bit fat, so when player tries to get in boat
			//He can accidentely click the npc, so npc places player in boat in that case
			e.player.setMount(mount);
		} else {
			//Shoot
			var raypos = normalizePos(e.npc.getPos());
			var shoot = e.npc.shootItem(
				raypos.x,
				raypos.y,
				raypos.z,
				e.npc.getInventory().getProjectile()||e.npc.world.createItem("variedcommodities:spell_fire", 0, 1),
				100
			);
			shoot.setHasGravity(false);
			shoot.setAccuracy(100);
			shoot.setHeading(mount.getRotation(), 2);
			shoot.enableEvents();


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

function projectileImpact(e) {
	var target = null;
	if(e.type == 0) {
		target = e.target;
	}
	if(e.type == 1) {
		var ents = e.projectile.world.getNearbyEntities(e.projectile.getPos(), 2, 0);
		for(var en in ents as ent) {
			//Scan boats
			if(ent.getEntityName() == "Boat") {
				target = ent;
				break;
			}
		}
	}
	e.projectile.world.broadcast("IMPACT TYPE: "+e.type);

	if(target != null) {
		var npc = null;
		var player = null;
		if("getAllRiders" in target) {
			var riders = target.getAllRiders();
			for(var r in riders as rider) {
				if(rider.getType() == 1) { player = rider; }
				if(rider.getType() == 2) { npc = rider; }
			}
			if(npc != null && player != null) {
				e.projectile.world.broadcast("Hit a boat with player!");
			}

		}

	}
}
