registerDataHandler("chatchannel", ChatChannel);
function ChatChannel(name) {
	DataHandler.apply(this, ['chatchannel', name]);
	extends function Permittable; //add getPermission etc

	this.addData({
		"displayName": name,
		"players": [],
		"color": "blue",
		"desc": "",
	});
	this.addPlayers = function(players){
		for(var p in players as player) {
			this.data.players.push(player);
		}
		return this;
	};
	this.getColor = function(cr) {
		cr = cr||'&';
		return cr+getColorId(this.data.color);
	};
	this.getName = function() {
		return this.getColor()+this.data.displayName+"&r";
	};
	this.getTag = function(prefix, cr) {
		cr = cr||'&';
		return this.getColor(cr)+cr+"l[#"+this.data.displayName+(prefix||'')+"]"+cr+"r";
	};
	this.removePlayers = function(players) {
		var np = [];
		for(var p in this.data.players as player) {
			if(players.indexOf(player) == -1) {
				np.push(player);
			}
		}
		this.data.players = np;
		return this;
	};
	this.getPlayers = function(world) { //returns all online IPlayers
		var plr = world.getAllPlayers();
		var plrs = [];
		for(var p in plr as pl) {
			if(this.data.players.indexOf(pl.getName()) > -1) {
				plrs.push(pl);
			}
		}
		return plrs;
	};
	this.broadcast = function(w, msg, exc) {
		if(typeof(exc) == typeof(undefined)) { exc = []; }
		var plrs = w.getAllPlayers();
		for(var p in plrs as pl) {
			if(this.data.players.indexOf(pl.getName()) > -1 && exc.indexOf(pl.getName()) == -1) {
				tellPlayer(pl, msg);
			}
		}
		return this;
	};

	this.onCreate(function(self, data){
		var perm = self.getPermission();
		perm.data.enabled = false;
		perm.save(data);
	});
}
