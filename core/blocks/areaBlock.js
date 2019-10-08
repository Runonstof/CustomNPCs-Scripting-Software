import "core/players/tell.js";
import "core/utils/FileUtils.js";

var plrs = {};

//Used when type is RANGE
var BLOCK_RANGE = {{! BLOCK_RANGE || 32 !}};

//Used when type is OFFSETS
var BLOCK_OFFSETS = {{! BLOCK_OFFSETS || null !}} || [
    [0,0,0], //xyz1 relative to block
    [0,0,0] //xyz2 relative to block
];

/*
RANGE - OFFSETS
*/
var DETECT_TYPE = {{! DETECT_TYPE || "RANGE" !}};
var AREA_ID = {{! AREA_ID || "UNKNOWN" !}}
@block block_tick_event

    var _plrs = e.block.world.getAllPlayers();
    //loop world players
    for(var p in _plrs as plr ) {
        var ppos = plr.pos;
        if(e.block.pos.distanceTo(ppos) < BLOCK_RANGE) {
            if(Object.keys(plrs).indexOf(plr.getUUID()) == -1) {
                var pdata = plr.storeddata;
                var regs = JSON.parse(pdata.get('AREA_BLOCKS')||'[]');
                if(regs.indexOf(AREA_ID) == 1) {
                    regs.push(AREA_ID);
                    pdata.put('AREA_BLOCKS', JSON.stringify(regs));
                }
                plrs[plr.getUUID()] = {
                    canceled: false,
                    pos: ppos
                };
                if(typeof playerEntered === "function") {
                    var pe = {
                        "player": plr,
                        "block": e.block,
                        "API": e.API,
                        "pos": ppos,
                    };
                    pe.setCanceled = _playerAreaCancel.bind(pe);
                    playerEntered(pe);
                }
            }

            var lplr = plrs[plr.getUUID()];
            if(lplr.canceled && lplr.pos != null && plr.getGamemode() != 1 && e.block.pos.distanceTo(plr.pos) <= BLOCK_RANGE-2) {
                plr.setPos(lplr.pos);
            }
            if(typeof playerInside === "function") {
                var pe = {
                    "player": plr,
                    "block": e.block,
                    "API": e.API,
                    "pos": lplr.pos,
                };
                
                playerInside(pe);
            }
        }

        var altered = false;
        var newPlrs = {};
        //loop entered players
        for(var plr_uuid in plrs as p) {
            var _plr = e.block.world.getEntity(plr_uuid);
            if(_plr) {
                if(e.block.pos.distanceTo(_plr.pos) > BLOCK_RANGE+1) {
                    altered = true;
                    if(typeof playerLeave === "function") {
                        var pe = {
                            "player": plr,
                            "block": e.block,
                            "API": e.API,
                            "pos": ppos,
                        };
                        pe.setCanceled = _playerAreaCancel.bind(pe);
                        playerLeave(pe);
                    }
                } else {
                    newPlrs[_plr.getUUID()] = {
                        "canceled": false,
                        "pos": p.pos||ppos
                    };
                }
            }
        }

        if(altered) {
            plrs = newPlrs;
        }
    }

@endblock

function _playerAreaCancel(canceled) {
    var e = this;
    if(canceled) {
        if(Object.keys(plrs).indexOf(e.player.getUUID()) > -1) {
            plrs[e.player.getUUID()].canceled = true;
        }
        
    }
}
