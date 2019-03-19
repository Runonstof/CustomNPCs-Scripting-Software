#template Player data\players;
import core\players\moreEvents.js;

function init(e) {
	yield init_event;
}

function interact(e) {
	yield interact_event;
}

function keyPressed(e) {
	yield keyPressed_event;
}

function build(e, placeblock) { //Custom event
	yield build_event;
}

function kill(e) {
	yield kill_event;
}

function login(e) {
	yield login_event;
}

function logout(e) {
	yield logout_event;
}

function pickedUp(e) {
	yield pickedUp_event;
}

function rangedLaunched(e) {
	yield rangedLaunched_event;
}

function timer(e) {
	yield timer_event;
}

function toss(e) {
	yield toss_event;
}

function tick(e) {
	yield tick_event;
}

function attack(e) {
	yield attack_event;
}

function broken(e) {
	yield broken_event;
}

function chat(e) {
	yield chat_event;
}

function containerOpen(e) {
	yield containerOpen_event;
}

function containerClose(e) {
	yield containerClose_event;
}

function damagedEntity(e) {
	yield damagedEntity_event;
}

function damaged(e) {
	yield damaged_event;
}

function died(e) {
	yield died_event;
}

function factionUpdate(e) {
	yield factionUpdate_event;
}