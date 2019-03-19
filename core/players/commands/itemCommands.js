@block register_commands_event
	registerXCommands([
		['!renameLore <slot> [...lore]', function(pl, args){
			var mItem = pl.getMainhandItem();
			
			if(!mItem.isEmpty()) {
				var newLoreStr = args.lore.join(' ');
				var newLore = objArray(mItem.getLore());
				var s = parseInt(args.slot) || 0;
				if(s < newLore.length) {
					newLore[s] = ccs(newLoreStr);
				} else {
					newLore.push(ccs(newLoreStr));
				}
				mItem.setLore(newLore);
				tellPlayer(pl, "&aRenamed lore!");
			} else {
				tellPlayer(pl, "&cYou don't have anything in your hand!");
			}
			
			return false;
		}, 'renameLore'],
		['!renameItem <...name>', function(pl, args){
			var mItem = pl.getMainhandItem();
			
			if(!mItem.isEmpty()) {
				var newName = args.name.join(' ');
				mItem.setCustomName(ccs(newName));
				return true;
			} else {
				tellPlayer(pl, "&cYou don't have anything in your hand!");
			}
			
			return false;
		}, 'renameItem'],
	]);
@endblock
