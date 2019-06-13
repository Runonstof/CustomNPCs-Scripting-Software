registerDataHandler("clan", Clan);

var CLAN_CREATE_COST = getCoinAmount("500K");

@block register_commands_event
    var clanCommands = new CommandFactory("clan");
    clanCommands.on("create", function(clan, pl, args, data, cdata, payload){
        var plo = new Player(pl.getName()).init(data);
        if(plo.data.money >= CLAN_CREATE_COST) {
            plo.data.money -= CLAN_CREATE_COST;
            tellPlayer(pl, "&aPaid &r:money:&e500K &ato create a clan!");
            plo.save(data);
        } else {
            tellPlayer(pl, "&cYou don't have &r:money:&e500K&c to create a clan!");
            payload.cancel = true;
        }
    })
    .genDefault(["copy"])
    .register();
@endblock
