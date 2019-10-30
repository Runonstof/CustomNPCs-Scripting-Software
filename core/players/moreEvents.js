import "core/datahandlers/Player.js";

@block interact_event
(function(e){
	//Create a 'build'-event for player scripts
	var USABLE_BLOCKS = [
		"minecraft:crafting_table",
	];

	if(e.type == 2) {
		var place_block = e.player.getMainhandItem();
		if( (place_block == null ? true : !place_block.isBlock()) ) { //If placeblock is null or not a block at all
			place_block = e.player.getOffhandItem(); //Try the offhand item
		}
		if( (place_block == null ? false : place_block.isBlock()) ) { //Is place_block not null and is a block?
			//Build event can be executed, check if it exists though
			//e.player.world.broadcast(e.target.getName());
			if(
				(
					e.player.isSneaking()
					||
					(!e.target.isContainer() && USABLE_BLOCKS.indexOf(e.target.getName()) == -1)
				)
			) { //Trying to build
				if(typeof(build) != typeof(undefined)) {
					build(e, place_block);
				}
			} else { //Trying to interact
				blockinteract(e);
			}
		} else {
			if(typeof(blockinteract) != typeof(undefined)) {
				blockinteract(e);
			}
		}
	}
})(e);
@endblock


@block init_event
	(function(e){
		var w = e.player.world;
		var wdata = w.storeddata;
		var plo = new Player(e.player.getName());
		if(!plo.exists(wdata)) {
			if(typeof firstLogin === 'function') {
				firstLogin(e)
			}
			plo.save(wdata);
		}
	})(e);
@endblock

