//Superfunction (extendable)
//Used to add permission requirements to datahandlers.
function Permittable(permDomain) {
	this.permDomain = permDomain||this.type;
	//Requires DataHandler
	this.getPermission = function(){
		return new Permission(this.getPermissionId());
	};
	this.getPermissionId = function(){
		return this.permDomain+'.'+this.name;
	};
	this.onRemove(function(self, data) {
		self.getPermission().remove(data); //Removes permission when DataHandler gets removed

	});
	this.onSave(function(self, data){
		var perm = self.getPermission();
		if(!perm.exists(data)) {
			//Create permission of permittable if not exists
			perm.save(data); //this will run Permission onSave functions
		}
	});
}
