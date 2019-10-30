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
				skill.mcSkill.setLevel(skill.level+1);
				skill.sbScore.setValue(skill.xp - skill.maxXp);
				if(typeof callback === 'function') {
					var e = {
						player: player,
						skill: getPlayerSkill(player, skill.name)
					};
					if(typeof callback === 'function') {
						callback(e);
					}
				}
				
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
			var skillslug = skillData.skill.getKey().replace(/\w+(?:\.|:)(\w+)/g, '$1');
			var sxp = skillslug+'_xp';//id.name to name_xp

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
				skillslug: skillslug,
				xpname: sxp,
				key: skillData.skill.getKey(),
				level: skillData.getLevel(),
				points: skillData.getSkillPoints(),
				xp: pl_xp.getValue(),
				maxXp: getMaxXp(skillData.getLevel()),
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
		if(skills[i].key == skill_id
		|| skills[i].name == skill_id
		|| skills[i].skillslug == skill_id
		) {
			return skills[i];
		}
	}

	return null;
}


function givePlayerXP(player, skill_id, amount) {
	var _API = Java.type("noppes.npcs.api.NpcAPI").Instance();
	var cmd = _API.createNPC(player.world.getMCWorld());
	var skill = getPlayerSkill(player, skill_id);
	amount = Math.round(amount);
	var xpname = skill_id.replace(/\w+(?:\.|:)(\w+)/g, '$1')+'_xp';
	if(skill) {
		var event = {
			player: player,
			skill: skill,
			amount: amount,
			_canceled: false,
			setCanceled: function(bool){
				this._canceled = bool;
			}
		};
		if(typeof skillGetXP === 'function') {
			skillGetXP(event);
		}
	
		if(!event._canceled) {
			var putamount = Math.round(event.amount);
			var cmdOutput = cmd.executeCommand("/scoreboard players "+(putamount > 0 ? "add" : "remove")+" "+player.getName()+" "+xpname+" "+Math.abs(putamount).toString());
			

			if(typeof skillHasXP === 'function') {
				
				skillHasXP(objMerge(event,{
					skill: getPlayerSkill(player, skill_id)
				}));
			}
		}

	} else {
		handleError({
			'fileName': 'function givePlayerXP',
			'message': '\''+skill_id+'\' is not a registered skill id!',
			'stack': 'Blame Runonstof'
		});
	}

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
