function lengthdir_x(length, angle) {
	return length * Number(Math.cos(toRadians(angle))).toFixed(2) * -1;
}

function lengthdir_z(length, angle) {
	return length * Number(Math.sin(toRadians(angle))).toFixed(2);
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

//Get angle between two points (2-dimensional)
function getPosAngle(x1, y1, x2, y2) {
	return Math.atan2(y2-y1, x2-x1) *(180/Math.PI);
}


function sign(num=0) {
	if(num > 0) { return 1; }
	if(num < 0) { return -1; }
	return 0;
}

function roundDec(num, dec=1) {
  	var mult = Math.pow(10, dec);

  	return Math.round(num*mult)/mult;
}

function fixAngle(angle) {
	return Number((Math.abs(angle) % 360) * sign(angle)).toFixed(2);
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
