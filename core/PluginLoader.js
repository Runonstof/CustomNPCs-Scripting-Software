import "core\utils\World.js";
import "core\utils\TellrawFormat.js";
import "core\utils\CSON.js";
import "core\utils\ErrorHandler.js";

import "core\players\executeCommand.js";

import "core\xcommandsAPI.js";

//

//Initialize PLugin Folder
var PLUGIN_FOLDER = CONFIG_SERVER.PLUGIN_FOLDER||"CustomServerTools/plugins";
var PLUGIN_LIST = [];

var PluginAPI = {
    Plugins: {
        get: function(name){
            for(var i in PLUGIN_LIST as _plugin) {

                if(_plugin.id.toString() === name.toString()) {
                    return _plugin;
                }
            }
            return null;
        },
        list: function(){
            var ids = [];
            for(var i in PLUGIN_LIST as plugin) {
                ids.push(plugin);
            }
            return ids;
        }
    },
    DataHandlers: {
        implement: function(datahandlername, implementationFunc) {
            if(!(datahandlername in PluginAPI.DataHandlers.implementFuncs)) {
                PluginAPI.DataHandlers.implementFuncs[datahandlername] = [];
            }
            PluginAPI.DataHandlers.implementFuncs[datahandlername].push(implementationFunc);
        },
        implementFuncs: {},
        run: function(dhname, t) {
            if(dhname in PluginAPI.DataHandlers.implementFuncs) {
                var imf = PluginAPI.DataHandlers.implementFuncs[dhname];
                for(var i in imf as im) {
                    im.apply(t, []);
                }
            }
        }
    },
    Players: {
        on: function(hook, func){
            if(!(hook in PluginAPI.Players.hookFns)) {
                PluginAPI.Players.hookFns[hook] = [];
            }

            PluginAPI.Players.hookFns[hook].push(func)
        },
        run: function(hook, args){
            if(Object.keys(PluginAPI.Players.hookFns).indexOf(hook) > -1) {
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
        var output = getTitleBar("Plugin List")+"\n&dHover plugin name for more info\n&a";
        for(var p in PLUGIN_LIST as plugin) {
            var pluginInfo = "$6$lName: $r$e{PluginName}\n$r$6$lID: $r$e{PluginId}\n$r$6$lAuthor: $r$e{PluginAuthor}\n$r$6$lVersion: $r$e{PluginVersion}\n\n$r$e{PluginDesc}$r".fill({
                "PluginId": plugin.id,
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
    }, 'plugins.list'],
    ['!plugin reload', function(pl, args, data){
        if(reloadPluginsFromDisk()) {
            tellPlayer(pl, "&r[&eCSTPluginLoader{*|show_text:$eCustomServerTools PluginLoader}&r] &aLoaded &c{PluginCount} &aplugins! &2[Plugin List]{run_command:!plugins|show_text:$aClick to see plugins or do $o$a!plugins}&r".fill({
                "PluginCount": PLUGIN_LIST.length
            }));
        }
    }, 'plugins.reload'],
]);



//1 if v1 > v2
//0 if same
//-1 if v1 < v2
function compareVersion(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

@block init_event
    if(e.player != null) {
        tellPlayer(e.player, "&r[&eCSTPluginLoader{*|show_text:$eCustomServerTools PluginLoader}&r] &aLoaded &c{PluginCount} &aplugins!  &2[Plugin List]{run_command:!plugins|show_text:$aClick to see plugins or do $o$a!plugins}&r".fill({
            "PluginCount": PLUGIN_LIST.length
        }));
        var w = e.player.world;
        var data = w.storeddata;

        var pluginPerm = new Permission("plugins");
        if(!pluginPerm.exists(data)) {
            pluginPerm.save(data);
        }
        var pluginListPerm = new Permission("plugins.list");
        if(!pluginListPerm.exists(data)) {
            pluginListPerm.data.enabled = false;
            pluginListPerm.save(data);
        }


        PluginAPI.Players.run("init", [e]);
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




reloadPluginsFromDisk();

function reloadPluginsFromDisk() {
    PLUGIN_LIST = [];
    PluginAPI.Players.hookFns = {};

    if(!(new File(PLUGIN_FOLDER).exists())) {
        mkPath(PLUGIN_FOLDER);
    }




    //Load plugins
    var pluginDirs = new File(PLUGIN_FOLDER).listFiles();
    var pluginsToRun = [];
    //Loop plugin directories
    for(var p in pluginDirs as pluginDir) {
        if(pluginDir.isDirectory()) {
            var pluginFiles = pluginDir.listFiles();
            var loadPlugin = null;
            for(var pf in pluginFiles as pluginFile) {
                //get config file
                if(pluginFile.getName() == "plugin.json") {
                    try {
                        loadPlugin = cson_parse(readFileAsString(pluginFile.getPath()));
                        loadPlugin['DIR'] = pluginDir.getPath();
                        //Load JS files
                        for(var lf in loadPlugin.files as lfilename) {
                            var lfilepath = pluginDir.getPath()+"/"+lfilename;
                            var lfile = new File(lfilepath);
                            if(lfile.exists()) {
                                //loadPlugin.fileFuncs[lfilepath] = (loadPlugin.fileFuncs[lfilepath]||[]).push(readFileAsString(lfilepath));



                                var fileScript = readFileAsString(lfilepath)
                                var fileFunc = new Function("SETTINGS", "PLUGIN", fileScript);
                                pluginsToRun.push({
                                    "func": fileFunc,
                                    "plugin": loadPlugin
                                })

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

    for(var i in pluginsToRun as runPlugin) {
        //Check requirements
        var canRun = true;
        var req = (runPlugin.plugin.required||{});
        var errtxt = "";
        if(Object.keys(req).length > 0) {
            for(var reqid in req as minver) {
                var checkPlugin = PluginAPI.Plugins.get(reqid);
                if(checkPlugin != null) {

                    if(compareVersion(checkPlugin.version, minver) == -1) {
                        errtxt += "&cError loading plugin '"+runPlugin.plugin.id+"' &4[Info]{*|show_text:{INFO}}&r\n".fill({
                            "INFO": ("&cToo low version of plugin '"+reqid+"' installed! Current: &l"+checkPlugin.version+"&r&c Required: &l"+minver).replaceAll("&", "§")
                        });
                        canRun = false;
                    }
                } else {
                    errtxt += "&cError loading plugin '"+runPlugin.plugin.id+"' &4[Info]{*|show_text:{INFO}}&r\n".fill({
                        "INFO": ("&cThis plugin requires &o"+reqid+"&r&c to be installed!").replaceAll("&", "§")
                    });
                    canRun = false;
                }
            }


        }

        if(canRun) {
            try {
                //execute plugins
                runPlugin.func(runPlugin.plugin.settings||{}, runPlugin.plugin);
            } catch(exc) {
                handleError(exc);
            }
        } else {
            executeCommandGlobal("/tellraw @a "+strf(errtxt));
        }
    }

    return true;
}
