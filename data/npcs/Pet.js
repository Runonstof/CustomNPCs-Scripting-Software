import core\functions.js;
import core\npcs\moreEvents.js;

var NPC = {
	"OWNER": "",
	"HP_BASE": 20,
	"HP_INCR": 0.2, //Grows 1 in size every 5 levels
	"SIZE_BASE": 2,
	"SIZE_INCR": 0.2,
	"LEVEL": 1,
	"MAX_LEVEL": 255,
};

function init(e){
	yield init_event;
}

function load(e) {
	yield load_event;
}

function interact(e){
	yield interact_event;
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
