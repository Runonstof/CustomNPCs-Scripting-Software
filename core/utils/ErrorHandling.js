import core\utils\TellrawFormat.js;

function handleError(error, logsToConsole=true, target="@a") {
    var world = API.getIWorld(0);
    var errinfo = "$6Error in "+error.fileName+":"+error.lineNumber+"\n$e"+error.message+"$r\n\n"+error.stack;

    var errorTxt = "&cScript error in "+error.fileName+":"+error.lineNumber+"! &n[Error Info]{*|show_text:"+errinfo.replaceAll("&", "")+"}&r";
    if(logsToConsole) {
        print("Error in "+error.fileName+":"+error.lineNumber+"\n"+error.message+"\n\n"+error.stack);
    }
    executeCommandGlobal("/tellraw "+target+" "+strf(errorTxt));
}
