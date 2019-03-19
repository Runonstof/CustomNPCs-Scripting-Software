function getFnArgs(fn) {
	var fnrgx = /function[\s]+([\w]+)\(([\w,\s]+)\)/;
	var fnstr = fn.toString();
	var fnargs = [];
	var m = fnstr.match(fnrgx);
	if(m != null) {
		
      	m[2].split(',').forEach(function(a){
        	fnargs.push(a.trim());
        });
      	
      	return fnargs;
	}
	
	return fnargs;
}
