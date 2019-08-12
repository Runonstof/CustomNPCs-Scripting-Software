import core\xcommandsAPI.js;


import core\players\CustomMenus\CustomMenu.js;



@block register_commands_event

    registerXCommands([
        ["!menu open <file>", function(pl, args, data){
            var path = "menus/"+args.file+".json";
            var menuFile = new File(path);
            if(menuFile.exists()){
                var json = readFileAsString(path);
                try {
                    json = JSON.parse(json);
                } catch(exc) {
                    handleError(exc, true, pl.getName());
                }

                var menu = new CustomMenu().fromJson(json);
                var c = menu.open(pl);
                tellPlayer(pl, "The size is: "+c.getSize());
            } else {
                tellPlayer(pl, "&cFile '"+path+"' doesn't exists!");
            }
        }, "menu.open"]
    ]);
@endblock
