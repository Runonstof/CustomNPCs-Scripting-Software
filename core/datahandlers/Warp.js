registerDataHandler("warp", Warp);
function Warp(name) {
	DataHandler.apply(this, ["warp", name]);
	Permittable.apply(this, ["warps"]); //Use new domain "warps"

	this.onCreate(function(self, data){
		var perm = self.getPermission();
		perm.data.enabled = false;
		perm.save(data);
	});

	this.addData({
		"pos": {
			"x": null,
			"y": null,
			"z": null,
		},
		"price": 0,
	});
}
