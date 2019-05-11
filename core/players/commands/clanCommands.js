registerDataHandler("clan", Clan);
function Clan(name) {
    extends function  DataHandler("clan", name);
    this.data = {
        "displayName": name,
        "desc": "",
        "money": 0,
        "players": {},
        "tier": 0,
    };

    this.addPlayer = function(name, rank=0) {
        if(!this.hasPlayer(name)) {
            this.data.players[name] = {
                "name": name,
                "rank": 0,
            };
        }
    };

    this.hasPlayer = function(name) {
        return Object.keys(this.data.players).indexOf(name) > -1;
    };
}

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
