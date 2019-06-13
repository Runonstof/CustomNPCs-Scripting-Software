@block register_commands_event
    //REGISTER ENTITY COMMANDS
    registerXCommands([
        //['', function(pl, args, data){}, '', []],
        ['!entity rename [...name]', function(pl, args, data){}, 'entity.rename', []],
    ]);
@endblock
