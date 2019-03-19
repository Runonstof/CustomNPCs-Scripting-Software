import mods.compatskills.SkillCreator.createSkill;
import mods.compatskills.Skill;
import mods.compatskills.TraitCreator.createTrait;
import crafttweaker.data.IData;
//import mods.compatskills.Trait;
import crafttweaker.item.IItemStack;
import crafttweaker.item.IIngredient;
import crafttweaker.recipes.ICraftingRecipe;
import crafttweaker.enchantments.IEnchantment;
import crafttweaker.potions.IPotionEffect;
import crafttweaker.enchantments.IEnchantmentDefinition;
import mods.compatskills.Requirement.addRequirement;
import crafttweaker.event.PlayerAnvilRepairEvent;
import crafttweaker.events.IEventManager;
import mods.ItemStages.addItemStage;
/*
var potion_ids = {
	<potion:minecraft:glowing>: 24 as short,
	<potion:minecraft:instant_health>: 6 as short,
	<potion:dungeontactics:cryo_effect>: 0 as short,
	<potion:xreliquary:cure_potion>: 30 as short,
	<potion:minecraft:weakness>: 18 as short,
	<potion:minecraft:levitation>: 25 as short,
	<potion:minecraft:slowness>: 2 as short,
	<potion:minecraft:strength>: 5 as short,
	<potion:minecraft:mining_fatigue>: 4 as short,
	<potion:minecraft:health_boost>: 21 as short,
	<potion:minecraft:invisibility>: 14 as short,
	<potion:minecraft:saturation>: 23 as short,
	<potion:minecraft:regeneration>: 10 as short,
	<potion:minecraft:jump_boost>: 8 as short,
	<potion:minecraft:blindness>: 15 as short,
	<potion:minecraft:wither>: 20 as short,
	<potion:totemexpansion:spelunking>: 33 as short,
	<potion:minecraft:speed>: 1 as short,
	<potion:minecraft:luck>: 26 as short,
	<potion:toroquest:royalty>: 31 as short,
	<potion:minecraft:unluck>: 27 as short,
	<potion:minecraft:instant_damage>: 7 as short,
	<potion:xreliquary:pacification_potion>: 29 as short,
	<potion:twilightforest:frosted>: 32 as short,
	<potion:minecraft:resistance>: 11 as short,
	<potion:minecraft:hunger>: 17 as short,
	<potion:minecraft:fire_resistance>: 12 as short,
	<potion:minecraft:poison>: 19 as short,
	<potion:minecraft:absorption>: 22 as short,
	<potion:minecraft:night_vision>: 16 as short,
	<potion:minecraft:nausea>: 9 as short,
	<potion:minecraft:haste>: 3 as short,
	<potion:minecraft:water_breathing>: 13 as short,
	<potion:xreliquary:flight_potion>: 28 as short
};*/

function toShort(count as int) as short {
 var newCount = 0 as short;
 for i in 0 .. count {
	newCount += 1 as short;
 }
 
 return newCount;
}


