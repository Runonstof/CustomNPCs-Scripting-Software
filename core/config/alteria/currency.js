


//Configure your own currency units
//Units of currency, with own names, with lowest unit being 1
var _COINTABLE = {//MUST BE FROM LOW TO HIGH
	'c': 1,
	'g': 100,
	'k': 100000,
	'm': 100000000,
	'b': 100000000000,
}; //With this setup, the syntax for 223503 would be 2k235g3c (case-INSensitive)

//Extra currencies that have no items themselves
var VIRTUAL_CURRENCIES = [
	{
		"name": "amoney",
		"displayName": "Arcade Tokens",
		"default": 0,
		"prefix": "&b:money:A",
		"suffix": "",
	},
	{
		"name": "vmoney",
		"displayName": "Vote Tokens",
		"default": 0,
		"prefix": "&d:money:V",
		"suffix": "",
	},
];


//Currency settings
var _COINITEMNAME = '&2&lMoney&r';//Custom name of currency
var _COINITEM_PREFIX = '&e'; //Prefix showing before money value lore (used for color coding)

//Your money items, and their values in money syntax
//"value": "item_id",
var LOWVALUE_ID = "minecraft:gold_nugget";
var MIDVALUE_ID = "minecraft:gold_nugget";
var HIGHVALUE_ID = "minecraft:gold_nugget";


//Coin Items for the physical currency
var _COINITEMS = { //MUST BE FROM LOW TO HIGH
	'1c': LOWVALUE_ID,
	'5c': LOWVALUE_ID,
	'10c': LOWVALUE_ID,
	'20c': LOWVALUE_ID,
	'50c': LOWVALUE_ID,
	'1g': LOWVALUE_ID,
	'2g': LOWVALUE_ID,
	'5g': MIDVALUE_ID,
	'10g': MIDVALUE_ID,
	'20g': MIDVALUE_ID,
	'50g': MIDVALUE_ID,
	'100g': MIDVALUE_ID,
	'200g': MIDVALUE_ID,
	'500g': MIDVALUE_ID,
	'1k': HIGHVALUE_ID,
	'10k': HIGHVALUE_ID,
	'100k': HIGHVALUE_ID,
	'1m': HIGHVALUE_ID,
	'10m': HIGHVALUE_ID,
	'100m': HIGHVALUE_ID,
	'1b': HIGHVALUE_ID,
};
