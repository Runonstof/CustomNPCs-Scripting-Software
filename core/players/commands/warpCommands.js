function Warp(name) {
	extends function DataHandler("warp", name);
	extends function Permittable("warps"); //Use new domain "warps"

	this.onCreate(function(self, data){
		var perm = self.getPermission();
		perm.data.enabled = false;
		perm.save(data);
	});

	this.data = {
		"pos": {
			"x": null,
			"y": null,
			"z": null,
		},
		"price": 0,
	};
}


@block register_commands_event
	//REGISTER COMMANDS
	registerXCommands([
		//["", function(pl, args, data){}, "", []],
		["!warp create <name>", function(pl, args, data){
			var wrp = new Warp(args.name);
			var ppos = pl.getPos();
			wrp.data.pos.x = ppos.getX();
			wrp.data.pos.y = ppos.getY();
			wrp.data.pos.z = ppos.getZ();
			wrp.save(data);
			tellPlayer(pl, "&aCreated warp '"+args.name+"'!");
		}, "warp.create", [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": false,
			},
		]],
		["!warp remove <name>", function(pl, args, data){
			var wrp = new Warp(args.name);
			wrp.remove(data);
			tellPlayer(pl, "&aRemoved warp '"+args.name+"'!");
		}, "warp.remove", [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": true,
			},
		]],
		["!warp setPrice <name> <price>", function(pl, args, data){
			var wrp = new Warp(args.name).init(data);
			wrp.data.price = getCoinAmount(args.price);
			wrp.save(data);
			tellPlayer(pl, "&aSet price of "+args.name+" to &r:money:&e"+getAmountCoin(wrp.data.price));
			return true;
		}, 'warp.setPrice', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": true,
			},
			{
				"argname": "price",
				"type": "currency",
				"min": 0,
			},
		]],
		["!warp info <name>", function(pl, args, data){
			var wrp = new Warp(args.name).init(data);
			tellPlayer(pl, getTitleBar("Warp Info"));
			tellPlayer(pl, "&6Warp Name: &b&o"+wrp.name+"&r [&9Teleport{}&r]");
			tellPlayer(pl, "&6Permission: &9&o"+wrp.getPermission().name+"&r [&e:sun: Info{run_command:!perms info "+wrp.getPermission().name+"}&r]");
			tellPlayer(pl, "&6Teleport Price: &r:money:&e"+getAmountCoin(wrp.data.price)+"&r [&a:check: Set{suggest_command:!warp setPrice "+wrp.name+" }&r]");
			var wpos = wrp.data.pos;
			tellPlayer(pl, "&6X: &c"+wpos.x+"&6Y: &c"+wpos.y+"&6Z: &c"+wpos.z);
		}, "warp.info", [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": true,
			},
		]],
		//Teleport to warp without having to pay etc
		["!warp admintp <name>", function(pl, args, data){
			var wrp = new Warp(args.name).init(data);

		}, "warp.admintp", [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": true,
			},
		]],
		//Teleport to warp that checks for money and permission etc
		["!warp tp <name>", function(pl, args, data){
			var plo = new Player(pl.getName()).init(data);
			var wrp = new Warp(args.name).init(data);
			var permwrp = wrp.getPermission().init(data);
			if(permwrp.permits(pl.getName(), pl.world.getScoreboard(), data)) {
				if(plo.data.money >= wrp.data.price) {
					var wpos = wrp.data.pos;
					if(wpos.x != null
					&& wpos.y != null
					&& wpos.z != null) {
						if(wrp.data.price > 0) {
							plo.data.money -= wrp.data.price;
							plo.save(data);
							tellPlayer(pl, "&aTook &r:money:&e"+getAmountCoin(wrp.data.price)+"&a as warp tax!");
						}

						pl.setPosition(wpos.x, wpos.y, wpos.z);
						tellPlayer(pl, "&aTeleported to "+wrp.name+"!");
						return true;
					} else {
						tellPlayer(pl, "&cThe warp has no valid xyz-position!");
					}
				} else {
					tellPlayer(pl, "&cYou do not have enough money!");
				}
			} else {
				tellPlayer(pl, "&cYou are not allowed to use this warp!");
			}
			return false;
		}, 'warp.tp', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": true,
			},
		]],
	]);
@endblock
