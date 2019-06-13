//Compare 2 IItemStacks
function isItemEqual(stack, other, ignoreNbt=false){
	if (!other || other.isEmpty()) {
		return false;
	}

	var stackNbt = stack.getItemNbt();
	stackNbt.remove('Count');
	var otherNbt = other.getItemNbt();
	otherNbt.remove('Count');

	if(ignoreNbt) {
		if(stackNbt.getString("id") == otherNbt.getString("id")) {
			return true;
		}
	} else {
		if(isNbtEqual(stackNbt, otherNbt)) {
			return true;
		}
	}

	return false;
}
