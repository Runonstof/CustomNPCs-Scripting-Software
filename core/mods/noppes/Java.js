var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
var INbt = Java.type('noppes.npcs.api.INbt');
var LogManager = Java.type('org.apache.logging.log4j.LogManager');
var Logger = LogManager.getLogger(SERVER_NAME);

var NbtTypes = {
    "Byte": 1,
    "Short": 2,
    "Integer": 3,
    "Long": 4,
    "Float": 5,
    "Double": 6,
    "ByteArray": 7,
    "String": 8,
    "List": 9,
    "Compound": 10,
    "IntegerArray": 11,
};

function getNbtType(num) {
    for(var n in NbtTypes as nbtType) {
        if(nbtType === num) { return n; }
    }
    return null;
}
