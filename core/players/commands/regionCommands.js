
function Region(name) {
	extends function DataHandler('region', name);
	extends function Permittable('regions'); //Uses custom permission domain 'regions'


	this.data = {
		"displayName": this.name,
		"positions": [],
		"owner": null,//
		"rentStartTime": 0,
		"maxRentCredit": -1,
		"rentCredit": 0,
		"forSale": false,
		"priority": 0,
		"salePrice": 0,
		"rentTime": -1,
		"trusted": [],//
	};

	/*String player, IScoreboard sb, IData data*/
	this.can = function(player, sb, data) {
		var perm = this.getPermission().init(data);
		return (
			this.data.owner == player
		|| 	this.data.trusted.indexOf(player) > -1
		||  perm.permits(player, sb, data)
		);
	}
	/*Array xyz1, Array xyz2*/
	this.addPos = function(xyz1, xyz2) {
		var newPos = {
			xyz1: xyz1,
			xyz2: xyz2,
		};
		this.data.positions.push(newPos);

		return this;
	};
	this.addCoord = function(xyz) {
		//Check if there is a half-position
		var hasHalfPos = false;
		for(var i in this.data.positions as pos) {
			if(pos.xyz1 == null || pos.xyz2 == null) {
				pos.xyz1 = pos.xyz1||xyz;
				pos.xyz2 = pos.xyz2||xyz;

				this.data.positions[i] = pos;
				hasHalfPos = true;
				break;
			}
		}
		if(!hasHalfPos) {
			this.addPos(xyz, null);
		}

		return this;
	};
	/*Array xyz*/
	this.getPos = function(xyz) { //Gets cube number of xyz coord
		for(var i in this.data.positions as pos) {//Loop cubes

			if(pos.xyz1 != null && pos.xyz2 != null) { //Check is valid cube
				var minx = Math.min(pos.xyz1[0], pos.xyz2[0]);
				var miny = Math.min(pos.xyz1[1], pos.xyz2[1]);
				var minz = Math.min(pos.xyz1[2], pos.xyz2[2]);

				var maxx = Math.max(pos.xyz1[0], pos.xyz2[0]);
				var maxy = Math.max(pos.xyz1[1], pos.xyz2[1]);
				var maxz = Math.max(pos.xyz1[2], pos.xyz2[2]);

				var x = xyz[0];
				var y = xyz[1];
				var z = xyz[2];

				if(x >= minx
				&& x <= maxx

				&& y >= miny
				&& y <= maxy

				&& z >= minz
				&& z <= maxz) {
					return parseInt(i);
				}
			}
		}

		return -1;
	};

	this.hasCoord = function(xyz) { //Check if xyz is in region
		return (this.getPos(xyz) > -1);
	}
}

function normalizePos(pos) {
	return [
		pos.getX(),
		pos.getY(),
		pos.getZ(),
	];
}

@block blockinteract_event
	if(!e.isCanceled()) {
		var pl = e.player;
		var w = pl.world;
		var data = w.getStoreddata();
		var sb = w.getScoreboard();
		var regids = new Region().getAllDataIds(data);
		var checkregs = 0;
		var can = false;
		var regs = [];
		var prio = 0;
		for(ri in regids as regid) {
			var reg = new Region(regid).init(data);
			if(reg.hasCoord(normalizePos((e.target==null?e.player:e.target).getPos()))) {
				checkregs++;
				regs.push(reg);
				if(reg.data.priority > prio) {
					prio++;
				}
			}
		}
		for(r in regs as reg) {
			if(reg.data.priority == prio && reg.can(pl.getName(), sb, data)) {
				can = true;
				break;
			}
		}
		if(checkregs > 0 && !can) {
			tellPlayer(pl, "&cYou can't interact here!");
			e.setCanceled(true);
		}
	}
@endblock

@block broken_event
	if(!e.isCanceled()) {
		var pl = e.player;
		var w = pl.world;
		var data = w.getStoreddata();
		var sb = w.getScoreboard();
		var regids = new Region().getAllDataIds(data);
		var checkregs = 0;
		var can = false;
		var regs = [];
		var prio = 0;
		for(ri in regids as regid) {
			var reg = new Region(regid).init(data);
			if(reg.hasCoord(normalizePos(e.block.getPos()))) {
				checkregs++;
				regs.push(reg);
				if(reg.data.priority > prio) {
					prio++;
				}
			}
		}
		for(r in regs as reg) {
			if(reg.data.priority == prio && reg.can(pl.getName(), sb, data)) {
				can = true;
				break;
			}
		}
		if(checkregs > 0 && !can) {
			tellPlayer(pl, "&cYou can't break here!");
			e.setCanceled(true);
		}
	}
@endblock

