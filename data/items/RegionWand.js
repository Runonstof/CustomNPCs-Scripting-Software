import core\functions.js;

var ITEM_TEXTURE_ID = 1;

function attack(e){
	yield attack_event;
}

function init(e){
	yield init_event;
	e.item.setItemDamage(ITEM_TEXTURE_ID);
	e.item.setTexture(ITEM_TEXTURE_ID, 'variedcommodities:wooden_staff');
	e.item.setDurabilityShow(false);
}

function interact(e){
	yield interact_event;
}

function pickedUp(e){
	yield pickedUp_event;
}

function spawn(e){
	yield spawn_event;
}

function toss(e){
	yield toss_event;
}

function tick(e){
	yield tick_event;
}
