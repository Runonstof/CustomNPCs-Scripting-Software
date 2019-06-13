function random_ranges(min, max, amount) {
	var a = 0;
	for(var i = 0; i < amount; i++) { a += random_range(min, max); }
	return a;
}

function rrandom_ranges(min, max, amount) {
	var a = 0;
	for(var i = 0; i < amount; i++) { a += rrandom_range(min, max); }
	return a;
}

function pickchance(a, amount) {
	var aa = [];
	for(var e in a) {
		if(!isArray(a[e])) {
			aa[aa.length] = a[e];
		} else {
			for(var i = 0; i < a[e][1]; i++) {
				aa[aa.length] = a[e][0];
			}
		}
	}

	return pick(aa, amount);
}

function rrandom_range(min, max) { return Math.round(random_range(min, max)); }

function random_range(_min, _max) {
	var min = Math.min(_min, _max);
	var max = Math.max(_min, _max);

	var diff = max - min;

	return (min + (Math.random() * diff));
}

function pickwhere(a, fn, amount) {
	return pick(array_filter(a, fn), amount);
}

function genName(name) {
	var p = [
    'Amazing',
    'Awesome',
    'Blithesome',
    'Excellent',
    'Fabulous',
    'Fantastic',
    'Favorable',
    'Gorgeous',
    'Incredible',
    'Outstanding',
    'Perfect',
    'Propitious',
    'Remarkable',
    'Rousing',
    'Spectacular',
    'Splendid',
    'Stellar',
    'Super',
    'Upbeat',
    'Unbelievable',
    'Wondrous',
	'Tempered',
	'Legendary',
	'Magical'
	];
	var s = [
		'Destruction',
		'Slaughter',
		'Starlight',
		'Heroism',
		'Bonebreaking',
		'The Fallen',
		'Silence',
		'Spellkeeping',
		'Massacre',
		'Sanity',
		'Insanity',
		'Remorse',
		'Fury'
	];

	return pick(p) + ' ' + name + ' of ' + pick(s);
}

function pick(a, amount=1) {
	var index = Math.floor(Math.random() * a.length);
	amount = Math.min(a.length, amount);
	if(amount == 1) {
		return a[index];
	} else {
		var picks = [];

		while(picks.length < amount) {
			index = Math.floor(Math.random() * a.length);
			if(picks.indexOf(a[index]) == -1) { picks.push(a[index]); }
		}

		return picks;
	}
}
