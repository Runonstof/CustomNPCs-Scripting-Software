function Collection(o=[]) {
    this.items = o;

    this.do = function(funcname, args){
        this.items[funcname].apply(this.items, args);
        return this;
    };

    this.where = function(boolfunc) {
        var newItems = [];
        this.items.forEach(function(item, i){
            if(boolfunc(item, i)) { newItems.push(item); }
        });
        this.items = newItems;
        return this;
    };

    this.get = function(){
        return this.items;
    };


}
