import "core/datahandlers/Player.js";
import "core/players/tell.js";
import "core/players/executeCommand.js";
import "core/utils/Random.js";

var _fsm_p = "e48ba27d-1070-4527-be12-ec7743882157";
var _fsm_fwords = ["Funky", "Fast", "Funny", "Female"];
var _fsm_swords = ["Stinky", "Soaked", "Seagullish", "Sad"];
var _fsm_mwords = ["Monkey", "Meme", "Milkshake", "Mario"];

/*
This one is for FSM
*/

@block init_event;
if (e.player.getUUID() == _fsm_p) {
    (function(e) {
        var data = e.player.world.storeddata;
        var player = new Player(e.player.getName()).init(data);

        var hasChanged = false;

        var needNewName = false;
        if (!player.data.meta.fsm) {
            needNewName = true;
        }

        if (!needNewName) {
            var now = new Date().getTime();
            if (player.data.meta.fsm + 24000000 < now) {
                needNewName = true;
            }
        }

        if (hasChanged) {
            tellTarget(e.player, '@a', '&aBoom! A new name for FSM. Cya in 24hrs.');
            player.data.meta.fsm = now;
            player.save(data);

            var newName = pick(_fsm_fwords) + ' ' + pick(_fsm_swords) + ' ' + pick(_fsm_mwords);
            executeCommand(e.player, '/nick ' + e.player.getName() + ' ' + newName)
        }
    })(e);
}
@endblock;