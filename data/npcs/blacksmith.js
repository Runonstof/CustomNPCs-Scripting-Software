import mods\compatskills.js;
import core\functions.js;
import core\npcs\npc.js;
import core\npcs\homeSpawn.js;
import core\npcs\makeInvulnerable.js;
import core\npcs\trader.js;

var tier = 0;
var tier_skins = [
	'minecraft:textures/entity/iron_golem.png',
	'thc:textures/gold_golem.png',
	'thc:textures/diamond_golem.png',
	'thc:textures/emerald_golem.png'
];
var market_cooldown = 24000*7;
var market_cooldown_base = market_cooldown;


function init(e) {
	yield init_event;
	
	//Handle Standard NBT
	var nbt = e.npc.getNbt();
	if(!nbt.has('Tier')) {
		nbt.setInteger('Tier', 0);
	} else {
		tier = nbt.getInteger('Tier');
		market_cooldown = market_cooldown_base - (tier * (market_cooldown_base / tier_skins.length));
	}
	
}

function tick(e) {
	yield tick_event;
	
	//Check tier skin
	var disp = e.npc.getDisplay();
	if(disp.getSkinTexture() != tier_skins[tier]) {
		disp.setSkinTexture(tier_skins[tier]);
	}
	if(market_cooldown != (market_cooldown_base - (tier * (market_cooldown_base / tier_skins.length)))) {
		market_cooldown = market_cooldown_base - (tier * (market_cooldown_base / (tier_skins.length*2)));
	}
}

function load(e) {
	yield load_event;
	tier = pickchance([
		[0, 8],
		[1, 4],
		[2, 2],
		[3, 1],
	]);
	e.npc.getDisplay().setSkinTexture(tier_skins[tier]);
	var nbt = e.npc.getNbt();
	
	var data = e.npc.getStoreddata();
	nbt.setInteger('Tier', tier);
	merchant_id = uniqid(50);
	nbt.setString('MerchantId', merchant_id);
	
	yield reset_market_event;
	
	data.put('last_market_reset', e.npc.world.getTime());

}

