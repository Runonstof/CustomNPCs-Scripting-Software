import core\functions.js;
import core\players\executeCommand.js;
import core\players\tell.js;
import core\players\xcommands.js;
import core\players\commands\*.js;
import mods\compatskills.js;

var staff_items = [
	'variedcommodities:wooden_staff',
	'variedcommodities:stone_staff',
	'variedcommodities:bronze_staff',
	'variedcommodities:golden_staff',
	'variedcommodities:iron_staff',
	'variedcommodities:diamond_staff',
];

function init(e) {
	e.item.setTexture(1, staff_items[rrandom_range(0, staff_items.length-1)]);
	
	e.item.setItemDamage(1);
}

function interact(e) {
	
}

function tick(e) {
	e.item.setTexture(1, staff_items[rrandom_range(0, staff_items.length-1)]);
}