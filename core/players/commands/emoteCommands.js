function Emote(name) {
  extends function DataHandler('emote', name);
  extends function Permittable('emotes');

  this.data = {
    "price": 0,
    "desc": "",
    "default": false, //If everyone has the emote by default
    "forSale": false, //If emote can be bought
  };
}

@block init_event
  (function(e){
    var pl = e.player;
    var w = pl.world;
    var data = w.getStoreddata();
    for(c in CHAT_EMOTES as ce) {
      var ec = new Emote(c);
      if(!ec.exists(data)) {
        ec.save(data);
      }
    }
  })(e);
@endblock

@block register_commands_event
  registerXCommands([
    //['', function(pl, args, data){}, '', []],
    ['!emote info <name>', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      tellPlayer(pl, getTitleBar('Emote Info'));
      tellPlayer(pl, "&eEmote Name: &r"+em.name);
      tellPlayer(pl, "&eEmote: &r:"+em.name+":");
      tellPlayer(pl, "&ePermission ID: &9&l"+em.getPermission().name);
      tellPlayer(pl, "&ePrice: &c"+getAmountCoin(em.data.price));
      tellPlayer(pl, "&eFor Sale: "+(em.data.forSale ? "&a:check: Yes" : "&c:cross: No"));
    }, 'emote.info', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      }
    ]],
    ['!emote take <emote> <player>', function(pl, args, data){
      var p = new Player(args.player).init(data);
      p.data.emotes = removeFromArray(p.data.emotes, args.emote);
      p.save(data);
      tellPlayer(pl, "&aTook emote '"+args.emote+"' from player '"+p.name+"'!");
      return true;
    }, 'emote.take', [
      {
        "argname": "player",
        "type": "datahandler",
        "datatype": "player",
        "exists": true,
      },
      {
        "argname": "emote",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
    ]],
    ['!emote give <emote> <player>', function(pl, args, data){
      var p = new Player(args.player).init(data);
      if(p.data.emotes.indexOf(args.emote) == -1) {
        p.data.emotes.push(args.emote);
      }
      p.save(data);
      tellPlayer(pl, "&aGave emote '"+args.emote+"' to player '"+p.name+"'!");
      return true;
    }, 'emote.give', [
      {
        "argname": "player",
        "type": "datahandler",
        "datatype": "player",
        "exists": true,
      },
      {
        "argname": "emote",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
    ]],
    ['!emote setForSale <name> <forSale>', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      em.data.forSale = (args.forSale == 'true');
      em.save(data);
      tellPlayer(pl, "&a"+(em.data.forSale ? "Put" : "Pulled")+" emote '"+em.name+"' "+(em.data.forSale ? "on" : "off")+"-sale!");
    }, '', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
      {
        "argname": "forSale",
        "type": "bool",
      },
    ]],
    ['!emote setDesc <name> [...desc]', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      em.data.desc = args.desc.join(" ");
      em.save(data);
      tellPlayer(pl, "&aChanged description of emote '"+em.name+"'!");
    }, 'emote.setDesc', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
    ]],
    ['!emote setPrice <name> <price>', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      em.data.price = getCoinAmount(args.price);
      em.save(data);
      tellPlayer(pl, "&aSet price of emote '"+em.name+"' to "+getAmountCoin(em.data.price));

      return true;
    }, 'emote.setPrice', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
      {
        "argname": "price",
        "type": "currency",
        "min": 0,
      },
    ]],
  ]);
@endblock
