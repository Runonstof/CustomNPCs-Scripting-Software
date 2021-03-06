var _COMMANDS = [];
var _DATAHANDLERS = {};
//To-Do: Comment this file
import "core/DataHandler.js";
import "core/utils/DataList.js";



function queryDataHandlers(qry) {

}

function registerDataHandler(alias, dataHandlerFn) {
    _DATAHANDLERS[alias] = dataHandlerFn;
}

function getDataHandler(alias) {
    return _DATAHANDLERS[alias];
}

function registerXCommand(commandMatch, callback, perm, rules = [], payload = {}) {
    _COMMANDS.push({
        usage: commandMatch,
        callback: callback,
        perm: perm,
        rules: rules,
        enabled: true,
        payload: payload,
    });
}

function getCommandNoArg(cmdstr) {
    return cmdstr.match(/![\w\s]+/)[0];
}

function matchXCommands(cmdstrs = []) {
    if (typeof(cmdstrs) == 'string') { cmdstrs = [cmdstrs]; }
    var cmds = [];

    for (var c in _COMMANDS as command) {
        for (var ci in cmdstrs as cmdstr) {
            var cname = getCommandNoArg(command.usage).trim();
            if (cmdstr.substr(0, 1) == "^") {
                if ((cmdstrs.length == 0 || occurrences(cname, cmdstr.substr(1, cmdstr.length)) == 0) && cmds.indexOf(command) == -1) {
                    cmds.push(command);
                    break;
                }
            } else {
                if ((cmdstrs.length == 0 || occurrences(cname, cmdstr) > 0) && cmds.indexOf(command) == -1) {
                    cmds.push(command);
                    break;
                }
            }
        }
    }

    return cmds;
}

function getCommandName(cmdstr) {
    var cmda = getCommandNoArg(cmdstr).trim(); //Remove whitespace around
    return cmda.substr(1, cmda.length); //Remove '!'-character
}

function getCommandPerm(cmdstr) {
    return getCommandName(cmdstr).replace(/\s+/g, '.');
}

function registerXCommands(cmds) {
    for (var c in cmds) {
        registerXCommand(cmds[c][0], cmds[c][1], cmds[c][2], cmds[c][3] || [], cmds[c][4] || {});
    }
}

