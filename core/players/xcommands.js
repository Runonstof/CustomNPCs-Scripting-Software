var _COMMANDS = [];
import core\players\commands\*.js;

@block init_event
	yield init_event;
@endblock

@block tick_event
	yield tick_event;
@endblock

@block interact_event
	yield interact_event;
@endblock

function DataHandler(type, name) {
	this.type = type;
	this.name = name;
	this.data = this.data || {};
	this.removeFns = this.removeFns || [];
	this.loadFns = this.loadFns || [];
	this.saveFns = this.saveFns || [];
	this.createFns = this.createFns || [];
	
	this.dkeyrgx = new RegExp(this.type+'_([\\w]+)', 'g');
	
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
				createFn(this, data);
			}
		}
		//Run onSave
		for(var i in this.saveFns as saveFn) {
			saveFn(this, data);
		}
		data.put(this.getDataId(), this.toJson());
		return this;
	};
	this.load = function(data) {
		if(this.exists(data)) {
			for(var i in this.loadFns as loadFn) {
				loadFn(this, data);
			}
			var ndata = data.get(this.getDataId());
			this.data = objMerge(this.data, JSON.parse(ndata));
			return true;
		}
		return false;
	};
	this.remove = function(data) {
		for(var i in this.removeFns as removeFn) {
			removeFn(this, data);
		}
		if(this.exists(data)) {
			data.remove(this.getDataId());
			return true;
		}
		return false;
	};
	this.onRemove = function(fn) { //When removed
		this.removeFns.push(fn);
		return this;
	};
	this.onLoad = function(fn) { //When gets loaded
		this.loadFns.push(fn);
		return this;
	};
	this.onSave = function(fn) { //Everytime when gets saved
		this.removeFns.push(fn);
		return this;
	};
	this.onCreate = function(fn) { //When gets saved but did not exists before (newly created)
		this.removeFns.push(fn);
		return this;
	};
	this.init = function(data, initdata) {
		this.data = objMerge(this.data, (initdata||{}));
		if(!this.exists(data)) {
			this.save(data);
		}
		this.load(data);
		
		return this;
	};
	this.toJson = function() {
		return JSON.stringify(this.data);
	};
}

function CommandHandler(type, cmdtree) {
	this.type = type;
	this.cmdtree = cmdtree||type;
	this.generate = function() {
		//add commands
		registerXCommands([
			["!"+this.cmdtree+" create <name> [...displayName]", function(pl, args, data){
				
			}, this.cmdtree+".create", [
				{
					"argname": "name",
					"type": "datahandler",
					"datatype": this.type,
					"exists": false
				}
			]],
		]);
	}
}

function registerXCommand(commandMatch, callback, perm, rules=[]) {
	_COMMANDS.push({
		usage: commandMatch,
		callback: callback,
		perm: perm,
		rules: rules,
		enabled: true
	});
}

function getCommandNoArg(cmdstr) {
	return cmdstr.match(/![\w\s]+/)[0];
}

function registerXCommands(cmds) {
	for(c in cmds) {
		registerXCommand(cmds[c][0], cmds[c][1], cmds[c][2], cmds[c][3] || []);
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
	for(c in _COMMANDS) {
		var cmd = _COMMANDS[c];
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
							if("as" in rule) {
								if(rule.as == "string" && typeof arg == 'object') {
									arg = arg.join(" ");
								}
							}
							
							if(rule.argname != a) { continue; }
							var rulename = rule.argname.toString();
							if('type' in rule) {//Check Arg Type
								switch(rule.type) {
									case 'id': {
										if(arg.replace(/([A-Za-z0-9_\-\.])/g, '') != '') {
											tellPlayer(player, "&c'"+rulename+"' is not a valid id/name (A-Za-z0-9_)!");
											return false;
										}
										//Run case 'string'
									}
									case 'string': {
										if('minlen' in rule) {
											if(arg.toString().length < rule.minlen) {
												tellPlayer(player, "&c'"+rulename+"' is too short! (Min. "+rule.minlen+" characters)");
												return false;
											}
										}
										if('maxlen' in rule) {
											if(arg.toString().length < rule.maxlen) {
												tellPlayer(player, "&c'"+rulename+"' is too long! (Min. "+rule.minlen+" characters)");
												return false;
											}
										}
										if("noColor" in rule) {
											if(rule.noColor) {
												if(escCcs(arg.toString()) != arg.toString()) {
													tellPlayer(player, "&c'"+rulename+"' cannot contain color coding!");
													return false;
												}
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
											tellPlayer(player, "&c'"+rulename+"' is not a number!");
											return false;
										}
										if('max' in rule) {
											if(num > rule.max) {
												tellPlayer(player, "&c'"+rulename+"' cannot be greater than "+rule.max.toString());
												return false;
											}
										}
										if('min' in rule) {
											if(num < rule.min) {
												tellPlayer(player, "&c'"+rulename+"' cannot be less than "+rule.min.toString());
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
													tellPlayer(player, "&c"+dh.type.rangeUpper(0,1)+" '"+dh.name+"' does not exist!");
													return false;
												}
												if(!rule.exists && exists) {
													//Has not to exists but does
													tellPlayer(player, "&c"+dh.type.rangeUpper(0,1)+" '"+dh.name+"' already exists!");
													return false;	
												}
											}
										}
										break;
									}
									case 'color': {
										if(objArray(_RAWCOLORS).indexOf(arg) == -1) {
											tellPlayer(player, "&cColor must be one of the following: "+objArray(_RAWCOLORS).join(', ')+'!');
											return false;
										}
										break;
									}
									case 'coloreffect': {
										if(objArray(_RAWEFFECTS).indexOf(arg) == -1) {
											tellPlayer(player, "&cChat effects must be one of the following: \n"+objArray(_RAWEFFECTS).join("\n"));
											return false;
										}
										break;
									}
									case 'attribute': {
										if(_ITEMATTR.indexOf(arg) == -1) {
											tellPlayer(player, "&cItem attributes must be one of these: \n"+_ITEMATTR.join("\n"));
											return false;
										}
										break;
									}
									case 'bool': {
										if(['true', 'false'].indexOf(arg) == -1) {
											tellPlayer(player, "&c"+rulename.rangeUpper(0,1)+" must be true or false!");
											return false;
										}
										break;
									}
								}
								
							}
						
						}
					}
					
					return (cmd.callback(player, args, data) || false);
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

