var npcSettings = {
	"Stats": {
		"MaxHealth": 20,
		"HealthRegen": 0,
		"AggroRange": 24,
		"CreatureType": 1, //Undede
		"RespawnType": 0, //"Yes",
		"RespawnTime": 86400,
		"HideDeadBody": true,
	},
	"Ai": {
		"StopOnInteract": false,
		"ReturnsHome": false,
	},
	"Display": {
		"Size": 5,
	}
};

//
@block npc_tick_event
    //
    updateNpc(e.npc);
@endblock

function updateNpc(npc) {
	var hasChanged = false;

	for(var getname in npcSettings) {
		var getter = npc['get'+getname](); //result of: npc.getDisplay(), npc.getAi(), ...
		for(var setting in npcSettings[getname]) { //Loop settings, variable 'setting' =key
			var value = npcSettings[getname][setting]; //value of setting

			if(getter['get'+setting]() != value) { //if current (ai,display,...) setting is not wanted value

                getter['set'+setting](value); //Update value of current (ai,display,...) setting
				hasChanged = true; //Mark updated
			}
		}
	}
	if(hasChanged) { //Npc only resets now when something has changed, no unneccesary updates
		//npc.reset();
	}
}
