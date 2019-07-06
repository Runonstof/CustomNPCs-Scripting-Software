import core\utils\World.js;
import core\utils\TellrawFormat.js;

import core\utils\ErrorHandler.js;

import core\players\executeCommand.js;

import core\xcommandsAPI.js;

//


var PluginAPI = {
    DataHandlers: {
        implement: function(datahandlername, implementationFunc) {
            PluginAPI.DataHandlers.implementFuncs[datahandlername] = implementationFunc;
        },
        implementFuncs: {}
    },
    Players: {
        on: function(hook, func){
            if(!(hook in PluginAPI.Players.hookFns)) {
                PluginAPI.Players.hookFns[hook] = [];
            }

            PluginAPI.Players.hookFns[hook].push(func)
        },
        run: function(hook, args){
            if(hook in PluginAPI.Players.hookFns) {
                for(var i in PluginAPI.Players.hookFns[hook] as hookFn) {
                    hookFn.apply(null, args);
                }
            }
        },
        hookFns: {},
    },
};


registerXCommands([
    ['!plugins', function(pl, args, data){
        var output = getTitleBar("Plugin List")+"\n&a";
        for(var p in PLUGIN_LIST as plugin) {
            var pluginInfo = "$6$lName: $r$e{PluginName}\n$r$6$lAuthor: $r$e{PluginAuthor}\n$r$6$lVersion: $r$e{PluginVersion}\n\n$r$e{PluginDesc}$r".fill({
                "PluginName": plugin.name,
                "PluginVersion": plugin.version,
                "PluginDesc": plugin.description||"",
                "PluginAuthor": plugin.author||"No author defined",
            });
            output += plugin.name+"{*|show_text:"+pluginInfo+"}&a";
            if(p < PLUGIN_LIST.length-1) {
                output += ", ";
            }
        }
        tellPlayer(pl, output);
        return true;
    }, 'plugins'],
    ['!plugin reload', function(pl, args, data){
        if(reloadPluginsFromDisk()) {
            tellPlayer(pl, "&aReloaded Plugins!");
        }
    }, 'plugins.reload'],
]);

@block init_event
    if(e.player != null) {

        tellPlayer(e.player, "&r[&eCSTPluginLoader{*|show_text:$eCustomServerTools PluginLoader}&r] &aLoaded &c{PluginCount} &aplugins!".fill({
            "PluginCount": PLUGIN_LIST.length
        }));

        var hookFn = PluginAPI.Players.run("init");
    }
@endblock

@block attack_event
	PluginAPI.Players.run("attack", [e]);
@endblock

@block broken_event
	PluginAPI.Players.run("broken", [e]);
@endblock

@block chat_event
	PluginAPI.Players.run("chat", [e]);
@endblock

@block containerClosed_event
	PluginAPI.Players.run("containerClosed", [e]);
@endblock

@block containerOpen_event
	PluginAPI.Players.run("containerOpen", [e]);
@endblock

@block damagedEntity_event
	PluginAPI.Players.run("damagedEntity", [e]);
@endblock

@block damaged_event
	PluginAPI.Players.run("damaged", [e]);
@endblock

@block died_event
	PluginAPI.Players.run("died", [e]);
@endblock

@block factionUpdate_event
	PluginAPI.Players.run("factionUpdate", [e]);
@endblock

@block interact_event
	PluginAPI.Players.run("interact", [e]);
@endblock

@block keyPressed_event
	PluginAPI.Players.run("keyPressed", [e]);
@endblock

@block kill_event
	PluginAPI.Players.run("kill", [e]);
@endblock

@block levelUp_event
	PluginAPI.Players.run("levelUp", [e]);
@endblock

@block login_event
	PluginAPI.Players.run("login", [e]);
@endblock

@block logout_event
	PluginAPI.Players.run("logout", [e]);
@endblock

@block pickedUp_event
	PluginAPI.Players.run("pickedUp", [e]);
@endblock

@block rangedLaunched_event
	PluginAPI.Players.run("rangedLaunched", [e]);
@endblock

@block timer_event
	PluginAPI.Players.run("timer", [e]);
@endblock

@block toss_event
	PluginAPI.Players.run("toss", [e]);
@endblock

@block tick_event
	PluginAPI.Players.run("tick", [e]);
@endblock

@block projectileImpact_event
	PluginAPI.Players.run("projectileImpact", [e]);
@endblock

@block projectileTick_event
	PluginAPI.Players.run("projectileTick", [e]);
@endblock


//Initialize PLugin Folder
var PLUGIN_FOLDER = "CST_plugins";
var PLUGIN_LIST = [];

reloadPluginsFromDisk();

function reloadPluginsFromDisk() {
    PLUGIN_LIST = [];
    PluginAPI.Players.hookFns = {};
    var pluginFolder = new File(PLUGIN_FOLDER);
    if(!pluginFolder.exists()) {
        pluginFolder.mkdir();
    }


    //Load plugins
    var pluginDirs = pluginFolder.listFiles();

    //Loop plugin directories
    for(var p in pluginDirs as pluginDir) {
        if(pluginDir.isDirectory()) {
            var pluginFiles = pluginDir.listFiles();
            var loadPlugin = null;
            for(var pf in pluginFiles as pluginFile) {
                //get config file
                if(pluginFile.getName() == "plugin.json") {
                    try {
                        loadPlugin = JSON.parse(readFileAsString(pluginFile.getPath()));

                        //Load JS files
                        loadPlugin.fileFuncs = {};
                        for(var lf in loadPlugin.files as lfilename) {
                            var lfilepath = pluginDir.getPath()+"/"+lfilename;
                            var lfile = new File(lfilepath);
                            if(lfile.exists()) {
                                //loadPlugin.fileFuncs[lfilepath] = (loadPlugin.fileFuncs[lfilepath]||[]).push(readFileAsString(lfilepath));
                                var fileFunc = new Function(readFileAsString(lfilepath));
                                
                                fileFunc();

                            }
                        }

                    } catch (exc) {
                        handleError(exc);
                    }



                    break;
                }
            }
            if(loadPlugin != null) {
                PLUGIN_LIST.push(loadPlugin);
            } else {
                var errtxt = "&cError loading plugin! &n&c[info]{*|show_text:$c{PluginDir} has no plugin.json!}".fill({
                    "PluginDir": pluginDir.getPath()
                });
                executeCommandGlobal("/tellraw @a "+strf(errtxt));
                return false;
            }
        }
    }

    return true;
}
