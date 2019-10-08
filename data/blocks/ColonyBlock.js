import "core/mods/noppes/IData.js";

var COLONY_ID = null;

function tick(e) {
    var data = e.block.storeddata;
    var wdata = e.block.world.storeddata;
    if(COLONY_ID == null && data.has('COLONY_INFO')) {
        var colonyInfo = JSON.parse(data.get('COLONY_INFO'));
        COLONY_ID = colonyInfo.id;
        var clan = new Colony(COLONY_ID);
        if(clan.exists(wdata)) {
            
        }
    }
}

function getColony() {
    if(COLONY_ID) {
        return new Colony(COLONY_ID);
    }
}