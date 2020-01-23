@block damaged_event
/*
if(!e.isCanceled()) {
	var pl = e.player;
	var w = pl.world;
	var data = w.getStoreddata();
	var regids = new Region().getAllDataEntries(data);
	var regs = [];
	var srcType = e.damageSource.getType();
	var prio = 0;

	regids.forEach(function(reg, i){
		if(reg.hasCoord(normalizePos(pl.getPos()))) {
			if(reg.data.priority > prio) {
				prio = reg.data.priority;
			}
			regs.push(reg);
		}
	});



	switch(srcType) {
		case "fall": {
			for(var i in regs as reg) {
				//Check fallDamage flag
				if(reg.data.priority == prio && reg.data.flags.noFallDamage) {
					e.setCanceled(true);
				}
			}

			break;
		}
	}
}
*/
@endblock

@block blockinteract_event
if (!e.isCanceled()) {
    var pl = e.player;
    var w = pl.world;
    var data = w.getStoreddata();
    var sb = w.getScoreboard();
    var regids = new Region().getAllDataIds(data);
    var checkregs = 0;
    var can = false;
    var regs = [];
    var prio = 0;
    for (var ri in regids as regid) {
        var reg = new Region(regid).init(data);
        if (reg.hasCoord(normalizePos((e.target == null ? e.player : e.target).getPos()))) {
            checkregs++;
            regs.push(reg);
            if (reg.data.priority > prio) {
                prio++;
            }
        }
    }
    for (var r in regs as reg) {
        if (reg.data.priority == prio && reg.can(pl.getName(), sb, data, "interact")) {
            can = true;
            break;
        }
    }
    if (checkregs > 0 && !can) {
        tellPlayer(pl, "&cYou can't interact here!");
        e.setCanceled(true);
    }
}
@endblock

@block broken_event
if (!e.isCanceled()) {
    var pl = e.player;
    var w = pl.world;
    var data = w.getStoreddata();
    var sb = w.getScoreboard();
    var regids = new Region().getAllDataIds(data);
    var checkregs = 0;
    var can = false;
    var regs = [];
    var prio = 0;
    for (var ri in regids as regid) {
        var reg = new Region(regid).init(data);
        if (reg.hasCoord(normalizePos(e.block.getPos()))) {
            checkregs++;
            regs.push(reg);
            if (reg.data.priority > prio) {
                prio++;
            }
        }
    }
    for (var r in regs as reg) {
        if (reg.data.priority == prio && reg.can(pl.getName(), sb, data, "build")) {
            can = true;
            break;
        }
    }
    if (checkregs > 0 && !can) {
        tellPlayer(pl, "&cYou can't break here!");
        e.setCanceled(true);
    }
}
@endblock

@block build_event
if (!e.isCanceled()) {
    var pl = e.player;
    var w = pl.world;
    var data = w.getStoreddata();
    var sb = w.getScoreboard();
    var rayt = pl.rayTraceBlock(10, false, false);
    var regids = new Region().getAllDataIds(data);
    var checkregs = 0;
    var can = false;
    var regs = [];
    var prio = 0;
    for (var ri in regids as regid) {
        var reg = new Region(regid).init(data);
        if (reg.hasCoord(normalizePos(e.target.getPos().offset(rayt.getSideHit())))) {
            checkregs++;
            regs.push(reg);
            if (reg.data.priority > prio) {
                prio++;
            }
        }
    }
    for (var r in regs as reg) {
        if (reg.data.priority == prio && reg.can(pl.getName(), sb, data, "build")) {
            can = true;
            break;
        }
    }
    if (checkregs > 0 && !can) {
        tellPlayer(pl, "&cYou can't build here!");
        e.setCanceled(true);
    }
}
@endblock

