registerDataHandler("automsg", AutoMsg);
function AutoMsg(name) {
    DataHandler.apply(this, ['automsg', name]);

    this.addData({
		"msg": "Default AutoMessage",
        "enabled": true,
        "mode": "interval",
        "interval": getStringTime("5min"),
        "lastSend": 0,
	});

    this.broadcast = function(pl, target) {
        executeCommand(pl, "/tellraw "+target+" "+parseEmotes(strf(this.msg)));
        return this;
    };

    this.canSend = function(){
        return new Date().getTime() >= this.lastSend+this.interval;
    };
}
