/**
 * 
 * @param {Array} items Items to show
 * @param {Array} matches (Default: [])Matches to filter on
 * @param {Number} showLen (Default: 10)Items to show per page
 * @param {Number} curPage (Default: 1)Current page to output
 * @param {String} navCmd Base command to generate new navigation commands on
 * @param {Function} listingFn (item, index) Function that returns string as one item in list (line break needed)
 * @param {Function} sortFn Function to sort items
 * @param {Function} compareFn (item,matches)Custom Function to check if item is allowed in list
 * @param {Enum("ASC", "DESC")} sortDesc (Default: ASC)Desc will reverse the items after sorting
 * @param {String} toptext The text above the results, below the help buttons
 */
function genDataPageList(items, matches = [], showLen = 10, curPage = 1, navCmd = null, listingFn = null, sortFn = null, compareFn = null, sortDesc = false, toptext = '') {


    var output = "";
    //Sanitize
    for (var i in matches as match) {
        matches[i] = match.replace(/[^*\w]/g, "");
    }

    //Limit showLen
    showLen = Math.max(Math.min(showLen, 32), 4);

    //get excludes from matches
    var excludes = [];
    var excludeRgx = /\*([\w]+)/;
    var newMatches = [];
    for (var a in matches as match) {
        (match.cmatch(excludeRgx) > 0 ? excludes : newMatches).push(match.replace(excludeRgx, "$1"));
    }
    matches = newMatches;

    var minShow = (curPage - 1) * showLen;
    var maxShow = minShow + showLen;

    var curShow = 0;

    var tellItems = [];
    //Sort items
    items.sort(typeof sortFn === "function" ? sortFn : function(a, b) {
        var al = a.toLowerCase();
        var bl = b.toLowerCase();

        if (al < bl) return -1;
        if (al > bl) return 1;

        return 0;
    });


    if (sortDesc) {
        items.reverse();
    }
    //Filter items
    for (var i in items as item) {
        var isExcluded = (compareFn == null ? arrayOccurs(item, excludes, false, false) > 0 : compareFn(item, excludes));
        if (matches.length == 0 || (compareFn == null ? arrayOccurs(item, matches, false, false) > 0 : compareFn(item, matches))) {
            if (!isExcluded) {
                if (curShow >= minShow && curShow < maxShow && tellItems.indexOf(item) == -1) {
                    tellItems.push(item)
                }
                curShow++;
            }
        }
    }

    function genNavCmd(_page = curPage, _showLen = showLen, _sort = sortDesc) {
        return navCmd.fill({
            "MATCHES": matches.join(" ") + " " + arrayFormat(excludes, "*{VALUE}"),
            "PAGE": _page,
            "SHOWLEN": _showLen, //Backwards compatability for some plugins
            "SHOW": _showLen, //New change
            "SORT": (_sort ? "desc" : "asc")
        });
    }

    var gCmd = genNavCmd();
    output += "&3[Copy Command]{suggest_command:" + gCmd + "|show_text:$3Click to get the command that shows exactly this page.}&r" +
        " &5[? Help]{*|show_text:$dAdd words divided by a space to search for them.\nTo Exclude something, put '*' in front.\nYou can also combine it to get more specific results.}&r\n";

    if (toptext) {
        output += toptext + '\n';
    }

    if (matches.length > 0) {
        output += "&6&lSearching for: &e" + matches.join(", ") + "\n";
    }
    if (excludes.length > 0) {
        output += "&6&lExcluding: &e" + excludes.join(", ") + "\n";
    }
    output += "&6&lSorting: &e" + (sortDesc ? "De" : "A") + "scending&r &b[Toggle]{run_command:" + genNavCmd(curPage, showLen, !sortDesc) + "|show_text:$3Click to toggle sorting type (asc/desc).}\n";
    output += "&6&lResults Found: &a" + curShow + " &eof &a" + items.length + "\n";

    var maxPages = Math.ceil(curShow / showLen);

    var showLenOptions = [
        5,
        10,
        15,
        20
    ];
    var sloTxt = "";
    for (var s in showLenOptions as slo) {
        var showLenCmd = genNavCmd(Math.round(curPage * (showLen / slo)), slo)

        sloTxt += "&b[Show " + slo + "]{run_command:" + showLenCmd + "|show_text:$3Click to show " + slo.toString() + " results per page.}&r ";
    }

    output += sloTxt + "\n";

    var navBtns = "";
    if (navCmd != null) {
        var matchCmd = matches.join(" ") + " " + arrayFormat(excludes, "*{VALUE}");
        var prevCmd = genNavCmd(curPage - 1);
        var nextCmd = genNavCmd(curPage + 1);
        var prevBtn = curPage > 1 ? " &9[<< Previous]{run_command:" + prevCmd + "|show_text:$9Click to go to previous page.}&r" : "";
        var nextBtn = curPage < maxPages ? " &a[Next >>]{run_command:" + nextCmd + "|show_text:$aClick to go to next page.}&r" : "";
        navBtns = prevBtn + nextBtn;
    }

    if (tellItems.length > 0) {
        output += "&6&lPage: &5&l" + curPage + "/" + maxPages + "&r" + navBtns + "\n";

        for (var i in tellItems as tellItem) {
            output += (listingFn == null ? " - &b&l" + tellItem + "&r\n" : listingFn(tellItem, i));
        }
    } else {
        output += "&cNothing found with given criteria.";
    }

    return output;
}