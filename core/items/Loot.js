import "core/mods/noppes/INbt.js";
/**
 * Checks Items NBT and handle loot gen
 * @param {IItemStack} stack ItemStack to check and handle loot
 * 
 * @returns {Boolean} If it was a loot item and loot gen was successful
 */
function checkLootItem(stack) {
    var nbt = stack.getNbt();

    if(nbt.has("LootGen")) {
        
    }

    return false;
}