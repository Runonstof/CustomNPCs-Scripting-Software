import core\mods\minecraft\Java.js;

function getEnchIdByName(name) {
    var enchants = REGISTRY.ENCHANTMENTS.getValues();
    for(var r in enchants as ench) {
        if(name == REGISTRY.ENCHANTMENTS.getKey(ench)) {
            return parseInt(REGISTRY.ENCHANTMENTS.getID(ench));
        }
    }

    return null;
}
