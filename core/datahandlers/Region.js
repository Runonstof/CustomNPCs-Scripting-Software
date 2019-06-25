function Region(name) {
	DataHandler.apply(this, ['region', name]);
	Permittable.apply(this, ['regions']); //Uses custom permission domain 'regions'


	this.data = {
		"displayName": this.name,
		"positions": [],
		"owner": null,//
		"rentStartTime": 0,
		"maxRentCredit": -1,
		"rentCredit": 0,
		"forSale": false,
		"priority": 0,
		"salePrice": 0,
		"rentTime": -1,
		"allInteract": false,
		"allBuild": false,
		"allAttack": false,
		"trusted": [],//
	};

	/*String player, IScoreboard sb, IData data*/
	this.can = function(player, sb, data, action=null) {
		var perm = this.getPermission().init(data);
		var canAction = false;

		switch(action) {
			case "interact":
				if(this.data.allInteract) canAction = true;
				break;
			case "build":
				if(this.data.allBuild) canAction = true;
				break;
			case "attack":
				if(this.data.allAttack) canAction = true;
				break;

		}

		return (
			this.data.owner == player
		|| 	this.data.trusted.indexOf(player) > -1
		||  perm.permits(player, sb, data)
		||	canAction
		);
	}
	/*Array xyz1, Array xyz2*/
	this.addPos = function(xyz1, xyz2) {
		var newPos = {
			xyz1: xyz1,
			xyz2: xyz2,
		};
		this.data.positions.push(newPos);

		return this;
	};
	this.addCoord = function(xyz) {
		//Check if there is a half-position
		var hasHalfPos = false;
		for(var i in this.data.positions as pos) {
			if(pos.xyz1 == null || pos.xyz2 == null) {
				pos.xyz1 = pos.xyz1||xyz;
				pos.xyz2 = pos.xyz2||xyz;

				this.data.positions[i] = pos;
				hasHalfPos = true;
				break;
			}
		}
		if(!hasHalfPos) {
			this.addPos(xyz, null);
		}

		return this;
	};
	/*Array xyz*/
	this.getPos = function(xyz) { //Gets cube number of xyz coord
		for(var i in this.data.positions as pos) {//Loop cubes

			if(pos.xyz1 != null && pos.xyz2 != null) { //Check is valid cube
				var minx = Math.min(pos.xyz1[0], pos.xyz2[0]);
				var miny = Math.min(pos.xyz1[1], pos.xyz2[1]);
				var minz = Math.min(pos.xyz1[2], pos.xyz2[2]);

				var maxx = Math.max(pos.xyz1[0], pos.xyz2[0]);
				var maxy = Math.max(pos.xyz1[1], pos.xyz2[1]);
				var maxz = Math.max(pos.xyz1[2], pos.xyz2[2]);

				var x = xyz[0];
				var y = xyz[1];
				var z = xyz[2];

				if(x >= minx
				&& x <= maxx

				&& y >= miny
				&& y <= maxy

				&& z >= minz
				&& z <= maxz) {
					return parseInt(i);
				}
			}
		}

		return -1;
	};

	this.hasCoord = function(xyz) { //Check if xyz is in region
		return (this.getPos(xyz) > -1);
	}
}
