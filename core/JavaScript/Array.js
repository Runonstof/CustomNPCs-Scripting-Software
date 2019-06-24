function array_filter(a, fn) {
	var aa = [];
	for(var i in a) {
		if(fn(a[i])) { aa.push(a[i]); }
	}

	return aa;
}

function array_dist(a) {
	var b = [];
	for(var c in a) {
		if(b.indexOf(a[c]) == -1) {
			b.push(a[c]);
		}
	}

	return b;
}

function array_remove(array, element) {
  var index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

function removeFromArray(arr, vals) {
	if(typeof(vals) == 'string') { vals = [vals]; }
	var a = arr;
	for(var v in vals as val) {
		array_remove(a, val);
	}
	return a;
}
function removeFromArrayByKey(arr, keys) {
	var narr = [];
	for(var k in keys as key) {
		keys[k] = parseInt(key);
	}
	for(var i in arr as ari) {
		if(keys.indexOf(i) > -1) {
			narr.push(ari);
		}
	}
	return narr;
}

function inArray(a, val) {
	for(var k in a) { if(a[k] === val) { return true; } }
	return false
}

function array_merge(a1, a2) {
	var bb = [];
	for(var k in a1) {
		bb[k] = a1[k];
	}
	for(var k in a2) {
		bb[k] = a2[k];
	}
	return bb;
}

function arrayTransform(arr, elfn) {
	var newa = [];
	for(var a in arr as arri) {
		newa.push(elfn(arri, a, arr));
	}
	return newa;
}

function arrayTakeRange(arr, start, end=null) {
	if(end == null) { end = arr.length; }
	var a = [];
	var _end = Math.min(end, arr.length);
	var _start = Math.min(start, _end);
	for(var i = _start; i < Math.min(end, arr.length); i++) {
		if(typeof(arr[i]) != typeof(undefined)) {
			a.push(arr[i]);
		}
	}
	return a;
}

function arrayOccurs(string, subArray, allowOverlapping=false, caseSensitive=true) {
	var occ = 0;
	for(var i in subArray as sel) {
		occ += occurrences(string, sel, allowOverlapping, caseSensitive);
	}

	return occ;
}

function arrayFormat(array, format, sep) {
	var joined = "";
  	for(var i = 0; i < array.length; i++) {
    	joined += format.fill({
        	"VALUE": array[i]
        })+(i == array.length-1 ? "" : sep||" ");
    }
  	return joined;
}
