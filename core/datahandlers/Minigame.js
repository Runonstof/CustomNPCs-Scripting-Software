registerDataHandler("minigame", Minigame);
function Minigame(name) {
    DataHandler.apply(this, ["minigame", name]);
	this.data = {
		"from": null,
		"to": [],
		"title": "",
		"message": ""
	};

    this.start = function(){

    }
    this.win = function(){

    }
}
