String.prototype.allMatch = function(regx) {
	var m = this.match(regx);
	var rr = [];
	for(var mm in m) {
		var mt = m[mm];
		var rx = regx.exec(this);
		rr.push(rx);
	}

	return rr;
};


String.prototype.cmatch = function(regx) {
	return (this.match(regx) || []).length;
};

String.prototype.rangeUpper = function(min, max) {
	var str = '';
	for(var i = 0; i < this.length; i++) {
		var c = this.substring(i, i+1); //curchar
		if(i >= min && i < max) {
			c=c.toUpperCase();
		}
		str+=c.toString();
	}
	return str;
};
String.prototype.rangeLower = function(min, max) {
	var str = '';
	for(var i = 0; i < this.length; i++) {
		var c = this.substring(i, i+1); //curchar
		if(i >= min && i < max) {
			c=c.toLowerCase();
		}
		str+=c.toString();
	}
	return str;
};

String.prototype.pad = function(character, len) {
	var n = this.toString();
	for(var i = n.length; i < len; i++) {
		n += character.toString();
	}
	return n;
};

String.prototype.fill = function(payload) {
	var str = this.toString();
	for(var p in payload as payl) {
		str = str.split("{"+p+"}").join(payl);
	}
	return str;
}

String.prototype.padMiddle = function(character, len) {

	var n = this.toString();
	var sc = Math.floor((len-n.length)/2);
	var ns = '';
	for(var i = 0; i < sc; i++) {
		ns += character.toString();
	}
	ns+=n;
	for(var i = 0; i < sc; i++) {
		ns += character.toString();
	}
	return ns;
};

String.prototype.cInt = function() {
	return (isNaN(parseInt(this)) ? null : parseInt(this));
};


String.prototype.append = function(ch, amount) {
	var new_str = this.toString();
  	for(var i = 0; i < amount; i++) {
    	if(i >= new_str.length) {
        	new_str += ch.toString();
        }
    }

  return new_str;
};

String.prototype.prepend = function(ch, amount) {
	var new_str = this.toString();
  	for(var i = 0; i < amount; i++) {
    	if(i >= new_str.length) {
        	new_str = ch.toString()+new_str;
        }
    }

  return new_str;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this.toString();
    if(typeof(search) == 'string') { search = [search]; }
		for(var s in search as sr) {
			target = target.split(sr).join(replacement);
		}
		return target;
};

function occurrences(string, subString, allowOverlapping=false, caseSensitive=true) {
    string = string.toString()
    subString = subString.toString()

	if(!caseSensitive) {
		string = string.toLowerCase();
		subString = subString.toLowerCase();
	}

    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}
