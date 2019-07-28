registerCSTEnchant("cst:launch", "launch", 10, function(id, e, lvl, type){
    switch(type) {
        case "damagedEntity":
            //if(hpPerc <= 50) {
                var jumpspd = 0.8+(0.05*lvl);
                (e.target).setMotionY(jumpspd);
            //}
        break;
    }
});
