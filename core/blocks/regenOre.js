var regenTimerId = 1;
var isRegen = false;
var data_vals = {
	'modelBlockId': 'minecraft:grass',
	'blockId': 'minecraft:coal_ore',
	'regenBlockId': 'minecraft:stone',
	'dropItems': '[]',
	'dropXp': '[]',
	'dropSkillXp': '[]',
	'minRegenTime': 100,
	'maxRegenTime': 200
};
var bli = clone(data_vals);

function reloadRegenData(data) {
	bli = data_get(data, data_vals);
}

function updateModel(block) {
	if(!isRegen && block.getModel() != bli.blockId) {
		block.setModel(bli.blockId);
	}
	if(isRegen && block.getModel() != bli.regenBlockId) {
		block.setModel(bli.regenBlockId);
	}
}

@block init_event
	(function(e){
		var d = e.block.getStoreddata();
		
		data_register(d, data_vals);
		reloadRegenData(d);
		isRegen = false;
		updateModel(e.block);
	})(e);
@endblock

@block harvested_event
	if(e.player.getGamemode() != 1 && !e.player.isSneaking()) {
		if(!isRegen) {
			isRegen = true;
			e.block.getTimers().forceStart(regenTimerId, rrandom_range(bli.minRegenTime, bli.maxRegenTime), false);
		}
		e.setCanceled(true);
	}
@endblock

@block tick_event
	(function(e){
		var d = e.block.getStoreddata();
		updateModel(e.block);
	})(e);
@endblock

@block timer_event
	(function(e){
		if(e.id == regenTimerId) {
			isRegen = false;
			updateModel(e.block);
		}
	})(e);
@endblock