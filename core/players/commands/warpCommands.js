registerDataHandler("warp", Warp);
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
	var warpCommands = new CommandFactory("warp");
	warpCommands
		//Set some things for default commands
		.on("create", function(warp, pl, args, data){
			warp.data.pos = {
				x: pl.getPos().getX(),
				y: pl.getPos().getY(),
				z: pl.getPos().getZ(),
			};
		})
		.addInfoText(function(warp){
			return "&6&lTeleport Price: &r:money:&e"+getAmountCoin(warp.data.price)+"&r [&a:check: Set{suggest_command:!warp setPrice "+warp.name+" }&r]\n";
		})
		.addInfoText(function(warp){
			var wpos = warp.data.pos;
			return "&aX: &c"+wpos.x+"&a Y: &c"+wpos.y+"&a Z: &c"+wpos.z;
		})
		.setListTransformer(
			"{LISTITEM} {PRICE} {TPBTN} {INFOBTN} {REMOVEBTN}",
			function(warp, pl, args, data){
				var sb = pl.world.getScoreboard();
				var wperm = warp.getPermission().init(data).permits(pl.getName(), sb, data);
				var canUseTp = new Permission("warp.tp").init(data).permits(pl.getName(), sb, data);
				var tdata = {
					"PRICE": "&r:money:&e"+getAmountCoin(warp.data.price)+"&r",
					"TPBTN": (canUseTp && wperm ? "(&9Teleport{run_command:!warp tp "+warp.name+"}&r)" : ""),
				};

				return tdata;
			}
		)
		.genDefault()
		.addSettable("price", function(price){
			return getCoinAmount(price);
		}, [
			{
				"argname": "price",
				"type": "currency",
				"min": 0
			}
		], {
			"val": "&r:money:&e{price}"
		})
		.add("tp <name>", function(warp, pl, args, data){
			var plo = new Player(pl.getName()).init(data);
			if(warp.getPermission().init(data).permits(pl.getName(), pl.world.getScoreboard(), pl.world.getStoreddata())) {
				if(plo.data.money >= warp.data.price) {
						plo.data.money -= warp.data.price;
						tellPlayer(pl, "&aTook &r:money:&e"+getAmountCoin(warp.data.price)+"&a as warp tax!");
						pl.setPosition(warp.data.pos.x, warp.data.pos.y, warp.data.pos.z);
						plo.save(data);
						return true;
				} else {
					tellPlayer(pl, "&cYou don't have enough money!");
				}
			} else {
				tellPlayer(pl, "&cYou don't have access to this warp!");
			}
			return false;
		})
		.register();
@endblock
