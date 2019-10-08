import "core\xcommandsAPI.js";

import "core\players\tell.js";

var petdata = {
    "name": "Pet",
    "title": "",
    "owners": [],
    "trusted": [],
    "minSize": 3,
    "maxSize": 12,
    "curSize": 3, //Can be decimal, will be rounded
    "sizePerLevel": 0.5,
    "maxHpMin": 5,
    "maxHpMax": 40,
    "maxHp": 5,
    "hpPerLevel": 2,
    "level": 1,
    "xp": 0
};

function init(e) {
    if(!petLoad(e.npc)) {
        petSave(e.npc);
    }
    petUpdate(e.npc);
}

function tick(e) {
    petUpdate(e.npc);
}

function getMaxXp(lvl) {
	var mxp = 0;
	if(lvl < 16) {
		mxp = 2 * lvl + 7;
	} else if(lvl < 31) {
		mxp = 5 * lvl - 38;
	} else {
		mxp = 9 * lvl - 158;
	}
	return mxp *2;
}

function petUpdate(pet) {
    var hasChanged = false;
    var needXp = getMaxXp(petdata.level);
    var msgs = [];
    if(petdata.xp >= needXp) {
        petdata.xp -= needXp;
        petdata.level++;
        msgs.push("&aYour pet has leveled up!");
        hasChanged = true;
    }

    var disp = pet.getDisplay();

    var displayValues = {
        "Name": ccs("&5["+petdata.level+"]&r "+petdata.name),
        "Title": ccs(progressBar(petdata.xp, getMaxXp(petdata.level), 30)),
    }

    for(var d in displayValues as dv) {
        if(disp["get"+d]() != dv) {
            disp["set"+d](dv);
            hasChanged = true;
        }
    }



}

function petSave(pet) {
    var psd = pet.storeddata;
    psd.put("petdata", JSON.stringify(petdata));
    return pet;
}

function petLoad(pet) {
    var psd = pet.storeddata;
    if(psd.has('petdata')) {
        petdata = JSON.parse(psd.get('petdata'));
        return true;
    }
    return false;
}
