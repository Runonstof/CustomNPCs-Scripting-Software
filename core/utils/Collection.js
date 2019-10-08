import "core/utils/Compare.js";
import "core/JavaScript/Object.js";


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
        return new Collection(newItems);
    };

    this.whereKey = function(key, opr_val, value) {
        var operator = (value ? opr_val : '==');
        var newItems = [];
        this.items.forEach(function(item, i){
            if(compare(key, operator, val)) { newItems.push(item); }
        });

        return new Collection(newItems);
    }

    this.toArray = function(){
        return this.items;
    };

    this.pluck = function(key) {
        var plucked = [];
        this.items.forEach(function(item,i){
            if(typeof key === 'string') {
                plucked.push(item[key]);
            } else {
                var objToPush = {};
                for(var k in key) {
                    objToPush[key[k]] = item[key[k]];
                }
                plucked.push(objToPush);
            }
        });

        return new Collection(plucked);
    };


}
