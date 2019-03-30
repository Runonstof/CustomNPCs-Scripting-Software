var _COMMANDS = [];
var _DATAHANDLERS = {};
import core\players\commands\*.js;

@block init_event
	yield init_event;
@endblock

@block login_event
	yield login_event;
@endblock

@block tick_event
	yield tick_event;
@endblock

@block interact_event
	yield interact_event;
@endblock

@block broken_event
	yield broken_event;
@endblock

@block attack_event
	yield attack_event;
@endblock

function DataHandler(type, name) {
	this.type = type;
	this.name = name;
	this.data = this.data || {};
	this.removeFns = this.removeFns || [];
	this.loadFns = this.loadFns || [];
	this.saveFns = this.saveFns || [];
	this.createFns = this.createFns || [];

	this.dkeyrgx = new RegExp(this.type+'_([\\w.\-]+)', 'g');

	//Gets all data IDS
	this.getAllDataIds = function(data) {
		var dkeys = data.getKeys();
		var ids = [];
		for(d in dkeys as dkey) {
			if(dkey.cmatch(this.dkeyrgx) > 0) {
				ids.push(dkey.replace(this.dkeyrgx, '$1'));
			}
		}

		return ids;
	};
	this.getDataId = function() {
		return this.type+'_'+this.name;
	}
	this.exists = function(data) {
		return data.get(this.getDataId()) != null;
	};
	this.save = function(data) {
		if(!this.exists(data)) {//Run onCreate
			for(var i in this.createFns as createFn) {
				if(typeof(createFn) == 'function') {
					createFn(this, data);
				}
			}
		}
		//Run onSave
		for(var i in this.saveFns as saveFn) {
			if(typeof(saveFn) == 'function') {
				saveFn(this, data);
			}
		}
		data.put(this.getDataId(), this.toJson());
		return this;
	};
	this.load = function(data) {
		if(this.exists(data)) {
			for(var i in this.loadFns as loadFn) {
				if(typeof(loadFn) == 'function') { loadFn(this, data); }
			}
			var ndata = data.get(this.getDataId());
			this.data = objMerge(this.data, JSON.parse(ndata));
			return true;
		}
		return false;
	};
	this.remove = function(data) {
		for(var rf in this.removeFns as removeFn) {
			if(typeof(removeFn) == 'function') {
				removeFn(this, data);
			}
		}
		data.remove(this.getDataId());
		return this;
	};
	this.onRemove = function(fn, args) { //When removed
		this.removeFns.push(fn, args||{});
		return this;
	};
	this.onLoad = function(fn, args) { //When gets loaded
		this.loadFns.push(fn, args||{});
		return this;
	};
	this.onSave = function(fn, args) { //Everytime when gets saved
		this.saveFns.push(fn, args||{});
		return this;
	};
	this.onCreate = function(fn, args) { //When gets saved but did not exists before (newly created)
		this.createFns.push(fn, args||{});
		return this;
	};
	this.init = function(data, createIfNotExists) {
		if(typeof(createIfNotExists) == typeof(undefined)) { createIfNotExists = true; }
		if(!this.exists(data) && createIfNotExists) {
			this.save(data);
		}
		this.load(data);

		return this;
	};
	this.toJson = function() {
		return JSON.stringify(this.data);
	};
}

function registerDataHandler(alias, dataHandlerFn) {
	_DATAHANDLERS[alias] = dataHandlerFn;
}

function getDataHandler(alias) {
	return _DATAHANDLERS[alias];
}

