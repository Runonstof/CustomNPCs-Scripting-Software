import "core/mods/noppes/Java.js";
/*
Bridge between Reskillable-Compatskills mod and Custom NPCs
*/

//Classes https://github.com/Coders-After-Dark/Reskillable/

/**
 * Checks if player can level up, and executes optional callback
 * @param {IPlayer} player The player
 * @param {function||null} callback Optional callback when leveling up
 */
function checkLevelUp(player, callback=null) {
	if(hasMCMod("reskillable")) {
		var skillData = getPlayerSkills(player);
		for(var i = 0; i < skillData.length; i++) {
			var skill = skillData[i];
			if(skill.xp >= skill.maxXp) {
				if(typeof callback === 'function') {
					var e = {
						player: player,
						skill: skill
					};
					if(typeof callback === 'function') {
						callback(e);
					}
				}
				skill.mcSkill.setLevel(skill.level+1);
				skill.sbScore.setValue(skill.xp - skill.maxXp);
			}
		}
	}
}

/**
 * 
 * @param {IPlayer} player Player to get skills from
 */
function getPlayerSkills(player) {
	
	if(hasMCMod("reskillable")) {
		var SkillDataHandler = Java.type('codersafterdark.reskillable.api.data.PlayerDataHandler');
		var skillDataList = SkillDataHandler.get(player.getMCEntity()).getAllSkillInfo().toArray();
		var retSkills = [];
		var sb = player.world.getScoreboard();

		for(var s in skillDataList as skillData) {
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
				mcSkill: skillData,
				sbObjective: sb_xp,
				sbScore: pl_xp
			};
			//Traits iteration
			for(var t in skillData.skill.getUnlockables() as trait){
				var ftrait = {
					name: trait.getName(),
					desc: trait.getDescription(),
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
	} else {
		return [];
	}
}

function getPlayerSkill(player, skill_id) {
	var skills = getPlayerSkills(player);

	for(var i in skills) {
		if(skills[i].key == skill_id) {
			return skills[i];
		}
	}

	return null;
}

function getBTW(prijs) {
	return prijs * 1.23;
}


function givePlayerXP(player, skill_id, amount) {
	var _API = Java.type("noppes.npcs.api.NpcAPI").Instance();
	var cmd = _API.createNPC(player.world.getMCWorld());
	var skill = getPlayerSkill(player, skill_id);
	var xpname = skill_id.replace(/\w+\.(\w+)/g, '$1_xp');

	cmd.executeCommand("/scoreboard players set "+xpname+" "+(amount > 0 ? "add" : "remove")+" "+Math.abs(amount).toString());


	if(skillGetXp) {
		skillGetXp({
			player: player,
			skill: skill
		});
	}
}