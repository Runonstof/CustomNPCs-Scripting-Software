
function getPlayerInvFromNbt(pnbt, w) {
	var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
	var pinv = pnbt.getList('Inventory', pnbt.getListType('Inventory'));
	var pitems = [];
	for(p in pinv as pin) {
		var pitm = w.createItemFromNbt(API.stringToNbt(pin.toJsonString()));
		pitems.push(pitm);
	}
	
	return pitems;
}

function getInvItemCount(pnbt, itemstack, w) {
	var itnbt = itemstack.getItemNbt();
	itnbt.remove('Count');
}


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
	var role = e.npc.getRole();
	var pinv = getPlayerInvFromNbt(e.player.getEntityNbt(), e.player.world);
	if(role.getType() == 1) {
		var currencies = [
			e.currency1 != null ? e.currency1.getName(): 'minecraft:air',
			e.currency2 != null ? e.currency2.getName(): 'minecraft:air',
		];
		var hasCurs = [
			e.currency1 == null,
			e.currency2 == null,
		];
		
		for(c in currencies as currn) {
			print((e.currency1 != null ? e.currency1.getItemNbt().toJsonString():''));
			print((e.currency2 != null ? e.currency2.getItemNbt().toJsonString():''));
			pinv.forEach(function(pin){
				if(pin.getName() == currn) {
					hasCurs[c] = true;
				}
			});
		}
		
		if(!hasCurs[0] || !hasCurs[1]) {
			e.setCanceled(true);
		}
	}
}