@block register_commands_event
//REGISTER REGION COMMANDS
registerXCommands([
    //['', function(pl, args){}, '', []],
    ['!region create <name>', function(pl, args, data) {
        var region = new Region(args.name);
        region.save(data);
        tellPlayer(pl, "&aAdded region '" + args.name + "'!");
        return true;
    }, 'region.create', [{
        "argname": "name",
        "type": "datahandler",
        "datatype": "region",
        "exists": false
    }]],
    ['!region info [name]', function(pl, args, data) {
        if (args.name != null) {
            var region = new Region(args.name).init(data);
            tellPlayer(pl, getTitleBar("Region Info"));
            tellPlayer(pl, "&eRegion ID: &b&l" + region.name + "&r (&2:recycle: Refresh{run_command:!region info " + region.name + "}&r)");
            var regperm = region.getPermission().init(data);
            tellPlayer(pl, "&ePermission ID: &9&l" + regperm.name + "&r (&6:sun: Perm Info{run_command:!perms info " + regperm.name + "}&r)");
            var rpermname = region.getPermission().name;
            //tellPlayer(pl, "&eRegion Permission: &b&l"+rpermname+"&r "+(region.getPermission().exists(data) ? "(&6:sun: Info{run_command:!perms info "+rpermname+"}&r)"));
            tellPlayer(pl, "&eOwner: &r&o" + (region.data.owner == null ? CONFIG_SERVER.TITLE : region.data.owner + "&r (&c:cross: Kick{run_command:!region setOwner " + region.name + "|show_text:Kick " + region.data.owner + " from " + region.name + "}&r)") + "&r (&a+ Set{suggest_command:!region setOwner " + region.name + " |show_text:Set new owner for " + region.name + "}&r)");
            tellPlayer(pl, "&eFor Sale: " +
                (region.data.forSale ?
                    "&a:check: Yes&r (&cPull off sale{run_command:!region setForSale " + region.name + " false}&r)" :
                    "&c:cross: No&r (&aPut for sale{run_command:!region setForSale " + region.name + " true}&r)")
            );
            tellPlayer(pl, "&ePriority: &6" + region.data.priority + "&r [&6&lEDIT{suggest_command:!region setPrio " + region.name + " }&r]");
            var openVals = [
                "Interact",
                "Build",
            ];
            for (var i in openVals as opv) {
                var rov = region.data['all' + opv];
                tellPlayer(pl,
                    "&eOpen " + opv + ": &b" + (rov ? "&a:check: Yes" : "&c:cross: No") +
                    "&r [&" + (rov ? "cDisable" : "aEnable") +
                    "{run_command:!region setOpen " + region.name + " " + opv.toLowerCase() + " " + (!rov).toString() + "}&r]"
                );
            }
            //tellPlayer(pl, "&eAll Interact: &6"+region.data.allInteract.toString());
            if (region.data.positions.length > 0) {
                //Cache positions for undo
                tellPlayer(pl, "&ePosition List:&r (&cClear{run_command:!region removePos " + region.name + " " + Object.keys(region.data.positions).join(" ") + "}&r)");
                for (var ri in region.data.positions as regpos) {
                    tellPlayer(pl, "&5&l" + ri + "&r - &eXYZ1 &r(&b" + (regpos.xyz1 || []).join(", ") + "&r) &eXYZ2 &r(&b" + (regpos.xyz2 || []).join(", ") + "&r) (&c - Remove{run_command:!region removePos " + region.name + " " + ri + "}&r)");
                }
            } else {
                tellPlayer(pl, "&6Region has no positions! (This region still can be used for group-rules, like regions with positions set)");
            }

            return true;
        } else {
            var regids = new Region().getAllDataIds(data);
            var ppos = [
                pl.getPos().getX(),
                pl.getPos().getY() + 4,
                pl.getPos().getZ(),
            ];
            var showRegs = [];
            for (var r in regids as regid) {
                var reg = new Region(regid).init(data);
                if (reg.hasCoord(ppos)) {
                    showRegs.push(reg.name);
                }
            }
            if (showRegs.length > 0) {

                executeXCommand("!region list " + showRegs.join(" "), pl);
                return true;
            } else {
                tellPlayer(pl, "&cYou are not standing in any region!");
            }
        }
        return false;
    }, 'region.info', [{
        "argname": "name",
        "type": "datahandler",
        "datatype": "region",
        "exists": true,
    }, ]],
    ['!region setOpen <name> <action> <value>', function(pl, args, data) {
        var reg = new Region(args.name).init(data);
        var rdatakey = 'all' + args.action.toLowerCase().rangeUpper(0, 1);
        var newval = (args.value == "true");
        reg.data[rdatakey] = newval;
        tellPlayer(pl, "&a" + (newval ? "Enabled" : "Disabled") + " open " + args.action + " of region '" + args.name + "'");
        reg.save(data);
    }, 'region.setOpen', [{
            "argname": "name",
            "type": "datahandler",
            "exists": true,
        },
        {
            "argname": "action",
            "type": "enum",
            "values": ["interact", "build", "attack"],
        },
        {
            "argname": "value",
            "type": "bool",
        },
    ]],
    ['!region setPrio <name> <priority>', function(pl, args, data) {
        var reg = new Region(args.name);
        reg.load(data);
        reg.data.priority = parseInt(args.priority);
        reg.save(data);
        tellPlayer(pl, "&aChanged priority of " + args.name + " to " + args.priority + "!");
        return true;
    }, 'region.setPrio', [{
        "argname": "name",
        "type": "datahandler",
        "datatype": "region",
        "exists": true,
    }]],
    ['!region setForSale <name> <forSale>', function(pl, args, data) {}, 'region.setForSale', []],
    ['!region removePos <name> [...posNumbers]', function(pl, args, data) {
        var region = new Region(args.name).init(data);
        //Cache pos for undo
        var undocmds = [];
        var newPos = [];

        for (var i in region.data.positions as rpos) {
            if (args.posNumbers.indexOf(i.toString()) > -1) {
                if (rpos.xyz1 && rpos.xyz2) {
                    undocmds.push("!region setPos " + region.name + " " + i + " 1 " + rpos.xyz1[0] + " " + rpos.xyz1[1] + " " + rpos.xyz1[2]);
                    undocmds.push("!region setPos " + region.name + " " + i + " 2 " + rpos.xyz2[0] + " " + rpos.xyz2[1] + " " + rpos.xyz2[2]);
                }
            } else {
                newPos.push(rpos);
            }
        }
        region.data.positions = newPos;

        tellPlayer(pl, "&aRemoved positions '" + args.posNumbers.join(" ") + "' of region '" + region.name + "'! &5[Undo]{run_command:!chain " + undocmds.join(";") + "}&r");

        region.save(data);
        return true;
    }, 'region.removePos', [{
        "argname": "name",
        "type": "datahandler",
        "datatype": "region",
        "exists": true
    }]],
    ['!region setPos <name> <posNum> <selectionNum> <x> <y> <z>', function(pl, args, data) { //Wont be used by players, but region wand commands
        var region = new Region(args.name).init(data);
        var posArgs = ['x', 'y', 'z'];
        for (var i in posArgs as pa) {
            args[pa] = args[pa].replace("~", pl.getPos()['get' + pa.toUpperCase()]());
        }
        var newPos = [
            args.x,
            args.y,
            args.z,
        ];
        var newPosNum = Math.min(parseInt(args.posNum), region.data.positions.length);
        if (!(newPosNum in region.data.positions)) {
            region.data.positions[newPosNum] = {
                xyz1: null,
                xyz2: null,
            };
        }
        region.data.positions[newPosNum]['xyz' + args.selectionNum] = newPos;
        tellPlayer(pl, "&aSet selection #" + args.selectionNum + " of position #" + args.posNum + " of region '" + region.name + "' to " + newPos.join(", ") + "!");
        region.save(data);
        return true;
    }, 'region.setPos', [{
            "argname": "name",
            "type": "datahandler",
            "datatype": "region",
            "exists": true,
        },
        {
            "argname": "posNum",
            "min": 0,
        },
        {
            "argname": "selectioNum",
            "min": 1,
            "max": 2,
        },
    ]],
    ['!region list [...matches]', function(pl, args, data) {
            var w = pl.world;
            var params = getArgParams(args.matches);
            var ids = new Region().getAllDataIds(data);

            var page = (parseInt(params.page) || 1) - 1;

            var defaultShowLen = 10;
            var minShowLen = 4;
            var maxShowLen = 32;

            var showLen = Math.max(Math.min((parseInt(params.show) || defaultShowLen), maxShowLen), minShowLen);
            var minShow = page * showLen;
            var maxShow = minShow + showLen;

            var curShow = 0;

            if (ids.length > 0) {
                tellPlayer(pl, getTitleBar("Region List"));
                var tellIds = [];
                var pagenum = Math.floor(minShow / showLen) + 1;
                for (var i in ids as id) {
                    if ((args.matches.length == 0 || arrayOccurs(id, args.matches, false, false))) {
                        if (curShow >= minShow && curShow < maxShow && tellIds.indexOf(id) == -1) {
                            tellIds.push(id)
                        }
                        curShow++;
                    }

                }
                if (args.matches.length > 0) {
                    tellPlayer(pl, "&6&lSearching for:&e " + args.matches.join(", "));
                }
                tellPlayer(pl, "&6&lResults: &c" + curShow);
                var maxpages = Math.ceil(curShow / showLen);
                var nxtPage = page + 2;
                var navBtns =
                    " &r" + (pagenum > 1 ? "[&9<< Previous{run_command:!region list " + args.matches.join(" ") + " -page:" + page + " -show:" + showLen + "}&r]" : "") +
                    " " + (pagenum < maxpages ? "[&aNext >>{run_command:!region list " + args.matches.join(" ") + " -page:" + nxtPage + " -show:" + showLen + "}&r]" : "");
                tellPlayer(pl, "&6&lPage: &d&l" + pagenum + "/" + maxpages + navBtns);
                tellPlayer(pl,
                    "[&cShow 5{run_command:!region list " + args.matches.join(" ") + " -show:5}&r] " +
                    "[&cShow 10{run_command:!region list " + args.matches.join(" ") + " -show:10}&r] " +
                    "[&cShow 15{run_command:!region list " + args.matches.join(" ") + " -show:15}&r] " +
                    "[&cShow 20{run_command:!region list " + args.matches.join(" ") + " -show:25}&r]"
                );
                for (var i in tellIds as id) {
                    tellPlayer(pl, "&e - &b&l" + id + "&r (&6:sun: Info{run_command:!region info " + id + "}&r) (&c:cross: Remove{run_command:!region remove " + id + "}&r)");
                }
            } else {
                tellPlayer(pl, "&cThere are no registered regions!");
            }
            return true;
        },
        ['region.list']
    ],
    ['!region remove <name>', function(pl, args, data) {
        var region = new Region(args.name);
        region.remove(data);
        tellPlayer(pl, "&aRemoved region '" + region.name + "'!");
        return true;
    }, 'region.remove', [{
        "argname": "name",
        "type": "datahandler",
        "datatype": "region",
        "exists": true
    }]],
    ['!region setOwner <name> [player]', function(pl, args, data) {
        var region = new Region(args.name).init(data);
        region.data.owner = args.player;
        tellPlayer(pl, "&aSet region owner to: " + (region.data.owner == null ? "&6&lGramados" : region.data.owner));
        region.save(data);
        return true;
    }, 'region.setOwner', [{
        "argname": "name",
        "type": "datahandler",
        "datatype": "region",
        "exists": true
    }]],
    ['!region select <name>', function(pl, args, data) {
        var rayt;
        try {
            rayt = pl.rayTraceBlock(16, false, true);

        } catch (exc) {}
        var region = new Region(args.name).init(data);
        if (rayt) {
            var rpos = [
                rayt.getPos().getX(),
                rayt.getPos().getY(),
                rayt.getPos().getZ(),
            ];
            region.addCoord(rpos).save(data);
            tellPlayer(pl, "&aAdded coords to region '" + region.name + "'! (" + rpos.join(", ") + ")");
            return true;
        }
        tellPlayer(pl, "&cYou are not looking at a block.");
        return false;
    }, 'region.setPos', [ //Needs setPos permission (to keep modifying position at one perm!)
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "region",
            "exists": true
        }
    ]],
]);

@endblock