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
			return "&6Teleport Price: &r:money:&e"+getAmountCoin(warp.data.price)+"&r [&a:check: Set{suggest_command:!warp setPrice "+warp.name+" }&r]";
		})
		.addInfoText(function(warp){
			var wpos = warp.data.pos;
			return "&6X: &c"+wpos.x+"&6 Y: &c"+wpos.y+"&6 Z: &c"+wpos.z;
		})
		.genDefault()
		.addSettable("price", [], function(price){
			return getCoinAmount(price);
		},{
			"val": "&r:money:&e{price}"
		})
		.register();
@endblock
