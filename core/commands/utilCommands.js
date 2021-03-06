import "core/utils/DataList.js";
import "core/mods/minecraft/Java.js";

function genMoney(w, amount) {
    var am = amount
    var coinams = Object.keys(_COINITEMS);
    var nmItems = [];
    for (var i = coinams.length - 1; i >= 0; i--) {
        var coincount = 0;
        var coinval = getCoinAmount(coinams[i]);
        if (coinval > 0) {
            while (am >= coinval) {
                coincount++;
                am -= coinval;
            }
        }
        if (coincount > 0) {
            var coinitem = w.createItem(_COINITEMS[coinams[i]], 0, coincount);
            coinitem.setCustomName(ccs(_COINITEMNAME));
            coinitem.setLore([
                ccs(_COINITEM_PREFIX + coinams[i].toUpperCase())
            ]);
            nmItems.push(coinitem);
        }
    }


    return nmItems;
}

function getPlayerMessage(player, message, w, pname = null, fullraw = true, allowed = []) {
    if (pname == null) { pname = player.getName(); }
    var data = w.getStoreddata();
    var plo = new Player(player.getName()).init(data);
    var sb = w.getScoreboard();
    var ts = sb.getTeams();
    var t = sb.getPlayerTeam(pname);
    var notifySound = pick([
        'animania:cluck3',
        'animania:combo',
        'animania:crow3',
        'animania:moo2',
        'animania:ooooohh',
        'animania:reeee',
        'immersiveengineering:birthdayparty',
    ]);
    var pcol = '';
    var pteam = '';
    var tcol = '';
    var teff = '';
    var colls = Object.keys(_RAWCOLORS);
    var effs = Object.keys(_RAWEFFECTS);
    if (t != null) {
        var ct = new Team(t.getName()).init(data);
        if (ct.data.chatcolor != null) {
            if (colls.indexOf(ct.data.chatcolor) > -1) {
                tcol = '&' + getColorId(ct.data.chatcolor);
            }
        }
        if (ct.data.chateffect != null) {
            if (effs.indexOf(ct.data.chateffect) > -1) {
                teff = '&' + getColorId(ct.data.chateffect);
            }
        }
        if (t.getColor() != null) {
            pcol = '&' + getColorId(t.getColor());
        }
        pteam = pcol + "&o" + t.getDisplayName() + " &r" + pcol;
    }

    //Override player specific
    if (plo.data.chatcolor != null) {
        tcol = '&' + getColorId(plo.data.chatcolor);
    }
    //var timestr = '';
    //var now = new Date();
    //timestr = '&l[&r'+pcol+now.getHours().toString().append('0', 2)+':'+now.getMinutes().toString().append('0', 2)+'&l]&r';

    //var newmsg = pcol+timestr+pcol+'&l[&r'+pteam+pname+'&r'+pcol+'&l] -> &r'+tcol+teff;
    var newmsg = pcol + '&l[&r' + pteam + pname + '&r' + pcol + '&l] -> &r' + tcol + teff;
    if (!fullraw) {
        newmsg = ccs(newmsg, allowed);
    }
    newmsg += message.rangeUpper(0, 1); //Concat message contents

    var plr = w.getAllPlayers();
    var mrx = /@(\w+)/g;
    var mplr = newmsg.match(mrx) || [];

    for (var k in mplr) {
        var mtc = mplr[k].replace(mrx, '$1');
        var pmtc = null;
        for (var p in plr) {
            if (occurrences(plr[p].getName().toLowerCase(), mtc.toLowerCase()) > 0) {
                pmtc = plr[p].getName();
                break;
            }
        }
        if (pmtc != null) {
            executeCommand(player, "/playsound " + notifySound + " hostile " + pmtc, pmtc);
            newmsg = ccs(newmsg.replace('@' + mtc, '&9&o&l@' + pmtc + '&r'));
        }
    }

    var trx = /\$(\w+)/g;
    var tlr = newmsg.match(trx) || [];
    var apl = (function(w) {
        var pnames = [];
        var ps = w.getAllPlayers();
        for (var psi in ps as iplayr) {
            pnames.push(iplayr.getName());
        }

        return pnames;
    })(w);
    for (var t in tlr) {
        var tc = tlr[t].replace(trx, '$1');
        for (var tt in ts as sbt) {
            if (occurrences(sbt.getDisplayName().toLowerCase(), tc.toLowerCase()) > 0) {
                //Team select
                var spl = sbt.getPlayers();
                var scol = sbt.getColor();
                var sscol = '&f';
                var stn = sbt.getDisplayName();
                if (scol != null) {
                    sscol = "&" + getColorId(scol);
                }

                for (var sp in spl as splayr) {
                    if (apl.indexOf(splayr) > -1) {
                        executeCommand(player, '/playsound ' + notifySound + ' hostile ' + splayr, splayr);
                    }
                }
                newmsg = ccs(newmsg.replace('$' + tc, sscol + '&l' + "$" + stn + '&r'));
            }
        }
    }

    return newmsg;
}



