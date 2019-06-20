@block register_commands_event
    registerXCommands([
        ["!kick <player> [...reason]", function(pl, args, data){
            if(playerIsOnline(pl.world, args.player)) {
                var plo = new Player(pl.getName()).init(data);
                pl.world.getPlayer(args.player).kick(parseEmotes(ccs(CONFIG_SERVER.BAR_OPEN+CONFIG_SERVER.TITLE+CONFIG_SERVER.BAR_CLOSE+"\n\n"+plo.getNameTag(pl.world.scoreboard)+"\n\n&9&lHas kicked you for:&r "+args.reason.join(" "))));
            } else {
                tellPlayer(pl, "&cPlayer is not online.")
            }
        }, "kick"],
    ]);
@endblock