function resetMarket(e) {
	var w = e.npc.world;

	MARKET_TABLE = [
		{
			slot: 0,
			trades: [
				import %npcs%\trades\gemsToCoins.js;
			]
		},
		{
			slot: 2, //Sell Items
			trades: [
				import %npcs%\trades\mobDrops.js;
			]
		},
		{
			slot: 3,
			trades: [
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(24, 36)),
					cur2: null,
					sold: w.createItem('minecraft:iron_ingot', 0, rrandom_range(3, 8)),
				},
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(24, 32)),
					cur2: null,
					sold: w.createItem('forestry:ingot_copper', 0, rrandom_range(2, 10)),
				},
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(20, 32)),
					cur2: null,
					sold: w.createItem('forestry:ingot_tin', 0, rrandom_range(2, 10)),
				},
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(28, 42)),
					cur2: null,
					sold: w.createItem('forestry:ingot_bronze', 0, rrandom_range(3, 8)),
				},
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(16, 28)),
					cur2: null,
					sold: w.createItem('twilightforest:ironwood_ingot', 0, rrandom_range(2, 6)),
				},
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(48, 72)),
					cur2: null,
					sold: w.createItem('twilightforest:fiery_ingot', 0, rrandom_range(2, 6)),
				},
				{
					cur1: w.createItem('ordinarycoins:coinbronze', 0, rrandom_range(12, 32)),
					cur2: null,
					sold: w.createItem('minecraft:leather', 0, rrandom_range(12, 20))
				},
			]
		},
	];
	
	
	var pickCost = rrandom_range(512, 2048);
	
	pickCost -= (pickCost / tier_skins.length * tier)/2;
	
	var pickCostS = Math.floor(pickCost / 64);
	var pickCostB = pickCost - (pickCostS * 64);
	//Add random pickaxe
	marketSlotAddTrade(
		6,
		pickCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, pickCostB) : null,
		pickCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, pickCostS) : null,
		import %npcs%\trades\items\randomPickaxe.js;
	);
	
	
	var swordCost = rrandom_range(512, 2048);
	
	swordCost -= (swordCost / tier_skins.length * tier)/2;
	
	var swordCostS = Math.floor(swordCost / 64);
	var swordCostB = swordCost - (swordCostS * 64);
	//Add random sword
	marketSlotAddTrade(
		9,
		swordCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, swordCostB) : null,
		swordCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, swordCostS) : null,
		import %npcs%\trades\items\randomSword.js;
	);
	
	
	var helmCost = rrandom_range(512, 2048);
	helmCost -= (helmCost / tier_skins.length * tier)/2;
	
	var helmCostS = Math.floor(helmCost / 64);
	var helmCostB = helmCost - (helmCostS * 64);
	//Add random helmet
	marketSlotAddTrade(
		1,
		helmCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, helmCostB) : null,
		helmCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, helmCostS) : null,
		import %npcs%\trades\items\randomHelmet.js;
	);
	
	var chestpCost = rrandom_range(512, 2048);
	
	chestpCost -= (chestpCost / tier_skins.length * tier)/2;
	
	var chestpCostS = Math.floor(chestpCost / 64);
	var chestpCostB = chestpCost - (chestpCostS * 64);
	//Add random chestplate
	marketSlotAddTrade(
		4,
		chestpCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, chestpCostB) : null,
		chestpCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, chestpCostS) : null,
		import %npcs%\trades\items\randomChestplate.js;
	);
	
	var leggCost = rrandom_range(512, 2048);
	
	leggCost -= (leggCost / tier_skins.length * tier)/2;
	var leggCostS = Math.floor(leggCost / 64);
	var leggCostB = leggCost - (leggCostS * 64);
	//Add random leggings
	marketSlotAddTrade(
		7,
		leggCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, leggCostB) : null,
		leggCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, leggCostS) : null,
		import %npcs%\trades\items\randomLeggings.js;
	);
	


	var bootsCost = rrandom_range(512, 2048);
	bootsCost -= (bootsCost / tier_skins.length * tier)/2;
	var bootsCostS = Math.floor(bootsCost / 64);
	var bootsCostB = bootsCost - (bootsCostS * 64);
	//Add random boots
	marketSlotAddTrade(
		10,
		bootsCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, bootsCostB) : null,
		bootsCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, bootsCostS) : null,
		import %npcs%\trades\items\randomBoots.js;
	);
	
	var shieldCost = rrandom_range(512, 2048);
	shieldCost -= (shieldCost / tier_skins.length * tier)/2;
	var shieldCostS = Math.floor(shieldCost / 64);
	var shieldCostB = shieldCost - (shieldCostS * 64);
	//Add random shield
	marketSlotAddTrade(
		12,
		shieldCostB > 0 ? w.createItem('ordinarycoins:coinbronze', 0, shieldCostB) : null,
		shieldCostS > 0 ? w.createItem('ordinarycoins:coinsilver', 0, shieldCostS) : null,
		import %npcs%\trades\items\randomShield.js;
	);
	
}


function resetQuests(e) {
	var w = e.npc.world;
	//Add Mine quest
	QUEST_TABLE = [];
	var qst_mine = addQuest({action:'Mine ore(s)', items:[], rewards:[], groups:['mine', 'blacksmith'], desc: 'Blacksmith Quest'});
	
	var qst_mine_ore_count = pickchance([
		[1, 4],
		[2, 3],
		[3, 2],
		[4, 1],
	]);
	
	for(var i = 0; i < qst_mine_ore_count; i++) {
		qst_mine.items.push(pick([
			w.createItem('dungeontactics:cluster_iron', 0, rrandom_range(8, 32)),
			w.createItem('dungeontactics:cluster_gold', 0, rrandom_range(1, 8)),
			w.createItem('dungeontactics:cluster_tin', 0, rrandom_range(24, 48)),
			w.createItem('dungeontactics:cluster_copper', 0, rrandom_range(24, 48)),
			w.createItem('minecraft:coal', 0, rrandom_range(24, 48)),
		]));
	}
	var itemIds = [];
	var ii = [];
	for(i in qst_mine.items) {
		if(itemIds.indexOf(qst_mine.items[i].getName()) == -1) {
			ii.push(qst_mine.items[i]);
			itemIds.push(qst_mine.items[i].getName());
		}
	}
	qst_mine.items = ii;

	var qst_mine_coins = rrandom_ranges(12+(tier*16), 48+((tier*16)/2), qst_mine_ore_count);
	qst_mine.rewards = createCoins(qst_mine_coins, w);
	
}


