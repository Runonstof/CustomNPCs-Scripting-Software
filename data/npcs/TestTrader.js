
function init(e){
	yield init_event;
}

function load(e) {
	yield load_event;
}

function interact(e){
	yield interact_event;
	var r = e.npc.getRole();
	var emerald = e.npc.world.createItem('minecraft:emerald', 0, 1);
	var diamond = e.npc.world.createItem('minecraft:diamond', 0, 1);
	var dirt = e.npc.world.createItem('minecraft:dirt', 0, 1);
	if(r.getType() == 1) {
		r.set(1, emerald, diamond, dirt);
		e.npc.getTimers().forceStart(1, 100, false);
	}
}

function timer(e){
	yield timer_event;
	
	if(e.id == 1) {
		var r = e.npc.getRole();
		var emerald = e.npc.world.createItem('minecraft:emerald', 0, 1);
		var diamond = e.npc.world.createItem('minecraft:diamond', 0, 1);
		var dirt = e.npc.world.createItem('minecraft:dirt', 0, 1);
		if(r.getType() == 1) {
			r.set(1, dirt, emerald, diamond);
		}
	}
}

function tick(e){
	
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
