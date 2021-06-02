import JSBI from 'jsbi'
import * as E from './errors.js'

//Welp thanks to js being js,
// get to rewrite all of this to use
// TypedArrays instead of jsbi
// math functions can use jsbi to be fast

function abToJSBI(ab) {
    var acc = JSBI.BigInt(0);
    var dv = new DataView(ab);

    for(var i = dv.byteLength - 1; i >= 0; i--) {
        var chunk = dv.getUint8(i);
        acc = JSBI.bitwiseXor(JSBI.leftShift(acc, JSBI.BigInt(8)),
                              JSBI.BigInt(chunk));
    }
    return acc;
}

function jsbiToAB(beeg) {
    var arr = [];
    while(JSBI.notEqual(JSBI.BigInt(0), beeg)) {
        var b = JSBI.toNumber(JSBI.bitwiseAnd(beeg, JSBI.BigInt(0xff)));
        arr.push(b);
        beeg = JSBI.signedRightShift(beeg, JSBI.BigInt(8));
    }

    var ab = new ArrayBuffer(arr.length);
    var dv = new DataView(ab);
    for(var i = 0; i < arr.length; i++) {
        dv.setUint8(i, arr[i]);
    }

    return ab;
}

function bitLength(n) {
    return Math.floor(Math.log2(n)) + 1;
}

function met(a, b) {
    // how many bloqs of size a are in b
    if(b instanceof ArrayBuffer) {
        var dv = new DataView(b);
        var bits = (dv.byteLength - 1) * 8 + bitLength(dv.getUint8(dv.byteLength - 1)),
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

    if(a instanceof ArrayBuffer || b instanceof ArrayBuffer) {
        return mint(JSBI.bitwiseXor(abToJSBI(a)),
                                    abToJSBI(b));
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
    if(a instanceof ArrayBuffer) {
        //verify that it's big enough
        var aj = a;

        if(a instanceof ArrayBuffer) {
            aj = abToJSBI(a);
        }

        if(JSBI.lessThan(aj, JSBI.BigInt(Number.MAX_SAFE_INTEGER))) {
            return JSBI.toNumber(aj);
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
    if(a instanceof ArrayBuffer || a > 0xffffffff) {
        //logical left shift with bloq size
        var b = JSBI.BigInt(b),
            n = JSBI.BigInt(n);
        if(a instanceof ArrayBuffer) {
            a = abToJSBI(a);
        } else {
            a = JSBI.BigInt(a);
        }

        var bits = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(2), b), n);
        return mint(jsbiToDV(JSBI.leftShift(a, bits)));
    } else {
        var bits = Math.pow(2, b) * n;
        return mint(a << bits);
    }
}

function rsh(b, n, a) {
    //logical right shift with bloq size,
    if(a instanceof ArrayBuffer || a > 0xffffffff) {
        var b = JSBI.BigInt(b),
            n = JSBI.BigInt(n);
        if(a instanceof ArrayBuffer) {
            a = abToJSBI(a);
        } else {
            a = JSBI.BigInt(a);
        }

        var bits = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(2), b), n);
        return mint(jsbiToAB(JSBI.signedRightShift(a, bits)));
    } else {
        var bits = Math.pow(2, b) * n;
        return mint(a >>> bits);
    }

}

function end(b, n, a) {
    //last n bloqs (size b) of atom a
    var b = JSBI.BigInt(b),
        n = JSBI.BigInt(n);

    if(a instanceof ArrayBuffer) {
        a = abToJSBI(a);
    } else {
        a = JSBI.BigInt(a);
    }

    var bits = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(2), b), n);
    var mask = dec(lsh(0, bits, 1));
    return mint(jsbiToAB(JSBI.bitwiseAnd(JSBI.BigInt(mask), a)));
}

function dec(a) {
    if(a instanceof ArrayBuffer) {
        a = abToJSBI(a);
        return mint(JSBI.subtract(a, JSBI.BigInt(1)));
    } else {
        return a - 1;
    }

}

function add(a, b) {
    if(a instanceof ArrayBuffer || b instanceof ArrayBuffer) {
        if(a instanceof ArrayBuffer) {
            a = abToJSBI(a);
        }

        if(b instanceof ArrayBuffer) {
            b = abToJSBI(b);
        }

        return mint(jsbiToAB(JSBI.add(JSBI.BigInt(a), JSBI.BigInt(b))));
    } else {
        return a + b;
    }

    return mint(JSBI.add(JSBI.BigInt(a), JSBI.BigInt(b)));
}

function sub(a, b) {
    return mint(JSBI.subtract(JSBI.BigInt(a), JSBI.BigInt(b)));
}

function mul(a, b) {
    return mint(JSBI.multiply(JSBI.BigInt(a), JSBI.BigInt(b)));
}

function div(a, b) {
    return mint(JSBI.divide(JSBI.BigInt(a), JSBI.BigInt(b)));
}

function cat(bloq, b, c) {
    return add(lsh(bloq, met(bloq, c), c), b);
}

export { met, mix, mint, con, dis, lsh, rsh, end, cat, abToJSBI, jsbiToAB, add, sub, mul, div };