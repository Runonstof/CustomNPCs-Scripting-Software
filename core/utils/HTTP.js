import "core/utils/ErrorHandler.js";

var URL = Java.type("java.net.URL");
var HttpURLConnection = Java.type("java.net.HttpURLConnection");
var BufferedReader = Java.type("java.io.BufferedReader");
var DataOutputStream = Java.type("java.io.DataOutputStream");
var InputStreamReader = Java.type("java.io.InputStreamReader");
var String = Java.type("java.lang.String");

var HTTP = {
    get: function(url, contentType) {
        var obj = new URL(url);
        var con = obj.openConnection();

        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "Mozilla/5.0");

        var responseCode = con.getResponseCode();

        var input = new BufferedReader(new InputStreamReader(con.getInputStream()));
        var inputLine;
        var response = "";
        while ((inputLine = input.readLine()) != null) {
            response = response + inputLine+"\n";
        }
        input.close();
        //print(response);

        switch(contentType) {
            case "application/json":
                response = cson_parse(response);
                break;
        }

        return {"success": responseCode === 200, "data": response, "reponseCode": responseCode};
    },
    post: function(url, data) {
        var obj = new URL(url);
        var con = obj.openConnection();
        con.setDoInput(true);
        con.setDoOutput(true);
        con.setInstanceFollowRedirects( false );
        con.setRequestMethod( "POST" );
        con.setRequestProperty("Content-Type", "application/json; utf-8");  
        con.setRequestProperty("User-Agent", "Mozilla/5.0");

        var os;
        try {
            os = con.getOutputStream();
            var writer = new DataOutputStream(os);
            writer.writeBytes(new String(JSON.stringify(data)));
            writer.flush();
            writer.close();       
            os.close();
        } catch(exc) {
            handleError(exc);
        }
        var br;
        var res = null;
        try {
            br = new BufferedReader(
                new InputStreamReader(con.getInputStream(), "UTF-8")
            ); 
            var response = '';
            var responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                response += responseLine.trim();
            }
            res = JSON.parse(response.toString());
        } catch(exc) {
            handleError(exc);
        }
        con.disconnect();

        return res;
    }
}

HTTP.async = {
    post: function(url, data){
        var promise = new Promise(function(resolve,reject){
            var response = HTTP.post(url, data);
            if(response.success) {
                resolve(response);
            } 
            
        })
    },
};