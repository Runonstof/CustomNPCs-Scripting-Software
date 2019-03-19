var MARKET_TABLE = [];
var QUEST_TABLE = [];

var merchant_id = '';

@block load_event
	(function(e){
		var nbt = e.npc.getNbt();
		nbt.setInteger('Tier', tier);
		merchant_id = uniqid(50);
		nbt.setString('MerchantId', merchant_id);
	})(e);
@endblock

function marketSlotAddTrade(slot, cur1, cur2, sold) {
	var exists = false;
	for(i in MARKET_TABLE) {
		var trade = MARKET_TABLE[i];
		if(trade.slot == slot) {
			trade.trades[trade.trades.length] = {
				cur1: cur1,
				cur2: cur2,
				sold: sold,
			};
			exists = true;
		}
	}
	
	if(!exists) {
		MARKET_TABLE[MARKET_TABLE.length] = {
			slot: slot,
			trades: []
		};
		marketSlotAddTrade(slot, cur1, cur2, sold);
	}
}

function genCoinNote(amount, w) {
	var item = w.createItem('minecraft:paper', 0, 1);
	item.setCustomName(ccs("&aCoin Note&l"));
	item.setLore([
		ccs("&7Redeem your coins at a blacksmith!"),
		ccs("&7Value: &e"+amount.toString()+" Coins&r")
	]);
	
	item.getNbt().setInteger("Money", amount);
	return item;
}

function genQuestItem(quest, w, mId) {
	var item = w.createItem('minecraft:paper', 0, 1);
	item.setCustomName(ccs('&9'+quest.action));
	var nbt = item.getNbt();
	var questitems_nbt = [];
	var questrewards_nbt = [];
	
	var lore = [
		ccs('&r'+quest.desc),
		ccs('&7Gather the following items:'),
	];
	for(i in quest.items) {
		var qi = quest.items[i];
		questitems_nbt.push(qi.getItemNbt());
		lore.push(ccs(' &6&l'+qi.getStackSize().toString()+' &8&lX &r'+qi.getDisplayName()));
	}
	nbt.setList('questItems', questitems_nbt);
	nbt.setString('itemType', 'quest');
	nbt.setString('MerchantId', mId);
	
	lore.push(ccs('&7To receive the following items:'));
	for(i in quest.rewards) {
		var qr = quest.rewards[i];
		questrewards_nbt.push(qr.getItemNbt());
		lore.push(ccs(' &6&l'+qr.getStackSize().toString()+' &8&lX &r'+qr.getDisplayName()));
	}
	nbt.setList('questRewards', questrewards_nbt);
	
	item.setLore(lore);
	
	
	
	
	return item;
	
}

function uniqid(length=10) {
	var _CHARSET = "01234567890abcdefghijklmnopqrstuvwxyz";
	var id = "";
	
	for(var i = 0; i < length; i++) {
		var index = rrandom_range(0, _CHARSET.length-1);
		id += _CHARSET.slice(index, index+1).toString();
	}
	
	
	return id;
}

function redeemMoney(e, money) {
	if(money != null) {
		var nbt = money.getNbt();
		if(nbt.has('Money')) {
			var mn = nbt.getInteger('Money');
			
			var coins = createCoins(mn, e.player.world);
		
			for(i in coins) {
				e.player.dropItem(coins[i]);
			}
		
		}
	}
}

function genQuestToken(type, tags, w, mId) {
	var item = w.createItem('minecraft:paper', 0, 1);
	item.setCustomName(ccs("&9New Quest&r"));
	item.setLore([
		ccs("&7"+type+" Quest&r")
	]);
	item.getNbt().setList('questTags', tags);
	item.getNbt().setString('itemType', 'quest_token');
	item.getNbt().setString('MerchantId', mId);
	return item;
}

function redeemQuest(e, questitem, mId) {
	var nbt = questitem.getNbt();
	var w = e.player.world;
	
	if(!nbt.has('itemType')) {
		return false;
	} else {
		var item_type = nbt.getString('itemType');
		if(typeof(resetMarket) != typeof(undefined)) { resetMarket(e); }
		switch(item_type) {
			case 'quest_token':
				print('ID: "'+mId.toString()+'"');
				if(nbt.getString('MerchantId').toString() == mId) {
					var quest_tags = nbt.getList('questTags', 8);
					if(quest_tags == null) { quest_tags = []; }
					//Array conversion
					var TEMP_quest_tags = quest_tags;
					quest_tags = [];
					for(i in TEMP_quest_tags) { quest_tags[i] = TEMP_quest_tags[i]; }
					
					
					
					e.player.dropItem(genQuestItem(pick(getQuests(quest_tags)), w, mId));
					return true;
				} else {
					e.npc.sayTo(e.player, "Sorry, but this new quest starter belongs to another merchant!");
					return false;
				}
				break;
			
			case 'quest':
				if(nbt.getString('MerchantId') == mId) {
					//Get necessary items
					var questitems = nbt.getList('questItems', 10);
					if(questitems == null) { questitems = []; }
					//Get reward items
					var questrewards = nbt.getList('questRewards', 10);
					if(questrewards == null) { questrewards = []; }
					
					//check if has items
					for(i in questitems) {
						var qi = w.createItemFromNbt(questitems[i]);
						if(e.player.inventoryItemCount(qi) < qi.getStackSize()) {
							e.npc.say("You don't have enough "+qi.getItemName());
							return false;
						}
					}
					//player Has items
					//remove items
					for(i in questitems) {
						var qi = w.createItemFromNbt(questitems[i]);
						if(!e.player.removeItem(qi, qi.getStackSize())) { return false; }
					}
					
					//Give rewards
					for(i in questrewards) {
						var qr = w.createItemFromNbt(questrewards[i]);
						e.player.dropItem(qr);
					}
					
					return true;
					
				} else {
					e.npc.sayTo(e.player, "Sorry, but I did not give you this quest!\nPerhaps another merchant?");
					return false;
				}
				break;
			
			default:
				return false;
				break;
		}
	}
	
	return false;
	
}

function getQuests(groups) {
	var q = [];
	for(var i = 0; i < QUEST_TABLE.length; i++) {
		var qst = QUEST_TABLE[i];
		var add = true;
		
		for(g in groups) {
			if(qst.groups.indexOf(groups[g]) == -1) { add = false; }
		}
		
		if(add) {
			q.push(qst);
		}
		
	}
	
	return q;
}

function addQuest(quest) {
	QUEST_TABLE.push(quest);
	return quest;
}

@block init_event
	(function(e){
		var nbt = e.npc.getNbt();
		if(nbt.has('MerchantId')) { merchant_id = nbt.getString('MerchantId'); }
	})(e);
@endblock

@block reset_market_event

	if(typeof(resetQuests) != typeof(undefined)) { resetQuests(e); }
	if(typeof(resetMarket) != typeof(undefined)) { resetMarket(e); }
	
	var m = e.npc.getRole();
	
	
	if(e.npc.getRole().getType() == 1) {
		//Remove old trades
		for(var i = 0; i < 18; i++) { m.remove(i); }
		//Add new Trades
		for(i in MARKET_TABLE) {
			var trade = MARKET_TABLE[i];
			var newTrade = pickchance(trade.trades);
			m.set(trade.slot, newTrade.cur1, newTrade.cur2, newTrade.sold);
		}
	}
@endblock
