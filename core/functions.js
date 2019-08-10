import core\JavaScript\*.js;


//Java import
import core\mods\noppes\Java.js;

//UUIDLeast-Most
function UUIDLM() { return rrandom_range(1, 99999); }

function getDropChance(npcnbt, slot) {
	var dropC = npcnbt.getList('DropChance', 10);
	var dropChance = parseInt(dropC[slot].getInteger('Integer'));

	return dropChance;
}




function getHandItem(player) {
	return player.getMainhandItem() || player.getOffhandItem();
}

//Get unique ID
function uniqid() {
	var id = '';
	for(var i = 0; i <= 3; i++) {
		id+=Math.random().toString(36).substr(2, 9);
	}
	return id;
}

//Vanilla item attributes
var _ITEMATTR = [
	'generic.attackDamage',
	'generic.followRange',
	'generic.maxHealth',
	'generic.followRange',
	'generic.knockbackResistance',
	'generic.movementSpeed',
	'generic.armor',
	'generic.armorToughness',
	'generic.attackSpeed',
	'generic.luck',
	'generic.attackKnockback',
	'generic.flyingSpeed',
	'generic.luck'
];

//Escape JSON symbols
function escapeNbtJson(json, trim_ends=true) {
	json = json.replace(/(?:\\n|\\)/g, '');
	json = json.replace(/(\d) ([fbds]+)/g, "$1$2");
	json = json.replace(/\\("|')/g, "$1");
	if(trim_ends) {
		json = json.slice(1, json.length - 1);
	}

	return json;
}

function getDayTime(time) {
	while(time > 24000) { time -= 24000; }
	return time;
}

function isArray(obj) {
	if(typeof(obj) === 'object') {
      for(var k in obj) {
          if(isNaN(k)) {
			  return false;
		  }
      }
      return true;
    } else { return false }
}

function isObject(obj) {
	return ( typeof(obj) === 'object' && !isArray(obj) );
}
