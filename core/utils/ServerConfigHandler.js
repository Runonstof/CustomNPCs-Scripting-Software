import "core\config\default\*.js";
import "core\utils\ErrorHandler.js";
import "core\utils\FileUtils.js";
import "core\JavaScript\*.js";
import "core\mods\noppes\Java.js";


//Check config file
var CONFIG_FILEPATH = "CustomServerTools/settings.json";

function getServerProperties() {
    var proprgxs = /([\w\-.]+)\s*=([\w\W]*?)$/gm;
    var proprgx = /([\w\-.]+)\s*=([\w\W]*?)$/m;
    var propdata = {};

    (readFileAsString('server.properties').match(proprgxs)||[]).forEach(function(prop){
        var propmeta = prop.match(proprgx);
        var propname = propmeta[1];
        var propval = propmeta[2];
        if(stringIsNumeric(propval)) {
            propval = parseFloat(propval);
        } else if(stringIsBool(propval)) {
            propval = propval === 'true';
        }

        propdata[propname] = propval
    });

    return propdata;
}

function getDiskHandler(diskname=null) {
    diskname = diskname||CONFIG_SERVER.USE_DISK;
    if(diskname === "DEFAULT") {
        return API.getIWorld(0).storeddata;
    }
    if(Object.keys(CONFIG_SERVER.FILE_DISKS).indexOf(diskname) > -1) {
        var disk = new CSTData().useDisk(diskname);
        return disk;
    }
    return null;
}

function saveConfiguration() {
    var configFile = new File(CONFIG_FILEPATH);

    try {

        writeToFile(CONFIG_FILEPATH, JSON.stringify(CONFIG_SERVER, null, 4));


    } catch (exc) {
        handleError(exc);
    }

}

function reloadConfiguration() {
    var configFile = new File(CONFIG_FILEPATH);

    if(!configFile.exists()) {
    	mkPath(CONFIG_FILEPATH);
    	writeToFile(CONFIG_FILEPATH, JSON.stringify(CONFIG_SERVER, null, 4));


    }

    try {
        var loadConf = JSON.parse(readFileAsString(CONFIG_FILEPATH))
        CONFIG_SERVER = objMerge(CONFIG_SERVER, loadConf);

        if(Object.keys(CONFIG_SERVER).sort().join(",") !== Object.keys(loadConf).sort().join(",")) {
            writeToFile(CONFIG_FILEPATH, JSON.stringify(CONFIG_SERVER, null, 4));
        }

    } catch (exc) {
        handleError(exc);
    }

}

reloadConfiguration();

@block register_commands_event
    registerXCommands([
        ['!config reload', function(pl, args, data){
            reloadConfiguration();
            tellPlayer(pl, "&aReloaded CustomServerTools configuration.");
        }, 'config.reload'],
    ]);
@endblock
