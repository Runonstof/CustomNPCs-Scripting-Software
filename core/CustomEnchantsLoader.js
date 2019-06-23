import core\noppes\*.js;
import core\utils\Romanize.js;
import core\deobf\*.js;

var _ENCHANTS = [];
var CSTENCH_TAG = "CSTEnch";

import core\enchants\*.js;

function getCSTEnchantByIdOrName(name_id) {
    for(var i in _ENCHANTS as ench) {
        if( ench[(typeof name_id == "string" ? "name" : "id")] == name_id ) {
            return ench;
        }
    }
    return null;
}

function getCSTEnchantsFromItem(itemstack) {
    if(itemstack == null) {
        return [];
    }
    var nbt = itemstack.getNbt();
    var enchs = [];
    var itemenchs = nbtGetList(nbt, CSTENCH_TAG)||[];
    for(var i in itemenchs as itemench) {
        enchs.push({
            "id": parseInt(itemench.getShort("id")),
            "lvl": parseInt(itemench.getShort("lvl")),
        });
    }
    return enchs;
}

//Checks if item has CST Enchant
//if lvl > 0 it will check also if enchant level >= lvl
function hasCSTEnchant(item, id, lvl=0) {
    var itemnbt = item.getNbt();
    var cstenchs = nbtGetList(itemnbt, CSTENCH_TAG);
    for(var i in cstenchs as cstench) {
        if(parseInt(cstench.getShort("id")) == id) {
            if(lvl > 0) {
                return parseInt(cstench.getShort("lvl")) >= lvl;
            }
            return true;
        }
    }

    return false;
}

function removeCSTEnchant(item, id) {
    if(hasCSTEnchant(item, id)) {
        var newench = [];
        var itemnbt = item.getNbt();
        var cstenchs = nbtGetList(itemnbt, CSTENCH_TAG);
        var newLore = [];
        var remLore = [];
        for(var i in cstenchs as cstench) {
            var ench = getCSTEnchantByIdOrName(parseInt(cstench.getShort("id")));
            var lvl = parseInt(cstench.getShort("lvl"));


            if(ench.id != id) {
                newench.push(cstench);
            } else {
                remLore.push(ccs(getCSTEnchantDisplay(ench.id, lvl)));
            }
        }
        itemnbt.setList(CSTENCH_TAG, newench);
        var iLore = Java.from(item.getLore());
        for(var i in iLore as lore) {
            if(remLore.indexOf(lore) == -1) {
                newLore.push(lore);
            }
        }
        item.setLore(newLore);
        return true;
    }
    return false;
}

function runCSTEnchant(id, event, lvl, type) {
    var ench = getCSTEnchantByIdOrName(id);
    if(ench != null) {
        return ench.func(id, event, lvl, type);
    }
    return null;
}

function addCSTEnchant(item, id, lvl) {
    var itemNbt = item.getNbt();
    var addench = getCSTEnchantByIdOrName(id);
    var newench = Java.from(nbtGetList(itemNbt, CSTENCH_TAG))||[];
    if(hasCSTEnchant(item, id)) {
        removeCSTEnchant(item, id);
    }
    newench.push(API.stringToNbt('{"id":'+id+'s,"lvl":'+lvl+'s}'));
    itemNbt.setList(CSTENCH_TAG, newench);
    item.setLore(Java.from(item.getLore()).concat([ccs(getCSTEnchantDisplay(id, lvl))]))
}

function getCSTEnchantDisplay(id, lvl) {
    var ench = getCSTEnchantByIdOrName(id);
    if(ench != null) {
        return "&7"+ench.displayName+(ench.showLvl ? " "+romanize(lvl) : "");
    }
    return "";
}

function registerCSTEnchant(id, maxlvl, name, displayName, func, showLvl=true) {
    _ENCHANTS.push({
        "id": id||_ENCHANTS.length,
        "maxlvl": maxlvl,
        "name": name,
        "displayName": displayName,
        "func": func,
        "showLvl": showLvl,
    });
}


@block damagedEntity_event
/*
    if(e.target.getHealth()-e.damage <= 0) {
        worldOut(e.target.getEntityName()+" dede");
    }
    var mitem = e.player.getMainhandItem();
    if(mitem != null) {
        var mitemdata = mitem.getNbt();
        if(mitemdata.has(CSTENCH_TAG)) {
            var mench = mitemdata.getList(CSTENCH_TAG, mitemdata.getListType(CSTENCH_TAG));
            for(var m in mench as mch) {
                var mid = parseInt(mch.getShort("id"));
                var mlvl = parseInt(mch.getShort("lvl")||1);
                runCSTEnchant(mid, e, mlvl, "damagedEntity");
            }
        }
    }
*/

    var mItemEnch = getCSTEnchantsFromItem(e.player.getMainhandItem());
    for(var m in mItemEnch as mench) {
        runCSTEnchant(mench.id, e, mench.lvl, "damagedEntity");
    }

@endblock

@block damaged_event
    var mItemEnch = getCSTEnchantsFromItem(e.player.getMainhandItem());
    for(var m in mItemEnch as mench) {
        runCSTEnchant(mench.id, e, mench.lvl, "damaged");
    }

@endblock