var enchants as IData[] = [
	{e: <enchantment:minecraft:protection> as Relation[IEnchantmentDefinition, enchant], m: 0, li: 6 } as IData,
	{e: <enchantment:minecraft:efficiency> as Relation[IEnchantmentDefinition, enchant], m: 15, li: 5 } as IData,
	{e: <enchantment:minecraft:fire_protection> as Relation[IEnchantmentDefinition, enchant], m: 15, li: 8 } as IData,
	{e: <enchantment:minecraft:feather_falling> as Relation[IEnchantmentDefinition, enchant], m: 25, li: 10 } as IData,
	{e: <enchantment:minecraft:blast_protection> as Relation[IEnchantmentDefinition, enchant], m: 10, li: 5 } as IData,
	{e: <enchantment:minecraft:projectile_protection> as Relation[IEnchantmentDefinition, enchant], m: 5, li: 5 } as IData,
	{e: <enchantment:minecraft:respiration> as Relation[IEnchantmentDefinition, enchant], m: 40, li: 8 } as IData,
	{e: <enchantment:minecraft:aqua_affinity> as Relation[IEnchantmentDefinition, enchant], m: 45, li: 5 } as IData,
	{e: <enchantment:minecraft:mending> as Relation[IEnchantmentDefinition, enchant], m: 75, li: 5 } as IData,
	{e: <enchantment:minecraft:thorns> as Relation[IEnchantmentDefinition, enchant], m: 30, li: 5 } as IData,
	{e: <enchantment:minecraft:unbreaking> as Relation[IEnchantmentDefinition, enchant], m: 15, li: 5 } as IData,
	{e: <enchantment:minecraft:depth_strider> as Relation[IEnchantmentDefinition, enchant], m: 60, li: 4 } as IData,
	{e: <enchantment:minecraft:frost_walker> as Relation[IEnchantmentDefinition, enchant], m: 80, li: 5 } as IData,
	{e: <enchantment:minecraft:silk_touch> as Relation[IEnchantmentDefinition, enchant], m: 99, li: 0 } as IData,
	{e: <enchantment:minecraft:sharpness> as Relation[IEnchantmentDefinition, enchant], m: 5, li: 9 } as IData,
	{e: <enchantment:minecraft:smite> as Relation[IEnchantmentDefinition, enchant], m: 0, li: 10 } as IData,
	{e: <enchantment:minecraft:bane_of_arthropods> as Relation[IEnchantmentDefinition, enchant], m: 2, li: 2 } as IData,
	{e: <enchantment:minecraft:knockback> as Relation[IEnchantmentDefinition, enchant], m: 5, li: 5 } as IData,
	{e: <enchantment:minecraft:fire_aspect> as Relation[IEnchantmentDefinition, enchant], m: 25, li: 10 } as IData,
	{e: <enchantment:minecraft:looting> as Relation[IEnchantmentDefinition, enchant], m: 20, li: 10 } as IData,
	{e: <enchantment:ffenchants:wither_aspect> as Relation[IEnchantmentDefinition, enchant], m: 30, li: 10 } as IData,
	{e: <enchantment:ffenchants:poison_aspect> as Relation[IEnchantmentDefinition, enchant], m: 35, li: 5 } as IData,
	{e: <enchantment:ffenchants:extinguish> as Relation[IEnchantmentDefinition, enchant], m: 25, li: 5 } as IData,
	{e: <enchantment:ffenchants:bloodlust> as Relation[IEnchantmentDefinition, enchant], m: 55, li: 5 } as IData,
	{e: <enchantment:ffenchants:vampiric> as Relation[IEnchantmentDefinition, enchant], m: 50, li: 10 } as IData,
	{e: <enchantment:ffenchants:cursed_body> as Relation[IEnchantmentDefinition, enchant], m: 55, li: 5 } as IData,
	{e: <enchantment:ffenchants:void_energy> as Relation[IEnchantmentDefinition, enchant], m: 60, li: 5 } as IData,
	{e: <enchantment:ffenchants:ascension> as Relation[IEnchantmentDefinition, enchant], m: 40, li: 10 } as IData,
	{e: <enchantment:ffenchants:gills> as Relation[IEnchantmentDefinition, enchant], m: 70, li: 0 } as IData,
	{e: <enchantment:ffenchants:leaping> as Relation[IEnchantmentDefinition, enchant], m: 35, li: 15 } as IData,
	{e: <enchantment:dungeontactics:smelting> as Relation[IEnchantmentDefinition, enchant], m: 40, li: 0 } as IData,
	{e: <enchantment:dungeontactics:berserking> as Relation[IEnchantmentDefenition, enchant], m: 30, li: 4 } as IData
];

