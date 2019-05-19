{%set SERVER_CONFIG=gramados%}

import core\config\%SERVER_CONFIG%\*.js;
import core\npcs\moreEvents.js;
import core\functions.js;
import core\players\commands\utilCommands.js;

function init(e){
	yield init_event;
}

function load(e) {
	yield load_event;
}

function interact(event){
	var pl = event.player, inv = pl.getInventory(), hand = pl.getMainhandItem(), trader = event.npc.getRole(), profit = 0, mult = 1, curCountF = 0, curCountS = 0;

	if(!pl.isSneaking()) return;
	event.setCanceled(true);
	if(hand && hand.getName()=="backpacks16840:backpack") {
		var bp = getBackpackInv(pl, hand);
		//IItemStack[] backpack items
		var bpItems = getIItemStackArray(bp.items);
	}
	//Trader's inventory cycle
	for(var i=0;i<18;i++){
		if(bp){
			//same as below but for backpack items array
			curCountF = getArrItemCount(bpItems, trader.getCurrency1(i));
			curCountS = getArrItemCount(bpItems, trader.getCurrency2(i));
		} else {
			curCountF = pl.inventoryItemCount(trader.getCurrency1(i));
			curCountS = pl.inventoryItemCount(trader.getCurrency2(i));
		}
		if((!trader.getCurrency1(i).isEmpty() && curCountF >= trader.getCurrency1(i).getStackSize()) || (!trader.getCurrency2(i).isEmpty() && curCountS >= trader.getCurrency2(i).getStackSize())){
			//Multipiler. Operations per trade actually
			//+ Silly way to fix bug
			if(!trader.getCurrency1(i).isEmpty()){
				mult = curCountF / trader.getCurrency1(i).getStackSize();
				if(!(parseInt(mult) === mult)) {
					curCountF = curCountF - (curCountF % trader.getCurrency1(i).getStackSize());
					mult = Math.floor(mult);
				}
			} else {
				mult = curCountS / trader.getCurrency2(i).getStackSize();
				if(!(parseInt(mult) === mult)) {
					curCountS = curCountS - (curCountS % trader.getCurrency2(i).getStackSize());
					mult = Math.floor(mult);
				}
			}

			//Adding to profit variable how much does it cost
			profit += getCoinAmount(trader.getSold(i).getLore()[0].replace(/\s+/g, '')) * trader.getSold(i).getStackSize() * mult;
			if(!trader.getCurrency1(i).isEmpty())
				if(bp) {
					//same as below but for backpack items array
					bp.items = getMCItemStackArray(arrayItemRemove(bpItems, trader.getCurrency1(i), curCountF));
					bp.saveInventory();
				} else
					pl.removeItem(trader.getCurrency1(i), curCountF);
			if(!trader.getCurrency2(i).isEmpty())
				if(bp) {
					//same as below but for backpack items array
					bp.items = getMCItemStackArray(arrayItemRemove(bpItems, trader.getCurrency2(i), curCountS));
					bp.saveInventory();
				} else
					pl.removeItem(trader.getCurrency2(i), curCountS);
		}
	}
	//You know that part. Stolen from your code XD Will give player his profit
	var pm = genMoney(pl.getWorld(), profit);
	for(var p in pm) {
		var pii = pm[p];
		pl.giveItem(pii);
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
}
