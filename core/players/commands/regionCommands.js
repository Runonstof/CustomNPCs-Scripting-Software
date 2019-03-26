function Region(name) {
	extends function DataHandler('region', name);
	
	this.data = {
		"displayName": this.name,
		"positions": [],
		"owner": null,
		"rentStartTime": 0,
		"maxRentCredit": -1,
		"rentCredit": 0,
		"forSale": false,
		"salePrice": 0,
		"rentTime": -1,
		"trusted": [],
	};
	this.getPermission = function() { //Permission for admin-override
		return new Permission('region.'+this.name);
	};
	/*IPlayer player, IData data*/
	this.canInteract = function(player, data) {
		
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
	/*Array xyz*/
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
			
			&& y >= miny
			&& y <= maxy
			
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
		//['', function(pl, args){}, '', []],
		['!region add <name> [...display_name]', function(pl, args, data){
			var region = new Region(args.name);
			if(args.display_name.length > 0) { region.data.displayName = args.display_name.join(" "); }
			region.save(data);
			return true;
		}, 'region.add', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": false
			}
		]],
		['!region list [...matches]', function(pl, args, data){
			var dkeys = data.getKeys();
			
			tellPlayer(pl, "&l[=======] &6&lGramados Regions&r &l[=======]");
			for(d in dkeys as dkey) {
				if(dkey.cmatch(/region_(\w)/g) > 0) {
					var region = new Region(dkey.replace(/region_(\w)/g, '$1'));
					region.load(data);
					if(args.matches.length == 0 || arrayOccurs(region.name.toLowerCase(), args.matches) > 0) {
						tellPlayer(pl, "&e - &b"+region.name);
					}
				}
			}
			
			return true;
		}, 'region.list'],
		['!region remove <name>', function(pl, args, data){
			var region = new Region(args.name);
			region.remove(data);
			tellPlayer(pl, "&aRemoved "+region.name+"!");
			return true;
		}, 'region.remove', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": true
			}
		]],
		
	]);
@endblock