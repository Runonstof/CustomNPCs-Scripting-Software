(function(e){
	var w = e.npc.world;
	var ids = [
		['minecraft:iron_chestplate', 7],
		['minecraft:golden_chestplate', 8],
		['minecraft:diamond_chestplate', 3],
		['dungeontactics:gilded_chestplate', 6],
		['dungeontactics:jewelled_chestplate', 5],
		['extragems:ruby_chestplate', 4],
		['extragems:sapphire_chestplate', 4],
		['extragems:amethyst_chestplate', 5],
		['extragems:topaz_chestplate', 4],
		['extragems:crystal_chestplate', 3],
		['extragems:emerald_chestplate', 3],
		['twilightforest:fiery_chestplate', 4]
	];
	var ench = [
		[{
			id: 'minecraft:unbreaking',
			minlvl: 1,
			maxlvl: 3
		}, 8],
		[{
			id: pick([
				'minecraft:protection',
				'minecraft:fire_protection',
				'minecraft:projectile_protection',
				'minecraft:blast_protection',
			]),
			minlvl: 1,
			maxlvl: 4
		}, 8],
		[{
			id: 'minecraft:mending',
			minlvl: 1,
			maxlvl: 1
		}, 1],
		[{
			id: 'minecraft:thorns',
			minlvl: 1,
			maxlvl: 3
		}, 4],
		[{
			id: 'ffenchants:cursed_body',
			minlvl: 1,
			maxlvl: 1
		}, 1],
	];
	
	var item = w.createItem(pickchance(ids), 0, 1);
	var enchants = rrandom_range(1, 4);
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
