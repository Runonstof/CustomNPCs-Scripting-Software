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
