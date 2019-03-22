/*
Bridge between Reskillable-Compatskills mod and Custom NPCs
*/

function getMaxXp(level) {
	return 10+(5+(level*2))*level;
}

function getSkills(player, pnbt=null) {
	if(pnbt == null) { pnbt = player.getEntityNbt(); }
	var w = player.world;
	var sb = w.getScoreboard();
	var skillData = pnbt
		.getCompound('ForgeData')
		.getCompound('PlayerPersisted')
		.getCompound('SkillableData')
		.getCompound('SkillLevels');
	var skillKeys = skillData.getKeys();
	
	var retSkills = [];
	
	for(s in skillKeys as skey) {
		var sname = skey.replace(/\w+\.(\w+)/g, '$1').rangeUpper(0, 1);//id.name to Name
		var sxp = skey.replace(/\w+\.(\w+)/g, '$1_xp');//id.name to name_xp
		var sb_xp = sb.getObjective(sxp);
		
		if(sb_xp == null) {
			sb_xp = sb.addObjective(sxp, 'dummy');
		}
		
		var pl_xp = sb_xp.getScore(player.getName());
		if(pl_xp == null) {
			pl_xp = sb_xp.createScore(player.getName());
			pl_xp.setValue(0);
		}
		
		var skillLevel = skillData.getCompound(skey).getInteger('level');
		var skillPoints = skillData.getCompound(skey).getInteger('skillPoints');
		
		var fskill = {
			name: sname,
			xpname: sxp,
			key: skey,
			level: skillLevel,
			points: skillPoints,
			xp: pl_xp.getValue(),
		};
		retSkills.push(fskill);
	}
	
	return retSkills;
}
