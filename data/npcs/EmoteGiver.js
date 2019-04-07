import core\config\*.js;
import core\npcs\makeInvulnerable.js;
import core\players\chatEmotes.js;
import core\players\executeCommand.js;
import core\players\tell.js;
import core\functions.js;
import core\players\xcommands.js;



function init(e) {
	var data = e.npc.world.getStoreddata();
	if(!data.has("GIVE_EMOTE")) {
		data.put("GIVE_EMOTE", "nether_star");
	}
}

function interact(e) {
	var data = e.npc.world.getStoreddata();
	var sb = e.player.world.getScoreboard();
	var pl = e.player;
	var plo = new Player(pl.getName()).init(data);
	if(e.player.getGamemode() == 1 && e.player.isSneaking()) {
		var mItem = e.player.getMainhandItem();
		if(mItem.getName() == "minecraft:name_tag" && mItem.hasCustomName()) {
			if(Object.keys(CHAT_EMOTES).indexOf(mItem.getDisplayName()) > -1) {
				tellPlayer(pl, "&aSet give emote to &r:"+mItem.getDisplayName()+":");
				data.put("GIVE_EMOTE", mItem.getDisplayName());
			} else {
				tellPlayer(pl, "&cEmote does not exists!");
			}
		}
		return true;
	}


	var giveEmote = data.get("GIVE_EMOTE");
	if(Object.keys(CHAT_EMOTES).indexOf(giveEmote) > -1) {
		if(!plo.hasEmote(giveEmote, sb, data)) {
			plo.data.emotes.push(giveEmote);
			plo.save(data);
			tellPlayer(pl, "&aUnlocked emote: &r:"+giveEmote+":!");
		} else {
			tellPlayer(pl, "&cYou already have this emote!");
		}
	}
}
