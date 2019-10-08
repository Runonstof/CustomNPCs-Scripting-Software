import "core/utils/FileUtils.js";

var CONFIG_PATH = "CustomServerTools/config/";
function Config(name, startvalues) {
    this.path = CONFIG_PATH+name+'.json';

    if(!this.exists()) {
        this.create();
    }

    this.create = function(){
        mkPath(this.path);
        writeToFile(this.path, JSON.stringify(startvalues||{}));
    };

    this.all = function(){
        return JSON.parse(readFileAsString(this.path)||"{}");
    }

    this.exists = function(){
        return new File(this.path).exists();
    };

    this.has = function(key) {
        return Object.keys(this.all()).indexOf(key) > -1;
    };

    this.get = function(key) {
        if(this.has(key)) {
            return this.all()[key];
        }

        return null;
    }

    this.put = function(key, value) {
        var o = this.all();
        o[key] = value;
        writeToFile(this.path, JSON.stringify(o));
    }

}