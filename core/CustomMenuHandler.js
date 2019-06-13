import core\utils\ErrorHandler.js;

var CUSTOM_MENUS = {}; //Menus
var MENU_TIMER_ID = 499; //Timer id for menus
var MENU_TIMER_EXEC = null; //Timer function
var MENU_TIMER_PAYLOAD = {}; //Data for timer

@block timer_event
    if(e.id == MENU_TIMER_ID) {
        if(MENU_TIMER_EXEC != null) {
            MENU_TIMER_EXEC(e.player, MENU_TIMER_PAYLOAD);
            MENU_TIMER_EXEC = null;
        }
    }
@endblock

function reloadCustomMenusFromDisk() {
    CUSTOM_MENUS = {};
    var output = [];

    //Check if menu folder exists
    var menuDir = new File("menus");
    output.push("&6Scanning for custom menu folder: &cmenus");
    if(!menuDir.exists()) {
        output.push("&6Directory does not exists. Creating...");
        menuDir.mkdir();
        output.push("&6Created directory, loading menu's...");
    } else {
        output.push("&6Directory already exists, loading menu's...");
    }
    var menus = readDir("menus");
    output.push("&6Found &c"+menus.length+" &6menus.");
    var loaded = [];
    for(var m in menus as men) {
        try {
            var menu = JSON.parse(men);
            if(loaded.indexOf(menu.name) == -1 ) {
                output.push("&6Loading Menu:&b&o "+menu.name);
                CUSTOM_MENUS[menu.name] = menu;
                loaded.push(menu.name);
            } else {
                output.push("&6Menu &b&o"+menu.name+"&r&6 already exists!");
            }
        } catch (exc) {
            output.push("&6Error loading menu.");
            print(exc.message);
        }
    }
    return output;
}

@block customChestClicked_event
    if(!e.slotItem.isEmpty()) {
        var sNbt = e.slotItem.getNbt();
        var data = e.player.world.getStoreddata();
        var plo = new Player(e.player.getName()).init(data);
        var hasRequirements = true;
        if(sNbt.has("requirements")) {
            var reqs = JSON.parse(sNbt.getString("requirements"));

            for(var r in reqs as req) {
                if("type" in req) {
                    switch(req.type) {
                        case "currency":
                            var amount = Math.max(req.amount||0, 0);
                            if(plo.data[req.value] < amount) {
                                hasRequirements = false;
                            }
                            break;
                    }
                }
            }
        }
        var execActions = (hasRequirements ? "clickActions" : "clickFailedActions");
        if(sNbt.has(execActions)) {
            var ca = JSON.parse(sNbt.getString(execActions));
            //Execute clickActions
            for(var c in ca as action) {
                if("value" in action) {
                    action.value = action.value.replaceAll("@i", e.player.getName());
                }
                if("type" in action) {
                    switch(action.type) {
                        case "close_menu":
                            e.player.closeGui();
                            break;
                        case "open_menu":
                            e.player.closeGui();
                            MENU_TIMER_PAYLOAD["menu"] = action.value||"";
                            MENU_TIMER_EXEC = function(player, payload){
                                executeXCommand("!menu open "+payload.menu, player);
                            };
                            e.player.timers.forceStart(MENU_TIMER_ID, 1, false);
                            break;
                        case "give":
                            var items = action.items||[];
                            for(var it in items as gitem) {
                                var witem = e.player.world.createItem(gitem.id, gitem.damage||0, gitem.count||1);
                                if("name" in gitem) {
                                    witem.setCustomName(parseEmotes(ccs(gitem.name)));
                                }
                                if("lore" in gitem) {
                                    var ilore = [];
                                    for(var il in gitem.lore as ilo) {
                                        ilore.push(parseEmotes(ccs("&r"+ilo)));
                                    }
                                    witem.setLore(ilore);
                                }
                                if("nbt" in gitem) {
                                    witem.getNbt().merge(e.API.stringToNbt(JSON.stringify(gitem.nbt)));
                                }
                                e.player.giveItem(witem);
                            }
                            break;
                        case "command":
                            if("value" in action) {
                                executeCommand(e.player, action.value);
                            }
                            break;
                        case "xcommand":
                            if("value" in action) {
                                executeXCommand(action.value, e.player,false);
                            }
                            break;
                        case "script":
                            var scr = action.value||"";
                            var scrFunc = new Function('e', scr);
                            scrFunc(e);
                            break;
                        case "run_file":
                            var scrPath = action.value||"";
                            var scrFile = new File(scrPath);
                            if(scrFile.exists()) {
                                var scr = Java.from( readFile(scrPath) ).join("\n").replace(/\t/g, "  ");
                                var scrFunc = new Function('e', 'payload', scr);
                                var payl = objMerge({
                                    //defaults
                                }, action.payload||{});

                                try {
                                    scrFunc(e, payl);
                                } catch(exc) {
                                    handleError(exc, false, e.player.getName());
                                }
                            } else {
                                tellPlayer(e.player, "&cFile '"+scrPath+"' doesn't exist!");
                            }
                            break;
                    }
                }
            }
        }
    }
@endblock
