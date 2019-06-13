function Emote(name) {
  extends function DataHandler('emote', name);
  extends function Permittable('emotes');

  this.data = {
    "price": 0,
    "desc": "",
    "default": false, //If everyone has the emote by default
    "forSale": false, //If emote can be bought
    "hidden": false, //Will be hidden from !myEmotes, unless player has it, if forSale == true emote can still be bought via command
  };

  this.getCode = function(){
      return CHAT_EMOTES[this.name]||"?";
  };
}