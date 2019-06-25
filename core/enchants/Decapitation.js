import core\mods\noppes\Java.js;

function getEntityMobHead(entity) {
    //Player
    if(entity.getType() == 1) {
        var head = API.getIWorld(0).createItem("minecraft:skull", 3, 1);
        head.getNbt().setString("SkullOwner", entity.getName());
        return head;
    }
    var vanillaSkulls = {
        "Skeleton": 0,
        "WitherSkeleton": 1,
        "Zombie": 2,
        "Creeper": 4,
    };
    var vk = Object.keys(vanillaSkulls);
    if(vk.indexOf(entity.getTypeName()) > -1) {
        var head = API.getIWorld(0).createItem("minecraft:skull", vanillaSkulls[entity.getTypeName()], 1);
        return head;
    }

    var mhfSkulls = {
        "Blaze": "Blaze",
        "CaveSpider": "CaveSpider",
        "Chicken": "Chicken",
        "Cow": "Cow",
        "Enderman": "Enderman",
        "Ghast": "Ghast",
        "VillagerGolem": "Golem",
        "LavaSlime": "LavaSlime",
        "MushroomCow": "MushroomCow",
        "Ocelot": "Ocelot",
        "Pig": "Pig",
        "PigZombie": "PigZombie",
        "Sheep": "Sheep",
        "Slime": "Slime",
        "Spider": "Spider",
        "Squid": "Squid",
        "Villager": "Villager",

    };
    if(Object.keys(mhfSkulls).indexOf(entity.getTypeName()) > -1) {
        var head = API.getIWorld(0).createItem("minecraft:skull", 3, 1);
        head.getNbt().setString("SkullOwner", "MHF_"+mhfSkulls[entity.getTypeName()]);
        return head;
    }

    return null;
}


registerCSTEnchant("cst:decapitation", "Decapitation", 5, function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var head = getEntityMobHead(e.target);
            if(head != null) {
                e.player.giveItem(head);
            }
        break;
    }
});
