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
