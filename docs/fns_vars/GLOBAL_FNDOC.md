# Global Functions

Location: `core\functions.js`    
Format: `Returntype FunctionName(Argu, ments); //Info`    
```js

Object objMerge(Object obj1, Object obj2); //Merges obj1 and obj2, if has same keys, then obj2 overrides
boolean playerIsOnline(IWorld world, String player);

int getDropChance(INbt customNpcEntityNbt, int slot); //Get the % drop-chance of npc drop-item

//Player inv workaround until IContainer does not give NullPointerExceptions anymore
IItemStack[] getPlayerInvFromNbt(INbt playerEntityNbt, IWorld world); //Returns an array of current inventory items, using INbt.
int getInvItemCount(INbt playerEntityNbt, IItemStack item, IWorld world, boolean ignoreNbt=false); //Returns  how many a player of an item has

int occurrences(String string, String subString, boolean allowOverlapping=false); //Return how many times subString occurs in string
int arrayOccurs(String string, String[] subStrings, boolean allowOverlapping=false); //Same as occurrences, but check whole array of subStrings

int sign(int number); //Returns -1 if number < 0, returns 0 if number == 0, returns 1 if number > 0. Used for maths
Array removeFromArray(Array arr, String[]* vals); //Returns an arr with vals removed from items

var _RAWCOLORS = {
	'0': 'black',
	'1': 'dark_blue',
	...
};

var _RAWEFFECTS = {
	'o': 'italic',
	'l': 'bold',
	...
}
var _RAWCODES = ['0', '1', 'o', 'l', ...]; //Array of _RAWCOLORS and _RAWEFFECTS keys
String getColorId(String color); //Returns 'a' for green, 'l' for 'bold' etc
String getColorName(String colorId); //Opposite of getColorId
String strrawformat(String str, boolean toRaw=true, Array allowedColors=null); //Parses colorcode (&) and click-hoverEvent to raw JSON for /tellraw. Only parses allowedColors
String strf(...); //Short for strrawformat
String colorCodeString(String str, Array allowedColors=null); //Parses colorcode (&) for in NBT Strings, etc.
String ccs(...); //Short for colorCodeString
String escCss(String str, Array escapeColors=null); //Filters color from ccs-string
float random_range(min, max); //Can have decimal, like 3.456
int rrandom_range(min, max); //Returns int (no decimal)

Mixed||Array pick(Array items, int amount=1); //Picks amount items from items, if amount>1 returns Array of items
Mixed||Array pickchance(Array items, int amount=1); //Picks from array with weighted-chance

print(pick([ //3 Chances
	'a', //1/3 chance
	'b', //1/3 chance
	'c', //1/3 chance
]));

print(pickchance([ //9 Chances (5+3+1)
	['a', 5], //5/9 chance
	['b', 3], //3/9 chance
	['c', 1], //1/9 chance
]));


```

Location: `core\JavaScript\*.js`    
```js
//Date.js
var msTable = [ //Time units in ms (used to check with Date.getTime()
	'y': 31556926000,
	'mon': 2629743830,
	'w': 604800000,
	...
];


Date.prototype.addTime(int addTime); //Adds time to this Date-object
Date.prototype.hasPassed(Date passDate); //Check if this has passed passDate
int getStringTime(String timeString); //converts 1y2mon5w3d-format to number
String getTimeString(int time); //converts number to 1y2mon5w3d-format

//Function.js
String[] getFnArgs(func); //Return argument names from function as array

//String.js
String.prototype.rangeUpper(min, max); //Capitalize all letters in a string from min to max
String.prototype.rangeLower(min, max); //Opposite of rangeUpper
String.prototype.cInt(); //Returns string as int, but returns null instead of NaN(Not A Number) to prevent errors
```

Location: `core\players\commands\*.js`    
```js
//utilCommands.js
IItemStack[] genMoney(IWorld w, int amount); //Returns money items for amount
int getCoinAmount(String str); //Converts 2M34K150G10C-format to number
String getAmountCoin(int amount); //Converts amount to 2M34K150G10C-format

var _COINTABLE = { //Money units (now: C, G, K and M, but we can add more later :) )
	'c': 1,
	'g': 100,
	'k': 100000,
	...
};

var _COINITEMS = { //Money items; value:Item_id
	'1c': 'variedcommodities:coin_iron',
	'5c': 'variedcommodities:coin_iron',
	'10c': 'variedcommodities:coin_iron',
	...
};

```