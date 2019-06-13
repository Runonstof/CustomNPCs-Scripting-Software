import core\blocks\blockTextured.js;
import core\blocks\blockConfigurable.js;
import core\players\commands\menuCommands.js;

function init(e){
	var config = {
		"effect": "string|25|2|15"
	};
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
	var effectInfo = JSON.parse(e.block.getStoreddata().get("config")).effect.split("|");
    e.entity.addPotionEffect(effectInfo[0], effectInfo[1], effectInfo[2], true);
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
