import "core/utils/StringFormat.js";
import "core/utils/TellrawFormat.js";
var rgx_booktag = /^#(\w+)(?:\s+([\w\W]+?))??\n?$/gm;
var rgx_booktaginfo = /^#(\w+)(?:\s+([\w\W]+?))??$/m;

function generateBook(w, bookstring) {
	var book = w.createItem("minecraft:written_book", 0, 1);
	var bnbt = book.getNbt();
    var pages = bookstring.split("#ENDPAGE");

	var putpages = [];
	for(var p in pages) {
		var page = pages[p];

		var booktags = page.match(rgx_booktag);
		for(var b in booktags) {
			var bt = booktags[b];
			
			var btinfo = bt.match(rgx_booktaginfo);
			switch(btinfo[1]) {
				case "TITLE":
					bnbt.setString("title", parseEmotes(ccs(btinfo[2])));
					break;
				case "AUTHOR":
					bnbt.setString("author", parseEmotes(ccs(btinfo[2])));
					break;
			}
			
			page = page.replace(btinfo[0]+"\n", "");
			page = page.replace(btinfo[0], "");
			
			
		}
		
		putpages.push(strf('&0'+page.replaceAll("&r", "&r&0")));
		
	}
	
	bnbt.setList("pages", putpages);
	
	return book;
	
}
