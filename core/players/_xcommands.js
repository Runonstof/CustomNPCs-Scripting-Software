var _COMMANDS = {
	'test': function(player, args) {
		executeCommand(player, "/title "+player.getName()+' actionbar '+strf("&9&lHello\nThere!", true));
	},
	'getdimensioninfo': function(player, args) {
		if(hasPermission(player, 'getdimensioninfo')) {
			var dim = player.world.getDimension();
			tellPlayer(player, strf("&aDimension ID: &c"+dim.getId().toString()));
			tellPlayer(player, strf("&aDimension Name: &c"+dim.getName().toString()));
			tellPlayer(player, strf("&aDimension Suffix: &c"+dim.getSuffix().toString()));
		}
	},
	'mail': function(player, args) {
		if(hasPermission(player,  "mail")) {
			if(args.length >= 1) {
				var mcmd = args[0];
				switch(mcmd) {
					case 'send': {
						if(hasPermission(player, "mail.send")) {
							if(args.length >= 4) {
								var toPl = args[1];
								var toTitle = args[2];
								var toMsg = arrayTakeRange(args, 3, args.length).join(' ');
								var data = player.world.getStoreddata();
								sendMail(data, player.getName(), toPl, toTitle, toMsg);
								if(playerIsOnline(player.world, toPl)) {
									executeCommand(player, "/tellraw "+toPl+" "+strf("&7You have new mail!", true));
								}
								tellPlayer(player, "&aSuccessfully sent mail to "+toPl);
							} else {
								tellPlayer(player, "&c!mail send <player_name> <title> <message>");
							}
						}
						break;
					}
					case 'read': {
						if(hasPermission(player, "mail.read")) {
							var data = player.world.getStoreddata();
							var mails = getMail(data, player);
							var matches = [];
							if(args.length >= 2) { matches = arrayTakeRange(args, 1, args.length); }
							var showed = 0;
							if(mails.length > 0) {
								var t = 0;
								for(m in mails) {
									var isMatch = matches.length == 0;
									if(!isMatch) {
										//Check title
										for(mm in matches) {
											if(occurrences(mails[m].title, matches[mm]) > 0) {
												isMatch = true;
											}
										}
									}
									if(isMatch) {
										tellPlayer(player, "&l[=======] &aAlteria Mail &l[=======]")
										var ago = getTimeString((new Date().getTime() - mails[m].time), ['ms']);
										var from = mails[m].from;
										tellPlayer(player, "&7From: &r&o"+(from!=null?from:'&c&lAlteria'));
										tellPlayer(player, "&7Sent "+ago+" ago");
										tellPlayer(player, "&7Title: &r&o"+mails[m].title);
										tellPlayer(player, "&7Message: &r&o"+mails[m].msg);
										if(t < mails.length-1) {
											tellPlayer(player, "&l[=====================]");
										}
										showed++;
									}
									t++;
								}
								
								if(showed == 0) {
									tellPlayer(player, "&cNo mails found"+(matches.length == 0 ? '.' : ' with given matches.'));
								}
							} else {
								tellPlayer(player, "&7You don't have any mail!");
							}
						}
						break;
					}
					case 'delete': {
						if(hasPermission(player, "mail.delete")) {
							var data = player.world.getStoreddata();
							var mailcount = getMail(data, player).length;
							deleteMail(data, player.getName());
							tellPlayer(player, "&7Deleted "+mailcount+" mail(s).");
						}
						break;
					}
					default: {
						tellPlayer(player, "&cUnknown mail command");
						break;
					}
				}
			} else {
				tellPlayer(player, strf("&eProper Usage: &c!mail <send|read|delete>"));
			}
		}
	},
	'jointeam': function(player, args) {
		if(hasPermission(player, 'jointeam')) {
			if(args.length >= 1) {
				var team_name = args[0].toLowerCase().rangeUpper(0, 1);
				var players = arrayTakeRange(args, 1);
				var sb = player.world.getScoreboard();
				if(players.length == 0) {
					players = [player.getName()];
				}
				var sbt = sb.getTeam(team_name);
				if(sbt != null) {
					for(p in players) {
						sbt.addPlayer(players[p]);
					}
					tellPlayer(player, "&aAdded "+players.length+" player(s) to team "+team_name);
				} else {
					tellPlayer(player, "&c"+team_name+" does'nt exists!");
				}
			} else {
				tellPlayer(player, "&cYou need to provide at leat a team name!")
			}
		}
	},
	'registerteam': function(player, args) {
		if(hasPermission(player, 'registerteam')) {
			if(args.length >= 1) {
				var w = player.world;
				var sb = w.getScoreboard();
				var add_teams = arrayTakeRange(args, 0, args.length);
				for(a in add_teams) {
					add_teams[a] = add_teams[a].toLowerCase().rangeUpper(0, 1);
					if(sb.getTeams().indexOf(add_teams[a]) == -1) {
						executeCommand(player, '/scoreboard teams add '+add_teams[a]);
						tellPlayer(player, strf('&aRegistered Scoreboard Team: '+add_teams[a]+'!'));
					} else {
						tellPlayer(player, strf('&cFailed to add team: '+add_teams[a]+' (Team already exists)'));
					}
				}
			} else {
				tellPlayer(player, strf('&cYou need to provide at least one team to add!'));
			}
		}
	},
	'perms': function(player, args) { //Permissions command
		if(hasPermission(player, 'perms')) { //Check permission
			var w = player.world;
			var data = w.getStoreddata();
			var sb = w.getScoreboard();
			
			if(args.length >= 1) {
				var permtype = args[0];
				switch(permtype) {
					case 'manage': { //manage permissions
						if(hasPermission(player, 'perms.manage')) {
							var operation = args[1];
							var cmd_id = null;
							
							if([//args.length >= 3 PERMISSION_ID FOR SOME ARGS
							'add',
							'remove',
							'register',
							'unregister',
							'addPlayer',
							'removePlayer',
							'setEnabled',
							'addList',
							'removeList',
							'addListItem',
							'removeListItem',
							'info'
							].indexOf(operation) != -1) {
								if(args.length >= 3) {
									cmd_id = args[2];
								} else {
									tellPlayer(player, [
										['You need to provide a permission id to perform this action!', 'red']
									]);
									return false;
								}
							}
							
							switch(operation) {
								case 'add': {
									if(hasPermission(player, 'perms.manage.add')) {
										if(args.length >= 4) {
											var new_sb_teams = arrayTakeRange(args, 3, args.length);
											for(ni in new_sb_teams) { new_sb_teams[ni] = new_sb_teams[ni].toString().toLowerCase().rangeUpper(0, 1); }
											if(addCommandPerm(data, cmd_id, new_sb_teams)) {
												tellPlayer(player, [
													["Successfully added team(s) \""+new_sb_teams.join(', ')+"\" to permission id: \""+cmd_id+"\"!", "green"]
												]);
											} else {
													tellPlayer(player, [
													['Permission id: "'+cmd_id+'" does not exists!', 'red']
												]);
											}
										} else {
											tellPlayer(player, [
												['You must provide at least one team to add!', 'red']
											]);
										}
									}
									break;
								}
								case 'remove': {
									if(hasPermission(player, 'perms.manage.remove')) {
										if(args.length >= 4) {
											var rem_sb_teams = arrayTakeRange(args, 3, args.length);
											for(ri in rem_sb_teams) { rem_sb_teams[ri] = 	rem_sb_teams[ri].toString().toLowerCase().rangeUpper(0, 1); }
											if(removeCommandPerm(data, cmd_id, rem_sb_teams)) {
												tellPlayer(player, [
													['Successfully removed team(s) "'+rem_sb_teams.join(', ')+'" from permission id: "'+cmd_id+'"', 'green']
												]);
											} else {
												tellPlayer(player, [
													['Permission id: "'+cmd_id+'" does not exists!', 'red']
												]);
											}
											
										} else {
											tellPlayer(player, [
												['You must provide at least one team to remove!', 'red']
											]);
										}
									}
									break;
								}
								case 'register': {
									if(hasPermission(player, 'perms.manage.register')) {
										if(data.get('cmd_permission_'+cmd_id) == null) {
											registerCommandPerm(data, cmd_id);
											executeCommand(player, "/tellraw "+player.getName()+" "+rawformat([
												["Succesfully registered permission id: "+cmd_id+"!", "green"]
											]));
										} else {
											executeCommand(player, "/tellraw "+player.getName()+" "+rawformat([
												['permission id already exists!', 'red']
											]));
										}
									}
									break;
								}
								case 'unregister': {
									if(hasPermission(player, 'perms.manage.unregister')) {
										if(data.get('cmd_permission_'+cmd_id) != null) {
											if(unregisterCommandPerm(data, cmd_id)) {
												tellPlayer(player, [
													["Succesfully deleted permission id: "+cmd_id+"!", "green"]
												]);
											}
										} else {
											tellPlayer(player, [
												['Permission id does not exists in data!', 'red']
											]);
										}
									}
									break;
								}
								case 'info': {
									if(hasPermission(player, 'perms.manage.info')) {
										if(args.length >= 3) {
											var show_perms = arrayTakeRange(args, 2, args.length);
											for(l in show_perms) {
												var cp = getCommandPerm(data, show_perms[l]);
												if(cp !== false) {
													storytellPlayer(player, cp);
												}
											}
										}
									}
									break;
								}
								case 'list': {
									if(hasPermission(player, 'perms.manage.list')) {
										var pmatches = [];
										if(args.length >= 3) { pmatches = arrayTakeRange(args, 2, args.length); }
										//List Perm IDS
										var dk = data.getKeys();
										tellPlayer(player, strf('&l[=======] &a&lAlteria Permission Ids &l[=======]'));
										var regkeys = [];
										for(k in dk) {
											var key = dk[k];
											if( (key.match(/cmd_permission_([\w\.]+)/) || []).length > 0 ) {
												//Is perm ID
												var l_id = key.replace(/cmd_permission_([\w\.]+)/, '$1');
												regkeys.push(l_id);
											}
										}
										
										if(pmatches.length > 0) {
											var nregk = [];
											for(pm in pmatches) {
												for(rgk in regkeys) {
													if(regkeys[rgk].indexOf(pmatches[pm]) > -1) {
														if(nregk.indexOf(regkeys[rgk]) == -1) {
															nregk.push(regkeys[rgk]);
														}
													}
												}
											}
											regkeys = nregk;
										}
										
										regkeys.sort();
										for(rk in regkeys) {
											tellPlayer(player, strf(' - '+regkeys[rk]));
										}
									
									}
									break;
								}
								case 'listPlayer': {
									if(hasPermission(player, 'perms.manage.listPlayer')) {
										if(args.length >= 3) {
											var a_lplayers = arrayTakeRange(args, 2, args.length);
											var lplayers = {};
											//Setup retrieve player perms
											for(aj in a_lplayers) { lplayers[a_lplayers[aj]] = []; }
											var dkeys = data.getKeys();
											for(dk in dkeys) {//Loop data
												var dkey = dkeys[dk];
												if( (dkey.match(/cmd_permission_([\w\.]+)/g) || []).length > 0 ) {//Is permission key
													var dperm = JSON.parse(data.get(dkey));
													//Check for players
													for(aj in a_lplayers) {
														apj = a_lplayers[aj];
														var d_id = dkey.replace(/cmd_permission_([\w\.]+)/g, '$1');
														if(dperm.whitelist.indexOf(apj) > -1 && lplayers[apj].indexOf(d_id) == -1) {
															lplayers[apj].push(d_id);
														}
														var sbt = sb.getPlayerTeam(apj);
														if(sbt != null) {
															if(dperm.permitted.indexOf(sbt.getDisplayName()) > -1 && lplayers[apj].indexOf(d_id) == -1) {
																lplayers[apj].push([d_id, sbt.getName()]);
															}
														}
													}
												}
											}
											
											for(l in lplayers) {
												var lplayer = lplayers[l];
												tellPlayer(player, [
													['Permissions for player: ', 'yellow'],
													[l.toString(), 'red'],
												]);
												for(prm in lplayer) {
													if(typeof(lplayer[prm]) == 'string') {
														tellPlayer(player, [
															[' - ', 'yellow'],
															[lplayer[prm].toString(), 'blue', 1]
														]);
													} else {
														tellPlayer(player, [
															[' - ', 'yellow'],
															[lplayer[prm][0].toString(), 'blue', 1],
															[' (Permitted via team ', 'yellow'],
															[lplayer[prm][1].toString(), 'dark_aqua', 1],
															[")", 'yellow'],
														]);
													}
												}
												tellPlayer(player, [[""]]);
											}
										} else {
											tellPlayer(player, [
												['You must provide at least one player!', 'red']
											]);
										}
									}
									break;
								}
								case 'addPlayer': {
									if(hasPermission(player, 'perms.manage.addPlayer')) {
										if(args.length >= 4) {
											var new_players = arrayTakeRange(args, 3, args.length);
											if(addPlayerCommandPerm(data, cmd_id, new_players)) {
												tellPlayer(player, [
													['Successfully added player(s) "'+new_players.join(', ')+'" to permission id: "'+cmd_id+'"!', 'green']
												]);
											} else {
												tellPlayer(player, [
													['Permission id: "'+cmd_id+'" does not exists!', 'red']
												]);
											}
										} else {
											tellPlayer(player, [
												['You must provide at least one player to add!', 'red']
											]);
										}
									}
									break;
								}
								case 'removePlayer': {
									if(hasPermission(player, 'perms.manage.removePlayer')) {
										if(args.length >= 4) {
											var rem_players = arrayTakeRange(args, 3, args.length);
											if(removePlayerCommandPerm(data, cmd_id, rem_players)) {
												tellPlayer(player, [
													['Successfully removed player(s) "'+rem_players.join(', ')+'" from permission id: "'+cmd_id+'"', 'green']
												]);
											} else {
												tellPlayer(player, [
													['Permission id: "'+cmd_id+'" does not exists!', 'red']
												]);
											}
										} else {
											tellPlayer(player, [
												['You must provide at least one player to remove!', 'red']
											]);
										}
									}
									break;
								}
								case 'setEnabled': {
									if(hasPermission(player, 'perms.manage.setEnabled')) {
										var val = args[3];
										if(['true', 'false'].indexOf(val) == -1) {
											tellPlayer(player, [
												['You must either provide ', 'red'],
												['true', 'red', 0, 0, 1],
												[' or ', 'red'],
												['false', 'red', 0, 0, 1],
												['!', 'red']
											]);
											return false;
										} else {
											var ep = getPerm(data, cmd_id);
											if(ep != null) {
												ep.enabled = (val == 'true');
												savePermAs(data, ep, cmd_id);
												tellPlayer(player, [
													[(ep.enabled ? 'Enabled':'Disabled')+' Permission: ', 'yellow'],
													[cmd_id, 'blue', 1],
												]);
											} else {
												tellPlayer(player, [
													['Permission id "'+cmd_id+'" doesn\'t exists!', 'red']
												]);
												return false;
											}
										}
									}
									break;
								}
								case 'reload': {
									if(hasPermission(player, 'perms.manage.reload')) {
										var ff = reloadPermissions(data);
										for(f in ff) {
											tellPlayer(player, [
												['Reloaded permission: "', 'green'],
												[ff[f].toString(), 'blue', 1],
												['"!', 'green'],
											]);
										}
									}
									break;
								}
								case 'addList': {
									if(hasPermission(player, 'perms.manage.addList')) {
										if(args.length >= 4) {
											var lists = arrayTakeRange(args, 3, args.length);
											for(ll in lists) {
												if(addPermMetaList(data, cmd_id, lists[ll])) {
													tellPlayer(player, [
														['Added list "'+lists[ll]+'" to permission "'+cmd_id+'"!', 'green']
													]);
												} else {
													tellPlayer(player, [
														['Error adding list "'+lists[ll]+'"!', 'red']
													]);
												}
											}
										} else {
											tellPlayer(player, [
												['You need to provide an list id!', 'red']
											]);
										}
									}
									break;
								}
								case 'removeList': {
									if(hasPermission(player, 'perms.manage.removeList')) {
										if(args.length >= 4) {
											var lists = arrayTakeRange(args, 3, args.length);
											for(ll in lists) {
												if(removePermMetaList(data, cmd_id, lists[ll])) {
													tellPlayer(player, [
														['Deleted list "'+lists[ll]+'" from permission "'+cmd_id+'"!', 'green']
													]);
												} else {
													tellPlayer(player, [
														['Something went wrong deleting list "'+lists[ll]+'" from permission "'+cmd_id+'"', 'red']
													]);
												}
											}
										}
									}
									break;
								}
								case 'addListItem': {
									if(hasPermission(player, 'perms.manage.addListItem')) {
										if(args.length >= 5) {
											var addItems = arrayTakeRange(args, 4, args.length);
											addPermMetaListItem(data, cmd_id, args[3], addItems);
											tellPlayer(player, [
												['Added "'+addItems.join(',')+'" to list "'+args[3]+'" in permission "'+cmd_id+'"!', 'green']
											]);
										} else {
											tellPlayer(player, [
												['You must provide a list ID and at least one item to add!', 'red']
											]);
										}
									}
									break;
								}
								case 'removeListItem': {
									if(hasPermission(player, 'perms.manage.removeListItem')) {
										if(args.length >= 5) {
											var remItems = arrayTakeRange(args, 4, args.length);
											removePermMetaListItem(data, cmd_id, args[3], remItems);
											tellPlayer(player, [
												['Removed "'+remItems.join(',')+'" to list "'+args[3]+'" in permission "'+cmd_id+'"!', 'green']
											]);
										} else {
											tellPlayer(player, [
												['You must provide a list ID and at least one item to remove!', 'red']
											]);
										}
									}
									break;
								}
								case 'help':
								case '?': {
									if(hasPermission(player, 'perms.manage.help')) {
										tellPlayer(player, [
											['[========] ', 'white', 0, 1],
											['Alteria Permissions Help', 'green', 0, 1],
											[' [========]', 'white', 0, 1],
										]);
										tellPlayer(player, [
											['!perms manage register <permission_id> [...score_board_teams]', 'red'],
											[' - Registers a permission where teams and players can be assigned to. Second argument is for providing teams and is optional, as you can add teams on a later moment', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage unregister <permission_id>', 'red'],
											[' - Removes a permission from the Alteria registry. Don\'t delete anything unless you have added a custom one yourself and want to delete that!', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage add <permission_id> <...scoreboard_teams>', 'red'],
											[' - Adds a certain permission to teams. You can apply the permissions to multiple teams at once by dividing the team-names with spaces.', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage addPlayer <permission_id> <...players>', 'red'],
											[' - Adds a certain permission to players, if you want to make exceptions, otherwise keep using teams to maintain full overview.', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage remove <permission_id> <...scoreboard_teams>', 'red'],
											[' - Removes a certain permission from teams.', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage removePlayer <permission_id> <...players>', 'red'],
											[' - Removes a certain permission from players.', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage setEnabled <permission_id> <true|false>', 'red'],
											[' - Enables or disables a permission. If disabled, there will not be checked for this permission, so everyone \'has\' the permission. Be cautious disabling sensitive permissions!', 'yellow']
										]);
										tellPlayer(player, [
											['!perms manage list [...matches]', 'red'],
											[' - Lists all permission ids in a list and if at least one match is given, it will only show permissions that matches', 'yellow']
										]);
										tellPlayer(player, strf('&c!perms manage info <...permission_ids>&e - Gives all the info you need to know about every given permission id.'));
										tellPlayer(player, [
											['!perms manage listPlayer <...player_names>', 'red'],
											[' - Gives info about every given players\' permissions.', 'yellow']
										]);
										tellPlayer(player, strf('&c!perms manage addList <permission_id> <l'));
									}
									break;
								}
								default: {
									tellPlayer(player, [
										["Type '!perms manage help' or '!perms manage ?' for more info."]
									]);
								}
							}
						}
						break;
					}
					case 'item': { //Set item permission
						
						break;
					}
					case 'help':
					case '?': {
						if(hasPermission(player, 'perms.help')) {
							storytellPlayer(player, [
								[
									['[========] ', 'white', 0, 1],
									['Alteria Permissions Help', 'yellow', 0, 1],
									['[========] ', 'white', 0, 1],
								],
								[
									['!perms manage '+permtype, 'red'],
									[' - Shows help for managing permissions']
								],
							]);
						}
						break;
					}
					default: {
						tellPlayer(player, [
							["Unknown action '"+permtype+"'. Use \"!perms ?\" or \"!perms help\" for more info", "red"]
						]);
						break;
					}
				}
			} else {
				tellPlayer(player, [
					["Use \"!perms ?\" or \"!perms help\" for more info", "red"]
				]);
			}
		}
	},
	'playerstats': function(player, args) {
		if(hasPermission(player, 'playerstats')) {}
	},
	'stats': function(player, args) {
		if(hasPermission(player, 'stats', false)) {
			var showstats = [];
			if(args.length == 0) {
				showstats = _SKILLS;
			} else if(args.length > 0) {
				for(i in args) {
					var arg = args[i].toLowerCase().rangeUpper(0, 1);
					for(n in skill_names) {
						if( (skill_names[n].match(new RegExp(arg, 'g')) || []).length > 0 ) {
							if(showstats.indexOf(_SKILLS[n]) == -1) {
								showstats.push(_SKILLS[n]);
								break;
							}
						}
					}
				}
			}
			var sk = getSkills(player, showstats);
			//Output player skills
			var pstat = (player.getName()+"'s Stats");
			executeCommand(player, '/tellraw '+player.getName()+' '+rawformat([
				['[==========] ', 'white'],
				[pstat.padMiddle(" ", 25), 'red', 0, 1],
				[' [==========]', 'white'],
			]));
			var sb = player.world.getScoreboard();
			for(i in sk) {
				var skn = [];
				if(_SKILLS.indexOf(sk[i].id) != -1) {
					var skillname = skill_names[_SKILLS.indexOf(sk[i].id)];
					var skillxp_id = xp_stats[_SKILLS.indexOf(sk[i].id)];
					
					var so = sb.getObjective(skillxp_id);
					if(so != null) {
						var ps = so.getScore(player.getName());
						if(ps != null) {
							skn = getRawSkillString(skillname, sk[i].level, ps.getValue());
						}
					}
					
					
				}
				
				if(skn.length > 0) {
					executeCommand(player, '/tellraw '+player.getName()+' '+rawformat(skn));
				}
			}
		}
	},
	'region': function(player, args) {
		if(hasPermission(player, "region")) {
			var w = player.world;
			var data = w.getStoreddata();
			
			if(args.length >= 1) {
				var regcmd = args[0];

				switch(regcmd) {
					case 'add': {
						if(hasPermission(player, "region.add")) {
							if(args.length >= 2) {
								var rgns = arrayTakeRange(args, 1, args.length);
								for(i in rgns) {
									var rgn_name = rgns[i];
									var _rgn = addRegion(data, rgns[i]);
									_rgn.dimension = player.world.getDimension().getId();
									saveRegion(data, _rgn);
									tellPlayer(player, [
										['Successfully created region "'+rgn_name+'"', 'green']
									]);
								}
							} else {
								tellPlayer(player, [
									['You must provide a name for the region!', 'red']
								]);
							}
						}
						break;
					}
					case 'remove': {
						if(hasPermission(player, "region.remove")) {
							if(args.length >= 2) {
								var rgns = arrayTakeRange(args, 1, args.length);
								for(i in rgns) {
									if(removeRegion(data, rgns[i])) {
										tellPlayer(player, [
											['Successfully removed region "'+rgns[i]+'"', 'green']
										]);
									} else {
										tellPlayer(player, [
											['Region "'+rgns[i]+'" doesn\'t exists!', 'red']
										]);
									}
								}
							} else {
								tellPlayer(player, [
									['You must provide at least one region to delete!', 'red']
								])
							}
						}
						break;
					}
					case 'extendVert': {
						if(hasPermission(player, 'region.extendVert')) {
							if(args.length >= 2) {
								var regg = getRegion(data, args[1]);
								if(regg != null) {
									regg.pos.y1 = 0;
									regg.pos.y2 = 255;
									saveRegion(data, regg);
									tellPlayer(player, strf("&aExtended region '"+regg.name+"' vertically!"));
								} else {
									tellPlayer(player, strf("&cRegion '"+args[1]+"' does not exists!"));
								}
							} else {
								tellPlayer(player, strf("&cYou need to provide a region name!"))
							}
						}
						break;
					}
					case 'setPos1':
					case 'setPos2': {
						var posnum = (regcmd == 'setPos1' ? 1 : 2);
						if(hasPermission(player, "region.set.pos"+posnum)) {
							if(args.length >= 2) {
								var pr_id = args[1];
								var plpos = player.getPos();
								var pregion = getRegion(data, pr_id);
								if(pregion != null) {
									var xyz = ['x','y','z'];
									var nw = [];
									for(a in xyz) {
										pregion.pos[xyz[a]+posnum] = plpos['get'+xyz[a].toUpperCase()]();
										nw.push(plpos['get'+xyz[a].toUpperCase()]());
									}
									data.put('region_'+pr_id, JSON.stringify(pregion));
									tellPlayer(player, strf('&aSet '+pr_id+' position #'+posnum+' to: '+nw.join(', ')+'!'));
									
								}
							} else {
								tellPlayer(player, strf('&cYou need to provide a region name!'));
							}
						}
						break;
					}
					case 'set': {
						if(hasPermission(player, "region.set")) {
							if(args.length >= 4) {
								var rg_name = args[1];
								var rg_key = args[2];
								var rg_val = args[3];
								var allowed_keys = [
									'enterText',
									'leaveText',
									'salePrice',
									'rentPeriod',
									'maxRentPeriod',
									'rentCredit',
									'forSale',
									'owner',
									'dimension'
								];
								var ak = allowed_keys.indexOf(rg_key);
								if(ak != -1) {
									if(hasPermission(player, "region.set."+allowed_keys[ak])) {
										if(rg_key == 'forSale') {
											rg_val = (rg_val == 'true');
										}
										if(rg_key == 'salePrice' || rg_key == 'dimension') {
											if(rg_val.cInt() != null) {
												rg_val = rg_val.cInt();
											}
										}
										if(rg_key == 'rentPeriod' || rg_key == 'maxRentPeriod' || rg_key == 'rentCredit') {
											rg_val = getStringTime(rg_val.toString());
											if(rg_key == 'rentCredit') {
												rg_val += new Date().getTime();
											}
										}
										var reg = getRegion(data, rg_name);
										reg[allowed_keys[ak]] = rg_val;
										data.put('region_'+rg_name, JSON.stringify(reg));
										tellPlayer(player, strf("&aSet '"+rg_key+"' to '"+rg_val+"' in region '"+rg_name+"'!"));
									}
								} else {
									tellPlayer(player, strf("&cUnknown region property \""+rg_key+"\"!"));
								}
							} else {
								tellPlayer(player, strf("&eProper Usage: &c!region set <region_name> <property_name> <new_value>"));
							}
						}
						break;
					}
					case 'list': {
						if(hasPermission(player, 'region.list')) {
							var mt = [];
							if(args.length >= 2) { mt = arrayTakeRange(args, 1, args.length); }
							
							
							tellPlayer(player, strf('&l[=======] &a&lAlteria Regions &l[=======]'));
							var showkeys = [];
							var dkeys = data.getKeys();
							for(dk in dkeys) {
								var dkey = dkeys[dk];
								if( (dkey.match(/region_([\w\.]+)/g) || []).length > 0 ) {
									var rgn_id = dkey.replace(/region_([\w\.])/g, '$1');
									if(showkeys.indexOf(rgn_id) == -1) {
										if(mt.length > 0) {
											for(mm in mt) {
												if(occurrences(rgn_id, mt[mm]) > 0 && showkeys.indexOf(rgn_id) == -1) {
													showkeys.push(rgn_id);
												}
											}
										} else {
											showkeys.push(rgn_id);
										}
									}
									//tellPlayer(player, strf(' - '+rgn_id));
								}
							}
							showkeys.sort();
							for(ss in showkeys) {
								tellPlayer(player, strf(' - '+showkeys[ss]));
							}
						
						}
						break;
					}
					case 'info': {
						if(hasPermission(player, 'region.info')) {
							if(args.length >= 2) {
								var sregions = arrayTakeRange(args, 1, args.length);
								
								var rgi = [];
								for(s in sregions) {
									tellPlayer(player, strf('&l[=======] &a&lAlteria Region Info &l[=======]'));
									var sregion = getRegion(data, sregions[s]);
									if(sregion != null) {
										rgi.push(strf('&eRegion Info: &9&o'+sregion.name));
										rgi.push(strf('&eEnter Text: &r'+sregion.enterText));
										rgi.push(strf('&eLeave Text: &r'+sregion.leaveText));
										rgi.push(strf('&eOwner: '+(sregion.owner == null ? '&a&lAlteria':'&r'+sregion.owner)));
										if(sregion.owner != null) {
											rgi.push(strf('&eRent time left: &6&o'+getTimeString(sregion.rentCredit - new Date().getTime())));
										} else {
											rgi.push(strf('&eFor Sale: &c'+sregion.forSale.toString()));
										}
										
										rgi.push(strf('&eCost per &6&o'+getTimeString(sregion.rentPeriod)+'&e: &l&2'+sregion.salePrice+' &eCoins'));
										rgi.push(strf('&eMax rent time: &6&o'+getTimeString(sregion.maxRentPeriod)));
										
										var valid = isValidRegion(sregion, true);
										rgi.push(strf('&eDimension: &c'+sregion.dimension));
										rgi.push(strf('&ePosition: '+(valid!=true?'(Region not physical yet, define '+valid.join(',')+' to make the region existend)':'')));
										for(ps in sregion.pos) {
											rgi.push(strf('&e - '+ps+': &c'+sregion.pos[ps]));
										}
										storytellPlayer(player, rgi);
									}
								}
							} else {
								tellPlayer(player, strf('&cYou need to provide at least one region name!'));
							}
						}
						break;
					}
					case 'rent': {
						if(hasPermission(player, 'region.rent')) {
							if(args.length >= 2) {
								var reg_id = args[1];
								var regg = getRegion(data, reg_id);
								if(regg != null) {
									if(regg.forSale || regg.owner == player.getName()) {
										if(regg.owner == null || regg.owner == player.getName()) {
											if(player.inventoryItemCount('minecraft:gold_nugget', -1) >= regg.salePrice) {
												if(regg.owner == null) {
													//new rent
													regg.owner = player.getName();
													regg.rentCredit = new Date().getTime();
													
												}
												regg.forSale = false;
												if(regg.rentCredit+regg.rentPeriod <= new Date().getTime()+regg.maxRentPeriod) {
													regg.rentCredit += regg.rentPeriod;
													player.removeItem('minecraft:gold_nugget', -1, regg.salePrice);
													saveRegion(data, regg);
													tellPlayer(player, strf('&aSuccessfully rented region!'));
												} else {
													tellPlayer(player, strf('&cYou have reached maximum renting time!'));
												}
												
												
											} else {
												tellPlayer(player, strf('&cYou don\'t have enough coins!'));
											}
											
											
										} else {
											tellPlayer(player, strf('&cThis region is already owned!'));
										}
									} else {
										tellPlayer(player, strf('&cThis region is not for sale!'))
									}
								} else {
									tellPlayer(player, strf('&cRegion does not exists!'));
								}
							} else {
								tellPlayer(player, strf('&cYou need to provide an region name!'));
							}
						}
					}
				}
			}
		}
	},
	'worth': function(player, args) {
		player.world.broadcast('worth: '+args.join(', ').toString());
	},
};

var _CMD_IDS = [];

var _MAGICMETHODS = [
	'__desc',
	'__run',
	'__help'
];


function executeXCommand(player, cmd) {
	var msg = cmd;
	var retval = false;
	if(msg.substr(0, 1) == '!') {
		msg = msg.substr(1, msg.length-1);
		var args = msg.split(" ");
		
		var cmd = _COMMANDS;
		var cancel = false;
		
		for(i in args) {
			var arg = args[i];
			//Is not magic method?
			if(_MAGICMETHODS.indexOf(arg) == -1) {
				//Check subcommands
				if(typeof(cmd[arg.toString()]) != typeof(undefined)) {
					cmd = cmd[arg.toString()];
				} else {
					tellPlayer(player, [
						['Cannot find this Alteria Command!', 'red']
					]);
				
					cancel = true;
					break;
				}
				
				//isRunnable
				if(typeof(cmd) == 'function') {
					var cmd_args = args.slice(i+1, args.length-i);
					retval = cmd(player, cmd_args) || false;
					break;
				}
			} else {
				//Is magic method
				var mm = _MAGICMETHODS[_MAGICMETHODS.indexOf(arg)];
				//if(mm == '__help'
				
				cancel = true;
				break;
			}
		
		}
		if(typeof(cmd.__run) != typeof(undefined)) {
			cmd.__run(player);
		}
		
		//has not selected subcommand?
		if(typeof(cmd) != 'function' && !cancel) {
			executeCommand(player, '/tellraw '+player.getName()+' '+rawformat([
				['Subcommands: '+Object.keys(cmd).join(', '), 'white']
			]));
		}
	}
	
	return retval;
}



@block chat_event
	(function(e){
		if(e.message.substr(0, 1) == '!') {
			executeXCommand(e.player, e.message);
			
			e.setCanceled(true);
		}
	})(e);
@endblock