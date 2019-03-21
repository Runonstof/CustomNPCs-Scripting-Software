function tellPlayer(player, rawtext) {
	
	return executeCommand(player, "/tellraw "+player.getName()+" "+strf(rawtext));
}

function storytellPlayer(player, ar) {
	for(var i in ar as ari) {
		//print(ai[i].join('==='));
		tellPlayer(player, ari);
	}
}
