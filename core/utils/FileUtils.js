var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");

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

function readFile(filePath){
	var path = Paths.get(filePath);
	try{
		var lines = Files.readAllLines(path, Java.type("java.nio.charset.StandardCharsets").UTF_8);
		return lines;
	} catch (e){
		return [];
	}
}