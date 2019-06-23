registerCSTEnchant(null, 10, "cst:big_bang", "Big Bang", function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var explChance = 20+5*lvl;
            if(Math.random()*100 <= explChance) {
                executeCommand(e.player, "/particle largeexplode {X} {Y} {Z} 1 1 1 2 5".fill({
                    "X": e.target.getX(),
                    "Y": e.target.getY(),
                    "Z": e.target.getZ(),
                }));
                e.target.damage(4);
            }
        break;
    }
});
