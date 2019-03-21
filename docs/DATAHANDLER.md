**DATAHANDLERS**

All regions, jobs, etc uses `DataHandler`'s methods

`DataHandler` object (Region, Job, Permission, ..., objects use these functions also)    
Location: `core\players\xcommands.js`
```js
function DataHandler(type, name) {
	this.type = type; //permission, chatchannel, job, etc
	this.name = name;
	this.data = this.data || {};
	
	this.dkeyrgx = new RegExp(this.type+'_([\\w]+)', 'g'); //Regex
	
	this.getAllDataIds = function(IData data) { /***/ }; //'Static' method, gets all Data IDs from this type
	
	this.getDataId = function() { /***/ }; //Get ID to reference in IData
	this.exists = function(IData data) { /***/ }; //Checks if this exists in IData
	this.save = function(IData data) { /***/ }; //Saves data to IData
	this.load = function(IData data) { /***/ }; //Loads data in this.data
	this.remove = function(IData data) { /***/ }; //Removes datahandler from IData
	this.init = function(IData data, Object initdata) { /***/ }; //initdata optional, load object and registers if not exists
	this.toJson = function(); //Gives back this.data as JSON
}
```

**LIST OF DATAHANDLER (WITH EXAMPLES)**
 - **[Job](JOBS.md) Object**