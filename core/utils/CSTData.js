import "core\utils\FileUtils.js";
import "core\utils\ServerConfigHandler.js";


var DATA_PATH = "CustomServerTools/data";

if(!new File(DATA_PATH).exists()) {
    mkPath(DATA_PATH);
}

function CSTData(disk=null, create=false) {


    this.file = "";

    this.useDisk = function(diskname){
        print("YOU CHOSE: "+diskname);
        diskname = diskname||CONFIG_SERVER.USE_DISK;
        if(Object.keys(CONFIG_SERVER.FILE_DISKS).indexOf(diskname) > -1) {
            print("DISKPATH: "+ CONFIG_SERVER.FILE_DISKS[diskname].path);
            this.file = CONFIG_SERVER.FILE_DISKS[diskname].path.fill({
                "worldname": getServerProperties()['level-name']
            });
            print("DISKPATH FILLES: "+this.file);
        }
        return this;
    };



    this.exists = function() {
        return new File(this.file).exists();
    };
    this.create = function(){
        if(!this.exists()) {
            new File(this.file).createNewFile();
            writeToFile(this.file, "{}");
        }

    };


    if(create) {this.create();}

    this.clear = function() {
        writeToFile(this.file, "{}");
    }

    this.put = function(key, value) {
        try {
            var d = JSON.parse(this.exists() ? readFileAsString(this.file).replace(/\n/gm, "") : "{}");
            d[key] = value;
            writeToFile(this.file, JSON.stringify(d));
            return true;
        } catch(exc) {
            handleError(exc);
            return false;
        }
    }

    this.has = function(key) {
        try {
            return Object.keys(cson_parse(readFileAsString(this.file))).indexOf(key) > -1;
        } catch(exc) {
            handleError(exc);
            return false;
        }
    }

    this.get = function(key) {
        try {
            print(this.file.toString()+" --- "+key+" --- "+readFileAsString(this.file).toString());
            var jdata = JSON.parse(readFileAsString(this.file));
            if(Object.keys(jdata).indexOf(key) > -1) {
                return jdata[key];
            }
        } catch(exc) {
            handleError(exc);
        }
        return null;
    }

    this.getKeys = function() {
        try {
            var jdata = JSON.parse(readFileAsString(this.file));
            return Object.keys(jdata);
        } catch(exc) {
            handleError(exc);
        }
        return [];
    }

    this.remove = function(key) {
        try {
            var jdata = JSON.parse(readFileAsString(this.file));
            if(Object.keys(jdata).indexOf(key) > -1) {
                delete jdata[key];
                writeToFile(this.file, JSON.stringify(jdata));
                return true;
            }
        } catch(exc) {
            handleError(exc);
        }

        return false;
    }
}
