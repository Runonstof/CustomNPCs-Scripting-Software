(function(e){
	var w = e.npc.world;
	var ids = [
		['minecraft:stone_sword', 8],
		['minecraft:iron_sword', 6],
		['minecraft:golden_sword', 8],
		['minecraft:diamond_sword', 2],
		['dungeontactics:gilded_sword', 6],
		['dungeontactics:jewelled_sword', 4],
		['extragems:ruby_sword', 3],
		['extragems:sapphire_sword', 3],
		['extragems:amethyst_sword', 4],
		['extragems:topaz_sword', 3],
		['extragems:crystal_sword', 3],
		['extragems:emerald_sword', 2],
		['twilightforest:fiery_sword']
	];
	var ench = [
		[{
			id: 'minecraft:sharpness',
			minlvl: 1,
			maxlvl: 5
		}, 12],
		[{
			id: 'minecraft:smite',
			minlvl: 1,
			maxlvl: 5
		}, 12],
		[{
			id: 'minecraft:bane_of_arthropods',
			minlvl: 1,
			maxlvl: 5
		}, 8],
		[{
			id: 'minecraft:knockback',
			minlvl: 1,
			maxlvl: 3
		}, 6],
		[{
			id: 'minecraft:fire_aspect',
			minlvl: 1,
			maxlvl: 2
		}, 3],
		[{
			id: 'minecraft:looting',
			minlvl: 1,
			maxlvl: 5
		}, 6],
		[{
			id: 'dungeontactics:berserking',
			minlvl: 1,
			maxlvl: 1
		}, 5],
		[{
			id: 'minecraft:unbreaking',
			minlvl: 1,
			maxlvl: 3
		}, 8],
		[{
			id: 'ffenchants:vampiric',
			minlvl: 1,
			maxlvl: 2
		}, 5],
		[{
			id: 'ffenchants:bloodlust',
			minlvl: 1,
			maxlvl: 3
		}, 3],
		[{
			id: 'ffenchants:wither_aspect',
			minlvl: 1,
			maxlvl: 3
		}, 3],
		[{
			id: 'ffenchants:extinguish',
			minlvl: 1,
			maxlvl: 1
		}, 6],
		[{
			id: 'ffenchants:poison_aspect',
			minlvl: 1,
			maxlvl: 2
		}, 4],
		
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
