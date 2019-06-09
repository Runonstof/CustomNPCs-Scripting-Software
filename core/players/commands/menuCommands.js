var CUSTOM_MENUS = {};
var MENU_TIMER_ID = 499;
var MENU_TIMER_EXEC = null;
var MENU_TIMER_PAYLOAD = {};

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

@block init_event
    reloadCustomMenusFromDisk();
@endblock

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
                                    "displayItem": {
                                        "id": e.slotItem.getId(),
                                        "count": e.slotItem.getStackSize(),
                                    }
                                }, action.payload||{});
                                
                                try {
                                    scrFunc(e, payl);
                                } catch(exc) {
                                    tellPlayer(e.player, "&cScript errored! ("+scrPath+":"+exc.lineNumber+") (Error printed in console)");
                                    print("Error in "+scrPath+":"+exc.lineNumber+"\n"+exc.message);
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

@block register_commands_event
    registerXCommands([
        ["!menu reload", function(pl, args, data){
            var output = reloadCustomMenusFromDisk();
            tellPlayer(pl, output.join("\n"));
        }, "menu.reload"],
        ["!menu open <name> [...args]", function(pl, args, data){
            if(args.name in CUSTOM_MENUS) {
                var menu = CUSTOM_MENUS[args.name];
                var container = pl.showChestGui(menu.rows);
                container.setName(parseEmotes(ccs(menu.displayName)));
                for(var i in menu.items as menitem) {
                    var item = pl.world.createItem(menitem.id, menitem.damage||0, menitem.count||1);
                    if("name" in menitem) {
                        item.setCustomName(parseEmotes(ccs(menitem.name)));
                    }
                    if("lore" in menitem) {
                        var ilore = [];
                        var lores = menitem.lore.concat(menitem.displayLore||[]);
                        for(var il in lores as ilo) {
                            ilore.push(parseEmotes(ccs("&r"+ilo)));
                        }
                        item.setLore(ilore);
                    }
                    if("nbt" in menitem) {
                        item.getNbt().merge(API.stringToNbt(JSON.stringify(menitem.nbt)));
                    }

                    var itemNbt = item.getNbt();

                    var passNbtData = [
                        "clickActions",
                        "clickFailedActions",
                        "requirements"
                    ];

                    for(var pp in passNbtData as pd) {
                        if(pd in menitem) {
                            itemNbt.setString(pd, JSON.stringify(menitem[pd]));
                        }
                    }

                    container.setSlot(parseInt(36+menitem.slot), item);

                }
            } else {
                tellPlayer(pl, "&cMenu doesn't exists!");
            }
        }, "menu.open"],
    ]);
@endblock
