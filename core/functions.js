import core\JavaScript\*.js;

var ASSET_MOD_ID = "adventureassets";

//Java import
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var HAS_MOD_BACKPACKS = hasMCMod("backpacks16840");
var UItem = (HAS_MOD_BACKPACKS ? Java.type("brad16840.common.UniqueItem") : null);
var UItemInv = (HAS_MOD_BACKPACKS ? Java.type('brad16840.common.UniqueItemInventory') : null);

//=========================FileUtils=========================
var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");

function readDir(dirPath){
	var res = [];
	var files = new File(dirPath).listFiles();
	for(var id in files as file){
		if(file.isDirectory())
			res = res.concat( readDir(file.toString()) );
		else
			res.push( Java.from( readFile(file.toString()) ).join("\n").replace(/\t/g, "  ") );
	}
	return res;
}

function readFile(filePath){
	var path = Paths.get(filePath);
	try{
		var lines = Files.readAllLines(path, Java.type("java.nio.charset.StandardCharsets").UTF_8);
		return lines;
	} catch (e){
		return [];
	}
}
//===========================================================

function objMerge(obj1, obj2, inheritNewProps=true){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) {
        if(inheritNewProps || Object.keys(obj1).indexOf(attrname) > -1) {
            obj3[attrname] = obj2[attrname];
        }
    }
    return obj3;
}

function getHalfRotation(angle) {
	angle = fixAngle(angle);
	if(angle <= 180) { return angle; } else { return -(180-(angle-180)); }
}
//UUIDLeast-Most
function UUIDLM() { return rrandom_range(1, 99999); }

function getQuartRotation(dir) {
	dir = getHalfRotation(dir);

	if(Math.abs(dir) > 90) {
		dir = (180-Math.abs(dir))*sign(dir);
	}

	return dir;
}

function compare(val1, comp, val2, asString=true) {

    return false;
}

function getDropChance(npcnbt, slot) {
	var dropC = npcnbt.getList('DropChance', 10);
	var dropChance = parseInt(dropC[slot].getInteger('Integer'));


	return dropChance;
}


