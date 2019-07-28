import core\mods\noppes\Java.js;

function clonePlayerAsNpc(player) {
    var npc = API.createNPC(player.world.getMCWorld());
    npc.setSkinPlayer(player.getName());
    
}
