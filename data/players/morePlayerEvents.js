function tick(e) {
    if(e.player.isSneaking()) {
        if(typeof sneak === 'function') {
            sneak(e);
        }
    }

    if(e.player.world.isRaining()) {
        if(typeof raining === 'function') {
            raining(e);
        }
    }

    if(e.player.world.isDay()) {
        if(typeof day === 'function') {
            day(e);
        }
    } else {
        if(typeof night === 'function') {
            night(extendEvent(e, {
                'moonphase': getMoonPhase(e.player.world),
            }, ['player']));
        }
    }

    
}

function interact(e) {
    (function(e){
		//Create a 'build'-event for player scripts
		var USABLE_BLOCKS = [
			"minecraft:crafting_table",
		];

		if(e.type == 2) {
			var place_block = e.player.getMainhandItem();
			if( (place_block.isEmpty() ? true : !place_block.isBlock()) ) { //If placeblock is null or not a block at all
				place_block = e.player.getOffhandItem(); //Try the offhand item
			}
			if( (place_block.isEmpty() ? false : place_block.isBlock()) ) { //Is place_block not null and is a block?
				//Build event can be executed, check if it exists though
				//e.player.world.broadcast(e.target.getName());
				if(
					(
						e.player.isSneaking()
						||
						(!e.target.isContainer() && USABLE_BLOCKS.indexOf(e.target.getName()) == -1)
					)
				) { //Trying to build
					if(typeof build === 'function') {
						build(e, place_block);
					}
                } else { //Trying to interact
                    if(typeof blockinteract === 'function') {
                        blockinteract(e);
                    }
				}
			} else {
				if(typeof blockinteract === 'function') {
					blockinteract(e);
				}
			}
		}
	})(e);
}

function extendEvent(event, obj, attr=[]) {
    var eventobj = {
        '_e': event,
        'API': event.API,
        'setCanceled': function(cancel) {
            return this._e.setCanceled(cancel);
        },
        'isCancelable': function() {
            return this._e.isCancelable();
        }
    };

    for(var i in attr) {
        eventobj[attr[i]] = event[attr[i]];
    }

    for(var i in obj) {
        eventobj[i] = obj[i];
    }

    return eventobj;
}

function getMoonPhase(world) {
    var day = Math.floor(world.getTime()/24000)
    if (day < 8) {
        return day;
    }
    return day % 8;
}
