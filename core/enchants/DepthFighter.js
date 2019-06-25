registerCSTEnchant("cst:depth_fighter", "Depth Fighter", 10, function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var xpChance = Math.min(5+4*(lvl-1), 100);
            var xpPerc = Math.min(25+5*(lvl-1), 100);
            var num = Math.round(Math.random()*100);
            if(num <= xpChance) {
                var giveXP = Math.round((e.damage)/100*xpPerc);
                executeCommand(e.player, "/playsound minecraft:entity.experience_orb.pickup ambient "+e.player.getName())
                executeCommand(e.player, "/summon xp_orb {X} {Y} {Z} {Value:{XP}}".fill({
                    "X": e.player.getX(),
                    "Y": e.player.getY()+1,
                    "Z": e.player.getZ(),
                    "XP": giveXP
                }));
            }
        break;
    }
});
