import "core\utils\TellrawFormat.js";

function handleError(error, logsToConsole=true, target=null) {
    var world = API.getIWorld(0);

    var errinfo = "";
    if(error.fileName) {
        errinfo += "$6Error in "+error.fileName+(error.lineNumber?':'+error.lineNumber:"")+"\n";
    }
    if(error.message) {
        errinfo += "$e"+error.message.replaceAll("&", "")+"\n";
    }
    if(error.stack) {
        errinfo += "$r\n"+error.stack+"\n";
    }
    var errorTxt = "&cScript error in "+error.fileName+(error.lineNumber? ":"+error.lineNumber : '')+"! &n&c[Error Info]{*|show_text:"+errinfo.replaceAll("&", "")+"}&r";
    if(logsToConsole) {
        print("Error in "+error.fileName+":"+error.lineNumber+"\n"+error.message+"\n\n"+error.stack);
    }
    executeCommandGlobal("/tellraw "+(target||"@a")+" "+strf(errorTxt));
}
