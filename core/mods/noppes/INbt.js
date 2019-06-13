function ENbt(nbtObject) {
    this.nbt = nbtObject; /* INbt */
    this.copy = function() {
        return new ENbt(API.stringToNbt(this.nbt.toJsonString()));
    };
    this.get = function(path) {
        var paths = path.toString().split(".");
        var cur = this.nbt;
        for(var pa in paths as p) {
            var keyType = getNbtType(cur.getType(p));
            if(keyType != "List") {
                //getString, getInteger etc
                cur = cur["get"+keyType](p);
            } else {
                cur = cur["get"+keyType](p, cur.getListType(p));
            }
        }
        return cur;
    };
    this.toJsonString = function() { return this.nbt.toJsonString(); }
    this.toJsonObj = function() { return JSON.parse(this.toJsonString()); }
}

function nbtCopy(nbt, api) {
	return api.stringToNbt(nbt.toJsonString());
}

function nbtItem(nbt, w) {
	if(typeof(nbt) == 'string') { nbt = API.stringToNbt(nbt); }
	var item = w.createItemFromNbt(nbt);
	return item;
}

//Turn String[] with item nbts to IItemStack[]
function nbtItemArr(nbtArr, w) {
    var itemArr = [];
	for(var itemData in nbtArr as item){
        itemArr.push(nbtItem(item, w));
    }

    return itemArr;
}

function isNbtEqual(nbt, otherNbt) {
    return nbt.toJsonString() == otherNbt.toJsonString();
}
