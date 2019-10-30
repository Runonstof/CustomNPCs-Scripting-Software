import "core\mods\noppes\Java.js";

function clonePlayerAsNpc(player) {
    var npc = API.createNPC(player.world.getMCWorld());
    var display = npc.display;
    display.setSkinPlayer(player.getName());
    display.setTint(0x777777);
    display.setShowName(0);
    

    return npc;
}
