function Region(name) {
	DataHandler.apply(this, ['region', name]);
	
	this.data = {
		"displayName": this.name,
		"positions": [],
		"owner": null,
		"height": 0,
		"rentStartTime": 0,
		"rentCredit": 0,
		"forSale": false,
		"salePrice": 0,
		"rentTime": -1,
		"trusted": [],
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
		['!region info <region_name>', function(pl, args){
			var data = pl.world.getStoreddata();
			var region = new Region(args.region_name);
			if(region.load(data)) {
				tellPlayer(pl, "&l[=======]&r &6&lGramados Region Info&r &l[=======]");
				tellPlayer(pl, "&eRegion name: &b"+region.name);
				tellPlayer(pl, "&eDisplay name: &r"+region.data.displayName);
				var rown = (region.data.owner == null ? '&6&lGramados' : region.data.owner);
				tellPlayer(pl, "&eOwner: &6"+rown);
				tellPlayer(pl, "&l[=======] &e&lRegion Property Info &r&l[=======]");
				tellPlayer(pl, "&eSale Price (Economy Value): &6"+getAmountCoin(region.data.salePrice));
				var rti = region.data.rentTime > -1 ? getTimeString(region.data.rentTime) : "-1 (BUY)";
				
				tellPlayer(pl, "&eRent Time: &6&o"+rti);
				var fs = region.data.forSale;
				tellPlayer(pl, "&eFor Sale: &"+(fs?'a':'c')+fs.toString());
				
			} else {
				tellPlayer(pl, "&cRegion '"+region.name+"' does not exists!");
			}
			
			return false;
		}, 'region.info'],

	]);
@endblock