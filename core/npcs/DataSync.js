function DataSync(vars, npcdata) {
    this.data = npcdata;
    this.vars = vars;

    this.set = function(keys, values){
        if(typeof keys === "string") keys = [keys];
        if(typeof values === "string") values = [values];

        for(var k in keys as key) {
            this.vars[key] = values[k];
        }

        return this;
    }

    this.sync = function(){
        
        return this;
    }
}
