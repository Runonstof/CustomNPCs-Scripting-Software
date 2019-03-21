
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
	
	this.getPlayers = function(IData data);
	this.getDisplayName = function(IData data);
	this.getStatusColor = function(IData data); 
}
```