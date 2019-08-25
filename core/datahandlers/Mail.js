registerDataHandler("mail", Mail);
function Mail(name) {
	this.addData({
		"from": null,
		"to": [],
		"title": "",
		"message": ""
	});
}
