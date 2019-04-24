registerDataHandler("automsg", AutoMsg);
function AutoMsg(name) {
    extends function DataHandler('automsg', name);

    this.data = {
        "msg": "Default AutoMessage",
        "enabled": true,
        "mode": "interval",
        "interval": getStringTime("5min"),
        "lastSend": 0,
    };

    this.broadcast = function(pl, target) {
        executeCommand(pl, "/tellraw "+target+" "+parseEmotes(strf(this.msg)));
        return this;
    };

    this.canSend = function(){
        return new Date().getTime() >= this.lastSend+this.interval;
    };
}

@block register_commands_event
    //REGISTER AUTOMSG COMMANDS
    registerXCommands([
        //['', function(pl, args, data){}, '', []],
        ['!automsg list [...matches]', function(pl, args, data){
            tellPlayer(pl, getTitleBar("AutoMsg List"));
            var aus = new AutoMsg().getAllDataIds(data);
            for(a in aus as auid) {
                var au = new AutoMsg(auid).init(data);
                var hoverInfo = "$e$lMode: $r"+au.data.mode+"\n$e$lInterval: $r"+getTimeString(au.data.interval);
                tellPlayer(pl, "&e - &b&l"+au.name+"{*|show_text:"+hoverInfo+"}&r [&6:sun: Info{run_command:!automsg info "+au.name+"}&r] [&c:cross: Remove{run_command:!automsg remove "+au.name+"}&r]");
            }
        }, 'automsg.list', []],
        ['!automsg create <name>', function(pl, args, data){
            var au = new AutoMsg(args.name);
            tellPlayer(pl, "&aCreated AutoMessage '"+au.name+"'!&r [&5&lUndo{run_command:!automsg remove "+au.name+"}&r]");
            au.save(data);
        }, 'automsg.create', [
            {
                "argname": "name",
                "type": "id",
                "minlen": 4
            },
            {
                "argname": "name",
                "type": "datahandler",
                "datatype": "automsg",
                "exists": false,
            },
        ]],
        ['!automsg remove <name>', function(pl, args, data){
            var au = new AutoMsg(args.name).init(data);

            var undo_cmds = [
                '!automsg create '+au.name,
                '!automsg setMessage '+au.name+' '+au.data.msg,
                '!automsg setEnabled '+au.name+' '+au.data.enabled.toString(),
                '!automsg setInterval '+au.name+' '+getTimeString(au.data.interval),
                '!automsg setMode '+au.name+' '+au.data.mode,

            ];

            tellPlayer(pl, "&aRemoved AutoMsg '"+au.name+"'!&r [&5&lUndo{run_command:!chain ;"+undo_cmds.join(";")+"}&r]");
            au.remove(data);
            return true;
        }, 'automsg.remove', [
            {
                "argname": "name",
                "type": "datahandler",
                "datatype": "automsg",
                "exists": true,
            }
        ]],
        ['!automsg setMessage <name> [...message]', function(pl, args, data){
            var au = new AutoMsg(args.name).init(data);
            var oldmsg = au.data.msg;
            au.data.msg = args.message.join(" ");
            au.save(data);
            tellPlayer(pl, "&aChanged message of AutoMessage '"+au.name+"'!&r [&5&lUndo{run_command:!automsg setMessage "+au.name+" "+oldmsg+"}&r]");
        }, 'automsg.setMessage', [
            {
                "argname": "name",
                "type": "datahandler",
                "datatype": "automsg",
                "exists": true,
            },
        ]],
        ['!automsg setMode <name> <mode>', function(pl, args, data){
            var au = new AutoMsg(args.name).init(data);
            var oldmode = au.data.mode;
            au.data.mode = args.mode;
            au.save(data);
            tellPlayer(pl, "&aChanged mode of AutoMessage '"+au.name+"' to '"+args.mode+"'!&r [&5&lUndo{run_command:!automsg setMode "+au.name+" "+oldmode+"}&r]");
        }, 'automsg.setMode', [
            {
                "argname": "name",
                "type": "datahandler",
                "datatype": "automsg",
                "exists": true,
            },
            {
                "argname": "mode",
                "type": "enum",
                "values": ["interval", "login"],
            },
        ]],
        ['!automsg setInterval <name> <time>', function(pl, args, data){
            var au = new AutoMsg(args.name).init(data);
            var oldint = getTimeString(au.data.interval);
            au.data.interval = getStringTime(args.time);
            var newint = getTimeString(au.data.interval);
            au.save(data);
            tellPlayer(pl, "&aChanged interval of AutoMessage '"+au.name+"' to '"+newint+"'!&r [&5&lUndo{run_command:!automsg setInterval "+au.name+" "+oldint+"}&r]");
        }, 'automsg.setInterval', [
            {
                "argname": "name",
                "type": "datahandler",
                "datatype": "automsg",
                "exists": true,
            },
            {
                "argname": "time",
                "type": "time",
                "min": getStringTime("10s"),
            },
        ]],
        ['!automsg setEnabled <name> <enabled>', function(pl, args, data){
            var au = new AutoMsg(args.name).init(data);
            au.data.enabled = (args.enabled == "true");
            au.save(data);
            tellPlayer(pl, "&a"+(au.data.enabled ? "Enabled":"Disabled")+" AutoMsg '"+au.name+"'!&r [&5&lUndo{run_command:!automsg setEnabled "+au.name+" "+au.data.enabled.toString()+"}&r]");
        }, 'automsg.setEnabled', [
            {
                "argname": "name",
                "type": "datahandler",
                "datatype": "automsg",
                "exists": true,
            },
            {
                "argname": "enabled",
                "type": "bool",
            },
        ]],

    ]);
@endblock
