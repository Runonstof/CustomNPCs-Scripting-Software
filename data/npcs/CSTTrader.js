import "core\functions.js";
import "core\players\executeCommand.js";
import "core\players\tell.js";
import "core\mods\noppes\*.js";

//

function init(e) {
    yield init_event;

    var display = e.npc.display;
    var ai = e.npc.ai;

    // ai.setReturnsToHome(false);

}

function load(e) {
    yield load_event;
}

function interact(e) {
    //
    yield interact_event;
    //
    if (e.npc.getRole().getType() == 1 && e.player.getGamemode() == 1) {
        if (e.player.isSneaking()) {

        } else {
            tellPlayer(e.player, "&cYou cannot trade with this trader in creative mode! &4[Why?]{*|show_text:$cThis is an patched trader to work with items from mods like $c$oAnimania$r$c and $c$oHarvestCraft$r$c and adds more functionalities to traders. Those functionalities don't work to well if player is in creative}&r");
        }
        e.setCanceled(true);
    }
}

function timer(e) {
    yield timer_event;
}

function tick(e) {
    yield tick_event;
}

function collide(e) {
    yield collide_event;
}

function damaged(e) {
    yield damaged_event;
}

function died(e) {
    yield died_event;
}

function kill(e) {
    yield kill_event;
}

function meleeAttack(e) {
    yield meleeAttack_event;
}

function rangedAttack(e) {
    yield rangedAttack_event;
}

function target(e) {
    yield target_event;
}

function targetLost(e) {
    yield targetLost_event;
}

function role(e) {
    yield role_event;
    var w = e.player.world;
    var pnbt = e.player.getEntityNbt();
    var npcnbt = e.npc.getEntityNbt();

    var tradeIgnoreNbt = (parseInt(npcnbt.getByte('TraderIgnoreNBT')) == 1);
    var role = e.npc.getRole();
    if (role.getType() == 1) {
        if (e.isCancelable()) {
            if (e.sold != null) {
                var inv = e.player.getInventory();
                var invItems = getPlayerInvFromNbt(pnbt, w, function(item, itnbt) {
                    //Exclude armor slots and offhand
                    return ["-106", "100", "101", "102", "103"].indexOf(itnbt.getByte('Slot').toString()) == -1;
                }).length;

                if (invItems == 36) {
                    tellPlayer(e.player, "&cYou can't trade, because your inventory is full. &4[Why?]{*|show_text:$cThis is a patched trader and this is to prevent an exploit.}&r");
                    e.setCanceled(true);
                    return false;
                }


                var canTrade = true;
                var currency = [
                    e.currency1,
                    e.currency2,
                ];

                for (var c in currency as crncy) {
                    if (crncy != null) {
                        var reqamount = crncy.getStackSize();
                        if (getInvItemCount(pnbt, crncy, w, tradeIgnoreNbt) < reqamount) {
                            canTrade = false;
                        }
                    }
                }

                if (canTrade) {
                    for (var c in currency as crncy) {
                        if (crncy != null) {

                            e.player.removeItem(crncy, crncy.getStackSize());

                        }
                    }
                    e.player.giveItem(e.sold);

                }

                e.setCanceled(true);
            }
        }
    }
}