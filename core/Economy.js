//Unstable, use money pouch for taking money
function takeMoneyFromPlayer(player, amount, pnbt=null) {
    if(pnbt == null) { pnbt = player.getEntityNbt(); }
    var w = player.world;
    if(getMoneyItemCount(pnbt, w) >= amount) {
        var pmitems = getPlayerInvFromNbt(pnbt, w, function(item, inbt, w){
            return isItemMoney(item, w);//Get only money items
        }).sort(function(r,s){
            return getItemMoney(r, w)-getItemMoney(s, w);//Sort by money
        });

        for(var pm in pmitems as pmitem) {
            var pval = getItemMoney(pmitem, w);

            for(var i = 1; i <= pmitem.getStackSize(); i++) {
                if(amount > 0) {
                    pmitem.setStackSize(pmitem.getStackSize()-1);
                    amount -= pval;
                } else {
                    break;
                }
            }
        }
        tellPlayer(player, "Amount: "+amount);
        if(amount < 0) {
            var cmoney = genMoney(w, Math.abs(amount));
            givePlayerItems(player, cmoney, pnbt)
        }
    }

}
//Returns amount of money in player inv
function getMoneyItemCount(pnbt, w) {
  var am = 0;
  for(var itemvalue in _COINITEMS as ci) {
    var coinItems = genMoney(w, getCoinAmount(itemvalue));
    for(var _cii in coinItems as _coin) {
      am += getInvItemCount(pnbt, _coin, w, false)*getCoinAmount(itemvalue);
    }

  }
  return am;
}

function getItemMoney(stack, w) {
    for(var ival in _COINITEMS as ci) {
        var cm = genMoney(w, getCoinAmount(ival))[0]||null;
        if(cm != null) {
            if(isItemEqual(stack, cm)) {
                return getCoinAmount(ival);
            }
        }
    }
    return 0;
}

function isItemMoney(stack, w) {
    return getItemMoney(stack, w) > 0;
}