@block build_event
if(!e.isCanceled()) {
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
	for(ri in regids as regid) {
		var reg = new Region(regid).init(data);
		if(reg.hasCoord(normalizePos(e.target.getPos().offset(rayt.getSideHit())))) {
			checkregs++;
			regs.push(reg);
			if(reg.data.priority > prio) {
				prio++;
			}
		}
	}
	for(r in regs as reg) {
		if(reg.data.priority == prio && reg.can(pl.getName(), sb, data)) {
			can = true;
			break;
		}
	}
	if(checkregs > 0 && !can) {
		tellPlayer(pl, "&cYou can't build here!");
		e.setCanceled(true);
	}
}
@endblock

@block register_commands_event
	//REGISTER REGION COMMANDS
	registerXCommands([
		//['', function(pl, args){}, '', []],
		['!region create <name>', function(pl, args, data){
			var region = new Region(args.name);
			region.save(data);
			tellPlayer(pl, "&aAdded region '"+args.name+"'!");
			return true;
		}, 'region.create', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": false
			}
		]],
		['!region info [name]', function(pl, args, data){
			if(args.name != null) {
				var region = new Region(args.name).init(data);
				tellPlayer(pl, getTitleBar("Region Info"));
				tellPlayer(pl, "&eRegion ID: &b&l"+region.name+"&r (&2:recycle: Refresh{run_command:!region info "+region.name+"}&r)");
				var regperm = region.getPermission().init(data);
				tellPlayer(pl, "&ePermission ID: &9&l"+regperm.name+"&r (&6:sun: Perm Info{run_command:!perms info "+regperm.name+"}&r)");
				var rpermname = region.getPermission().name;
				//tellPlayer(pl, "&eRegion Permission: &b&l"+rpermname+"&r "+(region.getPermission().exists(data) ? "(&6:sun: Info{run_command:!perms info "+rpermname+"}&r)"));
				tellPlayer(pl, "&eOwner: &r&o"+(region.data.owner == null ? SERVER_TITLE:region.data.owner+"&r (&c:cross: Kick{run_command:!region setOwner "+region.name+"|show_text:Kick "+region.data.owner+" from "+region.name+"}&r)")+"&r (&a+ Set{suggest_command:!region setOwner "+region.name+" |show_text:Set new owner for "+region.name+"}&r)");
				tellPlayer(pl, "&eFor Sale: "+
					(region.data.forSale ?
						"&a:check: Yes&r (&cPull off sale{run_command:!region setForSale "+region.name+" false}&r)"
						:
						"&c:cross: No&r (&aPut for sale{run_command:!region setForSale "+region.name+" true}&r)")
				);
				tellPlayer(pl, "&ePriority: &6"+region.data.priority+"&r [&6&lEDIT{suggest_command:!region setPrio "+region.name+" }&r]");
				if(region.data.positions.length > 0) {
					//Cache positions for undo
					tellPlayer(pl, "&ePosition List:&r (&cClear{run_command:!region removePos "+region.name+" "+Object.keys(region.data.positions).join(" ")+"}&r)");
					for(ri in region.data.positions as regpos) {
						tellPlayer(pl, "&5&l"+ri+"&r - &eXYZ1 &r(&b"+(regpos.xyz1||[]).join(", ")+"&r) &eXYZ2 &r(&b"+(regpos.xyz2||[]).join(", ")+"&r) (&c - Remove{run_command:!region removePos "+region.name+" "+ri+"}&r)");
					}
				} else {
					tellPlayer(pl, "&6Region has no positions! (This region still can be used for group-rules, like regions with positions set)");
				}

				return true;
			} else {
				var regids = new Region().getAllDataIds(data);
				var ppos = [
					pl.getPos().getX(),
					pl.getPos().getY()+4,
					pl.getPos().getZ(),
				];
				var showRegs = [];
				for(var r in regids as regid) {
					var reg = new Region(regid).init(data);
					if(reg.hasCoord(ppos)) {
						showRegs.push(reg.name);
					}
				}
				if(showRegs.length > 0) {

					executeXCommand("!region list "+showRegs.join(" "), pl);
					return true;
				} else {
					tellPlayer(pl, "&cYou are not standing in any region!");
				}
			}
			return false;
		}, 'region.info', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": true,
			},
		]],
		['!region setPrio <name> <priority>', function(pl, args, data){
			var reg = new Region(args.name);
			reg.load(data);
			reg.data.priority = parseInt(args.priority);
			reg.save(data);
			tellPlayer(pl, "&aChanged priority of "+args.name+" to "+args.priority+"!");
			return true;
		}, 'region.setPrio', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": true,
			},
			{
				"argname": "priority",
				"type": "number",
				"min": 0,
			}
		]],
		['!region setForSale <name> <forSale>', function(pl, args, data){}, 'region.setForSale', []],
		['!region removePos <name> [...posNumbers]', function(pl, args, data){
			var region = new Region(args.name).init(data);
			//Cache pos for undo
			var undocmds = [];

			if(args.posNumbers.length > 0) {
				for(var pn in args.posNumbers as apn) {
					apn = parseInt(apn);
					var pos = region.data.positions[apn];
					//undocmds.push("!region setPos "+region.name+" "+apn+" 1 "+pos.xyz1[0]+" "+pos.xyz1[1]+" "pos.xyz1[2]);
					//undocmds.push("!region setPos "+region.name+" "+apn+" 2 "+pos.xyz2[0]+" "+pos.xyz2[1]+" "pos.xyz2[2]);
				}
				region.data.positions = removeFromArrayByKey(region.data.positions, args.posNumbers);
				tellPlayer(pl, "&aRemoved positions '"+args.posNumbers.join(", ")+"' from region '"+region.name+"'&r [&5&lUndo{run_command:!chain "+undocmds.join(";")+"}&r]");
			} else {

				for(var i in region.data.positions as rpos) {
					undocmds.push("!region setPos "+region.name+" "+i+" 1 "+rpos.xyz1[0]+" "+rpos.xyz1[1]+" "+rpos.xyz1[2]);
					undocmds.push("!region setPos "+region.name+" "+i+" 2 "+rpos.xyz2[0]+" "+rpos.xyz2[1]+" "+rpos.xyz2[2]);
				}
				region.data.positions = [];
				tellPlayer(pl, "&aCleared all positions from region '"+region.name+"'&r [&5&l:recycle: Undo{run_command:!chain "+undocmds.join(";")+";}&r]");
			}
			region.save(data);
			return true;
		}, 'region.removePos', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": true
			}
		]],
		['!region setPos <name> <posNum> <selectionNum> <x> <y> <z>', function(pl, args, data){//Wont be used by players, but region wand commands
			var region = new Region(args.name).init(data);
			var posArgs = ['x','y','z'];
			for(var i in posArgs as pa) {
				args[pa] = args[pa].replace("~", pl.getPos()['get'+pa.toUpperCase()]());
			}
			var newPos = [
				args.x,
				args.y,
				args.z,
			];
			var newPosNum = Math.min(parseInt(args.posNum), region.data.positions.length);
			if(!(newPosNum in region.data.positions)) {
				region.data.positions[newPosNum] = {
					xyz1: null,
					xyz2: null,
				};
			}
			region.data.positions[newPosNum]['xyz'+args.selectionNum] = newPos;
			tellPlayer(pl, "&aSet selection #"+args.selectionNum+" of position #"+args.posNum+" of region '"+region.name+"' to "+newPos.join(", ")+"!");
			region.save(data);
			return true;
		}, 'region.setPos', [
			{
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
		['!region list [...matches]', function(pl, args, data){
			var dkeys = new Region().getAllDataIds(data);
			args.matches = args.matches.map(function(el){
				return el.toLowerCase();
			});
			tellPlayer(pl, "&l[=======] &6&lGramados Regions&r &l[=======]");
			for(d in dkeys as dkey) {
				var region = new Region(dkey);
				region.load(data);
				if(args.matches.length == 0 || arrayOccurs(region.name.toLowerCase(), args.matches) > 0) {
					tellPlayer(pl, "&e - &b&l"+region.name+"&r (&6&nInfo{run_command:!region info "+region.name+"}&r) (&c&nRemove{run_command:!region remove "+region.name+"}&r)");
				}

			}

			return true;
		}, 'region.list'],
		['!region remove <name>', function(pl, args, data){
			var region = new Region(args.name);
			region.remove(data);
			tellPlayer(pl, "&aRemoved region '"+region.name+"'!");
			return true;
		}, 'region.list', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": true
			}
		]],
		['!region setOwner <name> [player]', function(pl, args, data){
			var region = new Region(args.name).init(data);
			region.data.owner = args.player;
			tellPlayer(pl, "&aSet region owner to: "+(region.data.owner == null ? "&6&lGramados" : region.data.owner));
			region.save(data);
			return true;
		}, 'region.setOwner', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "region",
				"exists": true
			}
		]],
		['!region select <name>', function(pl, args, data){
			var rayt = pl.rayTraceBlock(16, false, true);
			var region = new Region(args.name).init(data);
			var rpos = [
				rayt.getPos().getX(),
				rayt.getPos().getY(),
				rayt.getPos().getZ(),
			];
			region.addCoord(rpos).save(data);
			tellPlayer(pl, "&aAdded coords to region '"+region.name+"'! ("+rpos.join(", ")+")");
			return true;
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
