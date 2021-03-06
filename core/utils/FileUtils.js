var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var CHARSET_UTF_8 = Java.type("java.nio.charset.StandardCharsets").UTF_8;


function mkPath(path) {
	var expath = path.split("/");
	var curpath = "";
	for(var ex in expath) {
		var expt = expath[ex];
		curpath += (curpath == "" ? "" : "/")+expt;
		var pfile = new File(curpath);
		if(!pfile.exists()) {
			if(expt.match(/[\w]+\.[\w]+/) === null) { //is dir?
				pfile.mkdir();
			} else {
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
	try {
		return Java.from( readFile(filePath) ).join("\n").replace(/\t/g, "  ");
		
	} catch(exc) {
		return readFile(filePath).join("\n").replace(/\t/g, "  ");
	}
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

function writeToFile(filePath, text, offset=null, length=null) {
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
