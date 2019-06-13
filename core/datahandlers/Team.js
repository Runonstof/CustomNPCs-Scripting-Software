function Team(name) {
	DataHandler.apply(this, ['team', name]);
	this.data = {
		"chatcolor": null,
		"chateffect": null,
	};
	this.teamExists = function(sb) {
		return sb.hasTeam(this.name);
	};
}