for ee in 0 .. enchants.length {
	var en = enchants[ee];
	
	var eid = en.e as IData;
	var e = get_enchant(eid.asString()); //IEnchantmentDefinition
	var m = en.m; //Int MinimumReqLevel
	var li = en.li; //Int LevelIncrease
	var mnl = e.minLevel;
	var mxl = e.maxLevel+1;
	
	for i in mnl .. mxl {
	
		var cost = m;
		cost += (i - 1) * li;
		if(cost == 0) { cost += 1; }
		
		var enchant = e.makeEnchantment(i).makeTag();
		var map as IData = {
			StoredEnchantments: [
				{id: enchant.ench[0].id, lvl: enchant.ench[0].lvl}
			]
		};
	
		addItemStage("compatskills:enchanting|"~cost, <minecraft:enchanted_book>.withTag(map));
		
		if(e.canApply(<item:minecraft:diamond_sword>)) {
			addItemStage("compatskills:enchanting|"~cost, <minecraft:diamond_sword>.withTag(enchant));
		}
		
	}
}

//XP Book recipe
val book = <minecraft:book>;
val paper = <minecraft:paper>;
recipes.addShapeless("skill_book", book.withTag({display:{Name:"§cSkill Book§r"},ench:[]}), [book, paper], null, null);


//Trading Skill

val trading = createSkill("trading", "textures/blocks/glowstone.png");
trading.name = 'Trading';
trading.setRankIcon(0, 'ordinarycoins:textures/items/coinbronze.png');
trading.setRankIcon(2, 'ordinarycoins:textures/items/coinsilver.png');
trading.setRankIcon(4, 'ordinarycoins:textures/items/coingold.png');
trading.setRankIcon(6, 'minecraft:textures/items/coinemerald.png');
//Trading traits
val trading_rename_tag = createTrait("rename_tag", 2, 3, "compatskills:trading", 6, "compatskills:trading|5");
trading_rename_tag.setEnabled(true);
trading_rename_tag.changeIcon("minecraft:textures/items/name_tag.png");
trading_rename_tag.name = "Rename tag";
trading_rename_tag.description = "Can rename a name tag with colorcoding at a blacksmith in a village.";

val trading_more_deals = createTrait("more_deals", 1, 2, "compatskills:trading", 10, "compatskills:trading|50");
trading_more_deals.setEnabled(true);
trading_more_deals.changeIcon("villagermarket:textures/blocks/crate-villager.png");
trading_more_deals.name = "More Deals";
trading_more_deals.description = "-50% Market reset cooldown time at each merchant.";

//Woodcutting skill
val woodcutting = createSkill("woodcutting", "minecraft:textures/blocks/log_oak_top.png");
woodcutting.name = 'Woodcutting';
woodcutting.setRankIcon(0, 'minecraft:textures/items/wood_axe.png');
woodcutting.setRankIcon(2, 'aether_legacy:textures/items/tools/valkyrie_axe.png');
woodcutting.setRankIcon(4, 'twilightforest:textures/items/minotaur_axe.png');
woodcutting.setRankIcon(6, 'aether_legacy:textures/items/tools/zanite_axe.png');

//Achery Skill
val archery = createSkill("archery", "textures/blocks/planks_oak.png");
archery.name = 'Archery';
archery.setRankIcon(0, 'minecraft:textures/items/bow_standby.png');
archery.setRankIcon(2, 'twilightforest:textures/items/triplebow_standby.png');
archery.setRankIcon(4, 'twilightforest:textures/items/enderbow_standby.png');
archery.setRankIcon(6, 'aether_legacy:textures/items/weapons/phoenix_bow.png');

//Enchanting Skill
val enchanting = createSkill("enchanting", "textures/blocks/nether_brick.png");
enchanting.name = 'Enchanting';
enchanting.setRankIcon(0, 'villagenames:textures/items/endcitybook.png');
enchanting.setRankIcon(2, 'villagenames:textures/items/koentusvillagebook.png');
enchanting.setRankIcon(4, 'villagenames:textures/items/nibiruvillagebook.png');
enchanting.setRankIcon(6, 'villagenames:textures/items/templebook.png');

<skill:reskillable:defense>.name = 'Blocking';

//220 320 270 260

//Durabilities of tools
for item in [<extragems:sapphire_pickaxe>, <extragems:sapphire_sword>, <extragems:sapphire_axe>, <extragems:sapphire_shovel>, <extragems:sapphire_hoe>, <dungeontactics:sapphire_shield>] as IItemStack[] {
	item.maxDamage = 600;
}


