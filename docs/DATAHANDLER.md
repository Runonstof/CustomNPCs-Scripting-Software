**DATAHANDLERS**

All regions, jobs, etc uses `DataHandler`'s methods

`DataHandler` object (Region, Job, Permission, ..., objects use these functions also)    
Location: `core\players\xcommands.js`
```js
function DataHandler(type, name) {
	this.type = type;
	this.name = name;
	this.data = this.data || {};
	
	this.dkeyrgx = new RegExp(this.type+'_([\\w]+)', 'g'); //Regex
	
	this.getAllDataIds = function(IData data) { /***/ }; //'Static' method
	
	this.getDataId = function() { /***/ };
	this.exists = function(IData data) { /***/ };
	this.save = function(IData data) { /***/ };
	this.load = function(IData data) { /***/ };
	this.remove = function(IData data) { /***/ };
	this.init = function(IData data, Object initdata) { /***/ }; //initdata optional and not used mostly
	this.toJson = function();
}
```

**LIST OF DATAHANDLER**
 - [Jobs](JOBS.md)