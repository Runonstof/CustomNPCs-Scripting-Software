var _SKILLS = [
	/*'compatskills.archery',
	'compatskills.trading',
	'compatskills.woodcutting',
	'compatskills.enchanting',*/
	'reskillable.attack',
	'reskillable.defense',
	'reskillable.farming',
	'reskillable.magic',
	'reskillable.mining',
	'reskillable.agility',
	'reskillable.building',
	'reskillable.gathering',
];

var _TRAITS = [
	//'compatskills.rename_tag',
	//'compatskills.more_deals',
];

//add xp objectives
var xp_stats = [];
var skill_names = [];
for(var s in _SKILLS) {
	xp_stats[s] = _SKILLS[s].replace(/[\w]+\.([\w]+)/g, "$1_xp"); //Converts 'reskillable.mining' to 'mining_xp'
	skill_names[s] = _SKILLS[s].replace(/[\w]+\.([\w]+)/g, "$1").rangeUpper(0,1); //Converts 'reskillable.mining' to 'Mining'
}

function getXpStatFromSkill(skill_id) {
	return skill_id.replace(/[\w]+\.([\w]+)/g, "$1_xp");
}


function getSkillNameFromSkill(skill_id) {
	return skill_id.replace(/[\w]+\.([\w]+)/g, "$1").rangeUpper(0, 1);
}

function getRawSkillString(skillname, level, xp) {
	var skn = [];
	var pxp = xp;
	var mxp = getMaxXp(level);
	if(level < 99) {
		var pcol = 'red';
		var xpprog = Math.round(100/mxp*pxp);
		
		if(xpprog >= 75) {
			pcol = 'blue';
		} else if(xpprog >= 50) {
			pcol = 'green';
		} else if(xpprog >= 25) {
			pcol = 'gold';
		}
		
		skn.push([skillname, 'blue', 0, 1]);
		skn.push([' - Level: ', 'yellow', 0, 1]);
		skn.push([level.toString()+' ', 'red']);
		skn.push(['- XP: ', 'yellow', 0, 1]);
		skn.push([pxp.toString()+'/'+mxp.toString()+' ', pcol, 0, 0]);
		skn.push([' [', 'white']);
		
		var progdone = '';
		var progtodo = '';
		
		for(var j = 0; j < Math.round(20/100*xpprog); j++) {
			progdone += '|';
		}
		
		for(var j = 0; j < Math.round(20/100*(100-xpprog)); j++) {
			progtodo += '|';
		}
		
		skn.push([progdone, 'green']);
		skn.push([progtodo, 'red']);
		skn.push(['] ', 'white']);
		//skn.push(['- Progress: ', 'yellow', 0, 1]);
		skn.push([xpprog.toString()+'%', pcol, 0, 1]);
	} else {
		skn.push([skillname, 'blue', 0, 1]);
		skn.push([' - Max Level (Total XP: ', 'green', 0, 1]);
		skn.push([pxp.toString(), 'gold', 0, 1]);
		skn.push([')', 'green', 0, 1]);
	}
	return skn;
}

function hasTraits(player, traits) {
	
	if(typeof(traits) == 'string') { traits = [traits]; }
	var s = getSkills(player, null, traits);
	var t = 0;
	for(var k in s) {
		var skill = s[k];
		for(var u in skill.unlockables) {
			if(traits.indexOf(skill.unlockables[u]) > -1) {
				t++;
			}
		}
	}
	
	return t == traits.length;
}


function getMaxXp(lvl) {
	return 10+(Math.max(lvl-1, 0)*(2*Math.max(lvl, 1)));
}

function getSkillArray(player, skills=null, traits=null) {
	var s = getSkills(player, skills, traits);
	var a = [];
	for(var n in s) { a.push(n); }
	return a;
}

function getSkills(player, skills=null, traits=null) {
	
	if(skills == null) {
		skills = _SKILLS;
	}
	if(traits == null) {
		traits = _TRAITS;
	}
	var pskills = {};
	var nbt = player.getNbt();
	var w = player.world;
	var sb = w.getScoreboard();
	var pp = nbt.getCompound('PlayerPersisted');
	var sk = pp.getCompound('SkillableData').getCompound('SkillLevels');
	for(var k in skills) {
		var skill = sk.getCompound(skills[k]);
		var unlocks = [];
		var unl = skill.getCompound('unlockables');
		var sxp = 0;
		var sxp_obj = sb.getObjective(getXpStatFromSkill(skills[k]));
		if(sxp_obj != null) {
			var sxp_sc = sxp_obj.getScore(player.getName());
			if(sxp_sc != null) {
				sxp = sxp_sc.getValue();
			}
		}
		for(var u in traits) {
			if(parseInt(unl.getByte(traits[u])) == 1) {
				unlocks.push(traits[u]);
			}
		}
		
		pskills[skills[k]] = {
			id: skills[k],
			level: skill.getInteger('level'),
			xp: sxp,
			skillPoints: skill.getInteger('skillPoints'),
			unlockables: unlocks
		};
		//print(skills[k]+': '+pskills[skills[k]].level.toString());
	}
	
	return pskills;
}
