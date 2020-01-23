import "core/JavaScript/*.js";
import "core/mods/compatskills.js";
import "core/mods/reskillable/players/moreEvents.js";
import "core/mods/players/moreEvents.js";
import "core/mods/noppes/IData.js";
import "core/mods/noppes/Java.js";
import "core/xcommandsAPI.js";
import "core/commands/minerim/commands.js";
import "core/commands/emoteCommands.js";
import "core/commands/playerCommands.js";
import "core/datahandlers/Permission.js";
import "core/utils/GenBook.js";
import "core/utils/FileUtils.js";
import "core/utils/NPCQuery.js";
import "core/utils/RunDelay.js";
import "core/utils/ErrorHandler.js";
import "core/utils/CSON.js";
import "core/utils/HTTP.js";
import "core/math.js";
import "core/players/moreEvents.js";
import "core/players/clone.js";

var MINERIM_CONFIG_PATH = "minerim/config.json";
var MINERIM_CONFIG_FILE = new File(MINERIM_CONFIG_PATH);

var MINERIM_CONFIG = {
    flush: function() {
        MINERIM_CONFIG_FILE.delete();
        MINERIM_CONIF.reload();
        return this;
    },
    read: function(key) {
        if (key in MINERIM) {
            API.getIWorld(0).broadcast(key + ' = ' + MINERIM[key]);
        } else {
            API.getIWorld(0).broadcast('Key not found.');
        }
    },
    reload: function() {
        if (!MINERIM_CONFIG_FILE.exists()) {
            mkPath(MINERIM_CONFIG_PATH);
            writeToFile(MINERIM_CONFIG_PATH, JSON.stringify(MINERIM));
        } else {
            MINERIM = objMerge(cson_parse(readFileAsString(MINERIM_CONFIG_PATH)));
        }
    }
};

var MINERIM = {
    'DEBUG_MODE': true
};

var HELP_BOOK = "minerim/help_book.txt";

MINERIM_CONFIG.reload();


registerXCommands([
    ['!query <...query>', function(plr, args, data) {
        $(args.query.join(" "), null, plr);
    }, 'query'],
    ['!eval [...code]', function(plr, args, data) {
        var fn = new Function('player', 'args', 'data', args.code.join(" "));

        try {
            tellPlayer(plr, (fn(plr, args, data) || ""));
        } catch (exc) {
            handleError(exc);
        }
    }]
]);


function firstLogin(e) {
    var helptxt = readFileAsString(HELP_BOOK);
    var helpbook = generateBook(e.player.world, helptxt);
    e.player.giveItem(helpbook);
}

function init(e) {
    yield init_event;

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
    for (var i in getTeams) {
        var team = sb.getTeam(getTeams[i]);
        if (team == null) {
            team = sb.addTeam(getTeams[i]);
        }
    }

    var openPerms = [
        'skills',
        'query'
    ];
    var data = e.player.world.storeddata;
    for (var i in openPerms) {
        new Permission(openPerms[i]).init(data).set('enabled', false).save(data);
    }

    executeCommand(e.player, '/gamerule commandBlockOutput false');

    //init reskillable-compatskills-customnpcs
    getPlayerSkills(e.player);

}

function showSkillBar(skillName, skillLevel, skillXp, skillMaxXp) {

    var skillPerc = Math.round(100 / skillMaxXp * skillXp);
    return '&6&l' + skillName + ' &0&l[&e&l' +
        skillLevel + '&0&l]&r' + progressBar(skillXp, skillMaxXp, 35, null, '&2&l', '&4&l', '&0&l[', '&0&l]') +
        '&0&l[&e&l' + (skillLevel + 1) + '&0&l] &d&l' +
        skillPerc + '%';
}

function skillLevelUp(e) {
    e.player.sendNotification(e.skill.name + ' Level Up', 'Reached level ' + e.skill.level, 2);
    var skillPerc = Math.round(100 / e.skill.maxXp * e.skill.xp);
    tellPlayerTitle(e.player, showSkillBar(e.skill.name, e.skill.level, e.skill.xp, e.skill.maxXp));
}

function skillHasXP(e) {
    var skillPerc = Math.round(100 / e.skill.maxXp * e.skill.xp);
    tellPlayerTitle(e.player, showSkillBar(e.skill.name, e.skill.level, e.skill.xp, e.skill.maxXp));
}


function tick(e) {
    yield tick_event;

    runDelayTick();
}

function chat(e) {
    yield chat_event;
}

function damaged(e) {
    var dmgSource = e.damageSource;
    var dmgType = dmgSource.getType();

    switch (dmgType) {
        case "fall":
            tellPlayer(e.player, 'tsest');
            if (e.player.getHealth() - e.damage > 0) {
                tellPlayer(e.player, 'kaasa');
                givePlayerXP(e.player, 'reskillable.agility', Math.floor(e.damage / 2));
            }
            break;
    }

}

function damagedEntity(e) {
    var dmgSource = e.damageSource;
    var dmgType = dmgSource.getType();



    if (!dmgSource.isProjectile()) {
        switch (e.target.getType()) {
            case EntityType_VILLAGER:
            case EntityType_THROWABLE:
                //case catch for no XP
                break;
            case EntityType_ANIMAL:
                givePlayerXP(e.player, 'attack', Math.floor(e.damage / 2));
                break;
            case EntityType_MONSTER:
            default:
                givePlayerXP(e.player, 'attack', e.damage);
                break;
        }
    } else {
        if (e.player.getMainhandItem().getName() == 'minecraft:bow') {
            switch (e.target.getType()) {
                case EntityType_VILLAGER:
                case EntityType_THROWABLE:
                    //case catch for no XP
                    break;
                case EntityType_ANIMAL:
                    givePlayerXP(e.player, 'archery', Math.floor(e.damage / 2));
                    break;
                case EntityType_MONSTER:
                default:
                    givePlayerXP(
                        e.player,
                        'archery',
                        e.damage * Math.max(Math.ceil(e.player.pos.distanceTo(e.target.pos) / 30), 1)
                    );
                    break;
            }
        }
    }

}