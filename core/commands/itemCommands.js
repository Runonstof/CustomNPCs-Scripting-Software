import core\utils\DataList.js;
import core\CustomEnchantsLoader.js;
//

@block register_commands_event
	registerXCommands([
		['!item renameLore <slot> [...lore]', function(pl, args){
			var mItem = pl.getMainhandItem();

			if(!mItem.isEmpty()) {
				var newLoreStr = args.lore.join(' ');
				var newLore = objArray(mItem.getLore());
				var s = parseInt(args.slot) || 0;
				if(s < newLore.length) {
					newLore[s] = parseEmotes(ccs(newLoreStr));
				} else {
					newLore.push(ccs(newLoreStr));
				}
				mItem.setLore(newLore);
				tellPlayer(pl, "&aRenamed lore!");
			} else {
				tellPlayer(pl, "&cYou don't have anything in your hand!");
			}

			return false;
		}, 'item.renameLore'],
		['!item rename <...name>', function(pl, args){
			var mItem = pl.getMainhandItem();

			if(!mItem.isEmpty()) {
				var newName = args.name.join(' ');
				mItem.setCustomName(parseEmotes(ccs(newName)));
				return true;
			} else {
				tellPlayer(pl, "&cYou don't have anything in your hand!");
			}

			return false;
		}, 'item.rename'],
		['!item addcstEnchant <name> [lvl]', function(pl, args, data){
			var mItem = pl.getMainhandItem();
			var ench = getCSTEnchantByName(args.name);
			if(!mItem.isEmpty() && ench != null) {
				addCSTEnchant(mItem, ench.name, args.lvl||1);
			}
		}, 'item.addEnchant', [
			{
				"argname": "lvl",
				"type": "number",
				"min": 1
			},

		]],
		["!item addSellItem", function(pl, args, data){
			var oItem = pl.getOffhandItem();
			var mItem = pl.getMainhandItem();

			var mNbt = mItem.getNbt();

			if(oItem.isEmpty()) {
				tellPlayer(pl, "&cYou don't have an chance item in your offhand!");
				return false;
			} else
			if(mItem.isEmpty()) {
				tellPlayer(pl, "&cYou don't have an sell item in your mainhand!");
				return false;
			} else {
				var chanceItems = mNbt.has("CSTSellItems") ? Java.from(mNbt.getList("CSTSellItems", mNbt.getListType("CSTSellItems"))) : [];

				chanceItems.push(oItem.getItemNbt());

				mNbt.setList("CSTSellItems", chanceItems);

				tellPlayer(pl, "&aAdded offhand item as chance item to sell item! To view sell item info, do &2!item sellItemInfo&a!");

			}


		}, "item.addSellItem"],
		['!item removecstEnchant <name>', function(pl, args, data){
			var mItem = pl.getMainhandItem();
			var ench = getCSTEnchantByName(args.name);
			if(!mItem.isEmpty() && ench != null) {
				removeCSTEnchant(mItem, ench.name);
			}
		}, 'item.removeEnchant', [
			{
				"argname": "lvl",
				"type": "number",
				"min": 1
			},

		]],
		['!listCstEnchants [...matches]', function(pl,args){
			var params = getArgParams(args.matches);
			var txt = getTitleBar("Custom Server Tools Enchants", false)+"\n";

			txt += genDataPageList(
				_ENCHANTS,
				args.matches,
				parseInt(params.show||10),
				parseInt(params.page||1),
				"!listCstEnchants {MATCHES} -show:{SHOWLEN} -page:{PAGE} -sort:{SORT}",
				function(ench) {
					return "&e - &c&l"+ench.name+"&r\n";
				},
				function(a,b) {
					var al = a.name.toLowerCase();
			        var bl = b.name.toLowerCase();

			        if(al < bl) return -1;
			        if(al > bl) return 1;

			        return 0;
				},
				function(ench, list) {
					 return arrayOccurs(ench.name, list, false, false) > 0
				},
				(params.sort||"").toLowerCase() == "desc"
			);

			tellPlayer(pl, txt);

		}, "listCstEnchants"],
		['!item setAttr <slot> <attribute> <value>', function(pl, args){
			var mItem = pl.getMainhandItem();

			if(!mItem.isEmpty()) {
				mItem.setAttribute(args.attribute, parseFloat(args.value), parseInt(args.slot));
				tellPlayer(pl, "&aSet "+args.attribute+" to "+args.value+"%!");
				return true;
			} else {
				tellPlayer(pl, "&cYou don't have anything in your hand!");
			}

			return false;
		}, 'item.setAttr', [
			{
				"argname": "slot",
				"type": "number",
				"min": -1,
				"max": 5,
			},
			{
				"argname": "attribute",
				"type": "attribute",
			},
			{
				"argname": "value",
				"type": "number",
				"min": 0,
			}
		]],

	]);
@endblock
