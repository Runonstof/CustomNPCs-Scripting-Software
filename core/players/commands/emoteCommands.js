registerDataHandler("emote", Emote);
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

@block init_event
  (function(e){
    var pl = e.player;
    var w = pl.world;
    var data = w.getStoreddata();
    for(var c in CHAT_EMOTES as ce) {
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
    ['!emote list [...matches]', function(pl, args, data){
        var emids = new Emote().getAllDataIds(data);
        tellPlayer(pl, getTitleBar('Emote List'));

    }, 'emote.list', []],
    ['!emote info <name>', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      tellPlayer(pl, getTitleBar('Emote Info'));
      tellPlayer(pl, "&eEmote Name: &r"+em.name);
      tellPlayer(pl, "&eEmote: &r:"+em.name+":");
      tellPlayer(pl, "&ePermission ID: &9&l"+em.getPermission().name+"&r [&6:sun: Info{run_command:!perms info "+em.getPermission().name+"}&r]");
      tellPlayer(pl, "&eIs Default: &c"+(em.data.default ? "&a:check: Yes" : "&c:cross: No"));
      tellPlayer(pl, "&ePrice: &c"+getAmountCoin(em.data.price));
      tellPlayer(pl, "&eFor Sale: "+(em.data.forSale ? "&a:check: Yes" : "&c:cross: No"));
      tellPlayer(pl, "&eHidden: "+(em.data.hidden ? "&c:check: Yes" : "&a:cross: No"));
    }, 'emote.info', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      }
    ]],
    ['!emote buy <emote>', function(pl, args, data){
        var em = new Emote(args.emote).init(data);
        var plo = new Player(pl.getName()).init(data);
        if(!em.data.hidden && em.data.forSale) {
            if(plo.data.emotes.indexOf() == -1) {
                if(plo.data.money >= em.data.price) {
                    plo.data.money -= em.data.price;
                    plo.data.emotes.push(em.name);
                    plo.save(data);
                    tellPlayer(pl, "&aBought emote "+em.name+" :"+em.name+": for &r:money:&e"+getAmountCoin(em.data.price)+"&a!");
                } else {
                    tellPlayer(pl, "&cYou don't have enough money in your money pouch!");
                }
            } else {
                tellPlayer(pl, "&cYou already have this emote!");
            }
        } else {
            tellPlayer(pl, "&cThis emote cannot be bought!");
        }
        return false;
    }, 'emote.buy', [
        {
            "argname": "emote",
            "type": "datahandler",
            "datatype": "emote",
            "exists": true,
        },
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
  }, 'emote.setForSale', [
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
    ['!emote setHidden <name> <hidden>', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      em.data.hidden = (args.hidden == 'true');
      em.save(data);
      tellPlayer(pl, "&a"+(em.data.hidden ? "Hided":"Showing")+" emote '"+em.name+"'");
  }, 'emote.setHidden', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
      {
        "argname": "hidden",
        "type": "bool",
      },
    ]],
    ['!emote setDefault <name> <default>', function(pl, args, data){
      var em = new Emote(args.name).init(data);
      em.data.default = (args.default == 'true');
      em.save(data);
      tellPlayer(pl, "&a"+(em.data.default ? "Put" : "Pulled")+" emote '"+em.name+"' "+(em.data.default ? "into" : "from")+" default emotes!");
  }, 'emote.setDefault', [
      {
        "argname": "name",
        "type": "datahandler",
        "datatype": "emote",
        "exists": true,
      },
      {
        "argname": "default",
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
