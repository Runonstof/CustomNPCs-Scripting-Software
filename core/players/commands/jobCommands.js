function Job(name) {
	DataHandler.apply(this, ['job', name]);
	this.data = {
		"displayName": name,
		"pay": getCoinAmount('5g'),
		"payTime": getStringTime('20min'),
		"isOpen": false,
		"capacity": 10,
		"fireTime": getStringTime('1w'),
		"companyId": null
	};

	this.getPlayers = function(data) {
		var pl = [];
		var dkeys = data.getKeys();
		for(d in dkeys as dkey) {
			if(dkey.cmatch(/player_(\w+)/g) == 1) {
				var player = new Player(dkey.replace(/player_(\w+)/g, '$1'));
				player.load(data);
				if(player.hasJob(this.name) && pl.indexOf(player.name) == -1) {
					pl.push(player.name);
				}
			}
		}

		return pl;
	};

	this.getDisplayName = function(data) {
		if(typeof(data) == typeof(undefined)) {
			return this.data.displayName+'&r';
		} else {
			return this.getStatusColor(data)+this.data.displayName+'&r';
		}
	}

	this.getStatusColor = function(data) {
		if(this.data.capacity == -1) {
			return '&a';
		}
		if(this.getPlayers(data).length < this.data.capacity) {
			return '&6';
		}
		return '&c';
	};
}

