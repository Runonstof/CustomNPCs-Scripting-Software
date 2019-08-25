//===== CONFIG
var CONFIG_SERVER = {
	"NAME": "YourServerName",
	"TITLE": "&a&lYourServerName",
	"PREFIX": "&a&l",
	"BAR_OPEN": "&r&l[=======] &r",
	"BAR_CLOSE": "&r&l [=======]&r",
	"DEFAULT_PERM_TEAMS": [
		"Owner",
		"Developer"
	],
	"DEFAULT_PERM_PLAYERS": [],
	"DEFAULT_TEAM_JOIN": "Player",
	"DEVELOPMENT_MODE": false,
	"USE_DISK": "DEFAULT",
	"LICENSE_KEY": "",
	"FILE_DISKS": {
		"DEFAULT": {
			"path": "{worldname}/customnpcs/scripts/world_data.json",
		},
		"CST_DATA": {
			"path": "CustomServerTools/data/data.json",
		}
	}
	///"ENABLE_BOT_MEE6": true,
	//"DEFAULT_PAY": 0,
	//"DEFAULT_MONEY": 0,
	//"MONEY_POUCH_LOSE_PERC": 50,
	//"COINTABLE": {},
};

var DEFAULT_MONEY = 0;

//Configure your own time units for in arguments etc!
var msTable = {
	//Reallife time
	'y': 31556926000, //365.25 days for taking leap years into account
	'mon': 2629743830, //
	'w': 604800000,
	'd': 86400000,
	'h': 3600000,
	'min': 60000,
	's': 1000,
	'ms': 1,
};
