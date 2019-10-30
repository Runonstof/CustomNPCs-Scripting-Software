import "core/mods/noppes/Java.js";
import "core/JavaScript/String.js";
import "core/JavaScript/Array.js";

var rgx_selector = /@([\w]+)(?:\[([^\v]*)\])?/;
var rgx_selector_arg = /(\w+)(?:=(\w+)?(?:(\.\.)(\w+)?)?)?/g;
var rgx_selector_nbt = /(\w+)={([\S]+})?/g;
function $(query,e, source) {
    
    //The order is important
    source = source||(e&&(e.npc||e.item||e.player))||null;
    
    var _x = 0;
    var _y = 0;
    var _z = 0;
    var w = API.getIWorld(0);
    if(source) {
        _x = source.pos.x;
        _y = source.pos.y;
        _z = source.pos.z;
        w = source.world;
    }
    var from = API.getIPos(_x, _y, _z);
    var ents = [];
    if(typeof query === 'string') {
        //query
        var selectors = query.split(';');
        for(var i in selectors) {
          var selector = selectors[i];
            //selector
            var smatch = selector.match(rgx_selector);
            var targetType = smatch[1];
            var args = {};
            var argdata;

            while( (argdata = rgx_selector_nbt.exec(smatch[2])) !== null ) {
                args[argdata[1]] = API.stringToNbt(argdata[2]);
            }

            argdata = null;
            //
            while( (argdata = rgx_selector_arg.exec(smatch[2])) !== null ) {
                //if no ".." 
                if(typeof argdata[3] === typeof undefined) {
                  //console.log("II",argdata);
                    var val = argdata[2] === undefined ? 'true' : argdata[2];
                  	if(['true','false'].indexOf(val.toLowerCase()) > -1) {
                        val = (val.toLowerCase() == 'true');
                    }
                    if(!isNaN(parseFloat(val))) {
                        val = parseFloat(val);
                    }
                    
                    args[argdata[1]] = val;
                    //console.log(val)
                //If has ".." (range)
                } else {
                	var rule = {};
                  	if(argdata[2] !== undefined) {
                    	rule.min = parseInt(argdata[2]);
                    }
                  
                  	if(argdata[4] !== undefined) {
                    	rule.max = parseInt(argdata[4]);
                    }
                  	args[argdata[1]] = rule;
                }
              
            }
            //has args


            switch(targetType) {
                case 'f':
                case 'p':
                    var plrs = w.getAllPlayers();
                    if(plrs.length > 0) {
                        plrs.sort(function(a,b){
                            return from.distanceTo(b.pos) - from.distanceTo(a.pos)
                        });
                        if(targetType == 'f') { plrs.reverse(); }
                        sel_ents.push(plrs[0]);
                    }
                    break;
                case 'a':
                    var plrs = w.getAllPlayers();
                    for(var p in plrs) {
                        sel_ents.push(plrs[p]);
                    }
                    break;
                case 'r':
                    var plrs = w.getAllPlayers();
                    plrs = array_shuffle(plrs);
                    if(plrs.length > 0) {
                        sel_ents.push(plrs[0]);
                    }
                    break;
                case 'e':
                    var all_ents = w.getAllEntities(EntityType_ANY);
                    for(var a in all_ents) {
                        sel_ents.push(all_ents[a]);
                    }
                    break;
                break;
                case 's':
                    if(source) {
                        sel_ents.push(source);
                    }
                    break;
            }

            //target determined
            var canAdd = true;
            //handle args
            for(var argname in args) {
                var argval = args[argname];


            }
        }
    }
    
}
