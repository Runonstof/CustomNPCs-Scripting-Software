import core\utils\TellrawFormat.js;

//Send player formatted message
function tellPlayer(player, rawtext) {
	return executeCommand(player, "/tellraw "+player.getName()+" "+parseEmotes(strf(rawtext)));
}

function tellTarget(player, target, rawtext) {
	return executeCommand(player, "/tellraw "+target+" "+parseEmotes(strf(rawtext)));
}

function tellPlayerAction(player, txt) {
	return executeCommand(player, "/tell")
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
	return CONFIG_SERVER.BAR_OPEN+(showServerName?CONFIG_SERVER.TITLE+" ":CONFIG_SERVER.PREFIX)+title+CONFIG_SERVER.BAR_CLOSE;
}

function getUndoBtn(undo_cmds, hoverText=null) {
	return "&r["+_MSG['undoBtnText']+"{run_command:!chain ;"+undo_cmds.join(";")+(hoverText == null ? "" : "|show_text:"+hoverText.toString())+"}&r]";
}
