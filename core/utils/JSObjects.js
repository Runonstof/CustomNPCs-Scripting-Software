function array_compare(array1, array2, compareFn) {
    var same = true;
    for(var i in array1) {
      if(compareFn ? !compareFn(array1[i],array2) : (array2.indexOf(array1[i]) == -1)) {
          same = false;
      }
  }
    for(var i in array2) {
      if(compareFn ? !compareFn(array2[i],array1) : (array1.indexOf(array2[i]) == -1)) {
          same = false;
      }
  }

    return same;
}