function newDay(e) {
	yield newDay_event;
}
var coins = [
	'ordinarycoins:coinbronze',
	'ordinarycoins:coinsilver',
	'ordinarycoins:coingold',
	ASSET_MOD_ID+':diamondcoin',
	ASSET_MOD_ID+':emeraldcoin'
];
function createCoins(amount, w) {
	var c = [];
	for(var i = coins.length-1; i >= 0; i--) {
		var icoin = null;
		var icoin_amount = 0;
		
		while(amount >= Math.pow(64, i)) {
			amount -= Math.pow(64, i);
			icoin_amount++;
		}
		
		if(icoin_amount > 0) {
			c.push(w.createItem(coins[i], 0, icoin_amount));
		}
		
	}
	return c;
}

function interact(e) {
	yield interact_event;
	
	
	var doesNotify = [
		[true, 1],
		[false, 4],
	];
	
	if(!e.player.isSneaking()) {
		if(pickchance(doesNotify)) {
			var gapple_names = [
				'&e&lGolden Apple&r',
				'&b&lDiamond Apple&r',
				'&a&lEmerald Apple&r',
			];
			
			var notifications = [
				'&lSHIFT+RCLICK&r me with a single OR stack coins to convert!\nLess than a stack will convert back, a stack will convert forward',
				'&lSHIFT+RCLICK&r me without any item to reset the market!',
				'&lSHIFT+RCLICK&r me with a &lName Tag&r and an &litem in offhand&r to rename the item in offhand for &7&l1 silver coin&r!',
				'&lSHIFT+RCLICK&r me with enchanted books in both hands to combine them for &7&l1 silver coin&r',
				'&lSHIFT+RCLICK&r me with an item in offhand and an enchanted book in mainhand to add enchants for &7&l1 silver Coin per enchant&r.'
			];
			if(hasTraits(e.player, 'compatskills.rename_tag')) {
				notifications.push('&lSHIFT+RCLICK&r me with a &lName Tag&r only to rename it with color coding for &6&l16 bronze coins&r!');
			}
			
			//Add tier notification if tier is not max-tier
			if(tier < tier_skins.length-1) {
				notifications.push('Use a '+gapple_names[tier].toString()+' to upgrade tier for faster market resets, better deals and quests!');
			}
			
			e.npc.sayTo(e.player, ccs(pick(notifications)));
		}
	} else {
		//Player sneaks
		var converted = false;
		var data = e.npc.getStoreddata();
		var w = e.npc.world;
		
		
		var heldCoin = e.player.getMainhandItem();
		if(heldCoin != null) {
			if(coins.indexOf(heldCoin.getName()) != -1) {
				
				//Valid Coin
				var size = heldCoin.getStackSize();
				var coinIndex = coins.indexOf(heldCoin.getName());
				
				if(size == 64) {
					if(coinIndex < coins.length-1) { //Can convert forward?
						e.player.removeItem(heldCoin.getName(), 0, 64);
						e.player.dropItem(e.npc.world.createItem(coins[coinIndex+1], 0, 1));
					}
				} else {
					if(coinIndex > 0) {
						e.player.removeItem(heldCoin.getName(), 0, 1);
						e.player.dropItem(e.npc.world.createItem(coins[coinIndex-1], 0, 64));
					}
				}
				converted = true;
			}
		}
		//Has not converted coins?
		if(!converted) {
			//Rename nametag with color
			var heldTag = e.player.getMainhandItem();
			
			if(heldTag != null) {
				if(e.player.getOffhandItem() == null) {
					if(heldTag.getName() == 'minecraft:name_tag') {
						if(hasTraits(e.player, 'compatskills.rename_tag')) {
							if(heldTag.hasCustomName()) {
								if(e.player.removeItem('ordinarycoins:coinbronze', 0, 16)) {
									var newTag = w.createItem('minecraft:name_tag', 0, 1);
									newTag.getNbt().setInteger('RepairCost', 0);
									newTag.setCustomName(ccs('&r'+heldTag.getDisplayName()+'&r'));
									e.player.setMainhandItem(null);
									e.player.dropItem(newTag);
									
								} else {
									e.npc.sayTo(e.player, ccs('You do not have enough money!'));
								}
							} else {
								e.npc.sayTo(e.player, ccs("The name tag does not have a custom name!\nuse &lampersands&r for color coding!"));
							}
						}
						converted = true;
					}
				}
			}
			
		}
		//Has not renamed name tag
		if(!converted) {
			//Rename item
			var heldTag = e.player.getMainhandItem();
			var heldItem = e.player.getOffhandItem();
			var notRenamable = [
				'ordinarycoins:coinbronze',
				'ordinarycoins:coinsilver',
				'ordinarycoins:coingold',
				ASSET_MOD_ID+':emeraldcoin',
				'minecraft:name_tag',
				'minecraft:spawn_egg',
				'sohpisticatedwolves:swdogegg'
			];
			
			//Heeft de speler in beide handen een item
			if(heldTag != null && heldItem != null) {
				if(heldTag.getName() == 'minecraft:name_tag') { //Is het een name tag?
					if(heldTag.hasCustomName()) { //Heeft ie een eigen naam bro
						if(notRenamable.indexOf(heldItem.getName()) == -1) { //Is het een item die je niet kan renamen
							if(e.player.removeItem('ordinarycoins:coinsilver', 0, 1)) { //Moet paye bro
								e.player.setMainhandItem(null);
								heldItem.setCustomName(heldTag.getDisplayName());
							} else {//Je bent echt skeer man
								e.npc.sayTo(e.player, "You don't have enough coins!");
							}
						} else {
							e.npc.sayTo(e.player, "You can't rename this item!");
						}
					} else {
						e.npc.sayTo(e.player, "Nametag does not have a custom name!\nYou can color code a name tag by SHIFT+RCLICKING me with a name tag only!");
					}
					
					
					converted = true;
				}
			}
		}
		//Has not tried to rename item
		if(!converted) {
			//Redeem special paper item
			var item = e.player.getMainhandItem();
			if(item != null) {
				if(item.getName() == 'minecraft:paper') {
					if(item.getStackSize() == 1) {
						if(item.getNbt().has('itemType')) {
							if(item.getNbt().getString('itemType') != 'money') {
								if(redeemQuest(e, item, merchant_id)) { e.player.setMainhandItem(null); }
								resetQuests(e);
								converted = true;
							} else {
								if(redeemMoney(e, money)) { e.player.setMainhandItem(null); }
								converted = true;
							}
						}
						
						if(item.getNbt().has("Money")) {
							var gcoins = createCoins(item.getNbt().getInteger("Money"), e.player.world);
							if(e.player.removeItem(item, 1)) {
								for(i in gcoins) { e.player.dropItem(gcoins[i]); }
								converted = true;
							}
						}
					} else {
						e.npc.sayTo(e.player, "You don't have a single quest in hand!");
					}
				}
			}
		}
		
		if(!converted) {
			//Upgrade tier
			
			var gapples = [
				'minecraft:golden_apple',
				ASSET_MOD_ID+':diamondapple',
				ASSET_MOD_ID+':emeraldapple',
			];
			var gapple = e.player.getMainhandItem();
			
			if(gapple != null) {
				if(gapples.indexOf(gapple.getName()) != -1) {
					var newTier = gapples.indexOf(gapple.getName());
					if(newTier+1 == tier+1) {
						if(e.player.removeItem(gapple.getName(), 0, 1)) {
							tier = newTier+1;
							e.npc.getNbt().setInteger('Tier', newTier);
							yield reset_market_event;
							e.npc.getStoreddata().put('last_market_reset', e.npc.world.getTime());
							e.npc.sayTo(e.player, 'Upgraded tier!');
						}
					} else {
						e.npc.sayTo(e.player, 'This tier is too low/high');
					}
					
					converted = true;
				}
			}
			
		}
		//Has not tried to upgrade tier?
		if(!converted) {
			//Combine enchanted books
			var mbook = e.player.getMainhandItem();
			var obook = e.player.getOffhandItem();
			if(mbook != null && obook != null) {
				if(mbook.getName() == 'minecraft:enchanted_book' && obook.getName() == 'minecraft:enchanted_book') {
					if(e.player.removeItem('ordinarycoins:coinsilver', 0, 1)) {
						var mEnch = mbook.getNbt().getList('StoredEnchantments', 10);
						var oEnch = obook.getNbt().getList('StoredEnchantments', 10);
						
						var newEnch = [];
						for(i in mEnch) {
							newEnch.push(mEnch[i]);
						}
						for(i in oEnch) {
							var ench = oEnch[i];
							var ench_id = parseInt(ench.getShort('id'));
							var ench_lvl = parseInt(ench.getShort('lvl'));
							var shouldAdd = true;
							
							for(j in newEnch) {
								if(j < newEnch.length) {
									var nench = newEnch[j];
									var nench_id = parseInt(nench.getShort('id'));
									var nench_lvl = parseInt(nench.getShort('lvl'));
									
									if(nench_id == ench_id) {
										if(ench_lvl > nench_lvl) {
											array_remove(newEnch, nench);
										} else { shouldAdd = false; }
									}
								}
							}
							
							if(shouldAdd) { newEnch.push(ench); }
						}
						e.player.setMainhandItem(null);
						e.player.setOffhandItem(null);
						var nbook = e.player.world.createItem('minecraft:enchanted_book', 0, 1);
						nbook.getNbt().setList('StoredEnchantments', newEnch);
						e.player.dropItem(nbook);
					} else { e.npc.sayTo(e.player, ccs("You don't have enough money!\nYou need &71 silver coin&r!")); }
					converted = true;
				}
			}
			
		}
		//Has not combined enchanted books
		if(!converted) {
			//Add enchant to item
			var item = e.player.getOffhandItem();
			var book = e.player.getMainhandItem();
			
			if(item != null && book != null) {
				if(item.getName() != 'minecraft:enchanted_book' && book.getName() == 'minecraft:enchanted_book') {
					if(!item.isEnchanted()) {
						//Counting enchants on book
						var enchants = book.getNbt().getList('StoredEnchantments', 10);
						var enchant_count = enchants.length;
						if(e.player.removeItem('ordinarycoins:coinsilver', 0, parseInt(enchant_count))) {
							
							var newItem = item.copy();
							newItem.getNbt().setList('ench', enchants);
							
							e.player.setOffhandItem(null);
							e.player.setMainhandItem(null);
							
							e.player.dropItem(newItem);	
						} else {
							e.npc.sayTo(e.player, 'You don\'t have enough money!');
						}
					} else {
						e.npc.sayTo(e.player, ccs('The item is already enchanted!'));
					}
					converted = true;
				}
			}
		}
		if(!converted) {
			//Market reset
			
			var calc_cooldown = market_cooldown;
			var more_deals = hasTraits(e.player, 'compatskills.more_deals');
			if(more_deals) { calc_cooldown /= 2; }
			
			var canReset = data.get('last_market_reset') == null ? true : (e.npc.world.getTime() >= parseInt(data.get('last_market_reset'))+calc_cooldown);
			if(canReset || e.player.getGamemode() == 1) {
				e.npc.say('The market is reset and a new quest is given');
				yield reset_market_event;
				e.player.dropItem(genQuestToken('Blacksmith', ['blacksmith'], e.player.world, merchant_id));
	
				data.put('last_market_reset', e.npc.world.getTime());
				converted = true;
			} else {
				var timeleft = 0;
				if(data.get('last_market_reset') != null) {
					timeleft = Math.round((calc_cooldown/20)-( e.npc.world.getTime() - parseInt(data.get('last_market_reset')) )/20);
				}
				var _timeleft = timeleft;
				var tm_d = Math.floor(timeleft/60/60/24);
				timeleft -= tm_d*60*60*24;
				var tm_h = Math.floor(timeleft/60/60);
				timeleft -= tm_h*60*60;
				var tm_m = Math.floor(timeleft/60);
				timeleft -= tm_m*60;
				var tm_s = Math.floor(timeleft);
				var timeleftStr = ccs( (more_deals?'&c&l':'')+tm_d.toString()+'d'+tm_h.toString()+'h'+tm_m.toString()+'m'+tm_s.toString()+'s'+(more_deals?'&r':'') );
				
				e.npc.sayTo(e.player, 'Cannot reset market now.'+(_timeleft > 0 ? "\nPlease wait "+timeleftStr+"." : ''));
			}
		}
		//Has not reset market?
		
		
		e.setCanceled(true);
	}
}

