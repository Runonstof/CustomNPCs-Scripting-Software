
@block register_commands_event
  registerXCommands([
    ['!giftcode list [...matches]', function(pl, args, data){
        tellPlayer(pl, getTitleBar("GiftCodes List"));
        var codes = new GiftCode().getAllDataIds(data);
        for(var n in codes as codeId) {
            var code = new GiftCode(codeId).init(data);
            var hoverInfo = "$e$lCode: $r"+code.data.code+"\n$e$lUses left: $r"+code.getUsesLeft();
            tellPlayer(pl, "&e - &b&l"+code.name+"{*|show_text:"+hoverInfo+"}&r [&6:sun: Info{run_command:!giftcode info "+code.name+"}&r] [&c:cross: Remove{run_command:!giftcode remove "+code.name+"}&r]");
        }
    }, 'giftcode.list', []],
	['!giftcode info <name>', function(pl, args, data){
		var code = new GiftCode(args.name).init(data);
        tellPlayer(pl, getTitleBar('GiftCode Info'));
        tellPlayer(pl, "&6GiftCode Name: &r"+code.name);
        tellPlayer(pl, "&6Code: &r"+code.data.code+"&r [&d:recycle: Regen{run_command:!giftcode setCode "+code.name+"}&r] [&eEdit{suggest_command:!giftcode setCode "+code.name+" }&r]");
        tellPlayer(pl, "&6Permission ID: &9&l"+code.getPermission().name+"&r [&6:sun: Info{run_command:!perms info "+code.getPermission().name+"}&r]");
        tellPlayer(pl, "&6Uses left: &c"+code.getUsesLeft());
        tellPlayer(pl, getTitleBar('Rewards', false));
		tellPlayer(pl, "&6Money: &r:money:&e"+getAmountCoin(code.data.money));
		if(code.data.items.length > 0){
			tellPlayer(pl, "&eItems:");
			for(var i in code.data.items as itemData){
				var item = nbtItem(itemData, pl.world);
				tellPlayer(pl, "&6-&3 [" + (parseInt(i)+1) + "] " + item.getDisplayName() + " &2x"+item.getStackSize() + " &r[&c:cross: Remove{run_command:!giftcode removeItem " + code.name + " " +(parseInt(i)+1)+"}&r]");
			}
		}
		if(code.data.emotes.length > 0){
			tellPlayer(pl, "&eEmotes:");
			for(var i in code.data.emotes as emoteData){
				var emote = new Emote(emoteData).init(data);
				tellPlayer(pl, "&6-&3 [" + (parseInt(i)+1) + "] " + emote.name + " &r:" + emote.name + ": [&c:cross: Remove{run_command:!giftcode removeEmote " + code.name + " " +(parseInt(i)+1)+"}&r]");
			}
		}


    }, 'giftcode.info', [
		{
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true
        }
	]],
    ['!giftcode create <name> [code]', function(pl, args, data){
        var giftcode = new GiftCode(args.name);
        if(args.code) {
            giftcode.data.code = args.code;
        } else {
            giftcode.generateCode();
        }
		giftcode.data.uses = -1;
        tellPlayer(pl, "&aGiftcode '"+args.name+"&a' added with code '"+giftcode.data.code+"'!");
        giftcode.save(data);
    }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "id",
            "minlen": 3
        },
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": false,
        }
    ]],
    ['!giftcode setCode <name> [code]', function(pl, args, data){
        var giftcode = new GiftCode(args.name);
        giftcode.load(data);
        if(typeof(args.code) === "string") {
            giftcode.data.code = args.code;
        } else {
            giftcode.generateCode();
        }
        giftcode.save(data);
        tellPlayer(pl, "&aSet the code for GiftCode '"+args.name+"&a' to "+giftcode.data.code+"!");
    }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true,
        },
        {
            "argname": "code",
            "type": "id",
            "minlen": 3
        }
    ]],
    ['!giftcode setMaxUses <name> <uses>', function(pl, args, data){
        var giftcode = new GiftCode(args.name);
        giftcode.load(data);
        giftcode.data.uses = args.uses;
        giftcode.save(data);
        tellPlayer(pl, "&aSet max uses for GiftCode '"+args.name+"&a' to "+giftcode.getUsesLeft()+"!");
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true,
        },
        {
            "argname": "uses",
            "type": "number"
        }
    ]],
    ['!giftcode addItem <name>', function(pl, args, data){
		var hand = pl.getMainhandItem();
		if(!hand.isEmpty()) {
			var giftcode = new GiftCode(args.name);
	        giftcode.load(data);
			giftcode.data.items.push(hand.getItemNbt().toJsonString());
			giftcode.save(data);
			executeXCommand("!giftcode info " + args.name, pl);
			return true;
		}
		tellPlayer(pl, "&cYou don't have anything in your hand!");
		return false;
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true,
        }
    ]],
	['!giftcode removeItem <name> <id>', function(pl, args, data){
		var giftcode = new GiftCode(args.name);
		var id = args.id - 1;
		giftcode.load(data);
		if(giftcode.data.items.length > id) {
			giftcode.data.items.splice(id, 1);
			giftcode.save(data);
			executeXCommand("!giftcode info " + args.name, pl);
			return true;
		}
		tellPlayer(pl, "&cNo item with this id!");
		return false;
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true,
        },
		{
			"argname": "id",
			"type": "number",
			"min": 1
		}
    ]],
	['!giftcode setMoney <name> <amount>', function(pl, args, data){
		var giftcode = new GiftCode(args.name);
	    giftcode.load(data);
		if(args.amount != 0)
			giftcode.data.money = getCoinAmount(args.amount);
		else
			giftcode.data.money = 0;
		giftcode.save(data);
		tellPlayer(pl, "&aMoney prize set to "+args.amount+"!");
		return true;
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true
        },
		{
			"argname": "amount",
			"type": "currency"
		}
    ]],
	['!giftcode addEmote <name> <emote>', function(pl, args, data){
		var giftcode = new GiftCode(args.name);
	    giftcode.load(data);
		giftcode.data.emotes.push(args.emote);
		giftcode.save(data);
		executeXCommand("!giftcode info " + args.name, pl);
		return true;
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true
        },
		{
            "argname": "emote",
            "type": "datahandler",
            "datatype": "emote",
            "exists": true
        }
    ]],
	['!giftcode removeEmote <name> <id>', function(pl, args, data){
		var giftcode = new GiftCode(args.name);
		var id = args.id - 1;
		giftcode.load(data);
		if(giftcode.data.emotes.length > id) {
			giftcode.data.emotes.splice(id, 1);
			giftcode.save(data);
			executeXCommand("!giftcode info " + args.name, pl);
			return true;
		}
		tellPlayer(pl, "&cNo emote with this id!");
		return false;
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true,
        },
		{
			"argname": "id",
			"type": "number",
			"min": 1
		}
    ]],
    ['!giftcode redeem <code>', function(pl, args, data){
		var codes = new GiftCode().getAllDataIds(data);
        for(var n in codes as codeId) {
            var code = new GiftCode(codeId).init(data);
			if(code.data.code == args.code){
				return code.redeem(pl, data);
			}
        }
        tellPlayer(pl, "&cGiftCode with code '"+args.code+"' not found!");
  }, 'giftcode.redeem'],

  	['!giftcode unredeem <name> <player>', function(pl, args, data){
	  var code = new GiftCode(args.name);
	  code.load(data);
	  if(code.data.player.indexOf(args.player) == -1) {
		  tellPlayer(pl, "&cCode isn't activated yet!");
		  return false;
	  }
	  array_remove(code.data.players, args.player);
	  code.save(data);
	  tellPlayer(pl, "&aUnredeemed giftcode '"+args.name+"&a' for player "+args.player+"!");
	}, 'giftcode.create', [
	  {
		  "argname": "name",
		  "type": "datahandler",
		  "datatype": "giftcode",
		  "exists": true,
	  },
	  {
		  "argname": "player",
		  "type": "datahandler",
		  "datatype": "player",
		  "exists": true
	  }
  	]],

	['!giftcode remove <name>', function(pl, args, data){
		var code = new GiftCode(args.name);
		code.remove(data);
		tellPlayer(pl, "&aRemoved giftcode '"+args.name+"&a'!");
  }, 'giftcode.create', [
        {
            "argname": "name",
            "type": "datahandler",
            "datatype": "giftcode",
            "exists": true,
        }
    ]]
  ]);
@endblock
