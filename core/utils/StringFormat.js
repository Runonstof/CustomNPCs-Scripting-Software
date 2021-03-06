import "core/JavaScript/Array.js";
import "core/utils/ServerConfigHandler.js";
var _RAWCOLORS = {
    '0': 'black',
    '1': 'dark_blue',
    '2': 'dark_green',
    '3': 'dark_aqua',
    '4': 'dark_red',
    '5': 'dark_purple',
    '6': 'gold',
    '7': 'gray',
    '8': 'dark_gray',
    '9': 'blue',
    'a': 'green',
    'b': 'aqua',
    'c': 'red',
    'd': 'light_purple',
    'e': 'yellow',
    'f': 'white',
};

var _RAWEFFECTS = {
    'o': 'italic',
    'l': 'bold',
    'k': 'magic',
    'm': 'strike',
    'n': 'underline',
    'r': 'reset'
}

var _RAWCODES = Object.keys(_RAWCOLORS).concat(Object.keys(_RAWEFFECTS));

function getColorId(name) {
    for (var i in _RAWCOLORS) {
        if (name == _RAWCOLORS[i]) {
            return i;
        }
    }
    for (var i in _RAWEFFECTS as re) {
        if (name == re) {
            return i;
        }
    }
    return 'r';
}

function getColorName(id) {
    for (var i in _RAWCOLORS as rc) {
        if (id == i) {
            return rc;
        }
    }
    for (var i in _RAWEFFECTS as re) {
        if (id == i) {
            return re;
        }
    }
    return 'white';
}

function stripColors(str) {
    for (var i in _RAWCODES as rawcode) {
        str = str.replaceAll('&' + rawcode, '');
    }

    return str;
}

function slugify(text) {
    text = stripColors(text);
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/__+/g, '_') // Replace multiple - with single -
        .replace(/^_+/, '') // Trim - from start of text
        .replace(/_+$/, ''); // Trim - from end of text
}

function ccs(str, af = null) {
    return colorCodeString(str, af);
}

function colorCodeString(str, allowed_formats = null) {
    if (allowed_formats == null) {
        allowed_formats = Object.keys(_RAWCOLORS).concat(Object.keys(_RAWEFFECTS));
    }
    allowed_formats = removeFromArray(allowed_formats, ['x', 'y']);
    return str.replace(new RegExp("&([" + allowed_formats.join("") + "])", 'g'), '\u00A7$1').replace(/&\\/g, '&');
}

function escCcs(str, esc_formats = null) {
    if (esc_formats == null) {
        esc_formats = _RAWCODES;
    }

    return str.replace(new RegExp('&([' + esc_formats.join("") + '])', 'g'), '');
}

function parseEmotes(str, allwd = [], replaceOld = true) {
    if (replaceOld) {
        str = str.replaceAll(Object.values(CHAT_EMOTES), '');
    }
    for (var ce in CHAT_EMOTES) {
        var chatemote = CHAT_EMOTES[ce];
        if (allwd.length == 0 || allwd.indexOf(ce) > -1) {
            str = str.replaceAll(':' + ce + ':', chatemote);
            str = str.replaceAll(':/' + ce + '/:', ':' + ce + ':');
        }
    }
    return str;
}