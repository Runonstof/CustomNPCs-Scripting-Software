import "core/xcommandsAPI.js";
import "core/utils/HTTP.js";

@block register_commands_event
    registerXCommands([
        ['!redeem [code]', function(pl, args, data){
            var response = HTTP.post('http://runonstof.000webhostapp.com/api/cst/adlink-mc', {
                'username': pl.getName()
            });
            tellPlayer(pl, JSON.stringify(response));
            print(response);
        }, 'redeem']
    ]);
@endblock