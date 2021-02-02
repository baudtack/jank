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

            return combine(t, b);
        } else {
            var topa = top(a);
            var bota = bot(a);

            return combine(topa, (bota ^ b));
        }
    } else if (b > 0xffffffff) {
        var topb = top(b);
        var botb = bot(b);

        return combine(topb, (botb ^ a));
    } else {
        return mint(a ^ b);
    }
}

function top(a) {
    return a / 0x80000000;
}

function bot(a) {
    return a % 0x80000000;
}

function combine(top, bot) {
    return (top * 0x80000000) + bot;
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

function con(a, b) {
    a = mint(a);
    b = mint(b);

    //logical or
    if(a instanceof JSBI || b instanceof JSBI) {
        return mint(JSBI.bitwiseOr(JSBI.BigInt(a),
                                   JSBI.BigInt(b)));
    } else if (a > 0xffffffff) {
        if (b > 0xffffffff) {
            var topa = top(a);
            var bota = bot(a);
            var topb = top(b);
            var botb = bot(b);

            var t = topa | topb;
            var b = bota | botb;

            return combine(t, b);
        } else {
            var topa = top(a);
            var bota = bot(a);

            return combine(topa, (bota | b));
        }
    } else if (b > 0xffffffff) {
        var topb = top(b);
        var botb = bot(b);

        return combine(topb, (botb | a));
    } else {
        return mint(a | b);
    }
}

function dis(a, b) {
    a = mint(a);
    b = mint(b);

    //logical and
    if(a instanceof JSBI || b instanceof JSBI) {
        return mint(JSBI.bitwiseOr(JSBI.BigInt(a),
                                   JSBI.BigInt(b)));
    } else if (a > 0xffffffff) {
        if (b > 0xffffffff) {
            var topa = top(a);
            var bota = bot(a);
            var topb = top(b);
            var botb = bot(b);

            var t = topa & topb;
            var b = bota & botb;

            return combine(t, b);
        } else {
            var topa = top(a);
            var bota = bot(a);

            return combine(topa, (bota & b));
        }
    } else if (b > 0xffffffff) {
        var topb = top(b);
        var botb = bot(b);

        return conbine(topb, (botb & a));
    } else {
        return mint(a & b);
    }
}

function lsh(b, n ,a) {
    //logical left shift with bloq size
    var b = JSBI.BigInt(b),
        n = JSBI.BigInt(n),
        a = JSBI.BigInt(a);

    var bits = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(2), b), n);
    return mint(JSBI.leftShift(a, bits));
}

function rsh(b, n, a) {
    //logical right shift with bloq size
    var b = JSBI.BigInt(b),
        n = JSBI.BigInt(n),
        a = JSBI.BigInt(a);

    var bits = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(2), b), n);
    return mint(JSBI.signedRightShift(a, bits));

}

function end(b, n, a) {
    //last n bloqs (size b) of atom a
}

export { met, mix, mint, con, dis, lsh, rsh };