//Converts int to string
function getAmountCoin(amount) {
    var rstr = '';
    var ams = sign(amount);
    if (ams == -1) { rstr = '-'; }
    amount = Math.abs(amount);
    var ckeys = Object.keys(_COINTABLE);
    for (var i = ckeys.length - 1; i >= 0; i--) {

        var add = 0;
        while (amount >= _COINTABLE[ckeys[i]]) {
            add++;
            amount -= _COINTABLE[ckeys[i]];
        }
        if (add > 0) {
            rstr += add.toString() + ckeys[i].toUpperCase();
        }
    }

    if (rstr == '') { rstr = '0G'; }
    return rstr;
}
//converts string to int
function getCoinAmount(str) {
    var arx = /([\d]+)([a-zA-Z]+)/g;
    var amounts = str.match(arx) || [];
    var amount = 0;
    var sgn = 1;
    if (str.substr(0, 1) == '-') { sgn = -1; }

    for (var a in amounts as _am) {
        var _amnum = parseInt(_am.replace(arx, '$1'));
        var _amunit = _am.replace(arx, '$2').toLowerCase();
        var coinkeys = Object.keys(_COINTABLE);
        if (coinkeys.indexOf(_amunit) > -1) {
            amount += _amnum * _COINTABLE[_amunit];
        }
    }
    return amount * sgn;
}


var ReskillableRegistry = (hasMCMod("reskillable") ? Java.type('codersafterdark.reskillable.api.ReskillableRegistries') : null);


