@block npc_role_event
	if(e.npc.getRole().getType() == RoleType_TRADER) {
		if(e.sold == null) {
			if(typeof tradeFailed === 'function') {
				tradeFailed(e);
			}
		} else {
			if(typeof trade === 'function') {
				trade(e);
			}
		}
	}
@endblock