/*
Bridge between Reskillable-Compatskills mod and Custom NPCs
*/

//Classes https://github.com/Coders-After-Dark/Reskillable/
var SkillDataHandler = Java.type('codersafterdark.reskillable.api.data.PlayerDataHandler');

function getSkills(player) {
	var skillDataList = SkillDataHandler.get(player.getMCEntity()).getAllSkillInfo().toArray();
	var retSkills = [];
	var sb = player.world.getScoreboard();
	
	for(s in skillDataList as skillData) {
		var sxp = skillData.skill.getKey().replace(/\w+\.(\w+)/g, '$1_xp');//id.name to name_xp
		
		var sb_xp = sb.getObjective(sxp);
		
		if(sb_xp == null)
			sb_xp = sb.addObjective(sxp, 'dummy');
		
		var pl_xp = sb_xp.getScore(player.getName());
		
		if(pl_xp == null) {
			pl_xp = sb_xp.createScore(player.getName());
			pl_xp.setValue(0);
		}
		
		var fskill = {
			name: skillData.skill.getName(),
			xpname: sxp,
			key: skillData.skill.getKey(),
			level: skillData.getLevel(),
			points: skillData.getSkillPoints(),
			xp: pl_xp.getValue(),
			maxXp: skillData.getLevelUpCost(),
			traits: [],
			mcSkill: skillData
		};
		//Traits iteration
		for(t in skillData.skill.getUnlockables() as trait){
			var ftrait = {
				name: trait.getName(),
				desc: trait.getDescription()
				key: trait.getKey(),
				cost: trait.getCost(),
				unlocked: skillData.isUnlocked(trait),
				mcTrait: trait
			}
			
			fskill.traits.push(ftrait);
		}
		
		retSkills.push(fskill);
	}
	
	return retSkills;
}
