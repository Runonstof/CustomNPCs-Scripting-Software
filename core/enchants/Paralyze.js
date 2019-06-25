registerCSTEnchant("cst:paralyze", "Paralyze", 10, function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var parChance = Math.min(5+(2*(lvl-1)), 100);
            if(Math.round(Math.random()*100) <= parChance) {
                var duration = Math.round(lvl*1.5);
                e.target.addPotionEffect(8, duration, 128, true);
                e.target.addPotionEffect(2, duration, 128, true);
            }
            break;
    }
})
