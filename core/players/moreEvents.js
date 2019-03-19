@block interact_event
	(function(e){
		//Create a 'build'-event for player scripts
		if(e.type == 2) {
			var place_block = e.player.getMainhandItem();
			if( (place_block == null ? true : !place_block.isBlock()) ) { //If placeblock is null or not a block at all
				place_block = e.player.getOffhandItem(); //Try the offhand item
			}
			if( !(place_block == null ? true : !place_block.isBlock()) ) { //Is place_block not null and is a block?
				//Build event can be executed, check if it exists though
				if(typeof(build) != typeof(undefined)) {
					build(e, place_block);
				}
			}
		}
	})(e);
@endblock