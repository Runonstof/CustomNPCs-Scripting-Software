registerCSTEnchant("cst:berserker", "Berserker", 10, function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var chance = 5+2*lvl;
            var newHP = e.player.getHealth();
            var hpPerc = Math.round(100/e.player.getMaxHealth()*newHP);
            if(hpPerc <= 50 && Math.random()*100 <= chance) {
                //Add Strength
                e.player.addPotionEffect(5, 3, lvl, true);
                //Add Speed
                e.player.addPotionEffect(1, 3, Math.ceil(lvl/2), true);
                //Add Haste
                e.player.addPotionEffect(3, 3, lvl, true);
            }
        break;
    }
});
