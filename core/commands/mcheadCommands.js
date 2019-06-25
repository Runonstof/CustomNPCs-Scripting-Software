import core\xcommandsAPI.js;
import core\cutils\DataList.js;
import core\utils\MCHeads.js;

//

registerXCommands([
    ['!mchead give <name> [count] [player]', function(pl, args, data){
        var head = getMCHeadItem(args.name);
        if(head != null) {
            pl.giveItem(head);
        } else {
            tellPlayer(pl, "&cThis head does not exists!");
        }
    }, 'mchead.give'],
    ['!mchead list [...matches]', function(pl, args, data){
        var params = getArgParams(args.matches);
        var txt = getTitleBar("MC Head List")+"\n";
        txt += genDataPageList(
            Object.keys(MCHeads),
            args.matches,
            parseInt(params.show||10),
            parseInt(params.page||1),
            "!mchead list {MATCHES} -show:{SHOWLEN} -page:{PAGE} -sort:{SORT}",
            function(item){
                return "&e - &b&l"+item+"&r &3[Get Head]{run_command:!mchead give "+item+"|show_text:$aClick to get mc head.}&r\n";
            },
            null,
            null,
            (params.sort||"").toLowerCase() == "desc"
        );
        tellPlayer(pl, txt);
    }, 'mchead.list'],
]);
