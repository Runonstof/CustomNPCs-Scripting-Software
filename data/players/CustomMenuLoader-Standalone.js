var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var File = Java.type("java.io.File");
var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var CHARSET_UTF_8 = Java.type("java.nio.charset.StandardCharsets").UTF_8;

var MENU_DIR = "menus";
var MENUSCRIPTS_DIR = "menuscripts";

//In a server, this will create a "menus" folder in top dir
//In single player, this will create a "menus" folder in ".minecraft"!
var menuDir = new File(MENU_DIR);
if(!menuDir.exists()) {
    menuDir.mkdir();
}
var menuScrDir = new File(MENUSCRIPTS_DIR);
if(!menuScrDir.exists()) {
    menuScrDir.mkdir();
}





//read directory
function readDir(dirPath, recursive=true){
    //Recursive is optional, defaults to true
	var res = [];
	var files = new File(dirPath).listFiles();
	for(var id in files as file){
		if(file.isDirectory() && recursive)
			res = res.concat( readDir(file.toString()) );
		else
			res.push( readFileAsString(file.toString()) );
	}
	return res;
}

function readFileAsString(filePath) { return Java.from( readFile(filePath) ).join("\n").replace(/\t/g, "  "); }

function readFile(filePath){
	var path = Paths.get(filePath);
	try{
		var lines = Files.readAllLines(path, CHARSET_UTF_8);
		return lines;
	} catch (e){
		return [];
	}
}

//Used to transform text into color coding for item name and lore
function colorCodeString(text) { return text.replace(/(?<!\\)&/g, "\u00A7"); }


//Show the chest gui and populate it with items
//guidata is an json object
//player is an IPlayer
function showCustomChestGui(player, guidata) {
    var rows = Math.min(Math.max(guidata.rows||1, 1), 6);
    var gui = player.showChestGui(rows);
    gui.setName(colorCodeString(guidata.name||""));
    var items = guidata.items||[];

    //loop through all items
    for(var i in items) {
        var item = items[i];
        //Create new IItemStack
        var witem = pl.world.createItem(item.id, item.damage||0, item.count||1);
        //Check if custom name is provided
        if("name" in item) {
            item.setCustomName(colorcodeString(item.name));
        }
        //check if lore is provided
        if("lore" in item) {
            var ilore = [];
            for(var il in item.lore) {
                ilore.push(colorCodeString(items.lore[i]));
            }
            witem.setLore(ilore);
        }
        //check if additional nbt is provided
        if("nbt" in item) {
            witem.getNbt().merge(API.stringToNbt(JSON.stringify(item.nbt)));
        }

        var witemNbt = witem.getNbt();

        var passNbtData = [
            "clickActions",
            "requirements",
            "clickFailedActions"
        ];
        //fetch extra data like clickActions etc and store it in item nbt
        for(var p in passNbtData) {
            var passData = passNbtData[p];
            if(passData in item) {
                witemNbt.setString(passData, JSON.stringify(item[passData]));
            }
        }
    }
}

function customChestClicked(e) {
    
}
