function givePlayerItems(player, stacks, pnbt=null) {
    var w = player.world;
    if(pnbt == null) {
        pnbt = player.getEntityNbt();//Dont over-use this one
    }
    var invcnt = getPlayerInvCount(pnbt, w);
    for(var s in stacks as stack) {
        if(invcnt < 36) {
            //Player inv not full
            player.giveItem(stack);
            invcnt++;
        } else {
            player.dropItem(stack);
        }
    }
}

//Made for givePlayerItems (does not include armor and offhand)
function getPlayerInvCount(pnbt, w) {
    return getPlayerInvFromNbt(pnbt, w, function(item, itnbt){
        //Exclude armor slots and offhand
        return ["-106", "100", "101", "102", "103"].indexOf(itnbt.getByte('Slot').toString()) == -1;
    }).length;
}

function getPlayerInvFromNbt(pnbt, w, filterFn=null) {
	var pinv = pnbt.getList('Inventory', pnbt.getListType('Inventory'));
	var pitems = [];
	for(var p in pinv as pin) {
		var pitm = w.createItemFromNbt(API.stringToNbt(pin.toJsonString()));
        //pin (INbt) contains key "Slot"
        //pitm.getItemNbt() does not, thats why pin is passed
        if( (filterFn == null ? true : filterFn(pitm, pin, w)) ) {
            pitems.push(pitm);
        }
	}

	return pitems;
}

function getInvItemCount(pnbt, itemstack, w, ignoreNbt) {
	return getArrItemCount(getPlayerInvFromNbt(pnbt, w), itemstack, ignoreNbt);
}

function playerIsOnline(world, player) {
	var isOnline = false;
	var pl = world.getAllPlayers();
	for(var p in pl) {
		if(pl[p].getName() == player.toString()) {
			isOnline = true;
			break;
		}
	}
	return isOnline;
}

function getChatMessage(player, team, color, message) {
	//time
	var curTimeStr = new Date().toLocaleTimeString("fr-FR").split(":");
	curTimeStr.pop();
	curTimeStr = curTimeStr.join(":");
	var ccode = getColorId(color);
	return "["+curTimeStr+"] &l&"+ccode+"[&"+ccode+team+"&r &"+ccode+player+"&l&"+ccode+"] -> &r"+message;
}

function getChatTag(player, team, color) {
	var ccode = getColorId(color);
	return "&"+ccode+"&l[&"+ccode+"&o"+team+"&r &"+ccode+player+"&"+ccode+"&l]";
}