function CommandFactory(datahandler, cmdtree) {
    this.type = datahandler;
    this.cmdtree = cmdtree || datahandler;
    this.cmds = [];
    this.info = [];
    this.listingTransformer = null;
    this.listingTransformerFn = null;
    this.listingRequirement = null;
    this.onFns = {
        "create": [],
        "remove": [],
        "info": [],
        "list": [],
        "copy": [],
    };

    //Event functions
    this.on = function(action, callback) {
        this.onFns[action].push(callback);
        return this;
    };

    //Command Building functions
    this.addInfoText = function(infoFn) {
        this.info.push(infoFn);
        return this;
    };
    this.add = function(subCommand, fn, rules = [], payload = {}, dhNameArg = "name", dhMustExists = true) {
        payload = objMerge({
            "datatype": this.type,
            "cmdtree": this.cmdtree,
            "argname": dhNameArg,
            "fn": fn,
        }, payload);
        var cmdstr = "!" + this.cmdtree + " " + subCommand;
        this.cmds.push([
            cmdstr,
            function(pl, args, data, cdata) {
                var dht = getDataHandler(cdata.datatype);
                var dh = new dht(args[cdata.argname]).init(data, false);
                return cdata.fn(dh, pl, args, data, cdata);
            },
            getCommandPerm(cmdstr),
            rules.concat([{
                "argname": dhNameArg,
                "type": "datahandler",
                "datatype": this.type,
                "exists": dhMustExists
            }]),
            payload
        ]);
        return this;
    };
    this.addSettable = function(property, argTransformFn = null, rules = [], outputTransform = null, argNode, argName) {
        var propname = property.rangeUpper(0, 1);
        var out = objMerge({
            "val": "\"{" + property + "}\"",
        }, (outputTransform || {}));
        argName = argName || property;
        argNode = (argNode || "<{NAME}>").fill({
            "NAME": argName,
        });
        this.cmds.push([
            '!' + this.cmdtree + ' set' + propname + ' <name> ' + argNode,
            function(pl, args, data, cdata) {
                var dht = getDataHandler(cdata.datatype);
                var dh = new dht(args.name);
                var val = args[cdata.argname];
                dh.load(data);
                dh.data[cdata.property] = (argTransformFn == null ? val : argTransformFn(val, dh, pl, args, data, cdata));
                dh.save(data);
                var tellData = {};
                tellData[cdata.property] = val;
                tellPlayer(pl, "&aSet property &2\"" + property + "\"&a of " + dh.type + " &2\"" + dh.name + "\"&a to " + cdata.out.val.fill(tellData) + "&r&a!");
                return true;
            },
            this.cmdtree.replaceAll(" ", ".") + '.set' + propname,
            rules.concat([{
                "argname": "name",
                "type": "datahandler",
                "datatype": this.type,
                "exists": true,
            }]),
            {
                "datatype": this.type,
                "cmdtree": this.cmdtree,
                "property": property,
                "propname": propname,
                "argname": argName,
                "argnode": argNode,
                "out": out,
            },
        ]);

        return this;
    };
    this.setListTransformer = function(transformFn) {
        this.listingTransformerFn = transformFn;

        return this;
    };
    //Generate Functions
    this.genDefault = function(excludes = []) {
        if (excludes.indexOf("create") == -1)
            this.cmds.push(
                ['!' + this.cmdtree + ' create <name>', function(pl, args, data, cdata) {
                    var dht = getDataHandler(cdata.datatype);
                    var dh = new dht(args.name);
                    var payload = {
                        "cancel": false,
                    };
                    for (var o in cdata.self.onFns['create'] as onFn) {
                        funcOutput = onFn(dh, pl, args, data, cdata, payload);
                    }

                    if (!payload.cancel) {
                        dh.save(data);
                        tellPlayer(pl, "&aCreated " + dh.type + " &2'" + dh.name + "'&a!");
                        return true;
                    }
                    return false;
                }, this.cmdtree.replaceAll(" ", ".") + '.create', [{
                        "argname": "name",
                        "type": "string",
                        "noColor": true,
                    },
                    {
                        "argname": "name",
                        "type": "datahandler",
                        "datatype": this.type,
                        "exists": false,
                    },
                ], {
                    "datatype": this.type,
                    "self": this,
                }]);
        if (excludes.indexOf("remove") == -1)
            this.cmds.push(
                ['!' + this.cmdtree + ' remove <name>', function(pl, args, data, cdata) {
                    var dht = getDataHandler(cdata.datatype);
                    var dh = new dht(args.name);
                    for (var o in cdata.self.onFns['remove'] as onFn) {
                        onFn(dh, pl, args, data, cdata, payload);
                    }
                    dh.remove(data);
                    tellPlayer(pl, "&aRemoved " + dh.type + " '" + dh.name + "'!");
                    return true;
                }, this.cmdtree.replaceAll(" ", ".") + '.remove', [{
                    "argname": "name",
                    "type": "datahandler",
                    "datatype": this.type,
                    "exists": true,
                }], {
                    "datatype": this.type,
                    "self": this,
                }]);
        if (excludes.indexOf("info") == -1)
            this.cmds.push(
                ['!' + this.cmdtree + ' info <name>', function(pl, args, data, cdata) {
                    var dht = getDataHandler(cdata.datatype);
                    var dh = new dht(args.name);
                    dh.load(data);
                    var typename = dh.type.rangeUpper(0, 1);
                    tellPlayer(pl, getTitleBar(typename + " Info", false));
                    tellPlayer(pl, "[&2:recycle: Refresh{run_command:!" + cdata.cmdtree + " info " + dh.name + "|show_text:$aClick to reload " + cdata.datatype + " info.}&r]\n" +
                        "&6&l" + typename + " Name: &b" + dh.name + "&r [&4:cross: Remove{run_command:!" + cdata.cmdtree + " remove " + dh.name + "|show_text:$cClick to remove " + dh.type + "}&r]");
                    if ("getPermission" in dh) {
                        var dhp = dh.getPermission().init(data, false);
                        tellPlayer(pl, "&6&lPermission: &9" + dhp.name + "&r [&e:sun: Info{run_command:!perms info " + dhp.name + "}&r]")
                    }
                    var tellInfo = "";
                    for (var i in cdata.info as infoFn) {
                        tellInfo += infoFn(dh, pl, args, data, cdata);
                    }
                    if (tellInfo != "") {
                        tellPlayer(pl, tellInfo);
                    }

                    for (var o in cdata.self.onFns['info'] as onFn) {
                        onFn(dh, pl, args, data, cdata);
                    }

                    return true;
                }, this.cmdtree.replaceAll(" ", ".") + '.info', [{
                    "argname": "name",
                    "type": "datahandler",
                    "datatype": this.type,
                    "exists": true,
                }], {
                    "self": this,
                    "datatype": this.type,
                    "cmdtree": this.cmdtree,
                    "info": this.info,
                    "exc": excludes
                }]);
        if (excludes.indexOf("list") == -1)
            this.cmds.push(
                ['!' + this.cmdtree + ' list [...matches]', function(pl, args, data, cdata) {
                        var w = pl.world;
                        var sb = w.getScoreboard();
                        var dht = getDataHandler(cdata.datatype);
                        var params = getArgParams(args.matches);

                        var de = new dht().getAllDataEntries(data);
                        for (var o in cdata.self.onFns['list'] as onFn) {
                            onFn(dh, pl, args, data, cdata);
                        }
                        var txt = getTitleBar(cdata.datatype.rangeUpper(0, 1) + " List") + "\n";
                        txt += genDataPageList(
                            de,
                            args.matches,
                            parseInt(params.show || 10),
                            parseInt(params.page || 1),
                            "!" + cdata.cmdtree + " list {MATCHES} -page:{PAGE} -show:{SHOWLEN} -sort:{SORT}",
                            function(item) {
                                return cdata.ltfn == null ? ("&e - &b" + item.name + "&r\n") : cdata.ltfn(item, pl, args, data);
                            },
                            function(a, b) {
                                var aa = a.name;
                                var bb = b.name;
                                if (aa < bb) return -1;
                                if (aa > bb) return 1;
                                return 0;
                            },
                            function(cmd, list) {
                                return arrayOccurs(cmd.name, list, false, false);
                            },
                            (params.sort || "").toLowerCase() == "desc"
                        );

                        tellPlayer(pl, txt);
                        return true;
                    }, this.cmdtree.replaceAll(" ", ".") + '.list', [],
                    {
                        "self": this,
                        "datatype": this.type,
                        "cmdtree": this.cmdtree,
                        "lt": this.listingTransformer,
                        "ltfn": this.listingTransformerFn,
                    },
                ]);
        if (excludes.indexOf("copy") == -1)
            this.cmds.push(
                ['!' + this.cmdtree + ' copy <name> <new_name>', function(pl, args, data, cdata) {
                    var dht = getDataHandler(cdata.datatype);
                    var dh = new dht(args.name).init(data);
                    for (var o in cdata.self.onFns['copy'] as onFn) {
                        onFn(dh, pl, args, data, cdata);
                    }
                    dh.name = args.new_name;
                    dh.save(data);
                    tellPlayer(pl, "&aCopied " + dh.type + " '" + args.name + "' to '" + args.new_name + "'!");
                    return true;
                }, this.cmdtree.replaceAll(" ", ".") + '.copy', [{
                        "argname": "new_name",
                        "type": "string",
                        "noColor": true,
                    },
                    {
                        "argname": "name",
                        "type": "datahandler",
                        "datatype": this.type,
                        "exists": true,
                    },
                    {
                        "argname": "new_name",
                        "type": "datahandler",
                        "datatype": this.type,
                        "exists": false
                    }
                ], {
                    "datatype": this.type,
                    "self": this,
                }]);
        return this;
    };
    this.register = function() {
        registerXCommands(this.cmds);
        return this;
    };
}


