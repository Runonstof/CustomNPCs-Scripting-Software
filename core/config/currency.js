
//Currency settings
var _COINITEMNAME = '&2&lMoney&r';//Custom name of currency
var _COINITEM_PREFIX = '&e'; //Prefix showing before money value lore (used for color coding)

//Configure your own currency units
//Units of currency, with own names, with lowest unit being 1
var _COINTABLE = {//MUST BE FROM LOW TO HIGH
	'c': 1,
	'g': 100,
	'k': 100000,
	'm': 100000000,
	'b': 100000000000,
}; //With this setup, the syntax for 223503 would be 2k235g3c (case-INSensitive)

//Your money items, and their values in money syntax
//"value": "item_id",
var _COINITEMS = { //MUST BE FROM LOW TO HIGH
	'1c': 'variedcommodities:coin_iron',
	'5c': 'variedcommodities:coin_iron',
	'10c': 'variedcommodities:coin_iron',
	'20c': 'variedcommodities:coin_iron',
	'50c': 'variedcommodities:coin_iron',
	'1g': 'variedcommodities:coin_iron',
	'2g': 'variedcommodities:coin_iron',
	'5g': 'variedcommodities:money',
	'10g': 'variedcommodities:money',
	'20g': 'variedcommodities:money',
	'50g': 'variedcommodities:money',
	'100g': 'variedcommodities:money',
	'200g': 'variedcommodities:money',
	'500g': 'variedcommodities:money',
	'1k': 'variedcommodities:plans',
	'10k': 'variedcommodities:plans',
	'100k': 'variedcommodities:plans',
	'1m': 'variedcommodities:plans',
	'10m': 'variedcommodities:plans',
	'100m': 'variedcommodities:plans',
	'1b': 'variedcommodities:plans',
};
