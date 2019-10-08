import "core\blocks\blockTextured.js";
import "core\blocks\blockConfigurable.js";

function init(e){
	var config = {
		"ignorePlayer": "bool|true"
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
    if( !JSON.parse(e.block.getStoreddata().get("config")).ignorePlayer || e.entity.getType()!=EntityType_PLAYER )
        e.entity.kill();
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

function customChestClicked(e) {
    yield customChestClicked_event;
}
