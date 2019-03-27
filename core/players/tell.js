function tellPlayer(player, rawtext) {
	
	return executeCommand(player, "/tellraw "+player.getName()+" "+parseEmotes(strf(rawtext)));
}

function storytellPlayer(player, ar) {
	for(var i in ar as ari) {
		//print(ai[i].join('==='));
		tellPlayer(player, ari);
	}
}
