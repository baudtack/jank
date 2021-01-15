import JSBI from 'jsbi'

function met(a, b){
    // how many blocks of size a are in b
    if(b instanceof JSBI) {
        //TODO: replace toString with a faster algo
        var bits = b.toString(2).length,
            full = bits >>> a,
            part = (full << a) !== bits;
        return part ? full + 1 : full;
    } else if(b > 0xffffffff) {
        var top = b / 0x100000000;

        return met32(a, top) + 32;
    } else {
        return met32(a, b);
    }
}

function met32(a, b) {
    var bits = 32 - Math.clz32(b),
        full = bits >>> a,
        part = (full << a) !== bits;
    return part ? full + 1 : full;
}

function mix(a, b) {
    console.log("called mix");
}

export { met, mix };