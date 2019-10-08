import "core\mods\noppes\Java.js";

import "core\mods\noppes\INbt.js";

import "core\players\executeCommand.js";

import "core\xcommandsAPI.js";

import "core\utils\FileUtils.js";

var MENU_TIMER_ID = 420;
var MENU_TIMER_PAYLOAD = null;
var MENU_ON_CLOSE = [];
var MENU_CAN_EDIT = false;

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
    MENU_CAN_EDIT = false;
@endblock

@block customChestClicked_event
    var snbt = e.slotItem.getNbt();
    if(snbt.getBoolean("takeable") || MENU_CAN_EDIT) {
        var heldItem = e.heldItem.copy();
        e.heldItem = e.slotItem;
        e.slotItem = heldItem;
    }

    if(snbt.has("onClick")) {
        var clickEvents = Java.from(nbtGetList(snbt, "onClick"));
        handleMenuEvents(e.player, clickEvents.map(function(ce){ return JSON.parse(ce); }));
    }

@endblock

function fillObject(obj, data) {

    for(var key in obj as val) {
        if(typeof val === 'string') {
            //obj[key] = val.fill(data);
        } else if(typeof val != 'number') {
            //fillObject(obj[key], data);
        }
    }
    return obj;
}

function containerGetRows(container) {
    return (container.getSize()-36)/9;
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
                var menuPath = "menus/"+(ev.file||"")+".json";
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
            case "function":
                if(typeof ev.function === 'function') {
                    var payl = objMerge({
                        //defaults
                    }, ev.payload||{});
                    var c = player.getOpenContainer();
                    ev.function(player, payl, c.getSize()>36 ? c : null);
                }
                break;
        }
    }
}

function CustomMenu(name, meta) {
    this.name = name||"";
    this.rows = 6;
    this.items = [];
    this.closeFns = [];
    this.openFns = [];
    this.filldata = {};
    this.meta = meta||{};

    this.getFirstFreeSlot = function(container) {
        var items = container.getItems();
        for(var i in items as item) {
            if(item.isEmpty() && i>=36) {
                return i-36;
            }
        }
        return -1;
    };

    this.fromContainer = function(container) {
        this.name = container.getName();
        this.items = container.getItems().map(function(item){
            return new CustomMenuItem().fromItemStack(item);
        });
        this.rows = containerGetRows(container);

    };

    this.fromJson = function(json) {
        if(typeof json === 'string') { json = JSON.parse(json); }
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
        if(json.meta) {
            this.meta = json.meta;
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

        MENU_ON_CLOSE = fillObject(objMerge({}, this.closeFns), {});
        handleMenuEvents(player, this.openFns);
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
    this.nbtstring = null;
    this.classes = [];
    this.name = null;
    this.takeable = false;

    this.toJsonString = function(){
        var json = {
            "id": this.id,
            "lore": this.lore,
            "damage": this.damage,
            "count": this.count,
            "slot": this.slot,
            "classes": this.classes,
            "takeable": this.takeable
        };
        if(this.nbt) { json.nbt = this.nbt; }
        if(this.name) { json.name = this.name }

        return JSON.stringify(json);
    };

    this.fromJson = function(json){
        if(typeof json === 'string') { json = JSON.parse(json); }
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
        this.count = stack.getStackSize();
        this.lore = stack.getLore()||[];
        if(stack.hasCustomName()) {
            this.name = stack.getDisplayName().replace("§", "&");
        }
        if(stack.hasNbt()) {
            var snbt = stack.getNbt();
            this.classes = nbtGetList(snbt, "classes")||[];
            var clickActions = (nbtGetList(snbt, "onClick")||[]);
            this.onClick = [];
            for(var c in clickActions as ca) {
                this.onClick.push(JSON.stringify(ca));
            }
            //print(nbtGetList(snbt, "onClick")||[]);
            this.takeable = snbt.getBoolean("takeable")||false;


            var setNbt = nbtCopy(snbt);
            setNbt.remove("classes");
            setNbt.remove("onClick");
            setNbt.remove("takeable");
            setNbt.remove("display");

            this.nbtstring = setNbt.toJsonString();
        }


        return this;
    };
    this.toItemStack = function(w){
        var item = w.createItem(this.id, this.damage, this.count);
        if(this.nbt) {
            //item.getNbt().merge(API.stringToNbt(JSON.stringify(this.nbt)));
        }
        var newLore = this.lore;
        item.setLore(newLore);
        if(this.name) {
            item.setCustomName(parseEmotes(ccs(this.name||""), [], false));
        }
        var inbt = item.getNbt();
        inbt.setList("classes", (Java.from(inbt.getList("classes", inbt.getListType("classes")))||[]).concat.apply([], [this.classes]));
        inbt.setList("onClick", (Java.from(inbt.getList("onClick", inbt.getListType("onClick")))||[]).concat.apply([], [this.onClickFuncs.map(function(f){return JSON.stringify(f);})]));
        inbt.setBoolean("takeable", this.takeable);



        if(this.nbtstring) {
            inbt.merge(API.stringToNbt(this.nbtstring));
        }
        return item;
    };
}
