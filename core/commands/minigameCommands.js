registerDataHandler("minigame", Minigame);
function Minigame(name) {
    extends function DataHandler("minigame", name);
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

function MinigameTeam(name) {
    extends function Minigame(name);
	this.data = {
		"teams": []
	};

    this.start = function(){

    }
    this.finish = function(){

    }
    this.win = function(teamName){

    }
}

@block register_commands_event
    registerXCommands([
        ["!minigame create <name>", function(pl, args, data){
            if(playerIsOnline(pl.world, args.player)) {
                var plo = new Player(pl.getName()).init(data);
                pl.world.getPlayer(args.player).kick(parseEmotes(ccs(plo.getNameTag(pl.world.scoreboard)+"\n\n&9&lHas kicked you for:&r "+args.reason.join(" "))));
            } else {
                tellPlayer(pl, "&cPlayer is not online.")
            }
        }, "minigame.create"],

        ["!minigame create <name>", function(pl, args, data){
            if(playerIsOnline(pl.world, args.player)) {
                var plo = new Player(pl.getName()).init(data);
                pl.world.getPlayer(args.player).kick(parseEmotes(ccs(plo.getNameTag(pl.world.scoreboard)+"\n\n&9&lHas kicked you for:&r "+args.reason.join(" "))));
            } else {
                tellPlayer(pl, "&cPlayer is not online.")
            }
        }, "minigame.create"],

        ["!minigame create <name>", function(pl, args, data){
            if(playerIsOnline(pl.world, args.player)) {
                var plo = new Player(pl.getName()).init(data);
                pl.world.getPlayer(args.player).kick(parseEmotes(ccs(plo.getNameTag(pl.world.scoreboard)+"\n\n&9&lHas kicked you for:&r "+args.reason.join(" "))));
            } else {
                tellPlayer(pl, "&cPlayer is not online.")
            }
        }, "minigame.create"],
    ]);
@endblock
