import "core/mods/noppes/Java.js";
import "core/utils/RunDelay.js";

function clonePlayerAsNpc(player) {
    var npc = API.createNPC(player.world.getMCWorld());
    
    npc.setPos(player.getPos());
    // npc.display.setTint(0x777777);
    npc.display.setShowName(0);
    npc.display.setName(player.getName());
    
    npc.display.setSkinPlayer(player.getName());
    
    
    
    npc.spawn();

    npc.ai.setAnimation(AnimationType_SLEEP);

    return npc;
}
