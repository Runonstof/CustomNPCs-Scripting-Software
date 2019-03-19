import core\functions.js;
import core\blocks\regenOre.js;

function init(e){
	yield init_event;
}

function interact(e){
	yield interact_event;
}

function tick(e){
	yield tick_event;
}

function broken(e){
	yield broken_event;
}

function clicked(e){
	yield clicked_event;
}

function collide(e){
	yield collide_event;
}

function doorToggle(e){
	yield doorToggle_event;
}

function fallenUpon(e){
	yield fallenUpon_event;
}

function exploded(e){
	yield exploded_event;
}

function harvested(e){
	yield harvested_event;
}

function neighborChanged(e){
	yield neighborChanged_event;
}

function rainFilled(e){
	yield rainFilled_event;
}

function redstone(e){
	yield redstone_event;
}

function timer(e){
	yield timer_event;
}
