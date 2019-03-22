function Region(name) {
	DataHandler.apply(this, ['region', name]);
	
	this.data = {
		"displayName": this.name,
		"positions": [],
		"owner": null,
		"rentStartTime": 0,
		"rentCredit": 0,
		"forSale": false,
		"salePrice": 0,
		"rentTime": -1,
		"trusted": [],
	};
	
	this.addPos = function(xyz1, xyz2) {
		var newPos = {
			xyz1: xyz1,
			xyz2: xyz2,
		};
		this.data.positions.push(newPos);
		
		return this;
	};
	this.hasCoord = function(xyz) { //Check if xyz is in region
		for(var i in this.data.positions as pos) {
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
			&& y >= minx
			&& y <= maxx
			&& z >= minz
			&& z <= maxz) {
				return true;
			}
		}
		
		return false;
	};
}

@block register_commands_event
	//REGISTER REGION COMMANDS
	registerXCommands([
		//['', function(pl, args){}, ''],
		['!region add <name> [...display_name]', function(pl, args){
			var region = new Region(args.name);
			var data = pl.world.getStoreddata();
			if(!region.exists(data)) {
				var dname = args.display_name.join(" ");
				if(dname != "") {
					region.data.displayName = dname;
				}
				region.save(data);
				tellPlayer(pl, "&aAdded region '"+args.name+"'!");
				return true;
			} else {
				tellPlayer(pl, "&cRegion '"+args.name+"' already exists!");
			}
			
			return false;
		}, 'region.add'],
		['!region list [...matches]', function(pl, args){
			var data = pl.world.getStoreddata();
			var dkeys = data.getKeys();
			
			tellPlayer(pl, "&l[=======] &6&lGramados Regions&r &l[=======]");
			for(d in dkeys as dkey) {
				if(dkey.cmatch(/region_(\w)/g) > 0) {
					var region = new Region(dkey.replace(/region_(\w)/g, '$1'));
					region.load(data);
					if(args.matches.length == 0 || arrayOccurs(region.name, args.matches) > 0) {
						tellPlayer(pl, "&e - &b"+region.name);
					}
				}
			}
			
			return false;
		}, 'region.list'],
		

	]);
@endblock