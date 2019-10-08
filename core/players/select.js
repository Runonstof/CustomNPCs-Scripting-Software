/*
world.storeddata refers to e.player.world.storeddata ofcourse
*/

var oil_treater = new Job('oil_treater');
oil_treater.data.displayName = "&cOil &cTreater";
oil_treater.data.pay = 10;


oil_treater.addPlayer("Runonstof").save(world.storeddata);



var cool_warp = new Warp('cool_warp');
cool_warp.data.displayName = "&aCool Warp!";
cool_warp.data.x = 1000;
cool_warp.data.y = 50;
cool_warp.data.z = 500;
cool_warp.save(world.storeddata);


cool_warp.tpPlayer(iPlayerObject);

function DataHandler(type, name) {
    this.data = {};

    this.dataname = type+"_"+name;

    this.save = function(data) { //IData
        data.put(this.dataname, JSON.stringify(this.data));

        return this;
    };

    this.exists = function(data) {
        return data.has(this.dataname);
    };

    this.remove = function(data) {
        if(this.exists(data)) {
            data.remove(this.dataname);
            return true;
        }
        return false;
    };

    this.load = function(data) { //Loads from data if exists
        if(this.exists(data)) {
            this.data = JSON.parse(data.get(this.dataname));
        }
        return this;
    };

    this.init = function(data) { //Loads from data, creates if not exists
        if(!this.exists(data)) {
            this.save(data);
        }

        this.load(data);
        return this;
    };

    this.addData = function(dhdata){
        this.data = Object.assign({}, this.data, dhdata);

        return this;
    };
}


function Job(name) {
    DataHandler.apply(this, ['job', name]);
    this.addData({
        'displayName': name,
        'pay': 0,
        'payTime': 10000,
        'players': []
    });

    this.hasPlayer = function(playername) {
        return this.data.players.indexOf(playername) > -1;
    };

    this.addPlayer = function(playername) {
        if(!this.hasPlayer(playername)) {
            this.data.players.push(playername);
        }
        return this;
    };

    this.removePlayer = function(playername) {
        if(this.hasPlayer(playername)) {
            this.data.players.splice(this.data.players.indexOf(playername), 1);
        }

        return this;
    };
}

function Warp(name) {
    DataHandler.apply(this, ['warp', name]);
    this.addData({
        'x': null,
        'y': null,
        'z': null,
        'displayName': name
    });

    this.tpPlayer = function(iplayer){
        if(this.data.x != null
        && this.data.y != null
        && this.data.z != null) {
            iplayer.setPosition(this.data.x, this.data.y, this.data.z);
        }

        return this;
    }
}
