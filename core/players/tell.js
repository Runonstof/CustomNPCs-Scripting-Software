function tellPlayer(player, rawtext) {

	return executeCommand(player, "/tellraw "+player.getName()+" "+parseEmotes(strf(rawtext)));
}

function storytellPlayer(player, ar) {
	for(var i in ar as ari) {
		//print(ai[i].join('==='));
		tellPlayer(player, ari);
	}
}

function getTitleBar(title, showServerName=true) {
	return SERVER_BAR_OPEN+(showServerName?SERVER_TITLE:"")+" "+title+SERVER_BAR_CLOSE;
}

function getUndoBtn(undo_cmds) {
	var str = "";
}