@block register_commands_event
//REGISTER UTIL COMMANDS
registerXCommands([
    ['!debug [...matches]', function(pl, args, data) {
        var items = new Permission().getAllDataEntries(data);

        var params = getArgParams(args.matches);
        var tellStr = getTitleBar("Sample Items") + "\n" +
            genDataPageList(
                items,
                args.matches,
                parseInt(params.show || 10),
                parseInt(params.page || 1),
                "!debug {MATCHES} -page:{PAGE} -show:{SHOWLEN}",
                function(item, i) {
                    return "&r[&c&l" + item.name + "&r] " + "\n";
                },
                function(a, b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                },
                function(item, list) {
                    return arrayOccurs(item.name, list, false, false) > 0;
                }
            );
        tellPlayer(pl, tellStr);
    }, 'debug', [{
        "argname": "rows",
        "type": "number",
        "min": 1,
        "max": 6,
    }]],
    ['!fakemsg <player> <team> <team_color> [...message]', function(pl, args, data) {
        executeCommand(pl, "/tellraw @a " + parseEmotes(strf(getChatMessage(args.player, args.team, args.team_color, args.message.join(" ")))));
    }, 'fakemsg', [{
        "argname": "team_color",
        "type": "color"
    }]],
    ['!scare [player] [type]', function(pl, args, data) {
        var tpl = args.player || pl.getName();
        var type = args.type || "creeper";
        var snds = {
            "creeper": "minecraft:entity.creeper.primed",
            "ghast": "minecraft:entity.ghast.hurt"
        };

        if (tpl != null) {
            executeCommand(pl, "/playsound " + snds[type] + " hostile " + tpl, tpl);
        }
    }, 'scare', [{
        "argname": "type",
        "type": "enum",
        "values": [
            "creeper",
            "ghast"
        ]
    }]],
    ['!thunder [player]', function(pl, args, data) {
        var target = (args.player == null ? pl : pl.world.getPlayer(args.player));
        if (target != null) {
            var tpo = new Player(target.getName()).init(data);
            var tpos = target.getPos();
            pl.world.thunderStrike(tpos.getX(), tpos.getY(), tpos.getZ());
            executeCommand(pl, "/tellraw @a " + parseEmotes(strf(tpo.getNameTag(pl.world.getScoreboard()) + "&a&l HAS MADE THE &r:seagull:&a&lHOLY SEAGULL&r:seagull:&a&l ANGRY!!!")));
        }
    }, 'thunder', []],
    ['!sign edit <line> [...text]', function(pl, args, data) {

        var rt = pl.rayTraceBlock(16, false, false);
        var rtb = rt.getBlock();
        //is sign
        if (["minecraft:wall_sign", "minecraft:standing_sign"].indexOf(rtb.getName()) > -1 && rtb.hasTileEntity()) {
            var rnbt = rtb.getTileEntityNBT();
            var newTxt = parseEmotes(strf(args.text.join(" ")));
            rnbt.setString("Text" + args.line.toString(), newTxt);
            rtb.setTileEntityNBT(rnbt);

            //==TEMPORARY: force block update
            //==Removed when Noppes includes updating in setTileEntityNBT
            var meta = rtb.getMetadata();
            rtb.setMetadata(0);
            rtb.setMetadata(1);
            rtb.setMetadata(meta);
            //==

            tellPlayer(pl, "&aEdited line #" + args.line.toString() + " of sign!");
        } else {
            tellPlayer(pl, "&cYou are not looking at a sign!");
        }

        return false;
    }, 'sign.edit', [{
        "argname": "slot",
        "type": "number",
        "min": 1,
        "max": 4,
    }, ]],
    ['!help [...matches]', function(pl, args, data) {
        var params = getArgParams(args.matches);
        var txt = getTitleBar("Commands") + "\n";
        var cmds = [];
        //Only get permiited commands
        for (var c in _COMMANDS as _cmd) {
            if (new Permission(_cmd.perm).init(data).permits(pl.getName(), pl.world.scoreboard, data)) {
                cmds.push(_cmd);
            }
        }
        txt += genDataPageList(
            cmds,
            args.matches,
            parseInt(params.show || 10),
            parseInt(params.page || 1),
            "!help {MATCHES} -page:{PAGE} -show:{SHOWLEN} -sort:{SORT}",
            function(cmd, i) {
                return "&c" + cmd.usage + "{suggest_command:" + getCommandNoArg(cmd.usage) + "}&r\n";
            },
            function(a, b) {
                var aa = getCommandNoArg(a.usage);
                var bb = getCommandNoArg(b.usage);
                if (aa < bb) return -1;
                if (aa > bb) return 1;
                return 0;
            },
            function(cmd, list) {
                return arrayOccurs(cmd.usage, list, false, false);
            },
            (params.sort || "").toLowerCase() == "desc"
        );
        tellPlayer(pl, txt);
    }, 'help'],
    ['!command info <...command>', function(pl, args, data) {
        var argcmd = args.command.join(" ").trim();
        for (var c in _COMMANDS as cmd) {
            if (getCommandName(cmd.usage) == argcmd) {
                tellPlayer(pl, getTitleBar("Command Info"));
                tellPlayer(pl, "&eCommand: &b" + getCommandNoArg(cmd.usage).trim());
                tellPlayer(pl,
                    "&ePermission ID: &9&l" +
                    cmd.perm + "&r" +
                    (new Permission(cmd.perm).exists(data) ?
                        " (&6:sun: Info{run_command:!perms info " + cmd.perm + "}&r)" :
                        "(&d:recycle: Regenerate{run_command:!chain !perms create " + cmd.perm + ";!command info " + argcmd + "|show_text:Command exists, but permission does not.\nClick to regenerate.}&r)"
                    )
                );
                return true;
            }
        }
        tellPlayer(pl, "&cNo commands found.");
        return true;
    }, 'command.info'],
    ['!chain <...commands>', function(pl, args, data) {
        var acmds = args.commands.join(" ").split(";");
        for (var a in acmds as acmd) {
            var excmd = acmd.trim().replace(/\s+/g, ' ');
            if (excmd.length != "") {
                executeXCommand(excmd, pl);
            }
        }
        return true;
    }, 'chain'],
    ['!fakeleave [...players]', function(pl, args) {
        var pcol = '&f';
        var sb = pl.world.getScoreboard();
        var spl = (args.players.length > 0 ? args.players : [pl.getName()]);
        for (var ss in spl as sp) {
            var t = sb.getPlayerTeam(sp);
            if (t != null) {
                var tc = t.getColor();
                if (tc != null) {
                    pcol = '&' + getColorId(tc);
                }
            }

            executeCommand(pl, '/tellraw @a ' + strf(pcol + sp + ' &r&eleft the game', true));
        }
    }, 'fakeleave'],
    ['!fakejoin [...players]', function(pl, args) {
        var pcol = '&f';
        var sb = pl.world.getScoreboard();
        var spl = (args.players.length > 0 ? args.players : [pl.getName()]);
        for (var ss in spl as sp) {
            var t = sb.getPlayerTeam(sp);
            if (t != null) {
                var tc = t.getColor();
                if (tc != null) {
                    pcol = '&' + getColorId(tc);
                }
            }

            executeCommand(pl, '/tellraw @a ' + strf(pcol + sp + ' &r&ejoined the game', true));
        }
    }, 'fakejoin'],
    ['!version', function(pl, args) {
        tellPlayer(pl, getTitleBar("Server Software"));
        tellPlayer(pl, "&e&l" + CONFIG_SERVER.NAME + " Version: &c&l" + SCRIPT_VERSION);
        tellPlayer(pl, "&e&lSubscription: &9&lPrototype Edition");
        tellPlayer(pl, "&e&lProgrammed by: &r&lRunonstof&e and &r&lslava_110");
        tellPlayer(pl, "&6Contact Runonstof for further questions. Or visit the &6&nDiscord Server&r");
    }, "version"],
    ['!listEnchants [...matches]', function(pl, args) {
        var ENCHANTS = REGISTRY.ENCHANTMENTS.getValues();
        ///tellPlayer(pl, getTitleBar("All Registered Enchantments", false));
        var showEnchants = [];
        for (var i in ENCHANTS as ench) {
            var ename = REGISTRY.ENCHANTMENTS.getKey(ench);
            var eid = REGISTRY.ENCHANTMENTS.getID(ench);
            showEnchants.push({
                'name': ename,
                'id': eid
            });
            // if(args.matches.length == 0 || arrayOccurs(ename, args.matches)) {
            // 	tellPlayer(pl, "&e - &b"+ename+"&r (ID: "+eid+")");
            // }
        }
        var params = getArgParams(args.matches);
        var tellStr = getTitleBar("All Registered Enchants", false) + "\n" +
            genDataPageList(
                showEnchants,
                args.matches,
                parseInt(params.show || 10),
                parseInt(params.page || 1),
                "!listEnchants {MATCHES} -page:{PAGE} -show:{SHOWLEN}",
                function(showEnchant, i) {
                    return "&r&b" + showEnchant.name + "&e (ID: &a" + showEnchant.id + "&e)\n";
                },
                function(a, b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                },
                function(showEnchant, list) {
                    return arrayOccurs(showEnchant.name, list, false, false) > 0;
                }
            );

        tellPlayer(pl, tellStr);
    }, 'listEnchants'],
    ['!listPotions [...matches]', function(pl, args) {
        var POTIONS = REGISTRY.POTIONS.getValues();
        // tellPlayer(pl, getTitleBar("All Registered Potion Effects", false));
        var showPotions = [];
        for (var i in POTIONS as pot) {
            var pname = REGISTRY.POTIONS.getKey(pot);
            var pid = REGISTRY.POTIONS.getID(pot);
            // if(args.matches.length == 0 || arrayOccurs(pname, args.matches) > 0) {
            // 	tellPlayer(pl, "&e - &b"+pname+"&r (ID: "+pid+")");
            // }
            showPotions.push({
                'name': pname,
                'id': pid
            });
        }

        var params = getArgParams(args.matches);
        var tellStr = getTitleBar("All Registered Potions", false) + "\n" +
            genDataPageList(
                showPotions,
                args.matches,
                parseInt(params.show || 10),
                parseInt(params.page || 1),
                "!listPotions {MATCHES} -page:{PAGE} -show:{SHOWLEN}",
                function(showPotion, i) {
                    return "&r&b" + showPotion.name + "&e (ID: &a" + showPotion.id + "&e)\n";
                },
                function(a, b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                },
                function(showPotion, list) {
                    return arrayOccurs(showPotion.name, list, false, false) > 0;
                }
            );

        tellPlayer(pl, tellStr);
    }, 'listPotions'],
    ['!listBiomes [...matches]', function(pl, args) {
        var BIOMES = REGISTRY.BIOMES.getValues();
        tellPlayer(pl, getTitleBar("All Registered Biomes", false));
        for (var i in BIOMES as bio) {
            var bname = REGISTRY.BIOMES.getKey(bio);
            var bid = REGISTRY.BIOMES.getID(bio);
            if (args.matches.length == 0 || arrayOccurs(bname, args.matches) > 0) {
                tellPlayer(pl, "&e - &b" + bname + "&r (ID: " + bid + ")");
            }
        }
    }, 'listBiomes'],
    ['!listEntities [...matches]', function(pl, args) {
        var ENTITIES = REGISTRY.ENTITIES.getValues();
        tellPlayer(pl, getTitleBar("All Registered Entities", false));
        for (var i in ENTITIES as ent) {
            var bname = REGISTRY.ENTITIES.getKey(ent);
            var bid = REGISTRY.ENTITIES.getID(ent);
            if (args.matches.length == 0 || arrayOccurs(bname, args.matches) > 0) {
                tellPlayer(pl, "&e - &b" + bname + "&r (ID: " + bid + ")");
            }
        }
    }, 'listEntities'],
    ['!listSkills [...matches]', function(pl, args) {
        if (ReskillableRegistry != null) {
            var SKILLS = ReskillableRegistry.SKILLS.getValues();
            tellPlayer(pl, getTitleBar("All Registered Skills", false));
            for (var i in SKILLS as skill) {
                var bname = ReskillableRegistry.SKILLS.getKey(skill);
                var bid = ReskillableRegistry.SKILLS.getID(skill);
                var obj = skill.getKey().replace(/\w+\.(\w+)/g, '$1_xp');
                if (args.matches.length == 0 || arrayOccurs(bname, args.matches) > 0) {
                    tellPlayer(pl, "&e - &b" + bname + "&r (ID: " + bid + ", Objective: " + obj + ")");
                }
            }
        } else {
            tellPlayer(pl, "&6This command requires the mod 'Reskillable' to be installed.");
        }
    }, 'listSkills'],
    ['!tellraw <player> <...message>', function(pl, args) {
        var msg = args.message.join(' ');
        executeCommand(pl, '/tellraw ' + args.player + ' ' + parseEmotes(strf(msg, true)));
        return true;
    }, 'tellraw'],
    ['!tellaction <player> <...message>', function(pl, args, data) {
        var msg = args.message.join(' ');
        executeCommand(pl, "/title " + args.player + " actionbar " + parseEmotes(strf(msg)));
        return true;
    }, 'tellaction'],
    ['!telltitle <player> <...message>', function(pl, args, data) {
        var msg = args.message.join(' ');
        executeCommand(pl, "/title " + args.player + " title " + parseEmotes(strf(msg)));
        return true;
    }, 'telltitle'],
    ['!setMagAmmo <amount>', function(pl, args) {
        var mItem = pl.getMainhandItem();
        if (!mItem.isEmpty()) {
            var mnbt = mItem.getNbt();
            if (mnbt.has('Ammo')) {
                mnbt.setInteger('Ammo', args.amount);
                //Item.setNbt(mnbt);
                tellPlayer(pl, "&aSet ammo to " + args.amount + "!");
                return true;
            }
        }
        tellPlayer(pl, "&cYou don't have an magazine in your hand!");

        return false;
    }, 'setMagAmmo', [{
        "argname": "amount",
        "type": "number",
        "min": 0
    }]],
    ['!giveMoney <amount> [...players]', function(pl, args) {
        var w = pl.world;
        var plrs = [];
        objArray(w.getAllPlayers()).forEach(function(wp) {
            plrs.push(wp.getName());
        });
        var am = getCoinAmount(args.amount);
        if (args.players.length == 0) { args.players = [pl.getName()]; }
        var mn = genMoney(w, am);

        for (var i in args.players as apl) {
            if (plrs.indexOf(apl) > -1) {
                for (var m in mn as mi) {
                    w.getPlayer(apl).giveItem(mi);
                }
            }
        }

        tellPlayer(pl, "&aGave &r:money:&e" + getAmountCoin(am) + "&a to players: '" + args.players.join(', ') + "'");
        for (var a in args.players as apl) {
            if (playerIsOnline(w, apl)) {
                executeCommand(pl, "/tellraw " + apl + " " + parseEmotes(strf("&aYou got &r:money:&e" + getAmountCoin(am))));
            }
        }
    }, 'giveMoney', [{
        "argname": "amount",
        "type": "currency",
        "min": 1
    }]],
    ['!takeMoney <amount> [...players]', function(pl, args, data) {
        var w = pl.world;
        var plrs = [];
        objArray(w.getAllPlayers()).forEach(function(wp) {
            plrs.push(wp.getName());
        });
        var am = getCoinAmount(args.amount);
        if (args.players.length == 0) { args.players = [pl.getName()]; }

        for (var i in args.players as ap) {
            var apo = new Player(ap).init(data);
            apo.data.money -= am;
            apo.save(data);
        }
    }, 'takeMoney', [{
        "argname": "amount",
        "type": "currency",
        "min": 1
    }]],
    ['!giveVMoney <amount> [...players]', function(pl, args, data) {
        var w = pl.world;

        var am = getCoinAmount(args.amount);
        if (args.players.length == 0) { args.players = [pl.getName()]; }


        for (var i in args.players as apl) {
            var apo = new Player(apl);
            if (apo.exists(data)) {
                apo.load(data);
                apo.data.vmoney += am;
                apo.save(data);

            }

        }

        tellPlayer(pl, "&aGave &b:money:" + getAmountCoin(am) + "&a to players: '" + args.players.join(', ') + "'");
        for (var a in args.players as apl) {
            if (playerIsOnline(w, apl)) {
                executeCommand(pl, "/tellraw " + apl + " " + parseEmotes(strf("&aYou got &b:money:" + getAmountCoin(am))));
            }
        }
    }, 'giveMoney', [{
        "argname": "amount",
        "type": "currency",
        "min": 1
    }]],
    ['!giveArMoney <amount> [...players]', function(pl, args, data) {
        var w = pl.world;

        var am = getCoinAmount(args.amount);
        if (args.players.length == 0) { args.players = [pl.getName()]; }


        for (var i in args.players as apl) {
            var apo = new Player(apl);
            if (apo.exists(data)) {
                apo.load(data);
                apo.data.armoney += am;
                apo.save(data);

            }

        }

        tellPlayer(pl, "&aGave &d:money:" + getAmountCoin(am) + "&a to players: '" + args.players.join(', ') + "'");
        for (var a in args.players as apl) {
            if (playerIsOnline(w, apl)) {
                executeCommand(pl, "/tellraw " + apl + " " + parseEmotes(strf("&aYou got &d:money:" + getAmountCoin(am))));
            }
        }
    }, 'giveMoney', [{
        "argname": "amount",
        "type": "currency",
        "min": 1
    }]],
    ['!convertMoney', function(pl, args) {
        var mItem = pl.getMainhandItem();
        if (!mItem.isEmpty()) {
            var mL = mItem.getLore();
            if (mL.length > 0) {
                var cAm = getCoinAmount(mL[0].replace(/\s/g, ''));
                if (cAm > 0) {
                    mItem.setCustomName(ccs('&2&lMoney&r'));
                    mItem.setLore([
                        ccs('&e' + getAmountCoin(cAm))
                    ]);
                    tellPlayer(pl, "&aConverted money!");
                    return true;
                }
            }
            tellPlayer(pl, "&cYou don't have valid money in hand!");
        } else {
            tellPlayer(pl, "&cYou don't have anything in your hand!");
        }

        return false;
    }, 'convertMoney'],
    ['!copyCoords [player]', function(pl, args, data) {
        var pname = args.player || pl.getName();
        if (playerIsOnline(pl.world, pname)) {
            var telltxt = getTitleBar("Coords", false) + "\n\n" +
                "&aX: &c{XCOORD} &aY: &c{YCOORD} &aZ: &c{ZCOORD}\n\n" +
                "&rCopy coords as:\n" +
                " - &a[TP Command]{suggest_command:/tp @p {XCOORD} {YCOORD} {ZCOORD}|show_text:$aClick to get coords as /tp command.}&r\n" +
                " - &a[Formatted XYZ]{suggest_command:X:{XCOORD} Y:{YCOORD} Z:{ZCOORD}|show_text:$aClick to get coords nicely formatted.}&r\n" +
                " - &a[Numbers Only]{suggest_command:{XCOORD} {YCOORD} {ZCOORD}|show_text:$aClick to get coords numbers only.}&r\n" +
                " - &a[Selector]{suggest_command:x={XCOORD},y={YCOORD},z={ZCOORD}|show_text:$aClick to get coords as selector.}&r\n";

            tellPlayer(pl, telltxt.fill({
                "XCOORD": Math.floor(pl.getX()),
                "YCOORD": Math.floor(pl.getY()),
                "ZCOORD": Math.floor(pl.getZ()),
            }));

        } else {
            tellPlayer(pl, "&cPlayer is not online!");
        }
    }, 'copyCoords'],
    //Inventory load/save
    ['!inv save <name>', function(pl, args, data) {
        var apo = new Player(pl.getName());
        apo.load(data);

        var inv = pl.getMCEntity().field_71071_by;
        var inventory = [];
        for (var i = 0; i < inv.field_70462_a.length; i++) {
            inventory.push(API.getIItemStack(inv.field_70462_a.get(i)).getItemNbt().toJsonString());
        }

        apo.data.inventories.push([args.name, inventory]);
        apo.save(data);
        tellPlayer(pl, "&aInventory saved as '" + args.name + "'");

        return true;

    }, 'inv.save'],
    ['!inv load <name>', function(pl, args, data) {
        var w = pl.world;
        var apo = new Player(pl.getName());
        apo.load(data);

        var inventory = apo.getInventory(args.name);
        if (!inventory) {
            tellPlayer(pl, "&cInventory '" + args.name + "' not found");
            return false;
        }

        var inv = pl.getMCEntity().field_71071_by;
        inv.func_174888_l(); //Clear

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i] && API.stringToNbt(inventory[i]).getString("id") != "minecraft:air")
                inv.field_70462_a.set(i, w.createItemFromNbt(API.stringToNbt(inventory[i])).getMCItemStack());
        }

        inv.func_70296_d(); //Mark dirty
        pl.getMCEntity().field_71069_bz.func_75142_b(); //Detect and send changes

        tellPlayer(pl, "&aInventory '" + args.name + "' succefully loaded");
        return true;

    }, 'inv.load'],
    ['!inv remove <name>', function(pl, args, data) {
        var w = pl.world;
        var apo = new Player(pl.getName());
        apo.load(data);

        var inventory = apo.getInventory(args.name);
        if (!inventory) {
            tellPlayer(pl, "&cInventory '" + args.name + "' not found");
            return false;
        }
        apo.removeInventory(args.name);
        apo.save(data);
        tellPlayer(pl, "&aInventory '" + args.name + "' succefully removed");
        return true;

    }, 'inv.save'],
    ['!eval [...code]', function(plr, args, data) {
        var fn = new Function('player', 'args', 'data', args.code.join(" "));

        try {
            tellPlayer(plr, (fn(plr, args, data) || ""));
        } catch (exc) {
            handleError(exc);
        }
    }]
]);
@endblock