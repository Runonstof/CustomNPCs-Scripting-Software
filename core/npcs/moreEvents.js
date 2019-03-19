var newDayInit = false;
@block tick_event
	(function(e){
		var w = e.npc.world;
		if(getDayTime(w.getTime()) < 100 && newDayInit == false) {
			if(typeof(newDay) != typeof(undefined)) {
				newDay(e);
			}
			newDayInit = true;
		}
		if(getDayTime(w.getTime()) >= 100 && newDayInit == true) {
			newDayInit = false;
		}
	})(e);
@endblock