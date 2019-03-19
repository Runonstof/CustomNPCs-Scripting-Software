import core\npc\moreEvents.js;

@block tick_event
	(function(e){
		var d = e.npc.getStoreddata();
		
		var allCreative = (function(e){
			var pl = e.npc.world.getAllPlayers();
			for(ayer in pl) {
				if(pl[ayer].getGamemode() != 1) { return false; }
			}
			return true;
		})(e);
		
		if(!isLoaded(e.npc) && !allCreative) {
			if(typeof(load) != typeof(undefined)) {
				load(e);
			}
			d.put('is_loaded', 1);
		}
	})(e);
	
	yield tick_event;
@endblock

function isLoaded(npc) {
	var d = npc.getStoreddata();
	var loadstate =  d.get('is_loaded');
	return (loadstate == 1);
}

function unload(e, doesReset) {
	e.npc.getStoreddata().put('is_loaded', 0);
	if(typeof(doesReset) == 'undefined' || doesReset == true) {
		e.npc.reset();
	}
	
}