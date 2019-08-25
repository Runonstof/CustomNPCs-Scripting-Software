registerDataHandler("team", Team);
function Team(name) {
	DataHandler.apply(this, ['team', name]);
	this.addData({
		"chatcolor": null,
		"chateffect": null,
	});
	this.teamExists = function(sb) {
		return sb.hasTeam(this.name);
	};
}
