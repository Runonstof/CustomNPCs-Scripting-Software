`Job` object `extends DataHandler`    
Location: `core\players\commands\jobCommands.js`
```js
function Job(name) {
	DataHandler.apply(this, ['job', name]);
	
	//This is where job's data defaults to
	this.data = {
		"displayName": name,
		"pay": getCoinAmount('5g'),
		"payTime": getStringTime('20min'),
		"isOpen": false,
		"capacity": 10,
		"fireTime": getStringTime('1w'),
		"companyId": null
	};
	
	this.getPlayers = function(IData data) { /***/ };
	this.getDisplayName = function(IData data) { /***/ };
	this.getStatusColor = function(IData data) { /***/ }; 
}
```

**EXAMPLES**    
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
    
	
	
