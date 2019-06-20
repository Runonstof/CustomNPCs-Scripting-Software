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
