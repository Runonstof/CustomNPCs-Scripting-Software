var _TIMERS = [];
function runDelay(timerObj, time, func) {
	//Generate a timer id that doesn't exists
	//To know what id does not exists, we need to get all timers
	var timerIds = [];
	for(var i in _TIMERS) {
		timerIds.push(_TIMERS[i].id);
	}

	var timerId;
	do {//Gen a new timer ID
		timerId = Math.round(Math.random()*10000);
	}
	while(timerIds.indexOf(timerId) > -1); //Do this until the generated id is unique

	//Add newly created timers to array
	_TIMERS.push({
		"id": timerId,
		"func": func,
	});

	if(!timerObj.has(timerId)) {
		timerObj.start(timerId, time, false);
	}
}

@block timer_event;
	var newTimers = [];

	//Loop all timers

	for(var i in _TIMERS) {
		//If timer id is id of event
		if(e.id == _TIMERS[i].id) {
			_TIMERS[i].func(e, _TIMERS[i].data);
		} else {
			newTimers.push(_TIMERS[i]);
		}
	}

	_TIMERS = newTimers;

@endblock;