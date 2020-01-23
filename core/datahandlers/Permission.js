import "core/datahandlers/Player.js";

registerDataHandler("permission", Permission);

function Permission(name) {
    DataHandler.apply(this, ['permission', name]);

    this.addData({
        "enabled": true,
        "teams": CONFIG_SERVER.DEFAULT_PERM_TEAMS,
        "players": [],
        "jobs": [],
        "meta": {}
    });

    this.set = function(key, val) {
        this.data[key] = val;
        return this;
    };

    this.addTeams = function(teams) {
        if (typeof(teams) == 'string') { teams = [teams]; }
        for (var t in teams as team) {
            var teamname = team;
            if (this.data.teams.indexOf(teamname) == -1) {
                this.data.teams.push(teamname);
            }
        }

        return this;
    };
    this.removeTeams = function(teams) {
        if (typeof(teams) == 'string') {
            teams = [teams];
        }

        var nteams = [];
        for (var t in this.data.teams as team) {
            if (teams.indexOf(team) == -1) {
                nteams.push(team);
            }
        }
        this.data.teams = nteams;
        return this;
    };
    this.addPlayers = function(players) {
        if (typeof(players) == 'string') { players = [players]; }
        for (var p in players as player) {
            if (this.data.players.indexOf(player) == -1) {
                this.data.players.push(player);
            }
        }

        return this;
    };
    this.removePlayers = function(players) {
        if (typeof(players) == 'string') { players = [players]; }
        var nplayers = [];
        for (var p in this.data.players as player) {
            if (players.indexOf(player) == -1) {
                nplayers.push(player);
            }
        }
        this.data.players = nplayers;
        return this;
    };
    this.permitsPlayer = function(pl, listenToDisabled = true) {
        return this.permits(pl.getName(), pl.world.scoreboard, pl.world.storeddata);
    };

    this.permits = function(player, sb, data, listenToDisabled = true) {
        ///String player
        ///IScoreboard sb
        ///IData data
        var team = sb.getPlayerTeam(player);
        var permitted = false;
        var p = new Player(player);
        p.load(data);

        if (this.name != "__ALL__") {
            if (new Permission("__ALL__").init(data, true).permits(player, sb, data, false)) {
                return true;
            }
        }

        //Check enabled
        if (!this.data.enabled && listenToDisabled) { return true; }

        //Check team
        if (team != null) {
            if (this.data.teams.indexOf(team.getName()) != -1) {
                permitted = true;
            }
        }
        //Check player
        if (this.data.players.indexOf(player) != -1) {
            permitted = true;
        }

        //Check jobs
        /*
        var pjobs = p.getJobs(data);
        for(var p in pjobs as pjob) {
        	if(this.data.jobs.indexOf(pjob.name) != -1) {
        		permitted = true;
        	}
        }*/

        //Check parents
        var ppar = getParentPerms(this.name || "", data);
        for (var p in ppar as par) {
            if (par.permits(player, sb, data, false)) {
                permitted = true;
                break;
            }
        }



        return permitted;
    };
}

function getParentPerms(name, data) {
    var ps = (name + "").split(".");
    var par = [];
    var cs = "";
    for (var i = 0; i < ps.length; i++) {
        if (i < ps.length - 1) {
            cs += (cs != "" ? "." : "") + ps[i];
            if (new Permission(cs).exists(data)) {
                par.push(new Permission(cs).init(data));
            }
        }
    }
    return par;

}