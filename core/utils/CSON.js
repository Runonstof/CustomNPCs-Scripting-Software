//Parses JSON with comments and trailing comma's to json objects
function cson_parse(cson_string) {
    var rgx_comments = /\/(?:\*{2,}\s[\s\S]+?|\*[^\*]+?)\*\/|([\s;])+\/\/.*$/gm;
    var rgx_commas = /,+\s*(\}|\])/g;
    return JSON.parse(cson_string.replace(rgx_comments, '').replace(rgx_commas, '$1'));
}
