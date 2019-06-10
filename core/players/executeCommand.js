function executeCommand(player, command, as_player=null) {
	if(as_player == null) { as_player = player.getName(); }
	var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
	var cmd = API.createNPC(player.world.getMCWorld());

	return cmd.executeCommand("/execute "+as_player+" ~ ~ ~ "+command);

}
