import core\utils\TellrawFormat.js;

//Send player formatted message
function tellPlayer(player, rawtext) {
	return executeCommand(player, "/tellraw "+player.getName()+" "+parseEmotes(strf(rawtext)));
}

//Send player multiple formatted messages from array
function storytellPlayer(player, ar) {
	for(var i in ar as ari) {
		tellPlayer(player, ari);
	}
}

//Get server title bar for displaying
//TO-DO: Placeholders instead of multiple variables
function getTitleBar(title, showServerName=true) {
	return SERVER_BAR_OPEN+(showServerName?SERVER_TITLE+" ":SERVER_PREFIX)+title+SERVER_BAR_CLOSE;
}

function getUndoBtn(undo_cmds, hoverText=null) {
	return "&r["+_MSG['undoBtnText']+"{run_command:!chain ;"+undo_cmds.join(";")+(hoverText == null ? "" : "|show_text:"+hoverText.toString())+"}&r]";
}
