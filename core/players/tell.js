function tellPlayer(player, rawtext) {
	if(typeof(rawtext) == 'string') { var rawtext = strf(rawtext); }
	
	return executeCommand(player, "/tellraw "+player.getName()+" "+rawformat(rawtext));
}

function tellPlayerStr(player, text) {
	return executeCommand(player, "/tellraw "+player.getName()+" "+text.toString());
}

function storytellPlayer(player, ar) {
	for(i in ar) {
		//print(ai[i].join('==='));
		tellPlayer(player, ar[i]);
	}
}

/*
function storyte_llPlayer(player, array_rawtext) {
	var tellStr = '[""';
	for(i in array_rawtext) {
		if(tellStr.substr(tellStr.length-1, tellStr.length) != ',' && tellStr.length > 0) {
			tellStr += ',';
		}
		tellStr += rawformat(array_rawtext[i], false).toString();
		if(i < array_rawtext.length-1) {
			tellStr += ',{"text":"\n"}';
		}
	}
	tellStr += ']';
	print(tellStr);
	return tellPlayerStr(player, tellStr);
}*/