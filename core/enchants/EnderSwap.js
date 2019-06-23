registerCSTEnchant(null, 1, "cst:ender_swap", "Ender Swap", function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            var ppos = e.player.getPos().up();
            var ppitch = e.player.getPitch();
            var prot = e.player.getRotation();

            var tpos = e.target.getPos().up();
            var tpitch = e.target.getPitch();
            var trot = e.target.getRotation();

            e.player.setPos(tpos);
            e.player.setPitch(tpitch);
            e.player.setRotation(trot);

            e.player.playSound("minecraft:entity.endermen.teleport", 2, 1);

            e.target.setPos(ppos);
            e.target.setPitch(ppitch);
            e.target.setRotation(prot);

            executeCommand(e.player, "/particle dragonbreath {X} {Y} {Z} 1 1 1 1 700 force".fill({
                "X": tpos.getX(),
                "Y": tpos.getY(),
                "Z": tpos.getZ(),
            }));
            executeCommand(e.player, "/particle dragonbreath {X} {Y} {Z} 1 1 1 1 700 force".fill({
                "X": ppos.getX(),
                "Y": ppos.getY(),
                "Z": ppos.getZ(),
            }));
        break;
    }
}, false);
