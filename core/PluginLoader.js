import core\utils\World.js;
import core\utils\TellrawFormat.js;

import core\players\executeCommand.js;

import core\xcommandsAPI.js;

var PluginAPI = {
    DataHandlers: {
        implement: function(datahandlername, implementationFunc) {
            PluginAPI.DataHandlers.implementFuncs[datahandlername] = implementationFunc;
        },
        implementFuncs: {}
    },
    Players: {
        on: function(hook, func){
            PluginAPI.Players.hookFns[hook] = func;
        },
        hookFns: {},
    },
};


registerXCommands([
    ['!plugins', function(pl, args, data){
        var output = getTitleBar("Plugin List")+"\n&a";
        for(var p in PLUGIN_LIST as plugin) {
            var pluginInfo = "$6$lName: $r$e{PluginName}\n$6$lVersion: $r$e{PluginVersion}".fill({
                "PluginName": plugin.name,
                "PluginVersion": plugin.version
            });
            output += plugin.name+"{*|show_text:"+pluginInfo+"}&a";
            if(p < PLUGIN_LIST.length-1) {
                output += ", ";
            }
        }
        tellPlayer(pl, output);
        return true;
    }, 'plugins'],
]);

@block init_event
    var hookFn = PluginAPI.Players.hookFns["init"];
    if(typeof hookFn == "function") { hookFn.apply(null, [e]); }
@endblock

//Initialize PLugin Folder
var PLUGIN_FOLDER = "CST_plugins";
var PLUGIN_LIST = [];


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
                loadPlugin = JSON.parse(readFileAsString(pluginFile.getPath()));
                break;
            }
        }
        if(loadPlugin != null) {
            PLUGIN_LIST.push(loadPlugin);
        } else {
            var errtxt = "&cError loading plugin! &n&c[info]{*|show_text:$c{PluginDir} has no plugin.json!".fill({
                "PluginDir": pluginDir.getPath()
            });
            executeCommandGlobal("/tellraw @a "+strf(errtxt));
        }
    }
}

executeCommandGlobal("/tellraw @a "+strf("&r[&eCSTPluginLoader{*|show_text:$eCustomServerTools PluginLoader}&r] &aLoaded &c{PluginCount} &aplugins!".fill({
    "PluginCount": PLUGIN_LIST.length
})));
