registerDataHandler("mail", Mail);
function Mail(name) {
	this.data = {
		"from": null,
		"to": [],
		"title": "",
		"message": ""
	};
}
