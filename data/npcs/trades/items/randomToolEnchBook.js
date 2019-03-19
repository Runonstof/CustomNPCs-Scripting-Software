(function(e){
	var w = e.npc.world;
	var ench = [
		[{//Smelting
			id: 'dungeontactics:smelting',
			lvl: 1,
		}, 3],
		[{//Efficiency
			id: 'minecraft:efficiency',
			lvl: [
				[1, 10],
				[2, 8],
				[3, 4],
				[4, 2],
				[5, 1],
			],
		}, 12],
		[{//Silk touch
			id: 'minecraft:silk_touch',
			lvl: 1,
		}, 1],
		[{//Unbreaking
			id: 'minecraft:unbreaking',
			lvl: [
				[1, 6],
				[2, 3],
				[3, 1],
			],
		}, 9],
		[{//Fortune
			id: 'minecraft:fortune',
			lvl: [
				[1, 6],
				[2, 3],
				[3, 1],
			],
		}, 9],
		[{//Mending
			id: 'minecraft:mending',
			lvl: 1,
		}, 1],
	];
	
	var enchants = %enchantCount || pickchance([
		[1, 8],
		[2, 4],
		[3, 2],
		[4, 1],
	])%;
	
	var hasEnch = [];
	var book = w.createItem('minecraft:enchanted_book');
	var bookCost = 0;
	while(hasEnch.length < enchants) {
		var newEnch =  pickchance(enchants);
		if(hasEnch.indexOf(newEnch.id) == -1) {
			if(isArray(newEnch.lvl)) { newEnch.lvl = pickchance(newEnch.lvl); }
			book.addEnchantment(newEnch.id, newEnch.lvl);
			hasEnch.push(newEnch.id);
		}
	}
	
	book.setCustomName(ccs("&eEnchanted Book (Tool)"));
	
	return {item:book,cost:bookCost};
})(e);