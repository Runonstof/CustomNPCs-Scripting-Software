import core\mods\noppes\Java.js;

import core\mods\noppes\INbt.js;

import core\players\executeCommand.js;

import core\xcommandsAPI.js;

import core\utils\FileUtils.js;

var MENU_TIMER_ID = 420;
var MENU_TIMER_PAYLOAD = null;
var MENU_ON_CLOSE = [];

@block timer_event
    if(e.id == MENU_TIMER_ID) {
        if(MENU_TIMER_PAYLOAD) {
            //Open new menu
            var menu = new CustomMenu().fromJson(MENU_TIMER_PAYLOAD.menu, MENU_TIMER_PAYLOAD.data);

            menu.open(e.player);
            MENU_TIMER_PAYLOAD = null;
        }
    }
@endblock

@block customChestClosed_event
    try {
        handleMenuEvents(e.player, MENU_ON_CLOSE);
    } catch(exc) {
        handleError(exc, true, e.player.getName());
    }

    MENU_ON_CLOSE = [];
@endblock

@block customChestClicked_event
    var snbt = e.slotItem.getNbt();
    if(snbt.getBoolean("takeable")) {
        var heldItem = e.heldItem.copy();
        e.heldItem = e.slotItem;
        e.slotItem = heldItem;
    }

    if(snbt.has("onClick")) {
        var clickEvents = Java.from(nbtGetList(snbt, "onClick"));//map parse json
        handleMenuEvents(e.player, clickEvents.map(function(ce){ return JSON.parse(ce); }));
    }

@endblock

function fillObject(obj, data) {
    for(var key in obj as val) {
        obj[key] = val.fill(data);
    }
    return obj;
}

function handleMenuEvents(player, evs, filldata) {
    filldata = objMerge({
        "player": player.getName(),
    }, filldata||{});

    for(var c in evs as ev) {
        fillObject(ev, filldata);
        switch(ev.type) {
            case "run_command":
                executeCommand(player, ev.command||"");
                break;
            case "run_xcommand":
            case "run_xcommand_admin":
                executeXCommand(ev.command||"", player, ev.type === "run_xcommand");
                break;
            case "run_file":
                var scrPath = ev.file||"";
                var scrFile = new File(scrPath);
                if(scrFile.exists()) {
                    var scr = readFileAsString(scrPath);
                    var scrFunc = new Function('e', 'payload', scr);
                    var payl = objMerge({
                        //defaults
                    }, ev.payload||{});

                    try {
                        scrFunc(e, payl);
                    } catch(exc) {
                        handleError(exc, false, player.getName());
                    }
                } else {
                    tellPlayer(player, "&cFile '"+scrPath+"' doesn't exist!");
                }
                break;
            case "run_script":
                var scr = ev.script||"";
                var scrFunc = new Function('e', 'payload', scr);
                var payl = objMerge({
                    //defaults
                }, ev.payload||{});

                try {
                    scrFunc(e, payl);
                } catch(exc) {
                    handleError(exc, false, player.getName());
                }
                break;
            case "open_menu":
                var menuPath = ev.file||"";
                var menuFile = new File(menuPath);
                if(menuFile.exists()) {
                    var menuFileText = readFileAsString(menuPath);
                    var menuJson = null;

                    try {
                        menuJson = JSON.parse(menuFileText);
                    } catch (exc) {
                        handleError(exc, false, player.getName());
                    }

                    if(menuJson !== null) {
                        player.closeGui();
                        MENU_TIMER_PAYLOAD = {'menu':menuJson,'data':ev.data||{},'onClose':menuJson.onClose||[]};
                        player.timers.forceStart(MENU_TIMER_ID, 1, false);

                    }


                } else {
                    tellPlayer(player, "&cFile '"+menuPath+"' does not exists!")
                }
                break;
            case "cancel":
                if(e.isCancelable()) {
                    e.setCanceled(true);
                }
                break;
            case "close_menu":
                player.closeGui();
                break;
        }
    }
}

function CustomMenu(name) {
    this.name = name||"";
    this.rows = 6;
    this.items = [];
    this.closeFns = [];
    this.openFns = [];
    this.filldata = {};

    this.fromJson = function(json) {
        this.name = json.name||"";
        this.rows = Math.min(Math.max(json.rows||6, 1),6);
        if(json.items) {
            for(var i in json.items as jitem) {
                this.items.push(new CustomMenuItem().fromJson(jitem));
            }
        }
        if(json.onClose) {
            this.closeFns = json.onClose;
        }
        if(json.onOpen) {
            this.openFns = json.onOpen;
        }
        if(json.data) {
            this.filldata = json.data;
        }

        return this;
    };

    this.onClose = function(ev) {
        this.closeFns.push(ev);
    };

    this.onOpen = function(ev){
        this.openFns.push(ev);
    };

    this.getItems = function() {
        return new Collection(this.items);
    };

    this.open = function(player) {
        var container =  player.showChestGui(this.rows);

        MENU_ON_CLOSE = fillObject(objMerge({}, this.closeFns), this.filldata);
        handleMenuEvents(player, this.openFns, this.filldata);
        this.populate(player.world, container);
        return container;
    };

    this.update = function(){
        this.getItems().do("each",function(item){item.update();});
    };

    this.populate = function(w, container) {
        container.setName(parseEmotes(ccs(this.name)));
        var items = this.items;
        for(var i in this.items as citem) {
            container.setSlot(36+citem.slot, citem.toItemStack(w));
        }
    };
}

function CustomMenuItem(id, damage=0, count=1) {
    this.id = id;
    this.lore = [];
    this.slot = 0;
    this.count = count;
    this.damage = damage;
    this.nbt = null;
    this.classes = [];
    this.name = null;
    this.takeable = false;

    this.fromJson = function(json){
        this.id=json.id;
        if("name" in json) {
            this.name = json.name;
        }
        this.lore = json.lore||[];
        this.damage = json.damage||0;
        this.count = json.count||1;
        this.nbt = json.nbt||null;
        this.classes = json.classes||[];
        this.takeable = json.takeable||false;
        this.slot = json.slot||0;
        this.onClickFuncs = json.onClick||[];

        return this;
    };

    this.onClickFuncs = [];

    this.onClick = function(type, meta){
        this.onClickFuncs.push(objMerge({
            "type": type,
        }, meta));
    };

    this.fromItemStack = function(stack) {
        this.id = stack.getName();
        this.damage = stack.getItemDamage();

        return this;
    };
    this.toItemStack = function(w){
        var item = w.createItem(this.id, this.damage, this.count);
        item.setLore(this.lore.map(function(l){
            return parseEmotes(ccs(l));
        }));
        if(this.name) {
            item.setCustomName(parseEmotes(ccs(this.name||"")));
        }
        var inbt = item.getNbt();
        inbt.setList("classes", (Java.from(inbt.getList("classes", inbt.getListType("classes")))||[]).concat.apply([], [this.classes]));
        inbt.setList("onClick", (Java.from(inbt.getList("onClick", inbt.getListType("onClick")))||[]).concat.apply([], [this.onClickFuncs.map(function(f){return JSON.stringify(f);})]));
        inbt.setBoolean("takeable", this.takeable);



        if(this.nbt) {
            inbt.merge(API.stringToNbt(JSON.stringify(this.nbt)));
        }
        return item;
    };
}
