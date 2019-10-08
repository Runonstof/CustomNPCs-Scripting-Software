function compare(fval, operator, sval) {
    switch(operator) {
        case '==':
            return fval == sval;
            break;
        case '===':
            return fval === sval;
            break;
        case '!=':
            return fval != sval;
            break;
        case '>':
            return fval > sval;
            break;
        case '<':
            return fval < sval;
            break;
        case '>=':
            return fval >= sval;
            break;
        case '<=':
            return fval <= sval;
            break;
        
    }

    return false;
}