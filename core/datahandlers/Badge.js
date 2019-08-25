registerDataHandler("badge", Badge);
function Badge(name) {
    DataHandler.apply(this, ["badge", name]);

    this.addData({
		"displayName": "New Badge",
        "emote": "medal_bronze",
        "desc": "",
	});
}
