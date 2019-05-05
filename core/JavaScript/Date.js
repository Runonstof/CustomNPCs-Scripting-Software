//==Reallife date handler for hiring regions etc

Date.prototype.addTime = function(addTime) {
	this.setTime(this.getTime()+addTime);
};

Date.prototype.hasPassed = function(passDate) {
	return (this.getTime() >= passDate.getTime());
};

//Converts TimeString to number
function getStringTime(timeString) {
	//0y4mon3d 6h 8min3s 800ms
	var reg = /([\d]+)([a-zA-Z]+)/g;
	var _m = timeString.match(reg);
	var newTime = 0;
	var _tk = Object.keys(msTable);

	for(var m in _m) {
		var fm = _m[m];
		var nm = fm.replace(reg, '$1').cInt();
		var om = fm.replace(reg, '$2');
		if(nm != null) {
			if(_tk.indexOf(om) != -1) {
				newTime += nm * (msTable[_tk[_tk.indexOf(om)]]);
			} else { newTime += nm; }
		}
	}

	return newTime;
}
//Converts number to TimeString
function getTimeString(stringTime, excludes=[]) {
	var newTime = parseInt(stringTime);
	var newStr = '';
	for(var ms in msTable) {
		if(excludes.indexOf(ms) == -1) {
			var msnum = 0;
			while(newTime >= msTable[ms]) {
				msnum++;
				newTime -= msTable[ms];
			}
			if(msnum > 0) {
				newStr += msnum.toString()+ms;
			}
		}
	}


	return newStr;
}
