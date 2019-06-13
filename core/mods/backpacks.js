var HAS_MOD_BACKPACKS = hasMCMod("backpacks16840");
var UItem = (HAS_MOD_BACKPACKS ? Java.type("brad16840.common.UniqueItem") : null);
var UItemInv = (HAS_MOD_BACKPACKS ? Java.type('brad16840.common.UniqueItemInventory') : null);

//Used to get backpack IInventory (to get/set items array you can use `getBackpackInv(pl, items).items` )
function getBackpackInv(pl, item){
	//If backpack item wasn't been opened yet
    if(HAS_MOD_BACKPACKS) {
        if(UItem.hasIdentifier(item.getMCItemStack()))
            return API.getIContainer(UItemInv.getInventory(pl.getMCEntity(), UItem.getIdentifier(item.getMCItemStack())));
    }
	return;
}
