import core\players\tell.js;
import core\JavaScript\*.js;

var NPCDATA = {
	"HP_BASE": 20,
	"HP_INCR": 2,
	"DMG_BASE": 3,
	"DMG_INCR": 0.5,
	"LEVEL": 1,
	"NAME": "Zombie"
};

function reloadNpcData(data) {
	for(var key in NPCDATA as val) {
		if(!data.has(key)) { data.put(key, val); }
		else {
			NPCDATA[key] = data.get(key);
		}
	}
}

function updateNpc(npc) {
	var lc = getLevelColor(NPCDATA.LEVEL);
	var newName = "&{X}&l[{LEVEL}]&r&{X} {NAME}&r".fill({
		"LEVEL": NPCDATA.LEVEL,
		"NAME": NPCDATA.NAME,
		"X": lc
	});
	var disp = npc.getDisplay();

	var barLen = 20;

	var newTitle = "&f[[";
	var hp = npc.getHealth();
	var hpm = npc.getMaxHealth();
	for(var i = 0; i < barLen; i++) {
		newTitle += "&"+(i <= barLen/hpm*hp ? "a": "c")+"|";
	}
	newTitle += "&f]]&r";

	if(disp.getName() != newName) {
		disp.setName(ccs(newName));
	}
	if(disp.getTitle() != newTitle) {
		disp.setTitle(ccs(newTitle));
	}
}

var LVL_COLORS = [
	'a',
	'b',
	'9',
	'1',
	'd',
	'c',
	'4',
];
var LVL_MAX = 100;

function getLevelColor(level) {
	return LVL_COLORS[Math.floor(LVL_COLORS.length/LVL_MAX*level)];
}

function init(e) {
	var data = e.npc.getStoreddata();
	reloadNpcData(data);
}

function tick(e) {
	updateNpc(e.npc);
}
