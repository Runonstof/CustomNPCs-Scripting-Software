var _UNIQIDS = [];

function uniqid() {
    var _CHARSET = "01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var id;
    do {
        id = "";
        
        for(var i = 0; i < length; i++) {
            var index = rrandom_range(0, _CHARSET.length-1);
            id += _CHARSET.slice(index, index+1).toString();
        }
    } while(_UNIQIDS.indexOf(id) > -1);
	
	
	return id;
}