function array_compare(arr1, arr2) {
    for(var i = 0; i < arr1.length; i++) {
        if(arr2.indexOf(arr1[i]) == -1) {
            return false;
        }
    }
    for(var j = 0; j < arr2.length; j++) {
        if(arr1.indexOf(arr2[i]) == -1) {
            return false;
        }
    }
    return true;
}

