var API = Java.type('noppes.npcs.api.NpcAPI').Instance();
function playerEventItemCraftedEvent(event) {
	
    var playerMP = Java.type('net.minecraft.entity.player.EntityPlayerMP')
	var cnpcsPlayer = API.getIEntity(event.player)
	API.getIWorld(0).broadcast('lel');
    if(event.player instanceof playerMP) {
    var cnpcsItem = API.getIItemStack(event.crafting)
    var cnpcsContainer = API.getIContainer(event.craftMatrix) /*this might not go well*/
    API.getIWorld(0).broadcast(cnpcsContainer)
    API.getIWorld(0).broadcast(cnpcsItem.getDisplayName())
    API.getIWorld(0).broadcast(event.player)
    API.getIWorld(0).broadcast(cnpcsPlayer.getDisplayName() + ' just crafted a ' + cnpcsItem.getDisplayName())
		
		if(typeof crafted === 'function') {
			crafted({
				'player': cnpcsPlayer,
				'item': cnpcsItem,
				'container': cnpcsContainer
			});
		}
	}
}


function anvilUpdateEvent(e) {
    e.setCanceled(true);
    e.setOutput(null);
    API.getIWorld(0).broadcast('12222');
}


function anvilRepairEvent() {
    API.getIWorld(0).broadcast('00004');
}