//===== CONFIG
var SERVER_NAME = "Gramados";
var SERVER_PREFIX = "&6&l"; //Colorcode for output for like the name, 
var SERVER_BAR_OPEN = "&r&l<-=======] &r"; //For output
var SERVER_BAR_CLOSE = "&r&l [=======->&r";//also for output
var BAR_OPEN = "&l["; //For a small bar
var BAR_CLOSE = "&l]";

var DEFAULT_MONEY = 5000000; //Starters money in the smallest units set in currency.js

var DEFAULT_TEAMS = [ //Default scoreboard teams that gets added when permission is created
	"Owner",
	"Developer",
];
var DEFAULT_PLAYERS = [ //Default players that gets added when permission is created

];
//Team that player autojoins when player has no team
//set to null to disable
var DEFAULT_TEAM_JOIN = "Player";
//var DEFAULT_TEAM_JOIN = null; //Do this to disable auto-join




//Configure your own time units!
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
