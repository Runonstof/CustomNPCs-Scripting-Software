@block register_commands_event
    registerXCommands([
        ["!kick <player> [...reason]", function(pl, args, data){
            if(playerIsOnline(pl.world, args.player)) {
                var plo = new Player(pl.getName()).init(data);
                pl.world.getPlayer(args.player).kick(parseEmotes(ccs(plo.getNameTag(pl.world.scoreboard)+"\n\n&9&lHas kicked you for:&r "+args.reason.join(" "))));
            } else {
                tellPlayer(pl, "&cPlayer is not online.")
            }
        }, "kick"],
    ]);
@endblock
