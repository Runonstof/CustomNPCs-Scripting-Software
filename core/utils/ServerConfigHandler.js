import core\config\default\*.js;
import core\utils\ErrorHandler.js;
import core\utils\FileUtils.js;



//Check config file
var CONFIG_FILEPATH = "CustomServerTools_Settings.json";

function reloadConfiguration() {
    var configFile = new File(CONFIG_FILEPATH);

    if(!configFile.exists()) {
    	configFile.createNewFile();
    	writeToFile(CONFIG_FILEPATH, JSON.stringify(CONFIG_SERVER, null, 4));
    }

    try {
        CONFIG_SERVER = objMerge(CONFIG_SERVER, JSON.parse(readFileAsString(CONFIG_FILEPATH)));
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
