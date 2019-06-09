import core\functions.js;
import core\players\executeCommand.js;

function interact(e){
	yield interact_event;
	var mount = e.npc.getMount();

	if(mount != null) {
		if(e.player.getMount() == null) {
			e.player.setMount(mount);
		} else {
			executeCommand(e.player, "/tellraw @a "+strf("&cPew!"));
		}
	}
}
