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
		['!item setAttr <slot> <attribute> <value>', function(pl, args){
			var mItem = pl.getMainhandItem();

			if(!mItem.isEmpty()) {
				mItem.setAttribute(args.attribute, parseFloat(args.value/1000), parseInt(args.slot));
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
