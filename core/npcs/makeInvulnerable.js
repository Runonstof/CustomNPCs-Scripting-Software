@block init_event
	(function(e){
		e.npc.getAi().setAttackInvisible(true);
		var stats = e.npc.getStats();
		stats.setImmune(0, true);
		stats.setImmune(1, false);
		stats.setImmune(2, false);
		stats.setImmune(3, true);
		stats.setImmune(4, true);
		stats.setImmune(5, true);
	})(e);
@endblock