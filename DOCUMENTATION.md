**CREATING A JOB, PERMISSION, CHAT CHANNEL, ETC**

`DataHandler` object (Region, Job, Permission, ..., objects use these functions also)    
Location: `core\players\xcommands.js`
```js
function DataHandler(type, name) {
	this.type = type;
	this.name = name;
	this.data = this.data || {};
	
	this.dkeyrgx = new RegExp(this.type+'_([\\w]+)', 'g'); //Regex
	
	this.getAllDataIds = function(IData data); //'Static' method
	
	this.getDataId = function();
	this.exists = function(IData data);
	this.save = function(IData data);
	this.load = function(IData data);
	this.remove = function(IData data);
	this.init = function(IData data, Object initdata); //initdata optional and not used mostly
	this.toJson = function();
}
```

`Job` object `extends DataHandler`    
Location: `core\players\commands\jobCommands.js`
```js
function Job(name) {
	DataHandler.apply(this, ['job', name]);
	
	//This is where a job defaults to
	this.data = {
		"displayName": name,
		"pay": getCoinAmount('5g'),
		"payTime": getStringTime('20min'),
		"isOpen": false,
		"capacity": 10,
		"fireTime": getStringTime('1w'),
		"companyId": null
	};
	
	this.getPlayers = function(IData data);
	this.getDisplayName = function(IData data);
	this.getStatusColor = function(IData data);
}
```