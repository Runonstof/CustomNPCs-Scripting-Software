import "core\deobf\*.js";
var MCItem = Java.type("net.minecraft.item.Item");
var MCItemArmor = Java.type("net.minecraft.item.ItemArmor");
var MCItemBow = Java.type("net.minecraft.item.ItemBow");
var MCItemSword = Java.type("net.minecraft.item.ItemSword");
var MCItemTool = Java.type("net.minecraft.item.ItemTool");
var EntityEqSlot = Java.type("net.minecraft.inventory.EntityEquipmentSlot");
var REGISTRY = Java.type('net.minecraftforge.fml.common.registry.ForgeRegistries');


function getItemType(iitemstack, mcentity=null) {
    var mcitem = iitemstack.getMCItemStack()[MCP.ItemStack_getItem]();
    if(mcitem instanceof MCItemBow) {
        return "BOW";
    }
    if(mcitem instanceof MCItemSword) {
        return "SWORD";
    }
    if(mcitem instanceof MCItemTool) {

        return "TOOL";
    }
    if(mcitem instanceof MCItemArmor) {
        if(mcentity != null) {
            if(mcitem.isValidArmor(iitemstack.getMCItemStack(), EntityEqSlot.CHEST, mcentity)) {
                return "ARMOR_CHEST";
            }
        }
        return "ARMOR";
    }
    return "NONE";
}
