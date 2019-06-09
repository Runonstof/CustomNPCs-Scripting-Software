import core\math.js;

function init(e){
	yield init_event;
}

function load(e) {
	yield load_event;
}

function interact(e){
	yield interact_event;
	if(e.npc.getAllRiders().length == 0) {
        e.npc.addRider(e.player);
    }
}

function timer(e){
	yield timer_event;
}

function tick(e){
	yield tick_event;
	var rid = e.npc.getAllRiders();
    if(rid.length >= 1) {
		if(rid[0].getType() == 1) {
			var ridrot = rid[0].getRotation();
			e.npc.setRotation(ridrot);
			var mf = rid[0].getMoveForward();
			if(mf != 0) {
				e.npc.setMotionX(lengthdir_x(2, ridrot)*-sign(mf));
				e.npc.setMotionZ(lengthdir_z(2, ridrot)*sign(mf));
			}
			var mv = rid[0].getMoveVertical();
		}
    }
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
