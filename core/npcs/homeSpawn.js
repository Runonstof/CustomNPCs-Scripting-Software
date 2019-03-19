@block init_event
	(function(e){
		var pos = e.npc.getPos();
		e.npc.setHome(pos.getX(), pos.getY()-1, pos.getZ());
		e.npc.getAi().setReturnsHome(false);
	})(e);
@endblock
