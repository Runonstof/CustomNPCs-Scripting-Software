import core\functions.js;
import core\players\executeCommand.js;
import core\players\tell.js;


function init(e){
	yield init_event;
}

function load(e) {
	yield load_event;
}

function interact(e){
	yield interact_event;
	if(e.npc.getRole().getType() == 1 && e.player.getGamemode() == 1) {
		tellPlayer(e.player, "&cYou cannot trade with this trader in creative mode!");
		e.setCanceled(true);
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
	var w = e.player.world;
	var pnbt = e.player.getEntityNbt();
	var npcnbt = e.npc.getEntityNbt();

	var tradeIgnoreNbt = (parseInt(npcnbt.getByte('TraderIgnoreNBT')) == 1);
	var role = e.npc.getRole();
	if(role.getType() == 1) {
		if(e.isCancelable()) {
			if(e.sold != null) {
				var canTrade = true;
				var currency = [
					e.currency1,
					e.currency2,
				];

				for(c in currency as crncy) {
					if(crncy != null) {
						var reqamount = crncy.getStackSize();
						if(getInvItemCount(pnbt, crncy, w, tradeIgnoreNbt) < reqamount) {
							canTrade = false;
						}
					}
				}

				if(canTrade) {
					for(c in currency as crncy) {
						if(crncy != null) {
						
							e.player.removeItem(crncy, crncy.getStackSize());

						}
					}
					e.player.giveItem(e.sold);
				}

				e.setCanceled(true);
			}
		}
	}
}
