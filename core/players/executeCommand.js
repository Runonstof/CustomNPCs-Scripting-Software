import core\mods\noppes\Java.js;

function executeCommand(player, command, as_player=null) {
	if(as_player == null) { as_player = player.getName(); }
	var cmd = API.createNPC(player.world.getMCWorld());

	return cmd.executeCommand("/execute "+as_player+" ~ ~ ~ "+command);

}

function executeCommandGlobal(command) {
	return API.createNPC(API.getIWorld(0).getMCWorld()).executeCommand(command);
}
