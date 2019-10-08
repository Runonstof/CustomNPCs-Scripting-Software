import "core/utils/FileUtils.js";
import "core/deobf/minecraft.js";
/*
var DP_FOLDER_PATH = "datapacks";
var DP_FOLDER = new File(DP_FOLDER_PATH);

if(!DP_FOLDER.exists()) {
    DP_FOLDER.mkdir();
}


var rgx_func = /^(?!\s*#)([\s\S]+?)$/gm;

var DP_LOADED = {};
*/


function interact(e) {
    var mcworld = e.player.world.getMCWorld();
    var worldInfo = mcworld[MCP.fields.World_worldInfo];

    e.player.message("remote: "+mcworld[MCP.fields.World_isRemote].toString());
    //print(dump(mcworld));
    e.player.message(worldInfo["func_76065_j"]());
    worldInfo["func_76062_a"]("kaaskoekjes");
    e.player.message(worldInfo["func_76065_j"]());
}
