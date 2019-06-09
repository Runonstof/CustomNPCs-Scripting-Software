function lengthdir_x(length, angle) {
	var ang = fixAngle(Math.abs(angle)+90)-180;
	var sang = fixAngle(Math.abs(angle))-180;

	var qang = Math.abs((Math.abs(ang)-90));
	//print("qang:"+qang.toString());
	return -((qang/90)*length)*sign(sang);
}
function lengthdir_z(length, angle) {
	var ang = fixAngle(Math.abs(angle)+180)-180;
	var sang = fixAngle(Math.abs(angle)+90)-180;

	var qang = Math.abs((Math.abs(ang)-90));
	//print("qang:"+qang.toString());
	return -(((qang/90)*length)*sign(sang));
}


function sign(num=0) {
	if(num > 0) { return 1; }
	if(num < 0) { return -1; }
	return 0;
}

function fixAngle(angle) {
	return angle % 359;
}
