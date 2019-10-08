import "core/xcommands.js";
import "core/players/tell.js";
import "core/TellrawFormat.js";
import "core/mods/reskillable/compatskills.js";

registerXCommands([
    ['!skills [...matches]', function(pl, args, data){
        //!skills {MATCHES} -show:{SHOWLEN} -page:{PAGE} -sort:{SORT}
        var pskills = getPlayerSkills(pl);
        var skillItems = [];
        var params = getArgParams(args.matches);

        var txt = [
            "&l[=======] &cMinerim Skills &r&l[=======]",
            genDataPageList(
                pskills,
                args.matches,
                params.show,
                params.page,
                "!skills {MATCHES} -show:{SHOW} -page:{PAGE} -sort:{SORT}",
                function(skill, i){
                    var progBar = progressBar(skill.xp, skill.maxXp, 20,"|");
                    var proc = Math.round(100/skill.maxXp*skill.xp);
                    var hovertxt = [
                        "&l&o[&e&l&o"+skill.name+"&r&l&o]&r",
                        "&e&l&oLevel: &a&l"+skill.level+"&r",
                        progBar+"&r &9&l"+proc+"% &d"+skill.xp+"/"+skill.maxXp+"&r"
                    ];

                    return "&l[&6&l"+skill.level+"&r&l] &e&l"+skill.name+"&r "+progBar+"&r &7&l[Info]{*|show_text:"+hovertxt.join("\n").replace(/&/g,'\$')+"}&r\n";
                },
                function(a,b){//sort by level first, then xp
                    return b.lvl - a.lvl || b.xp - a.xp;
                },
                null,
                (params.sort||"").toLowerCase() == 'desc'
            )
        ];

        tellPlayer(pl, txt);

    }, 'skills']
]);