function parseUsageRgx(command, str = null) { //Converts command usage to Regex, and gathers info about command
    //!perms\s+manage\s+add((?:\s+[\w]+))((?:\s+[\w]+)*)
    //+ == <...vars> //multiple args, minimal one required
    //* == [...vars] //multiple args, optional
    //  == <var> //arg, required
    //? == [var] // arg, optional

    var argrx = [];
    var cmdMatch = command.usage
        .replace(/(\w)\s+(\w)/g, "$1\\s+$2")
        .replace(/(\w|>|\])\s+(\w|<|\[)/g, "$1$2"); //fix whitespace
    var req_regx = /<([.]{3})*([\w]+)>/g; //Required arg regex
    var opt_regx = /\[([.]{3})*([\w]+)\]/g; //Optional arg recalc
    var rm = cmdMatch.allMatch(req_regx);
    for (var i in rm) { //required args
        var rmcode = rm[i][0];
        var rmmulti = (rm[i][1] != null);
        var rmname = rm[i][2];
        var rmpart = "((?:\\s+\\S+)" + (rmmulti ? "+" : "") + ")";
        if (str != null) {
            argrx.push([
                command.usage.indexOf(rmcode),
                rmname,
                rmmulti
            ]);
        }
        cmdMatch = cmdMatch.replace(rmcode, rmpart);
    }
    var om = cmdMatch.allMatch(opt_regx);
    for (var i in om) { //optional args
        var omcode = om[i][0];
        var ommulti = (om[i][1] != null);
        var omname = om[i][2];
        var ompart = "((?:\\s+\\S+)" + (ommulti ? "*" : "?") + ")";
        if (str != null) {
            argrx.push([
                command.usage.indexOf(omcode),
                omname,
                ommulti
            ]);
        }
        cmdMatch = cmdMatch.replace(omcode, ompart);
    }

    var capt_names = [];
    var cids = [];

    while (argrx.length > 0) {
        var hid = 0;
        for (var i in argrx) {
            if (argrx[i][0] > hid) {
                hid = argrx[i][0];
            }
        }
        for (var i in argrx) {
            if (argrx[i][0] == hid) {
                capt_names.push([argrx[i][1], argrx[i][2]]);
                argrx.splice(i, 1);
                break;
            }
        }
    }
    capt_names.reverse();

    return [cmdMatch, capt_names];
}

