function Job(name) {
	extends function DataHandler('job', name);
	this.data = {
		"displayName": name,
		"pay": getCoinAmount('5g'),
		"payTime": getStringTime('20min'),
		"isOpen": false,
		"capacity": 10,
		"fireTime": getStringTime('1w'),
		"companyId": null
	};

	this.getPlayers = function(data) {
		var pl = [];
		var dkeys = data.getKeys();
		for(var d in dkeys as dkey) {
			if(dkey.cmatch(/player_(\w+)/g) == 1) {
				var player = new Player(dkey.replace(/player_(\w+)/g, '$1'));
				player.load(data);
				if(player.hasJob(this.name) && pl.indexOf(player.name) == -1) {
					pl.push(player.name);
				}
			}
		}

		return pl;
	};

	this.getDisplayName = function(data) {
		if(typeof(data) == typeof(undefined)) {
			return this.data.displayName+'&r';
		} else {
			return this.getStatusColor(data)+this.data.displayName+'&r';
		}
	}

	this.getStatusColor = function(data) {
		if(this.data.capacity == -1) {
			return '&a';
		}
		if(this.getPlayers(data).length < this.data.capacity) {
			return '&6';
		}
		return '&c';
	};
}
