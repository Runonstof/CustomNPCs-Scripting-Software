registerCSTEnchant(null, 10, "cst:life_steal", "Life Steal", function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var stealChance = Math.min(5+4*(lvl-1), 100);
            var stealPerc = Math.min(50+5*(lvl-1), 100);
            var num = Math.round(Math.random()*100);
            if(num <= stealChance) {
                var newHP = Math.min(Math.round(e.player.getHealth()+(e.damage/100*stealPerc)), e.player.getMaxHealth());
                e.player.setHealth(newHP);
                executeCommand(e.player, "/particle heart {x} {y} {z} 1 2 1 10 20".fill({
                    "x": e.player.getX(),
                    "y": e.player.getY()+1,
                    "z": e.player.getZ(),
                }));
                executeCommand(e.player, "/playsound minecraft:entity.firework.large_blast ambient "+e.player.getName());
            }
        break;
    }
});
