(function(e){
	var w = e.npc.world;
	var ids = [
		['minecraft:shield', 12],
		['dungeontactics:stone_shield', 10],
		['dungeontactics:iron_shield', 7],
		['dungeontactics:golden_shield', 8],
		['dungeontactics:diamond_shield', 3],
		['dungeontactics:gilded_shield', 6],
		['dungeontactics:jewelled_shield', 5],
		['dungeontactics:ruby_shield', 4],
		['dungeontactics:sapphire_shield', 4],
		['dungeontactics:amethyst_shield', 5],
		['dungeontactics:topaz_shield', 4],
		['dungeontactics:crystal_shield', 3],
		['dungeontactics:emerald_shield', 3],
	];
	var ench = [
		[{
			id: 'minecraft:unbreaking',
			minlvl: 1,
			maxlvl: 3
		}, 8],

		[{
			id: 'minecraft:mending',
			minlvl: 1,
			maxlvl: 1
		}, 1],
	];
	
	var item = w.createItem(pickchance(ids), 0, 1);
	var enchants = rrandom_range(1, 2);
	var hasIds = [];
	var ii = 0;
	while(ii < enchants) {
		var nE = pickchance(ench);
		if(hasIds.indexOf(nE.id) == -1) {
			item.addEnchantment(nE.id.toString(), rrandom_range(nE.minlvl, nE.maxlvl));
			hasIds[hasIds.length] = nE.id;
			ii++;
		}
	}
	item.setCustomName('\u00A7r'+genName(item.getItemName()));
	
	return item;
})(e)
