import core\deobf\*.js;
import core\math.js;
import core\utils\World.js;


//FLY SETTINGS
//Pitch is 90 when player looks fully down
var FLY_MIN_PITCH = 10; //(if on 20, then: when player pitch is above 20 or below -20 the npc will fly up/down)
var FLY_SPEED = 2;

//Without these settings, controlled npc flight is very, very quirky
	//I tested it all out, some I dont understand why, but tested with on/off and does make the difference
var aiUpdate = {
	//Set moving type to standing
	"MovingType": 0,
	//Set body rotation to manual
	"StandingType": 1,
	//Set stop on interact to false
	"StopOnInteract": false,
	//Set returns home to false
	"ReturnsHome": false,
};

//Function to set the settings for an npc so they can fly/can be controlled properly
function updateNpcSettings(npc) {
	var npcAi = npc.getAi();

	//For tick friendlyness, i hope, tick is hostile by itself
	var hasChanged = false;

	//If we are gonna set something (like standing type, returns home etc), we are gonna check if it is not already that, to make it tick-friendly
	//(why set something to 2 when its already 2)

	for(var a in aiUpdate) { //Loop all keys we wanna update
		var au = aiUpdate[a];
		if(npcAi["get"+a]() != au) { //if the key is not value we want
			npcAi["set"+a](au); //Set the value
			hasChanged = true;
		}
	}
	//tick-friendlyness
	if(hasChanged) {
		npc.updateClient();
		npc.reset();
	}

}

function npcSetNavType(npc, type) {
	var npcAi = npc.getAi();
	//Temp fix
	var types = [
		0,
		1,
		2,
	];
	var ti = types.indexOf(npcAi.getNavigationType());
	while(npcAi.getNavigationType() != type) {
		npcAi.setNavigationType(types[ti]);
		ti = (ti+1 == types.length ? 0 : ti+1);
	}

}

function init(e) {
	updateNpcSettings(e.npc);
}



function interact(e) {
	if(e.player.isSneaking()) { //let the dragon switch between flying/standing
		var npcAi = e.npc.getAi();

		npcSetNavType(e.npc, (e.npc.getAi().getNavigationType() == 1 ? 0 : 1));

	} else {//if not sneaking
		if(e.npc.getRiders().length == 0 && e.player.getMount() == null) {
			//If npc has no riders and player is not sitting on something
			e.npc.addRider(e.player);//set the player as rider
		} else {
			e.npc.say("OOF");
		}

	}
}

function tick(e) {
	updateNpcSettings(e.npc);
	var riders = e.npc.getRiders();
	for(var r in riders as rider) { //Loop the riders on npc

		if(rider.getType() == 1) { //If the rider is an player
			//e.npc.setPitch(rider.getPitch());
			e.npc.setRotation(rider.getRotation()); //Set rotation for fly-direction
			var ms = rider.getMoveStrafing();
			if(ms != 0) {
				FLY_SPEED = Math.min(Math.max(FLY_SPEED+.25*sign(ms), 1), 8);
			}
			var mf = Math.round(rider.getMoveForward()); //Will be 1 when pressed W and -1 when S is pressed (or other key, depends on ur controls config)
			var mv = rider.getPitch(); //-90 when player looks up, 90 when player looks down
			var rot = fixAngle(rider.getRotation());
			if(mf != 0) {
				//e.npc.navigateTo(e.npc.getX()+lengthdir_x(4, rot), e.npc.getY(), e.npc.getZ()+lengthdir_z(4, rot), 5);
				e.npc.setMotionX(-lengthdir_x(FLY_SPEED-(FLY_SPEED/90*Math.abs(mv)), fixAngle(rider.getRotation()+90))*sign(mf));
				e.npc.setMotionZ(lengthdir_z(FLY_SPEED-(FLY_SPEED/90*Math.abs(mv)), fixAngle(rider.getRotation()+90))*sign(mf));

				//worldOut(e.npc.getMotionX()+" -- "+e.npc.getMotionZ());
				//e.npc.setMoveForward(rider.getMoveForward());

				//e.npc.setMoveForward(rider.getMoveForward()); //Set moveForward of npc, the npc will moce in direction it looks
				if(e.npc.getAi().getNavigationType() == 1) {
					if(Math.abs(mv) > FLY_MIN_PITCH) {
						e.npc.setMotionY((((FLY_SPEED/2)/90*Math.abs(mv))*-sign(mv))*sign(mf));
					}
				}
			} else if(e.npc.getMoveForward() != 0) {
				e.npc.setMoveForward(0);
			}

			break;//exit for-loop
		}
	}
}