function progressBar(value, max, length, fillColor="&a", leftColor="&c"){
	var skillBar = '&r&l[&r';
	var progress = Math.floor((value/max)*length);
	var proc = Math.round(value/max*100);
	for(var i = 0; i < length; i++) {
		if(i < progress) skillBar += "&a:box:";
		if(i >= progress) skillBar += "&c:box:";
	}
	return skillBar += "&r&l]";
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

var ForgeLoader = Java.type("net.minecraftforge.fml.common.Loader").instance();

function getMCModList() {
    var modlist = [];
    var loadmods = Java.type("net.minecraftforge.fml.common.Loader").instance().getModList();

    for(var mid in loadmods as lmod) {
        modlist.push(lmod.getModId());
    }

    return modlist;
}

function hasMCMod(name) {
    return getMCModList().indexOf(name) > -1;
}

//===================ItemStack Array Utils===================

//Used to get backpack IInventory (to get/set items array you can use `getBackpackInv(pl, items).items` )
function getBackpackInv(pl, item){
	//If backpack item wasn't been opened yet
    if(HAS_MOD_BACKPACKS) {
	if(UItem.hasIdentifier(item.getMCItemStack()))
		return UItemInv.getInventory(pl.getMCEntity(), UItem.getIdentifier(item.getMCItemStack()));
    }
	return;
}

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

function isNbtEqual(nbt, otherNbt) {
    return nbt.toJsonString() == otherNbt.toJsonString();
}

function isItemEqual(stack, other, ignoreNbt=false){
	if (!other || other.isEmpty()) {
		return false;
	}

	var stackNbt = stack.getItemNbt();
	stackNbt.remove('Count');
	var otherNbt = other.getItemNbt();
	otherNbt.remove('Count');

	if(ignoreNbt) {
		if(stackNbt.getString("id") == otherNbt.getString("id")) {
			return true;
		}
	} else {
		if(isNbtEqual(stackNbt, otherNbt)) {
			return true;
		}
	}

	return false;
}

//How much items in array
function getArrItemCount(array, itemstack, ignoreNbt=false) {
	var icount = 0;
	for(var pi in array as pitem) {
		var pinbt = pitem.getItemNbt();
		var scount = parseInt(pinbt.getByte('Count'));
		if(isItemEqual(itemstack, pitem, ignoreNbt))
			icount += scount;
	}

	return icount;
}

//Remove certain amount of ItemStack item from ItemStack[] array
function arrayItemRemove(array, item, amount){
	var count = getArrItemCount(array, item);
	if (amount > count) {
		return false;
	}
	if (count == amount) {
		return arrayAllItemsRemove(array, item);
	} else {
		for (var i = 0; i < array.length; ++i) {
			if (!array[i] || !isItemEqual(item, array[i])) continue;
			if (amount >= array[i].getStackSize()) {
				//EmptyItemStack
				array[i] = API.getIItemStack(Java.type('net.minecraft.item.ItemStack').field_190927_a);
				amount -= array[i].getStackSize();
				continue;
			}
			array[i].setStackSize(array[i].getStackSize() - amount);
			break;
		}
	}
	return array;
}

//Remove all items like ItemStack item from ItemStack[] array
function arrayAllItemsRemove(array, item){
	for (var i = 0; i < array.length; ++i) {
		if (!array[i] || !isItemEqual(item, array[i])) continue;
		//EmptyItemStack
		array[i] = API.getIItemStack(Java.type('net.minecraft.item.ItemStack').field_190927_a);
	}
	return array;
}

//Convert MCItemStack[] to IItemStack[]
function getIItemStackArray(array){
	var newArr = [];
	for (var i = 0; i < array.length; ++i) {
		newArr[i] = API.getIItemStack(array[i]);
	}
	return newArr;
}

//Convert IItemStack[] to MCItemStack[]
function getMCItemStackArray(array){
	var newArr = [];
	for (var i = 0; i < array.length; ++i) {
		newArr[i] = array[i].getMCItemStack();
	}
	return newArr;
}


function getHandItem(player) {
	return player.getMainhandItem() || player.getOffhandItem();
}
//===========================================================

function uniqid() {
	var id = '';
	for(var i = 0; i <= 3; i++) {
		id+=Math.random().toString(36).substr(2, 9);
	}
	return id;
}

function arrayOccurs(string, subArray, allowOverlapping=false, caseSensitive=true) {
	var occ = 0;
	for(var i in subArray as sel) {
		occ += occurrences(string, sel, allowOverlapping, caseSensitive);
	}

	return occ;
}

function occurrences(string, subString, allowOverlapping=false, caseSensitive=true) {
    string = string.toString()
    subString = subString.toString()

	if(!caseSensitive) {
		string = string.toLowerCase();
		subString = subString.toLowerCase();
	}

    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function arrayTransform(arr, elfn) {
	var newa = [];
	for(var a in arr as arri) {
		newa.push(elfn(arri, a, arr));
	}
	return newa;
}

function arrayTakeRange(arr, start, end=null) {
	if(end == null) { end = arr.length; }
	var a = [];
	var _end = Math.min(end, arr.length);
	var _start = Math.min(start, _end);
	for(var i = _start; i < Math.min(end, arr.length); i++) {
		if(typeof(arr[i]) != typeof(undefined)) {
			a.push(arr[i]);
		}
	}
	return a;
}


function sign(num=0) {
	if(num > 0) { return 1; }
	if(num < 0) { return -1; }
	return 0;
}

function g(obj, grp_props) {
	for(var j in grp_props) {
		var props = grp_props[j];
		for(var i in props[0]) {
			if(obj != null) {
				if(typeof(obj[props[0][i]]) != typeof(undefined)) {
					obj = obj[props[0][i]];

					break;
				}
			}
		}
	}


	return obj;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getAllFuncs(obj) {
    var props = [];

    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) {
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}

function removeFromArray(arr, vals) {
	if(typeof(vals) == 'string') { vals = [vals]; }
	var a = arr;
	for(var v in vals as val) {
		array_remove(a, val);
	}
	return a;
}
function removeFromArrayByKey(arr, keys) {
	var narr = [];
	for(var k in keys as key) {
		keys[k] = parseInt(key);
	}
	for(var i in arr as ari) {
		if(keys.indexOf(i) > -1) {
			narr.push(ari);
		}
	}
	return narr;
}

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
	'generic.luck',

];


var _RAWCOLORS = {
	'0': 'black',
	'1': 'dark_blue',
	'2': 'dark_green',
	'3': 'dark_aqua',
	'4': 'dark_red',
	'5': 'dark_purple',
	'6': 'gold',
	'7': 'gray',
	'8': 'dark_gray',
	'9': 'blue',
	'a': 'green',
	'b': 'aqua',
	'c': 'red',
	'd': 'light_purple',
	'e': 'yellow',
	'f': 'white',
};

var _RAWEFFECTS = {
	'o': 'italic',
	'l': 'bold',
	'k': 'magic',
	'm': 'strike',
	'n': 'underline',
	'r': 'reset'
}

var _RAWCODES = Object.keys(_RAWCOLORS).concat(Object.keys(_RAWEFFECTS));
function getColorId(name) {
	for(var i in _RAWCOLORS) {
		if(name == _RAWCOLORS[i]) {
			return i;
		}
	}
	for(var i in _RAWEFFECTS as re) {
		if(name == re) {
			return i;
		}
	}
	return 'r';
}
function getColorName(id) {
	for(var i in _RAWCOLORS as rc) {
		if(id == i) {
			return rc;
		}
	}
	for(var i in _RAWEFFECTS as re) {
		if(id == i) {
			return re;
		}
	}
	return 'white';
}

function parseEmotes(str, allwd=[]) {

  str = str.replaceAll(objArray(CHAT_EMOTES), '');
	for(var ce in CHAT_EMOTES as chatemote) {
    if(allwd.length == 0  || allwd.indexOf(ce) > -1) {
		    str = str.replaceAll(':'+ce+':', chatemote);
		    str = str.replaceAll(':/'+ce+'/:', ':'+ce+':');
    }
	}
	return str;
}


function strf(str, toRaw=true, allowed=null) {
	return strrawformat(str, toRaw, allowed);
}
var trg = /{[\s]*(?:([\w]+)[\s]*\:[\s]*([\w\W\/]+?)|\*)(?:[\s]*\|[\s]*([\w]+)[\s]*\:[\s]*([\w\W\/]+?[\s]*))?}/;


function strrawformat(str, toRaw=false, allowed) {
	var rf = [];
	var txt = '';
	var ri = -1;
	var isCode = false;
	var txtColor = 'white';
	var isItalic = false;
	var isBold = false;
	var isStrike = false;
	var isUnderlined = false;
	var isObf = false;
	str = str+'&r ';

	for(var i = 0; i < str.length; i++) {
		var c = str.substr(i, 1);
		if(c == '&' || i == str.length-1) {
			//Check if new section has to be made
			if(txt.length > 0) {
				ri++;
				var cmds = [];


				rf.push([txt, txtColor, isItalic, isBold, isUnderlined, isStrike, isObf]);
				isItalic = false;
				isBold = false;
				isUnderlined = false;
				isStrike = false;
				isObf = false;
				txtColor = 'white';
				txt = '';
			}
			isCode = true;
			continue;
		} else {
			if(!isCode) {
				txt += c.toString();
			} else {
				//Check Colors
				if(typeof(_RAWCOLORS[c]) != typeof(undefined)) {
					txtColor = _RAWCOLORS[c];
				}
				//Check Markup
				switch(c.toString()) {
					case 'o': {
						isItalic = true;
						break;
					}
					case 'l': {
						isBold = true;
						break;
					}
					case 'n': {
						isUnderlined = true;
						break;
					}
					case 'm': {
						isStrike = true;
						break;
					}
					case 'k': {
						isObf = true;
						break;
					}
					case 'r': {
						isItalic = false;
						isBold = false;
						isUnderlined = false;
						isStrike = false;
						isObf = false;
						txtColor = 'white';
						break;
					}
				}
				isCode = false;
			}
		}
	}

	return (!toRaw ? rf : rawformat(rf, true));
}


function rawformat(str_pieces, fullraw=true, allowed=null) {
	if(allowed == null) {
		allowed = Object.keys(_RAWCOLORS).concat(Object.keys(_RAWEFFECTS)).concat(['x', 'y']);

	}
	var txt = '';
	if(fullraw) { txt+='[""'; }

	for(var i in str_pieces) {
		var p = str_pieces[i];
		var ntext = p[0].replace(/\"/g, '\\"');
		var nm =  ntext.match(trg) || [];
		if(nm.length > 0) {
			p[7] = nm[1];
			p[8] = nm[2];
			p[9] = nm[3];
			p[10] = nm[4];
			ntext = ntext.replace(nm[0], '');
		}
		var pc = '{"text":"'+ntext+'"';
		if(p[1]) {
			if(allowed.indexOf(getColorId(p[1])) == -1) {
				p[1] = 'white';
			}

			pc+=',"color":"'+p[1].toString()+'"';

		}
		if(p[2]) {
			if(allowed.indexOf('o') > -1) {
				pc+=',"italic":true';
			}
		}
		if(p[3]) {
			if(allowed.indexOf('l') > -1) {
				pc+=',"bold":true';
			}
		}
		if(p[4]) {
			if(allowed.indexOf('n') > -1) {
				pc+=',"underlined":true';
			}
		}
		if(p[5]) {
			if(allowed.indexOf('m') > -1) {
				pc+=',"strikethrough":true';
			}
		}
		if(p[6]) {
			if(allowed.indexOf('k') > -1) {
				pc+=',"obfuscated":true';
			}
		}

		if(p[7] && p[8]) { pc+=',"clickEvent":{"action":"'+p[7]+'","value":"'+p[8]+'"}'; }
		if(p[9] && p[10]) { pc+=',"hoverEvent":{"action":"'+p[9]+'","value":"'+ccs((p[10]||"").replace(/\$/g, '\u00A7'),allowed)+'"}'; }
		pc += '}';


		txt+=( fullraw ? ',' : '' )+pc.toString();
	}

	if(fullraw) {
		txt += ']';
	}

	return txt;


}

function data_get(data, keys) {
	var get = {};
	for(var k in keys) {
		//var key = keys[k];
		get[k] = data.get(k);
		if(get[k] == null) { get[k] = keys[k]; }
	}

	return get;
}

function data_register(data, vals) {
	for(var k in vals) {
		var val = vals[k];
		if(data.get(k) == null) { data.put(k, val); }
	}
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function data_overwrite(data, keys=[], vals=[]) {
	if(typeof(keys) == 'string') { keys = [keys]; }
	if(typeof(vals) == 'string') { vals = [vals]; }

	for(var k in keys) {
		var key = keys[k];
		var val = vals[k];
		data.put(key, val);
	}
}

function posdir(pos, dir=0, pitch=0, len=1, flying=false) {
	var x = pos.getX();
	var y = pos.getY();
	var z = pos.getZ();
	var xdir = getQuartRotation(dir);
	var zdir = getQuartRotation(dir-90);
	x += Math.round(len*(Math.abs(xdir)/90)*sign(xdir));
	z += Math.round(len*(Math.abs(zdir)/90)*sign(zdir));
	if(flying) {
		y += (len)*(Math.abs(pitch)/90)*-sign(pitch);
	}
	return {x:x,y:y,z:z};
}


function fixAngle(angle) {
	angle = Math.abs(angle);
	if(angle >= 360) { angle -= 360; }
	return angle;
}

function lengthpitch_y(pitch, length) {
	return Math.round(pitch/-90)*length;
}


function lengthdir_x(angle, length=1) {
	return Math.round((getQuartRotation(angle)/90)*length);
}

function lengthdir_z(angle, length=1) {
	angle = fixAngle(angle+270);
	return -lengthdir_x(angle, length);
}

function pick(a, amount=1) {
	var index = Math.floor(Math.random() * a.length);
	amount = Math.min(a.length, amount);
	if(amount == 1) {
		return a[index];
	} else {
		var picks = [];

		while(picks.length < amount) {
			index = Math.floor(Math.random() * a.length);
			if(picks.indexOf(a[index]) == -1) { picks.push(a[index]); }
		}

		return picks;
	}
}

function escapeNbtJson(json, trim_ends=true) {
	json = json.replace(/(?:\\n|\\)/g, '');
	json = json.replace(/(\d) ([fbds]+)/g, "$1$2");
	json = json.replace(/\\("|')/g, "$1");
	if(trim_ends) {
		json = json.slice(1, json.length - 1);
	}

	return json;
}


function array_remove(array, element) {
  var index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function pickwhere(a, fn, amount) {
	return pick(array_filter(a, fn), amount);
}

function array_dist(a) {
	var b = [];
	for(var c in a) {
		if(b.indexOf(a[c]) == -1) {
			b.push(a[c]);
		}
	}

	return b;
}

function objArray(obj) {
	var a = [];
	for(var i in obj as o) {
		a.push(o);
	}
	return a;
}

function array_filter(a, fn) {
	var aa = [];
	for(var i in a) {
		if(fn(a[i])) { aa.push(a[i]); }
	}

	return aa;
}

function escCcs(str, esc_formats=null) {
	if(esc_formats == null) {
		esc_formats = _RAWCODES;
	}

	return str.replace(new RegExp('&(['+esc_formats.join("")+'])', 'g'), '');
}

function ccs(str, af=null) {
	return colorCodeString(str, af);
}

function colorCodeString(str, allowed_formats=null) {
	if(allowed_formats == null) {
		allowed_formats = Object.keys(_RAWCOLORS).concat(Object.keys(_RAWEFFECTS));
	}
	allowed_formats = removeFromArray(allowed_formats, ['x', 'y']);
	return str.replace(new RegExp("&(["+allowed_formats.join("")+"])", 'g'), '\u00A7$1').replace(/&\\/g, '&');
}

function genName(name) {
	var p = [
    'Amazing',
    'Awesome',
    'Blithesome',
    'Excellent',
    'Fabulous',
    'Fantastic',
    'Favorable',
    'Gorgeous',
    'Incredible',
    'Outstanding',
    'Perfect',
    'Propitious',
    'Remarkable',
    'Rousing',
    'Spectacular',
    'Splendid',
    'Stellar',
    'Super',
    'Upbeat',
    'Unbelievable',
    'Wondrous',
	'Tempered',
	'Legendary',
	'Magical'
	];
	var s = [
		'Destruction',
		'Slaughter',
		'Starlight',
		'Heroism',
		'Bonebreaking',
		'The Fallen',
		'Silence',
		'Spellkeeping',
		'Massacre',
		'Sanity',
		'Insanity',
		'Remorse',
		'Fury'
	];

	return pick(p) + ' ' + name + ' of ' + pick(s);
}

function nbtCopy(nbt, api) {
	return api.stringToNbt(nbt.toJsonString());
}

function getDayTime(time) {
	while(time > 24000) { time -= 24000; }
	return time;
}

function random_ranges(min, max, amount) {
	var a = 0;
	for(var i = 0; i < amount; i++) { a += random_range(min, max); }
	return a;
}

function rrandom_ranges(min, max, amount) {
	var a = 0;
	for(var i = 0; i < amount; i++) { a += rrandom_range(min, max); }
	return a;
}

function pickchance(a, amount) {
	var aa = [];
	for(var e in a) {
		if(!isArray(a[e])) {
			aa[aa.length] = a[e];
		} else {
			for(var i = 0; i < a[e][1]; i++) {
				aa[aa.length] = a[e][0];
			}
		}
	}

	return pick(aa, amount);
}

function inArray(a, val) {
	for(var k in a) { if(a[k] === val) { return true; } }
	return false
}

function rrandom_range(min, max) { return Math.round(random_range(min, max)); }

function random_range(_min, _max) {
	var min = Math.min(_min, _max);
	var max = Math.max(_min, _max);

	var diff = max - min;

	return (min + (Math.random() * diff));
}

function array_merge(a1, a2) {
	var bb = [];
	for(var k in a1) {
		bb[k] = a1[k];
	}
	for(var k in a2) {
		bb[k] = a2[k];
	}
	return bb;
}

function isArray(obj) {
	if(typeof(obj) === 'object') {
      for(var k in obj) {

          if(isNaN(k)) { return false; }
      }


      return true;
    } else { return false }
}

function isObject(obj) {
	return ( typeof(obj) === 'object' && !isArray(obj) );
}


function nbtItem(nbt, w) {
	if(typeof(nbt) == 'string') { nbt = API.stringToNbt(nbt); }
	var item = w.createItemFromNbt(nbt);

	return item;
}

function nbtItemArr(nbtArr, w) {
    var itemArr = [];
	for(var itemData in nbtArr as item){
        itemArr.push(nbtItem(item, w));
    }

    return itemArr;
}
