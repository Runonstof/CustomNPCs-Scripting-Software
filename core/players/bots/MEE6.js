//MEE6 Bot
//Simple MEE6-like thing to block messages with more than 55% uppercase symbols. Annoying thing. Runonstof, why you did it?..
String.prototype.getCapsPercentage = function(){
    var str = this.toString();
    var caps = 0;
    var i=0;
    var character='';
    while (i <= str.length){
        character = str.charAt(i);
        if (isNaN(character * 1)) {
            if (character == character.toUpperCase()) {
                caps++;
            }
        }
        i++;
    }
    return Math.round(100/str.length*caps);
}
@block chat_event
    if(!e.isCanceled()) {
        if(e.message.length >= 9) {
            if(e.message.getCapsPercentage() >= 55) {
                executeCommand(e.player, "/tellraw @a "+strf(getChatMessage("MEE6", "Bot", "dark_aqua", "&9&o@"+e.player.getName()+"&r&b has been warned for capital letters!")));
                e.player.sendNotification(ccs("&9&o@"+e.player.getName()), ccs(getChatTag("MEE6", "Bot", "dark_aqua")), 2)
                e.setCanceled(true);
                return false;
            }
        }
    }
@endblock
