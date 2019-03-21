function tellPlayer(player, rawtext) {
	if(typeof(rawtext) == 'string') { var rawtext = strf(rawtext); }
	
	return executeCommand(player, "/tellraw "+player.getName()+" "+rawformat(rawtext));
}

function storytellPlayer(player, ar) {
	for(var i in ar as ari) {
		//print(ai[i].join('==='));
		tellPlayer(player, ari);
	}
}