for item in [<extragems:ruby_pickaxe>, <extragems:ruby_sword>, <extragems:ruby_axe>, <extragems:ruby_shovel>, <extragems:ruby_hoe>, <dungeontactics:ruby_shield>] as IItemStack[] {
	item.maxDamage = 720;
}


for item in [<extragems:topaz_pickaxe>, <extragems:topaz_sword>, <extragems:topaz_axe>, <extragems:topaz_shovel>, <extragems:topaz_hoe>, <dungeontactics:topaz_shield>] as IItemStack[] {
	item.maxDamage = 840;
}


for item in [<extragems:crystal_pickaxe>, <extragems:crystal_sword>, <extragems:crystal_axe>, <extragems:crystal_shovel>, <extragems:crystal_hoe>, <dungeontactics:crystal_shield>] as IItemStack[] {
	item.maxDamage = 1080;
}

for item in [<extragems:emerald_pickaxe>, <extragems:emerald_sword>, <extragems:emerald_axe>, <extragems:emerald_shovel>, <extragems:emerald_hoe>, <dungeontactics:emerald_shield>] as IItemStack[] {
	item.maxDamage = 1320;
}


/*
1561

383
528
495
429
*/




{%ReqItems = {
	"stone": {
		"lvl": 5,
		"items": [
			"<minecraft:stone_pickaxe:*>",
			"<minecraft:stone_sword:*>",
			"<minecraft:stone_axe:*>",
			"<minecraft:stone_hoe:*>",
			"<minecraft:stone_shovel:*>",
			"<dungeontactics:stone_shield:*>",
			"<minecraft:leather_helmet:*>",
			"<minecraft:leather_chestplate:*>",
			"<minecraft:leather_leggings:*>",
			"<minecraft:leather_boots:*>"
		]
	},
	"gold": {
		"lvl": 8,
		"items": [
			"<minecraft:golden_pickaxe:*>",
			"<minecraft:golden_sword:*>",
			"<minecraft:golden_axe:*>",
			"<minecraft:golden_hoe:*>",
			"<minecraft:golden_shovel:*>",
			"<dungeontactics:golden_shield:*>",
			"<minecraft:golden_helmet:*>",
			"<minecraft:golden_chestplate:*>",
			"<minecraft:golden_leggings:*>",
			"<minecraft:golden_boots:*>"
		]
	},
	"iron": {
		"lvl": 15,
		"items": [
			"<minecraft:iron_pickaxe:*>",
			"<minecraft:iron_sword:*>",
			"<minecraft:iron_axe:*>",
			"<minecraft:iron_hoe:*>",
			"<minecraft:iron_shovel:*>",
			"<dungeontactics:iron_shield:*>",
			"<minecraft:iron_helmet:*>",
			"<minecraft:iron_chestplate:*>",
			"<minecraft:iron_leggings:*>",
			"<minecraft:iron_boots:*>"
		]
	},
	"amethyst": {
		"lvl": 20,
		"items": [
			"<extragems:amethyst_pickaxe:*>",
			"<extragems:amethyst_sword:*>",
			"<extragems:amethyst_axe:*>",
			"<extragems:amethyst_hoe:*>",
			"<extragems:amethyst_shovel:*>",
			"<dungeontactics:amethyst_shield:*>",
			"<extragems:amethyst_helmet:*>",
			"<extragems:amethyst_chestplate:*>",
			"<extragems:amethyst_leggings:*>",
			"<extragems:amethyst_boots:*>"
		]
	},
	"sapphire": {
		"lvl": 25,
		"items": [
			"<extragems:sapphire_pickaxe:*>",
			"<extragems:sapphire_sword:*>",
			"<extragems:sapphire_axe:*>",
			"<extragems:sapphire_hoe:*>",
			"<extragems:sapphire_shovel:*>",
			"<dungeontactics:sapphire_shield:*>",
			"<extragems:sapphire_helmet:*>",
			"<extragems:sapphire_chestplate:*>",
			"<extragems:sapphire_leggings:*>",
			"<extragems:sapphire_boots:*>"
		]
	},
	"ruby": {
		"lvl": 35,
		"items": [
			"<extragems:ruby_pickaxe:*>",
			"<extragems:ruby_sword:*>",
			"<extragems:ruby_axe:*>",
			"<extragems:ruby_hoe:*>",
			"<extragems:ruby_shovel:*>",
			"<dungeontactics:ruby_shield:*>",
			"<extragems:ruby_helmet:*>",
			"<extragems:ruby_chestplate:*>",
			"<extragems:ruby_leggings:*>",
			"<extragems:ruby_boots:*>"
		]
	},
	"topaz": {
		"lvl": 45,
		"items": [
			"<extragems:topaz_pickaxe:*>",
			"<extragems:topaz_sword:*>",
			"<extragems:topaz_axe:*>",
			"<extragems:topaz_hoe:*>",
			"<extragems:topaz_shovel:*>",
			"<dungeontactics:topaz_shield:*>",
			"<extragems:topaz_helmet:*>",
			"<extragems:topaz_chestplate:*>",
			"<extragems:topaz_leggings:*>",
			"<extragems:topaz_boots:*>"
		]
	},
	"crystal": {
		"lvl": 65,
		"items": [
			"<extragems:crystal_pickaxe:*>",
			"<extragems:crystal_sword:*>",
			"<extragems:crystal_axe:*>",
			"<extragems:crystal_hoe:*>",
			"<extragems:crystal_shovel:*>",
			"<dungeontactics:crystal_shield:*>",
			"<extragems:crystal_helmet:*>",
			"<extragems:crystal_chestplate:*>",
			"<extragems:crystal_leggings:*>",
			"<extragems:crystal_boots:*>"
		]
	},
	"emerald": {
		"lvl": 85,
		"items": [
			"<extragems:emerald_pickaxe:*>",
			"<extragems:emerald_sword:*>",
			"<extragems:emerald_axe:*>",
			"<extragems:emerald_hoe:*>",
			"<extragems:emerald_shovel:*>",
			"<dungeontactics:emerald_shield:*>",
			"<extragems:emerald_helmet:*>",
			"<extragems:emerald_chestplate:*>",
			"<extragems:emerald_leggings:*>",
			"<extragems:emerald_boots:*>"
		]
	},
	"diamond": {
		"lvl": 90,
		"items": [
			"<minecraft:diamond_pickaxe:*>",
			"<minecraft:diamond_sword:*>",
			"<minecraft:diamond_axe:*>",
			"<minecraft:diamond_hoe:*>",
			"<minecraft:diamond_shovel:*>",
			"<dungeontactics:diamond_shield:*>",
			"<minecraft:diamond_helmet:*>",
			"<minecraft:diamond_chestplate:*>",
			"<minecraft:diamond_leggings:*>",
			"<minecraft:diamond_boots:*>"
		]
	}
}%}
{%ReqStats = [
	"reskillable:mining",
	"reskillable:attack",
	"compatskills:woodcutting",
	"reskillable:farming",
	"reskillable:farming",
	"reskillable:defense",
	"reskillable:attack",
	"reskillable:attack",
	"reskillable:attack",
	"reskillable:attack"
]%}


{%for Material in ReqItems as rloop%}

	{%for Item in Material.items as iloop%}
	//{{iloop.index}}
	//{{iloop.index1}}
		addRequirement({{Item}}, "{$$vars['ReqStats'][{{iloop.index1}}]$}|{{Material.lvl}}");
	{%endfor iloop%}
{%endfor rloop%}

var stagger = [
	"1|0"
] as string[];

var skills = [
	<skill:reskillable:attack>,
    <skill:reskillable:defense>,
    <skill:reskillable:farming>,
    <skill:reskillable:magic>,
    <skill:reskillable:mining>,
	<skill:compatskills:trading>,
	<skill:compatskills:archery>,
	<skill:compatskills:enchanting>,
	<skill:compatskills:woodcutting>
] as Skill[];

for skill in skills {
	skill.setEnabled(true);
	skill.setBaseLevelCost(99);
    skill.setLevelStaggering(stagger);
	skill.setCap(99);
}