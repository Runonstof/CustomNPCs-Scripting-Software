if(typeof(Object.values) !== "function")  {
    Object.values = function(obj){
        var v = [];
        for(var i in obj as oi) {
            v.push(oi);
        }

        return v;
    }
}
if(typeof(Object.keys) !== "function")  {
    Object.keys = function(obj){
        var v = [];
        for(var i in obj as oi) {
            v.push(i);
        }

        return v;
    }
}
