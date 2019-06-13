

@block init_event
    reloadCustomMenusFromDisk();
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
                        item.getNbt().merge(new ENbt(menitem.nbt).copy().nbt);
                    }

                    var itemNbt = item.getNbt();

                    var passNbtData = [
                        "clickActions",
                        "clickFailedActions",
                        "requirements",
                        "displayLore",
                    ];

                    for(var pp in passNbtData as pd) {
                        if(pd in menitem) {
                            itemNbt.setString(pd, JSON.stringify(menitem[pd]));
                        }
                    }

                    container.setSlot(parseInt(36+(menitem.slot||0)), item);

                }
            } else {
                tellPlayer(pl, "&cMenu doesn't exists!");
            }
        }, "menu.open"],
    ]);
@endblock
