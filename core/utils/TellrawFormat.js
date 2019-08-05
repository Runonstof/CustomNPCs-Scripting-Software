import core\utils\StringFormat.js;

function strf(str, toRaw=true, allowed=null) {
	return strrawformat(str, toRaw, allowed);
}
var CHAT_CMD_RGX = /{[\s]*(?:([\w]+)[\s]*\:[\s]*([\w\W\/]+?)|\*)(?:[\s]*\|[\s]*([\w]+)[\s]*\:[\s]*([\w\W\/]+?[\s]*))?}/;
var CHAT_CMD_RGX_G = /{[\s]*(?:([\w]+)[\s]*\:[\s]*([\w\W\/]+?)|\*)(?:[\s]*\|[\s]*([\w]+)[\s]*\:[\s]*([\w\W\/]+?[\s]*))?}/g;


function strrawformat(str, toRaw=false, allowed) {
	var rf = [];
	var txt = '';
	var ri = -1;
	var isCode = false;
	var txtColor = 'white';
	var isItalic = false;
	var isBold = false;
	var isStrike = false;
	var isUnderlined = false;
	var isObf = false;
	str = str+'&r ';

	for(var i = 0; i < str.length; i++) {
		var c = str.substr(i, 1);
		if(c == '&' || i == str.length-1) {
			//Check if new section has to be made
			if(txt.length > 0) {
				ri++;
				var cmds = [];

				rf.push([txt, txtColor, isItalic, isBold, isUnderlined, isStrike, isObf]);
				isItalic = false;
				isBold = false;
				isUnderlined = false;
				isStrike = false;
				isObf = false;
				txtColor = 'white';
				txt = '';
			}
			isCode = true;
			continue;
		} else {
			if(!isCode) {
				txt += c.toString();
			} else {
				//Check Colors
				if(typeof(_RAWCOLORS[c]) != typeof(undefined)) {
					txtColor = _RAWCOLORS[c];
				}
				//Check Markup
				switch(c.toString()) {
					case 'o': {
						isItalic = true;
						break;
					}
					case 'l': {
						isBold = true;
						break;
					}
					case 'n': {
						isUnderlined = true;
						break;
					}
					case 'm': {
						isStrike = true;
						break;
					}
					case 'k': {
						isObf = true;
						break;
					}
					case 'r': {
						isItalic = false;
						isBold = false;
						isUnderlined = false;
						isStrike = false;
						isObf = false;
						txtColor = 'white';
						break;
					}
				}
				isCode = false;
			}
		}
	}

	return (!toRaw ? rf : rawformat(rf, true));
}

function rawformat(str_pieces, fullraw=true, allowed=null) {
	if(allowed == null) {
		allowed = Object.keys(_RAWCOLORS).concat(Object.keys(_RAWEFFECTS)).concat(['x', 'y']);

	}
	var txt = '';
	if(fullraw) { txt+='[""'; }

	for(var i in str_pieces) {
		var p = str_pieces[i];
		var ntext = p[0].replace(/\"/g, '\\"');
		var nm =  ntext.match(CHAT_CMD_RGX) || [];
		if(nm.length > 0) {
			p[7] = nm[1];
			p[8] = nm[2];
			p[9] = nm[3];
			p[10] = nm[4];
			ntext = ntext.replace(nm[0], '');
		}
		var pc = '{"text":"'+ntext+'"';
		if(p[1]) {
			if(allowed.indexOf(getColorId(p[1])) == -1) {
				p[1] = 'white';
			}

			pc+=',"color":"'+p[1].toString()+'"';

		}
		if(p[2]) {
			if(allowed.indexOf('o') > -1) {
				pc+=',"italic":true';
			}
		}
		if(p[3]) {
			if(allowed.indexOf('l') > -1) {
				pc+=',"bold":true';
			}
		}
		if(p[4]) {
			if(allowed.indexOf('n') > -1) {
				pc+=',"underlined":true';
			}
		}
		if(p[5]) {
			if(allowed.indexOf('m') > -1) {
				pc+=',"strikethrough":true';
			}
		}
		if(p[6]) {
			if(allowed.indexOf('k') > -1) {
				pc+=',"obfuscated":true';
			}
		}

		if(p[7] && p[8]) { pc+=',"clickEvent":{"action":"'+p[7]+'","value":"'+p[8]+'"}'; }
		if(p[9] && p[10]) { pc+=',"hoverEvent":{"action":"'+p[9]+'","value":"'+ccs((p[10]||"").replace(/\$/g, '\u00A7'),allowed)+'"}'; }
		pc += '}';


		txt+=( fullraw ? ',' : '' )+pc.toString();
	}

	if(fullraw) {
		txt += ']';
	}

	return txt;
}


function progressBar(value, max, length, progChar=null, fillColor="&a", leftColor="&c"){
	var skillBar = '&r&l[&r';
	var progress = Math.floor((value/max)*length);
	var proc = Math.round(value/max*100);
	for(var i = 0; i < length; i++) {
		if(i < progress) skillBar += fillColor+(progChar||"|");
		if(i >= progress) skillBar += leftColor+(progChar||"|");
	}
	return skillBar += "&r&l]";
}
