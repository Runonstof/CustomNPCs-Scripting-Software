**DATAHANDLERS**

All regions, jobs, etc uses `DataHandler`'s methods

`DataHandler` object (Region, Job, Permission, ..., objects use these functions also)    
Location: `core\players\xcommands.js`
```js
function DataHandler(type, name) {
	this.type = type; //permission, chatchannel, job, etc
	this.name = name;
	this.data = this.data || {};
	
	this.dkeyrgx = new RegExp(this.type+'_([\\w]+)', 'g'); //Regex for matching id in data
	
	this.getAllDataIds = function(IData data) { /***/ }; //'Static' method, gets all Data IDs from this type as Array
	
	this.getDataId = function() { /***/ }; //Get ID to reference in IData
	this.exists = function(IData data) { /***/ }; //Checks if this exists in IData
	this.save = function(IData data) { /***/ }; //Saves data to IData
	this.load = function(IData data) { /***/ }; //Loads data in this.data
	this.remove = function(IData data) { /***/ }; //Removes datahandler from IData
	this.init = function(IData data, Object initdata) { /***/ }; //initdata optional, load object and registers if not exists
	this.toJson = function(); //Gives back this.data as JSON-string
}
```
**EXAMPLE** *For permissions, chatchannels, etc ofcourse*
Creating a new job if not exists:    
*This example also counts for `regions`, `permissions`, `chatchannels`, etc!*    
```js
var data = world.getStoreddata(); //Any IData object allowed, but I only use world's
var job = new Job('oil_treater');
if(!job.exists(data)) {
	job.save(data);
}

job.data.displayName = "Oil Treater";
job.save(data);

```
Same as
```js
var data = world.getStoreddata(); //Any IData object allowed, but I only use world's
var job = new Job('oil_treater').init(data);

job.data.displayName = "Oil Treater";
job.save(data);

```

**LIST OF DATAHANDLER**
 - **[Job](datahandlers/JOBS.md) Object**
 - **[Permission](datahandlers/PERMISSIONS.md) Object**