var ARGPARAM_REGEX = /-([\w]+)(?:\s*:\s*([\w\S]+))?/;

function getArgParams(arr) {
    var params = {};
    var remParams = [];
    for (var i in arr as a) {
        var am = a.match(ARGPARAM_REGEX);
        if (am != null) {
            params[am[1]] = (am[2] === undefined ? true : am[2]);
            remParams.push(am[0]);
        }
    }
    for (var re in remParams as remPar) {
        array_remove(arr, remPar);
    }
    return params;
}

function executeXCommand(str, player, permcheck = true, data) {
    var data = data || player.world.getStoreddata();
    var sb = player.world.getScoreboard();
    for (var c in _COMMANDS as cmd) {
        var cmdm = parseUsageRgx(cmd, str);

        var argrgx = cmdm[0];
        var rgx = new RegExp(argrgx, 'gi');
        if ((str.match(rgx) || []).length == 1) {
            if (str.indexOf(str.match(rgx)[0]) == 0 && str.replace(rgx, '') == '') {
                var argnames = cmdm[1];
                var cg = 1;
                var args = {};
                for (var a in argnames) {
                    var argname = argnames[a][0];
                    var ismulti = argnames[a][1];
                    if (typeof(args[argname]) == typeof(undefined)) {
                        args[argname] = (ismulti ? [] : null)
                    }
                    var argval = str.replace(rgx, '$' + cg.toString());
                    if (ismulti) {
                        args[argname] = argval.split(' ');
                        args[argname] = args[argname].filter(function(el) {
                            return el.toString().length > 0;
                        });
                    } else {
                        args[argname] = (argval.trim() == "" ? null : argval.trim());
                    }


                    cg++;
                }

                var cmdperm = new Permission(cmd.perm);
                if (!cmdperm.exists(data)) {
                    cmdperm.save(data);
                }
                cmdperm.load(data);
                if (cmdperm.permits(player.getName(), sb, data) || !permcheck) {
                    //Check arguments
                    for (var a in args as arg) {
                        if (arg == null) { continue; }

                        for (var b in cmd.rules as rule) {

                            if (!("argname" in rule)) { continue; }
                            var errpref = '';
                            var errsuff = '';
                            if ("msgprefix" in rule) { errpref = rule.msgprefix }
                            if ("msgsuffix" in rule) { errsuff = rule.msgsuffix }

                            if ("as" in rule) {
                                if (rule.as == "string" && typeof arg == 'object') {
                                    arg = arg.join(" ");
                                }
                            }

                            if (rule.argname != a) { continue; }
                            var rulename = rule.name || rule.argname.toString();
                            if ('type' in rule) { //Check Arg Type
                                switch (rule.type) {
                                    case 'id':
                                        {
                                            if (arg.replace(/([\w\-\.]+)/g, '') != '') {
                                                tellPlayer(player, errpref + _MSG["argNotValid"].fill({
                                                    "argName": rulename,
                                                    "allowed": "A-Za-z0-9_-:D"
                                                }) + errsuff);
                                                return false;
                                            }
                                            //Run case 'string'
                                        }
                                    case 'string':
                                        {
                                            if (arg.replace(/([\w\-\.]+)/g, '') != '') {
                                                tellPlayer(player, errpref + _MSG["argNotValid"].fill({
                                                    "argName": rulename,
                                                    "allowed": "&cA-Za-z0-9_-"
                                                }) + errsuff);
                                                return false;
                                            }
                                            if ('minlen' in rule) {
                                                if (arg.toString().length < rule.minlen) {
                                                    tellPlayer(player, errpref + "&c'" + rulename + "' is too short! (Min. " + rule.minlen + " characters)" + errsuff);
                                                    return false;
                                                }
                                            }
                                            if ('maxlen' in rule) {
                                                if (arg.toString().length < rule.maxlen) {
                                                    tellPlayer(player, errpref + "&c'" + rulename + "' is too long! (Min. " + rule.minlen + " characters)" + errsuff);
                                                    return false;
                                                }
                                            }
                                            if ("noColor" in rule) {
                                                if (rule.noColor) {
                                                    if (escCcs(arg.toString()) != arg.toString()) {
                                                        tellPlayer(player, errpref + "&c'" + rulename + "' cannot contain color coding!" + errsuff);
                                                        return false;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                    case 'enum':
                                        {
                                            if ("values" in rule) {
                                                if (rule.values.indexOf(arg) == -1) {
                                                    tellPlayer(player, "&c'" + rulename + "' must be one of the following: " + rule.values.join(", "));
                                                    return false;
                                                }
                                            }
                                            break;
                                        }
                                    case 'currency':
                                    case 'time':
                                    case 'number':
                                        {
                                            var num = NaN;
                                            if (rule.type == 'number') {
                                                num = parseFloat(arg);
                                            } else if (rule.type == 'currency') {
                                                num = getCoinAmount(arg);
                                            } else {
                                                num = getStringTime(arg);
                                            }

                                            if (isNaN(num)) {
                                                tellPlayer(player, errpref + "&c'" + rulename + "' is not a number!" + errsuff);
                                                return false;
                                            }
                                            if ('max' in rule) {
                                                if (num > rule.max) {
                                                    var rmax = rule.max;
                                                    if (rule.type == 'currency') {
                                                        rmax = getAmountCoin(rule.max);
                                                    } else if (rule.type == 'time') {
                                                        rmax = getTimeString(rule.max);
                                                    }
                                                    tellPlayer(player, errpref + "&c'" + rulename + "' cannot be greater than " + rmax + errsuff);
                                                    return false;
                                                }
                                            }
                                            if ('min' in rule) {
                                                if (num < rule.min) {
                                                    var rmin = rule.min;
                                                    if (rule.type == 'currency') {
                                                        rmin = getAmountCoin(rule.min);
                                                    } else if (rule.type == 'time') {
                                                        rmin = getTimeString(rule.min);
                                                    }
                                                    tellPlayer(player, errpref + "&c'" + rulename + "' cannot be less than " + rmin + errsuff);
                                                    return false;
                                                }
                                            }
                                        }
                                    case 'datahandler':
                                        {
                                            if ('datatype' in rule) {
                                                var dh = new DataHandler(rule.datatype, arg);
                                                if ('exists' in rule) {
                                                    var exists = dh.exists(data);
                                                    if (rule.exists && !exists) {
                                                        //Hasto exists but does not
                                                        tellPlayer(player, errpref + "&c" + dh.type.rangeUpper(0, 1) + " '" + dh.name + "' does not exist!" + errsuff);
                                                        return false;
                                                    }
                                                    if (!rule.exists && exists) {
                                                        //Has not to exists but does
                                                        tellPlayer(player, errpref + "&c" + dh.type.rangeUpper(0, 1) + " '" + dh.name + "' already exists!" + errsuff);
                                                        return false;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                    case 'color':
                                        {
                                            if (objArray(_RAWCOLORS).indexOf(arg) == -1) {
                                                tellPlayer(player, errpref + "&cColor must be one of the following: " + objArray(_RAWCOLORS).join(', ') + '!' + errsuff);
                                                return false;
                                            }
                                            break;
                                        }
                                    case 'coloreffect':
                                        {
                                            if (objArray(_RAWEFFECTS).indexOf(arg) == -1) {
                                                tellPlayer(player, errpref + "&cChat effects must be one of the following: \n" + objArray(_RAWEFFECTS).join("\n") + errsuff);
                                                return false;
                                            }
                                            break;
                                        }
                                    case 'attribute':
                                        {
                                            if (_ITEMATTR.indexOf(arg) == -1) {
                                                tellPlayer(player, errpref + "&cItem attributes must be one of these: \n" + _ITEMATTR.join("\n") + errsuff);
                                                return false;
                                            }
                                            break;
                                        }
                                    case 'bool':
                                        {
                                            if (['true', 'false'].indexOf(arg) == -1) {
                                                tellPlayer(player, errpref + "&c" + rulename.rangeUpper(0, 1) + " must be true or false!" + errsuff);
                                                return false;
                                            }
                                            break;
                                        }
                                }

                            }

                        }
                    }

                    return (cmd.callback(player, args, data, cmd.payload) || false);
                } else {
                    tellPlayer(player, "&cYou don't have permission to this command!");
                    return false;
                }
            }
        }
    }
    //No valid command given
    var usg = [];
    var aa = str.split(" ");

    while (aa.length > 0) {
        var saa = aa.join(" ");
        if (usg.length == 0) {
            for (c in _COMMANDS as cmd) {
                if (occurrences(cmd.usage, saa) > 0) {
                    var lcp = new Permission(cmd.perm);
                    lcp.load(data);
                    if (lcp.permits(player.getName(), sb, data)) {
                        usg.push(cmd.usage);
                    }
                }
            }
        }
        aa.splice(-1, 1);
    }

    if (usg.length > 0) {
        var helpText = "&e<argument> &6means that it is required\n" +
            "&e[argument] &6means that it is optional\n" +
            "&e<...argument] &6means that you can provide multiple, but $nat least one$r\n" +
            "&e[...argument] &6means that you can provide multiple, or nothing.\n\n" +
            "&cClick on a command listed below, to save yourself some typing.";
        tellPlayer(player, "&a&lDid you mean?: &5[Help]{*|show_text:" + helpText.replace(/&/g, '$') + "}&r");
        for (var u in usg) {
            tellPlayer(player, "&e - &c" + usg[u] + "{suggest_command:" + getCommandNoArg(usg[u]) + "}");
        }
    } else {
        tellPlayer(player, "&cCould not find this command!\nDo &c&n!help or click here{run_command:!help}&c to see available commands.");
    }



    return false;

}

@block chat_event
if (e.message.substr(0, 1) == '!' && !e.isCanceled()) {
    executeXCommand(e.message, e.player, true, getDiskHandler());
    e.setCanceled(true);
    return true;
}
@endblock

//Register commands
yield register_commands_event;