//Superfunction (extendable)
//Used to save function data object.
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
		for(var d in dkeys as dkey) {
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
			this.data = objMerge(this.data, JSON.parse(ndata), false);
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