function registerXCommand(commandMatch, callback, perm, rules=[], payload={}) {
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

function matchXCommands(cmdstrs=[]) {
	if(typeof(cmdstrs) == 'string') { cmdstrs = [cmdstrs]; }
	var cmds = [];

	for(c in _COMMANDS as command) {
		for(ci in cmdstrs as cmdstr) {
			var cname = getCommandNoArg(command.usage).trim();
			if(cmdstr.substr(0, 1) == "^") {
				if((cmdstrs.length == 0 || occurrences(cname, cmdstr.substr(1, cmdstr.length)) == 0) && cmds.indexOf(command) == -1) {
					cmds.push(command);
					break;
				}
			} else {
				if((cmdstrs.length == 0 || occurrences(cname, cmdstr) > 0) && cmds.indexOf(command) == -1) {
					cmds.push(command);
					break;
				}
			}
		}
	}

	return cmds;
}

function getCommandName(cmdstr) {
	var cmda = getCommandNoArg(cmdstr).trim();//Remove whitespace around
	return cmda.substr(1, cmda.length);//Remove '!'-character
}

function registerXCommands(cmds) {
	for(c in cmds) {
		registerXCommand(cmds[c][0], cmds[c][1], cmds[c][2], cmds[c][3] || [], cmds[c][4] || {});
	}
}

function CommandFactory(datahandler, cmdtree){
	this.type = datahandler;
	this.cmdtree = cmdtree||datahandler;
	this.settables = [

	];

	this.addSettable = function(key, rules, dataKey){
		this.settables.push([key, rules||[], dataKey||key ]);
	}

	this.generate = function(){
		var cmds = [
			['!'+this.cmdtree+' create <name>', function(pl, args, data, cmddata){
				var dht = getDataHandler(cmddata.datatype);
				var dh = new dht(args.name);
				dh.save(data);
				tellPlayer(pl, "&aCreated "+dh.type+" '"+dh.name+"'!");
				return true;
			}, this.type+'.create', [
				{
					"argname": "name",
					"type": "datahandler",
					"datatype": this.type,
					"exists": false,
				}
			], {
				"datatype": this.type
			}],
			['!'+this.cmdtree+' remove <name>', function(pl, args, data, cmddata){
				var dht = getDataHandler(cmddata.datatype);
				var dh = new dht(args.name);
				dh.remove(data);
				tellPlayer(pl, "&aRemoved "+dh.type+" '"+dh.name+"'!");
				return true;
			}, this.type+'.remove', [
				{
					"argname": "name",
					"type": "datahandler",
					"datatype": this.type,
					"exists": true,
				}
			], {
				"datatype": this.type
			}],
			['!'+this.cmdtree+' list [...matches]', function(pl, args, data, cmddata){
				var dht = getDataHandler(cmddata.datatype);
				var dh = new dht(args.name);
				var dhids = dh.getAllDataIds(data);
				tellPlayer(pl, "&l[=======] &6&l Gramados "+cmddata.datatype.rangeUpper(0, 1)+"s List&r &l[=======]");

				for(var i in dhids as dhid) {
					var dhi = new dht(dhid).init(data);

				}
				return true;
			}, this.type+'.list', [], {
				"datatype": this.type
			}],

		];


		return cmds;
	}
}


function parseUsageRgx(command, str=null) {//Converts command usage to Regex, and gathers info about command
	//!perms\s+manage\s+add((?:\s+[\w]+))((?:\s+[\w]+)*)
	//+ == <...vars> //multiple args, minimal one required
	//* == [...vars] //multiple args, optional
	//  == <var> //arg, required
	//? == [var] // arg, optional

	var argrx = [];
	var cmdMatch = command.usage
	.replace(/(\w)\s+(\w)/g, "$1\\s+$2")
	.replace(/(\w|>|\])\s+(\w|<|\[)/g, "$1$2");//fix whitespace
	var req_regx = /<([.]{3})*([\w]+)>/g;//Required arg regex
	var opt_regx = /\[([.]{3})*([\w]+)\]/g;//Optional arg recalc
	var rm = cmdMatch.allMatch(req_regx);
	for(i in rm) {//required args
		var rmcode = rm[i][0];
		var rmmulti = (rm[i][1] != null);
		var rmname = rm[i][2];
		var rmpart = "((?:\\s+\\S+)"+(rmmulti?"+":"")+")";
		if(str != null) {
			argrx.push([
				command.usage.indexOf(rmcode),
				rmname,
				rmmulti
			]);
		}
		cmdMatch = cmdMatch.replace(rmcode, rmpart);
	}
	var om = cmdMatch.allMatch(opt_regx);
	for(i in om) {//optional args
		var omcode = om[i][0];
		var ommulti = (om[i][1] != null);
		var omname = om[i][2];
		var ompart = "((?:\\s+\\S+)"+(ommulti?"*":"?")+")";
		if(str != null) {
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

	while(argrx.length > 0) {
		var hid = 0;
		for(var i in argrx)  {
			if(argrx[i][0] > hid) {
				hid = argrx[i][0];
			}
		}
		for(var i in argrx)  {
			if(argrx[i][0] == hid) {
				capt_names.push([argrx[i][1], argrx[i][2]]);
				argrx.splice(i, 1);
				break;
			}
		}
	}
	capt_names.reverse();
	return [cmdMatch, capt_names];
}

function executeXCommand(str, player) {
	var data = player.world.getStoreddata();
	var sb = player.world.getScoreboard();
	for(c in _COMMANDS as cmd) {
		var cmdm = parseUsageRgx(cmd, str);

		var argrgx = cmdm[0];
		var rgx = new RegExp(argrgx, 'g');
		if( (str.match(rgx) || []).length == 1) {
			if(str.indexOf(str.match(rgx)[0]) == 0 && str.replace(rgx, '') == '') {
				var argnames = cmdm[1];
				var cg = 1;
				var args = {};
				for(a in argnames) {
					var argname = argnames[a][0];
					var ismulti = argnames[a][1];
					if(typeof(args[argname]) == typeof(undefined)) {
						args[argname] = (ismulti ? [] : null)
					}
					var argval = str.replace(rgx, '$'+cg.toString());
					if(ismulti) {
						args[argname] = argval.split(' ');
						args[argname] = args[argname].filter(function(el){
							return el.toString().length > 0;
						});
					} else {
						args[argname] = (argval.trim() == "" ? null : argval.trim());
					}


					cg++;
				}

				var cmdperm = new Permission(cmd.perm);
				if(!cmdperm.exists(data)) {
					cmdperm.save(data);
				}
				cmdperm.load(data);
				if(cmdperm.permits(player.getName(), sb, data)) {
					//Check arguments
					for(a in args as arg) {
						for(b in cmd.rules as rule) {

							if(!"argname" in rule) { continue; }
							var errpref = '';
							var errsuff = '';
							if("msgprefix" in rule) { errpref = rule.msgprefix }
							if("msgsuffix" in rule) { errsuff = rule.msgsuffix }

							if("as" in rule) {
								if(rule.as == "string" && typeof arg == 'object') {
									arg = arg.join(" ");
								}
							}

							if(rule.argname != a) { continue; }
							var rulename = rule.name||rule.argname.toString();
							if('type' in rule) {//Check Arg Type
								switch(rule.type) {
									case 'id': {
										if(arg.replace(/([A-Za-z0-9_\-\.])/g, '') != '') {
											tellPlayer(player, errpref+"&c'"+rulename+"' is not a valid id/name (A-Za-z0-9_)!"+errsuff);
											return false;
										}
										//Run case 'string'
									}
									case 'string': {
										if('minlen' in rule) {
											if(arg.toString().length < rule.minlen) {
												tellPlayer(player, errpref+"&c'"+rulename+"' is too short! (Min. "+rule.minlen+" characters)"+errsuff);
												return false;
											}
										}
										if('maxlen' in rule) {
											if(arg.toString().length < rule.maxlen) {
												tellPlayer(player, errpref+"&c'"+rulename+"' is too long! (Min. "+rule.minlen+" characters)"+errsuff);
												return false;
											}
										}
										if("noColor" in rule) {
											if(rule.noColor) {
												if(escCcs(arg.toString()) != arg.toString()) {
													tellPlayer(player, errpref+"&c'"+rulename+"' cannot contain color coding!"+errsuff);
													return false;
												}
											}
										}
										break;
									}
									case 'enum': {
										if("values" in rule) {
											if(rule.values.indexOf(arg) == -1) {
												tellPlayer(player, "&c'"+rulename+"' must be one of the following: "+rule.values.join(", "));
												return false;
											}
										}
										break;
									}
									case 'currency':
									case 'time':
									case 'number': {
										var num = NaN;
										if(rule.type == 'number') {
											num = parseFloat(arg);
										} else if(rule.type == 'currency') {
											num = getCoinAmount(arg);
										} else {
											num = getStringTime(arg);
										}

										if(isNaN(num)) {
											tellPlayer(player, errpref+"&c'"+rulename+"' is not a number!"+errsuff);
											return false;
										}
										if('max' in rule) {
											if(num > rule.max) {
												tellPlayer(player, errpref+"&c'"+rulename+"' cannot be greater than "+rule.max.toString()+errsuff);
												return false;
											}
										}
										if('min' in rule) {
											if(num < rule.min) {
												tellPlayer(player, errpref+"&c'"+rulename+"' cannot be less than "+rule.min.toString()+errsuff);
												return false;
											}
										}
									}
									case 'datahandler': {
										if('datatype' in rule) {
											var dh = new DataHandler(rule.datatype, arg);
											if('exists' in rule) {
												var exists = dh.exists(data);
												if(rule.exists && !exists) {
													//Hasto exists but does not
													tellPlayer(player, errpref+"&c"+dh.type.rangeUpper(0,1)+" '"+dh.name+"' does not exist!"+errsuff);
													return false;
												}
												if(!rule.exists && exists) {
													//Has not to exists but does
													tellPlayer(player, errpref+"&c"+dh.type.rangeUpper(0,1)+" '"+dh.name+"' already exists!"+errsuff);
													return false;
												}
											}
										}
										break;
									}
									case 'color': {
										if(objArray(_RAWCOLORS).indexOf(arg) == -1) {
											tellPlayer(player, errpref+"&cColor must be one of the following: "+objArray(_RAWCOLORS).join(', ')+'!'+errsuff);
											return false;
										}
										break;
									}
									case 'coloreffect': {
										if(objArray(_RAWEFFECTS).indexOf(arg) == -1) {
											tellPlayer(player, errpref+"&cChat effects must be one of the following: \n"+objArray(_RAWEFFECTS).join("\n")+errsuff);
											return false;
										}
										break;
									}
									case 'attribute': {
										if(_ITEMATTR.indexOf(arg) == -1) {
											tellPlayer(player, errpref+"&cItem attributes must be one of these: \n"+_ITEMATTR.join("\n")+errsuff);
											return false;
										}
										break;
									}
									case 'bool': {
										if(['true', 'false'].indexOf(arg) == -1) {
											tellPlayer(player, errpref+"&c"+rulename.rangeUpper(0,1)+" must be true or false!"+errsuff);
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
	while(aa.length > 0) {
		var saa = aa.join(" ");
		if(usg.length == 0) {
			for(c in _COMMANDS as cmd) {
				if(occurrences(cmd.usage, saa) > 0) {
					var lcp = new Permission(cmd.perm);
					lcp.load(data);
					if(lcp.permits(player.getName(), sb, data)) {
						usg.push(cmd.usage);
					}
				}
			}
		}
		aa.splice(-1,1);
	}

	if(usg.length > 0) {
		tellPlayer(player, "&eDid you mean:");
		for(u in usg) {
			tellPlayer(player, "&e - &c"+usg[u]+"{suggest_command:"+getCommandNoArg(usg[u])+"}");
		}
	} else {
		tellPlayer(player, "&cCould not find this command!");
	}
	return false;

}

@block chat_event
	if(e.message.substr(0, 1) == '!') {
		executeXCommand(e.message, e.player);
		e.setCanceled(true);
		return true;
	}
@endblock

//Register commands
yield register_commands_event;
