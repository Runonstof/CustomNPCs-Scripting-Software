//Get data from IData
function data_get(data, keys) {
	var get = {};
	for(var k in keys) {
		//var key = keys[k];
		get[keys[k]] = data.get(keys[k]);
		//if(get[keys[k]] == null) { get[keys[k]] = keys[k]; }
	}

	return get;
}

//Add data to IData if it doesn't exist
function data_register(data, vals) {
	for(var k in vals as val) {
		if(data.get(k) == null) { data.put(k, val); }
	}
}

//Add data to IData even if it does exist
function data_overwrite(data, keys=[], vals=[]) {
	if(typeof(keys) == 'string') { keys = [keys]; }
	if(typeof(vals) == 'string') { vals = [vals]; }

	for(var k in keys) {
		var key = keys[k];
		var val = vals[k];
		data.put(key, val);
	}
}
