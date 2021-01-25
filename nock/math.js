import JSBI from 'jsbi'
import * as E from './errors.js'

function met(a, b){
    // how many bloqs of size a are in b
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
    a = mint(a);
    b = mint(b);

    if(a instanceof JSBI || b instanceof JSBI) {
        return mint(JSBI.bitwiseXor(JSBI.BigInt(a),
                                    JSBI.BigInt(b)));
    } else if (a > 0xffffffff) {
        if (b > 0xffffffff) {
            var topa = top(a);
            var bota = bot(a);
            var topb = top(b);
            var botb = bot(b);

            var t = topa ^ topb;
            var b = bota ^ botb;

            return (t * 0x100000000) + b;
        } else {
            var topa = top(a);
            var bota = bot(a);

            return (topa * 0x100000000) + (bota ^ b);
        }
    } else if (b > 0xffffffff) {
        var topb = top(b);
        var botb = bot(b);

        return (topb * 0x100000000) + (botb ^ a);
    } else {
        return mint(a ^ b);
    }
}

function top(a) {
    return a / 0x100000000;
}

function bot(a) {
    return a % 0x100000000;
}

function mint(a) {
    if(a instanceof JSBI) {
        //verify that it's big enough
        if(JSBI.lessThan(a, JSBI.BigInt(Number.MAX_SAFE_INTEGER))) {
            return JSBI.toNumber(a);
        } else {
            return a;
        }
    } else {
        if(!Number.isSafeInteger(a)) {
            throw new E.Assertion('number is not safe');
        } else if(a < 0) {
            throw new E.Assertion('number is negative');
        } else {
            return a;
        }
    }
}

export { met, mix, mint };