@block register_commands_event
	registerXCommands([
		['!jobs create <name> [...display_name]', function(pl, args){
			var job = new Job(args.name);
			var dname = args.display_name.join(' ');
			var data = pl.world.getStoreddata();
			if(dname != "") {
				job.data.displayName = dname;
			}
			tellPlayer(pl, "&aJob '"+job.getDisplayName(data)+"&a' created! "+getUndoBtn(["!jobs remove "+job.name], "$cClick to undo"));
			job.save(data);
		}, 'jobs.create', [
			{
				"argname": "name",
				"type": "id",
				"minlen": 3
			},
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": false,
			}
		]],
		['!jobs remove <name>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.remove(data);
			tellPlayer(pl, "&aRemoved job '"+job.getDisplayName(data)+"&a'!");
		}, 'jobs.add', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			}
		]],
		['!jobs setPay <name> <amount>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			var amount = getCoinAmount(args.amount);
			job.data.pay = amount;
			job.save(data);
			tellPlayer(pl, "&aSet the salary of job '"+job.getDisplayName(data)+"&a' to &r:money:&e"+getAmountCoin(amount)+"&a!");
		}, 'jobs.setPay', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			},
			{
				"argname": "amount",
				"type": "number"
			}
		]],
		['!jobs setPayTime <name> <time>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			job.data.payTime = args.time;
			job.save(data);
			tellPlayer(pl, "&aSet the paytime of job '"+job.getDisplayName(data)+"&a' to "+getTimeString(args.time)+"!");
		}, 'jobs.setPayTime', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			},
			{
				"argname": "time",
				"type": "time"
			}
		]],
		['!jobs setOpen <name> <open>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			job.data.isOpen = (args.open == 'true');
			job.save(data);
			tellPlayer(pl, "&aSet if job '"+job.getDisplayName(data)+"&a' is open to "+args.open);
		}, 'jobs.setOpen', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			},
			{
				"argname": "open",
				"type": "bool"
			}
		]],
		['!jobs setDisplayName <name> <...display_name>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			job.data.displayName = args.display_name.join(' ');
			job.save(data);
			tellPlayer(pl, "&aSet the display of job_id '"+job.name+"' to '"+job.getDisplayName(data)+"&a'!");
		}, 'jobs.setDisplayName', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			}
		]],
		['!jobs list [...matches]', function(pl, args){
			var data = pl.world.getStoreddata();
			var dkeys = data.getKeys();
			tellPlayer(pl, "&l[=======]&r&6&lGramados Job List&r&l[=======]");
			for(d in dkeys as dkey) {
				if( ( dkey.match(/job_(\w.)/g) || [] ).length > 0 ) {
					var job = new Job(dkey.replace(/job_(\w.)/g, '$1'));
					var isMatch = false;
					args.matches.forEach(function(mt){
						if(occurrences(mt, job.name) > 0 || occurrences(mt, job.getDisplayName(data)) > 0) {
							isMatch = true;
						}
					});

					if(args.matches.length == 0 || isMatch) {
						job.load(data);
						tellPlayer(pl, "&e - &r"+job.getStatusColor(data)+escCcs(job.getDisplayName())+"&r (&9&o"+job.name+"&r)");
					}

				}
			}
			return true;
		}, 'jobs.list'],
		['!jobs info <name>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			tellPlayer(pl, "&l[=======]&r&6&lGramados Job Info&r&l[=======]");
			tellPlayer(pl, "&eName: &9&o"+job.name);
			tellPlayer(pl, "&eDisplay Name: &r"+job.getStatusColor(data)+escCcs(job.getDisplayName()));
			tellPlayer(pl, "&eCompany: &c"+job.data.companyId);
			tellPlayer(pl, "&eIncome: "+getAmountCoin(job.data.pay)+' per '+getTimeString(job.data.payTime));
			tellPlayer(pl, "&eIs Open: "+(job.data.isOpen ? '&atrue':'&cfalse'));
			tellPlayer(pl, "&ePlaces taken: "+job.getStatusColor(data)+job.getPlayers(data).length+"/"+(job.data.capacity > -1 ? job.data.capacity : 'UNLIMITED'));
			tellPlayer(pl, "&eFire Time: &6"+getTimeString(job.data.fireTime));
		}, 'jobs.info', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			}
		]],
		['!jobs playerList <name>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			tellPlayer(pl, "&l[=======] &r&6&lGramados Job Player List &r&l[=======]");
			tellPlayer(pl, "&eJob: &9&o"+args.name);
			var pls = job.getPlayers(data);
			for(p in pls as plr) {
				tellPlayer(pl, "&e - &r"+plr);
			}
		}, 'jobs.playerList', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			}
		]],
		['!jobs addPlayers <name> <...player_names>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.load(data);
			for(p in  args.player_names as apl) {
				var apo = new Player(apl);
				if(apo.load(data)) {
					apo.addJob(job.name);
					apo.save(data);
				}
			}
			tellPlayer(pl, "&aAdded "+args.player_names.length+" player(s) to job '"+job.name+"'");
		}, 'jobs.addPlayers', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			}
		]],
		['!jobs setPlaces <name> <amount>', function(pl, args){
			var am = parseInt(args.amount) || 10;
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.data.capacity = am;
			tellPlayer(pl, "&aSet max players of job '"+job.name+"' to "+am+'!');
			job.save(data);
		}, 'jobs.setPlaces', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			},
			{
				"argname": "amount",
				"type": "number"
			}
		]],
		['!jobs setFireTime <name> <time>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			job.data.fireTime = args.time;
			tellPlayer(pl, "&aSet fire time of job '"+job.name+"' to "+getTimeString(args.time)+"!");
			job.save(data);
		}, 'jobs.setFireTime', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			},
			{
				"argname": "time",
				"type": "time"
			}
		]],
		['!jobs removePlayers <name> <...players>', function(pl, args){
			var job = new Job(args.name);
			var data = pl.world.getStoreddata();
			for(p in args.players as apl) {
				var apo = new Player(apl);
				if(apo.load(data)) {
					apo.delJob(job.name);
					apo.save(data);
				}
			}
			tellPlayer(pl, "&aRemoved "+args.players.length+" player(s) from job '"+job.name+"'");
		}, 'jobs.removePlayers', [
			{
				"argname": "name",
				"type": "datahandler",
				"datatype": "job",
				"exists": true,
			}
		]],
		['!jobs reload', function(pl, args){
			var data = pl.world.getStoreddata();
			var dkeys = data.getKeys();
			var jc = 0;
			for(d in dkeys as dkey) {
				if(dkey.cmatch(/job_(\w+)/g)) {
					var job = new Job(dkey.replace(/job_(\w+)/g, '$1'));
					if(job.load(data)) {
						job.save(data);
					}
					jc++;
				}
			}
			tellPlayer(pl, "&aReloaded "+jc+" job(s)!");
		}, 'jobs.reload']
	]);
@endblock
