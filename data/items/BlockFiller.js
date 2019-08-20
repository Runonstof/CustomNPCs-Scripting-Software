import "core\mods\noppes\Java.js";
import "core\JavaScript\String.js";
import "core\JavaScript\Object.js";
import "core\players\tell.js";

////
var positions = [
    {x:null,y:null,z:null},
    {x:null,y:null,z:null}
];

var setblock = null;

function setPosition(num, pos) {
    positions[num].x = pos.x;
    positions[num].y = pos.y;
    positions[num].z = pos.z;
}

var MSG = "&aSet position #{NUM} to {x}, {y}, {z}!";


function interact(e) {
    if(e.type == 2) {
        if(!e.player.isSneaking()) {
            setPosition(1, e.target.pos);
            tellPlayer(e.player, MSG.fill({
                "NUM": 2,
                "x": e.target.pos.x,
                "y": e.target.pos.y,
                "z": e.target.pos.z,
            }));
            e.setCanceled(true);
        } else {
            var _pos = positions;
            var isValid = true;
            for(var p in _pos as pp) {
                for(var a in pp as u) {
                    if(pp[u] == null) {
                        isValid = false;
                    }
                }
            }
            if(setblock == null) {
                isValid = false;
            }
            tellPlayer(e.player, "/fill {x1} {y1} {z1} {x2} {y2} {z2} {block} {meta} &2[COPY]{suggest_command:/fill {x1} {y1} {z1} {x2} {y2} {z2} {block} {meta}}&r".fill({
                "x1": _pos[0].x,
                "y1": _pos[0].y,
                "z1": _pos[0].z,
                "x2": _pos[1].x,
                "y2": _pos[1].y,
                "z2": _pos[1].z,
                "block": setblock.getName(),
                "meta": setblock.getMetadata()
            }));
            if(isValid) {
                tellPlayer(e.player, "/fill {x1} {y1} {z1} {x2} {y2} {z2} {block} {meta} &2[COPY]{suggest_command:/fill {x1} {y1} {z1} {x2} {y2} {z2} {block} {meta}}&r".fill({
                    "x1": _pos[0].x,
                    "y1": _pos[0].y,
                    "z1": _pos[0].z,
                    "x2": _pos[1].x,
                    "y2": _pos[1].y,
                    "z2": _pos[1].z,
                    "block": setblock.getName(),
                    "meta": setblock.getMetadata()
                }));
            } else {
                tellPlayer(e.player, "&cYou have not set a valid position or not set a block.");
            }
        }
    }
}
function attack(e) {
    if(e.type == 2) {
        if(!e.player.isSneaking()) {

            setPosition(0, e.player.pos);
            tellPlayer(e.player, MSG.fill({
                "NUM": 1,
                "x": e.target.pos.x,
                "y": e.target.pos.y,
                "z": e.target.pos.z,
            }));
            e.setCanceled(true);
        } else {
            setblock = e.target;
            e.setCanceled(true);
        }
    }
}
