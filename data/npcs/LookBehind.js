import core\math.js;

//

function init(e){
	yield init_event;
}

function load(e) {
	yield load_event;
}

function interact(e){
	yield interact_event;
	var npcRot = fixAngle(Math.abs(e.npc.getRotation())) % 360;
	var pRot = e.player.getRotation();
	var posAngle = fixAngle(getPosAngle(e.npc.getX(), e.npc.getZ(), e.player.getX(), e.player.getZ())+180+(npcRot-90))-180;

	//A "Behind-my-back-look"-code of 90 dregrees total
	if(Math.abs(posAngle) < 45) {
		e.npc.say("You are behind me!");
	}


}

function timer(e){
	yield timer_event;
}

function tick(e){
	yield tick_event;
}

function collide(e){
	yield collide_event;
}

function damaged(e){
	yield damaged_event;
}

function died(e){
	yield died_event;
}

function kill(e){
	yield kill_event;
}

function meleeAttack(e){
	yield meleeAttack_event;
}

function rangedAttack(e){
	yield rangedAttack_event;
}

function target(e){
	yield target_event;
}

function targetLost(e){
	yield targetLost_event;
}

function role(e){
	yield role_event;
}
