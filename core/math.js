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

function posdir(pos, dir=0, pitch=0, len=1, flying=false) {
	var x = pos.getX();
	var y = pos.getY();
	var z = pos.getZ();
	var xdir = getQuartRotation(dir);
	var zdir = getQuartRotation(dir-90);
	x += Math.round(len*(Math.abs(xdir)/90)*sign(xdir));
	z += Math.round(len*(Math.abs(zdir)/90)*sign(zdir));
	if(flying) {
		y += (len)*(Math.abs(pitch)/90)*-sign(pitch);
	}
	return {x:x,y:y,z:z};
}

function lengthpitch_y(pitch, length) {
	return Math.round(pitch/-90)*length;
}

function getQuartRotation(dir) {
	dir = getHalfRotation(dir);
	
	if(Math.abs(dir) > 90) {
		dir = (180-Math.abs(dir))*sign(dir);
	}

	return dir;
}

function getHalfRotation(angle) {
	angle = fixAngle(angle);
	if(angle <= 180) { return angle; } else { return -(180-(angle-180)); }
}
