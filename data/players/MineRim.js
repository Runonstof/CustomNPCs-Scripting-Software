import "core/mods/compatskills.js";
import "core/mods/reskillable/players/moreEvents.js";
import "core/mods/players/moreEvents.js";
import "core/utils/GenBook.js";
import "core/utils/FileUtils.js";
import "core/xcommandsAPI.js";
import "core/commands/minerim/commands.js";
import "core/commands/itemCommands.js";
import "core/commands/utilCommands.js";
import "core/commands/permCommands.js";
import "core/datahandlers/Permission.js";

var MINERIM_CONFIG_PATH = "minerim/config.json";
var MINERIM_CONFIG = new File(MINERIM_CONFIG_PATH);

var MINERIM = {};

var HELP_BOOK = "minerim/help_book.txt";

if(!MINERIM_CONFIG.exists()) {
    mkPath(MINERIM_CONFIG_PATH);
    writeToFile(MINERIM_CONFIG_PATH, JSON.stringify(MINERIM));
}


function firstLogin(e) {
    var helptxt = readFileAsString(HELP_BOOK);
    var helpbook = genBook(e.player.world, helptxt);
    e.player.giveItem(helptxt);
}

function init(e) {

    /**
     * Register MineRim settings and services
     */
    //Create teams
    var sb = e.player.world.scoreboard;
    var teams = [];
    var getTeams = [
        "Player",
        "Owner",
        "Developer",
        "Admin",
        "Moderator"
    ];
    for(var i in getTeams) {
        var team = sb.getTeam(getTeams[i]);
        if(team == null) {
            team = sb.addTeam(getTeams[i]);
        }
    }

    var openPerms = [
        'skills'
    ];
    var data = e.player.world.storeddata;
    for(var i in openPerms) {
        new Permission(openPerms[i]).init(data).set('enabled', false).save(data);
    }

    yield init_event;

    //init reskillable-compatskills-customnpcs
    getPlayerSkills(e.player);

}

function skillLevelUp(e) {
    
}


function tick(e) {
    yield tick_event;
}

function chat(e) {
    yield chat_event;
}