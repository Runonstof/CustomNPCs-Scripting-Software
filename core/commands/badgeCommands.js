import core\xcommandsAPI.js;

import core\datahandlers\Badge.js;

//

@block register_commands_event
    var badgeCommands = new CommandFactory("badge");
    badgeCommands
        .genDefault()
        .addSettable("desc", function(desc){
            return desc.join(" ");
        }, [], null, "[...{NAME}]")
        .addSettable("emote", function(emote){return emote;}, [
            {
                "argname": "emote",
                "type": "enum",
                "value": Object.keys(CHAT_EMOTES)
            }
        ])
        .addSettable("displayName", function(name){
            return name.join(" ");
        }, [], null, "[...{NAME}]")
        .addInfoText(function(badge){
            return "&6&lDisplay Name: &r"+badge.data.displayName+" &r&4[Change]{suggest_command:!badge setDisplayName "+badge.name+" }&r\n"+
            "&6&lEmote Icon:&r :"+badge.data.emote+": ("+badge.data.emote+")\n"+
            "&6&lDescription:&r "+badge.data.desc;
        })
        .add("give <name> [...players]", function(badge, pl, args, data){
            if(args.players.length == 0) { args.players.push(pl.getName()); }
            for(var i in args.players as apl) {
                var aplo = new Player(apl);
                if(aplo.exists(data)) {
                    aplo.init(data);
                    if(aplo.data.badges.indexOf(badge.name) == -1) {
                        aplo.data.badges.push(badge.name);
                        aplo.save(data);
                    }
                }
            }

            tellPlayer(pl, "&aGave badge '"+badge.name+"' to players '"+args.players.join(", ")+"'.");
        })
        .add("take <name> [...players]", function(badge, pl, args, data){
            if(args.players.length == 0) { args.players.push(pl.getName()); }
            for(var i in args.players as apl) {
                var aplo = new Player(apl);
                if(aplo.exists(data)) {
                    aplo.init(data);
                    if(aplo.data.badges.indexOf(badge.name) > -1) {
                        var newBadges = [];
                        for(var pb in aplo.data.badges as plb) {
                            if(plb != badge.name) {
                                newBadges.push(plb);
                            }
                        }
                        aplo.data.badges = newBadges;
                        aplo.save(data);
                    }
                }
            }

            tellPlayer(pl, "&aTook badge '"+badge.name+"' from players '"+args.players.join(", ")+"'.");
        })
        .register();
@endblock
