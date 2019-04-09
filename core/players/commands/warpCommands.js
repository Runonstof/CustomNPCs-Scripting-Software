function Warp(name) {
	extends function DataHandler("warp", name);
	extends function Permittable("warps"); //Use new domain "warps"

	this.data = {
		"displayName": name,
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
		["!warp setDisplayName <name> [...displayName]", function(pl, args, data){
			var wrp = new Warp(args.name).init(data);
			wrp.data.displayName = args.displayName.join(" ");
			tellPlayer(pl, "&aChanged displayname of warp '"+args.name+"'!");
		}, "warp.setDisplayName", [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "warp",
				"exists": true,
			},
		]],

	]);
@endblock
