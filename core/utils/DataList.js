function genDataPageList(items, matches=[], showLen=10, curPage=1, navCmd=null, listingFn=null, sortFn=null, compareFn=null, sortDesc=false) {


    var output = "";
    //Sanitize
    for(var i in matches as match) {
        matches[i] = match.replace(/[^*\w]/g, "");
    }

    //Limit showLen
    showLen = Math.max(Math.min(showLen, 32), 4);

    //get excludes from matches
    var excludes = [];
    var excludeRgx = /\*([\w]+)/;
    var newMatches = [];
    for(var a in matches as match) {
        (match.cmatch(excludeRgx) > 0 ? excludes : newMatches).push(match.replace(excludeRgx, "$1"));
    }
    matches = newMatches;

    var minShow = (curPage-1)*showLen;
    var maxShow = minShow+showLen;

    var curShow = 0;

    var tellItems = [];
    //Sort items
    items.sort(typeof sortFn === "function" ? sortFn : function(a,b){
        var al = a.toLowerCase();
        var bl = b.toLowerCase();

        if(al < bl) return -1;
        if(al > bl) return 1;

        return 0;
    });


    if(sortDesc) {
        items.reverse();
    }
    //Filter items
    for(var i in items as item) {
        var isExcluded = (compareFn == null ? arrayOccurs(item, excludes, false, false) > 0 : compareFn(item, excludes));
        if(matches.length == 0 || (compareFn == null ? arrayOccurs(item, matches, false, false) > 0 : compareFn(item, matches))) {
            if(!isExcluded) {
                if(curShow >= minShow && curShow < maxShow && tellItems.indexOf(item) == -1){
                    tellItems.push(item)
                }
                curShow++;
            }
        }
    }

    function genNavCmd(_page=curPage, _showLen=showLen, _sort=sortDesc) {
        return navCmd.fill({
            "MATCHES": matches.join(" ")+" "+arrayFormat(excludes, "*{VALUE}"),
            "PAGE": _page,
            "SHOWLEN": _showLen,
            "SORT": (_sort ? "desc" : "asc")
        });
    }

    var gCmd = genNavCmd();
    output += "&3[Copy Command]{suggest_command:"+gCmd+"|show_text:$3Click to get the command that shows exactly this page.}&r"+
        " &5[? Help]{*|show_text:$dAdd words divided by a space to search for them.\nTo Exclude something, put '*' in front.\nYou can also combine it to get more specific results.}&r\n";

    if(matches.length > 0) {
        output += "&6&lSearching for: &e"+matches.join(", ")+"\n";
    }
    if(excludes.length > 0) {
        output += "&6&lExcluding: &e"+excludes.join(", ")+"\n";
    }
    output += "&6&lSorting: &e"+(sortDesc?"De":"A")+"scending&r &b[Toggle]{run_command:"+genNavCmd(curPage, showLen, !sortDesc)+"|show_text:$3Click to toggle sorting type (asc/desc).}\n";
    output += "&6&lResults Found: &a"+curShow+" &eof &a"+items.length+"\n";

    var maxPages = Math.ceil(curShow/showLen);

    var showLenOptions = [
        5,
        10,
        15,
        20
    ];
    var sloTxt = "";
    for(var s in showLenOptions as slo) {
        var showLenCmd = genNavCmd(Math.round(curPage * (showLen/slo)), slo)

        sloTxt += "&b[Show "+slo+"]{run_command:"+showLenCmd+"|show_text:$3Click to show "+slo.toString()+" results per page.}&r ";
    }

    output += sloTxt+"\n";

    var navBtns = "";
    if(navCmd != null) {
        var matchCmd = matches.join(" ")+" "+arrayFormat(excludes, "*{VALUE}");
        var prevCmd = genNavCmd(curPage-1);
        var nextCmd = genNavCmd(curPage+1);
        var prevBtn = curPage > 1 ? " &9[<< Previous]{run_command:"+prevCmd+"|show_text:$9Click to go to previous page.}&r" : "";
        var nextBtn = curPage < maxPages ? " &a[Next >>]{run_command:"+nextCmd+"|show_text:$aClick to go to next page.}&r" : "";
        navBtns = prevBtn+nextBtn;
    }

    if(tellItems.length > 0) {
        output += "&6&lPage: &5&l"+curPage+"/"+maxPages+"&r"+navBtns+"\n";

        for(var i in tellItems as tellItem) {
            output += (listingFn == null ? " - &b&l"+tellItem+"&r\n" : listingFn(tellItem, i));
        }
    } else {
        output += "&cNothing found with given criteria.";
    }

    return output;
}
