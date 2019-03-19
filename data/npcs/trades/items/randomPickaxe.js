(function(e){
			var w = e.npc.world;
			var ids = [
				['minecraft:stone_pickaxe', 8],
				['minecraft:iron_pickaxe', 6],
				['minecraft:golden_pickaxe', 8],
				['minecraft:diamond_pickaxe', 2],
				['dungeontactics:gilded_pickaxe', 6],
				['dungeontactics:jewelled_pickaxe', 4],
				['extragems:ruby_pickaxe', 3],
				['extragems:sapphire_pickaxe', 3],
				['extragems:amethyst_pickaxe', 4],
				['extragems:topaz_pickaxe', 3],
				['extragems:crystal_pickaxe', 3],
				['extragems:emerald_pickaxe', 2],
				['twilightforest:fiery_pickaxe', 3]
			];
			var ench = [
				[{//Smelting
					id: 'dungeontactics:smelting',
					minlvl: 1,
					maxlvl: 1
				}, 3],
				[{//Efficiency
					id: 'minecraft:efficiency',
					minlvl: 1,
					maxlvl: 5
				}, 12],
				[{//Silk touch
					id: 'minecraft:silk_touch',
					minlvl: 1,
					maxlvl: 1
				}, 1],
				[{//Unbreaking
					id: 'minecraft:unbreaking',
					minlvl: 1,
					maxlvl: 3
				}, 9],
				[{//Fortune
					id: 'minecraft:fortune',
					minlvl: 1,
					maxlvl: 3
				}, 9],
				[{//Mending
					id: 'minecraft:mending',
					minlvl: 1,
					maxlvl: 1
				}, 1],
				[{//Energy Of The Void
					id: 'ffenchants:void_energy',
					minlvl: 1,
					maxlvl: 1,
				}, 2],
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