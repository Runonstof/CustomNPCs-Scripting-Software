/*

Has same methods as IData
    - put
    - get
    - has
    - getKeys
    - clear

Own methods:
    - create

Own properties:
    - file

Because it has same method names as the methods in IData its easy to implement in existing script
*/
var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var CHARSET_UTF_8 = Java.type("java.nio.charset.StandardCharsets").UTF_8;
var API = Java.type('noppes.npcs.api.NpcAPI').Instance();


var IData_look_alike = new CSTData("storage/data.json")
IData_look_alike.create();





/*
jsonfile can be non-existend json file

use CSTData.create() to create it
or use mkPath()
*/
function CSTData(jsonfile) {


    this.file = jsonfile;

    this.exists = function() {
        return new File(this.file).exists();
    };
    this.create = function(){
        if(!this.exists()) {
            new File(this.file).createNewFile();
            writeToFile(this.file, "{}");
        }
        return this;
    };

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

function handleError(error) {
    API.getIWorld(0).broadcast("Error in CustomNPCs script! Check console for more info.");
    print("Error in "+error.fileName+":"+error.lineNumber+"\n"+error.message+"\n\n"+error.stack);
}

//Creates file, but recursively created directories also if they dont exist
function mkPath(path) {
	var expath = path.split("/"); //split the path
	var curpath = "";
	for(var ex in expath) { //loop trhough path
        var expt = expath[ex];
		curpath += (curpath == "" ? "" : "/")+expt; //current path
		var pfile = new File(curpath);
		if(!pfile.exists()) {
			if(expt.match(/[\w]+\.[\w]+/) === null) { //is dir?
				pfile.mkdir();
			} else {//Is file
				pfile.createNewFile();
			}
		}
	}
}


function readDir(dirPath){
	var res = [];
	var files = new File(dirPath).listFiles();
	for(var id in files as file){
		if(file.isDirectory())
			res = res.concat( readDir(file.toString()) );
		else
			res.push( Java.from( readFile(file.toString()) ).join("\n").replace(/\t/g, "  ") );
	}
	return res;
}

function readFileAsString(filePath) {
	return Java.from( readFile(filePath) ).join("\n").replace(/\t/g, "  ");
}


function readFile(filePath){
	var path = Paths.get(filePath);
	try{
		var lines = Files.readAllLines(path, CHARSET_UTF_8);
		return lines;
	} catch (e){
		return [];
	}
}

/*
offset && length are optional
*/
function writeToFile(filePath, text, offset, length) {
	var path = Paths.get(filePath);
	try {
		var writer = Files.newBufferedWriter(path, CHARSET_UTF_8);
		writer.write(text, offset||0, length||text.length);
		writer.close();
		return true;
	} catch (exc) {
		return false
	}
}
