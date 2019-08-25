var URL = Java.type("java.net.URL");
var HttpURLConnection = Java.type("java.net.HttpURLConnection");
var BufferedReader = Java.type("java.io.BufferedReader");
var DataOutputStream = Java.type("java.io.DataOutputStream");
var InputStreamReader = Java.type("java.io.InputStreamReader");

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
    }
}
