registerDataHandler("giftcode", GiftCode);

function GiftCode(name) {
	DataHandler.apply(this, ['giftcode', name]);
	Permittable.apply(this, ['giftcodes']);
	this.data = {
		"code": "",
        "uses": 0,
        "items": [],
		"money": 0,
		"emotes": [],
		"players": [], //redeemed players
	};

	this.onCreate(function(self, data){
		var perm = self.getPermission();
        perm.data.enabled = false;
        perm.save(data);
    });

    this.generateCode = function(){
        var code = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 6; i++)
            code += chars.charAt(Math.floor(Math.random() * chars.length));

        this.data.code = code;
    };

    this.getUsesLeft = function(pl){
        if(this.data.uses == -1) return "infinite";
        return this.data.uses;
    };

    this.redeem = function(pl, data){
		var perm = this.getPermission().init(data);
		if(!perm.permits(pl.getName(), pl.world.getScoreboard(), data)){
			tellPlayer(pl, "&cYou don't have permission to use this code!");
			return false;
		}

		var p = new Player(pl.getName()).init(data);
		if(this.data.uses == 0){
			tellPlayer(pl, "&cMax uses reached");
			return false;
		}
		if(this.data.players.indexOf(pl.getName()) > -1){
			tellPlayer(pl, "&cYou already activated this code");
			return false;
		}
		//give
		if(this.data.emotes.length > 0){
			for(var n in this.data.emotes as emote) {
				if(p.data.emotes.indexOf(emote) == -1) {
	          		p.data.emotes.push(emote);
	        	}
        	}
		}
		if(this.data.items.length > 0) givePlayerItems(pl, nbtItemArr(this.data.items, pl.world));
		if(this.data.money > 0) givePlayerItems(pl, genMoney(pl.world, this.data.money));

		if(this.data.uses > 0) { //keep -1 special
			this.data.uses -= 1;
		}
		this.data.players.push(pl.getName());
		this.save(data);
		p.save(data);
		tellPlayer(pl, "&aCode '"+this.name+"&a' activated!");
		return true;
    };

}
