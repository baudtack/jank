import test from 'ava'
import * as M from '../nock/math.js'
import '../nock/errors.js'
import JSBI from 'jsbi'

test('met(0, 8) is 4', t => {
    t.is(4, M.met(0, 8));
});

test('met(0, 256) is 9', t => {
    t.is(9, M.met(0, 256));
});

test('met(3, 8) is 1', t => {
    t.is(1, M.met(3, 8));    
});

test('met(3, 0xff) is 1', t => {
    t.is(1, M.met(3, 0xff));
});

test('met(3, 0xffff) is 2', t => {
    t.is(2, M.met(3, 0xffff));
});

test('met(0, 0x1.0000) is 3', t => {
    t.is(3, M.met(3, 0x10000));
});

test('met(0, 0xffff.ffff.ffff) is 48', t => {
    t.is(48, M.met(0, 0xffffffffffff));
});

test('met(0, 0x20.0000.0000.0000) is 54', t => {
    var j = M.jsbiToAB(JSBI.BigInt('0x20000000000000'));

    t.is(54, M.met(0, j));
});

test('met(0, 0xffff.ffff.ffff.ffff) is 64', t => {
    var j = M.jsbiToAB(JSBI.BigInt('0xffffffffffffffff'));

    t.is(64, M.met(0, j));
});

test('met(0, 0xffff.ffff.ffff.ffff.ffff.ffff.ffff.ffff) is 128', t => {
    var j = M.jsbiToAB(JSBI.BigInt('0xffffffffffffffffffffffffffffffff'));
    t.is(128, M.met(0, j));
});

test('met(3, 0x2.ffff.ffff.ffff.ffff.ffff.ffff.ffff.ffff) is 17', t => {
    var j = M.jsbiToAB(JSBI.BigInt('0x2ffffffffffffffffffffffffffffffff'));

    t.is(17, M.met(3, j));
});


test('bit cats', t => {
    t.is(0, M.cat(0, 0, 0), "zero");
    t.is(1, M.cat(0, 0, 1), "one");
    t.is(1, M.cat(0, 1, 0), "two");
    t.is(3, M.cat(0, 1, 1), "three");
});

test('word cats', t => {
    t.is(32, M.cat(5, 0, 32), "0 and 32");
    t.is(32, M.cat(5, 32, 0), "32 and 0");
    t.is(137438953504, M.cat(5, 32, 32), "32 and 32");

    var ab = M.jsbiToAB(JSBI.BigInt("0xdeadbeefdeadbeef"));
    t.deepEqual(ab, M.cat(5, 0xdeadbeef, 0xdeadbeef), "deadbeef and deadbeef");

});

test('abToJSBI(DataView(10)) is jsbi(10)', t => {
    var b = new ArrayBuffer(8);
    var dv = new DataView(b);
    dv.setUint8(0, 10);
    var j = JSBI.BigInt(10);
    var c = M.abToJSBI(b);
    t.true(JSBI.equal(j, c));
});

test('jsbiToDV(jsbi(10)) is dataview(10)', t => {
    var j = JSBI.BigInt(10);
    var c = M.jsbiToAB(j);
    var cdv = new DataView(c);
    t.true(cdv.getUint8(0) === 10);
});

test('abToJSBI(DataView(1010)) is jsbi(1010)', t => {
    var b = new ArrayBuffer(8);
    var dv = new DataView(b);
    dv.setUint8(0, 10);
    dv.setUint8(1, 10);

    var j = JSBI.BigInt(2570);
    var c = M.abToJSBI(b);

    t.true(JSBI.equal(j, c));
});

test('jsbiToAB(jsbi(2570)) is dataview(10, 10)', t => {
    var j = JSBI.BigInt(2570);
    var c = M.jsbiToAB(j);
    var cdv = new DataView(c);

    t.true(cdv.getUint8(0) === 10 && cdv.getUint8(1) === 10);
});


test('mint(10) is 10', t => {
    t.is(10, M.mint(10));
});

test('mint(DataView(10)) is 10', t => {
    var buff = new ArrayBuffer(8);
    var dv = new DataView(buff);

    dv.setUint8(0, 10)

    t.is(10, M.mint(buff));
});

test('mint(-1) throws error', t => {
    t.throws(function () {
        M.mint(-1);
    });
});

test('mint(Number.MAX_SAFE_INTEGER) throws error', t => {

    t.throws(function () {
        M.mint(Number.MAX_SAFE_INTERGER);
    });
});

test('mint(large bigint) is large bigint', t => {
    var bi = M.jsbiToAB(JSBI.add(JSBI.BigInt(Number.MAX_SAFE_INTEGER),
                                 JSBI.BigInt(1)));

    var minted = M.mint(bi);

    if(!(minted instanceof ArrayBuffer)) {
        t.fail("result is not a ArrayBugger");
    }

    var minteddv = new DataView(minted);
    var bidv = new DataView(bi);

    for(var i = bidv.byteLength - 1; i >= 0; i--) {
        if(bidv.getUint8(i) !== minteddv.getUint8(i)) {
            t.fail("results do not match");
        }
    }

    t.pass();
});

test('mix(0b100, 0b001) is 0b101', t => {
    t.is(0b101, M.mix(0b100, 0b001));
});

test('mix(0b10010011001001, 0b10000101010001) is 0b00010110011000', t => {
    t.is(0b00010110011000, M.mix(0b10010011001001, 0b10000101010001));
});

test('mix(0x400000000000, 0x200000000000) is 0x600000000000', t => {
    t.is(0x600000000000, M.mix(0x400000000000, 0x200000000000));
});

test('con(4, 2) is 6', t => {
    t.is(6, M.con(4, 2));
});

test('con(0xffffffff0000, 0xffffffffeeee) is 0xffffffffeeee', t => {
    t.is(0xffffffffeeee, M.con(0xffffffff0000, 0xffffffffeeee));
});

test('dis(4, 2) is 0', t => {
    t.is(0, M.dis(4, 2));
});

test('dis(0xffffffff0000, 0xffffffffeeee) is 0xffffffff0000', t => {
    t.is(0xffffffff0000, M.dis(0xffffffff0000, 0xffffffffeeee));
});

test('lsh(0, 1, 1) is 2', t => {
    t.is(2, M.lsh(0, 1, 1));
});

test('lsh(0, 2, 1) is 4', t => {
    t.is(4, M.lsh(0, 2, 1));
});

test('lsh(0, 3, 1) is 8', t => {
    t.is(8, M.lsh(0, 3, 1));
});

test('lsh(3, 1, 2) is 0x200', t => {
    t.is(0x200, M.lsh(3, 1, 2));
});

test('lsh(3, 2, 8) is 0x80000', t => {
    t.is(0x80000, M.lsh(3, 2, 8));
});

test('lsh(3, 3, 10) is 0xa000000', t => {
    t.is(0xa000000, M.lsh(3, 3, 10));
});

test('rsh(0, 1, 2) is 1', t => {
    t.is(1, M.rsh(0, 1, 2));
});

test('rsh(0, 2, 4) is 1', t => {
    t.is(1, M.rsh(0, 2, 4));
});

test('rsh(0, 3, 8) is 1', t => {
    t.is(1, M.rsh(0, 3, 8));
});

test('rsh(3, 1, 0x200) is 2', t => {
    t.is(2, M.rsh(3, 1, 0x200));
});

test('rsh(3, 2, 0x80000) is 8', t => {
    t.is(8, M.rsh(3, 2, 0x80000));
});

test('rsh(3, 3, 0xa000000) is 10', t => {
    t.is(10, M.rsh(3, 3, 0xa000000));
});

test('rsh(3, 3, 0xa111111) is 10', t => {
    t.is(10, M.rsh(3, 3, 0xa111111));
});

test('end(0, 4, 0b1110110) is 0b0110', t => {
    t.is(0b0110, M.end(0, 4, 0b1110110));
});

test('end(1, 1, 0b1110110) is 0b10', t => {
    t.is(0b10, M.end(1, 1, 0b1110110));
});

test('end(3, 1, 0b11101101101111000101001) is 0b00101001', t => {
    t.is(0b00101001, M.end(3, 1, 0b11101101101111000101001));
});

test('end(3, 2, 0b11101101101111000101001) is 0b1101111000101001', t => {
    t.is(0b1101111000101001, M.end(3, 2, 0b11101101101111000101001));
});

test('add(3, 4) is 7', t => {
    t.is(7, M.add(3, 4));
});

test('add(3, ab(4)) is 7', t => {
    var ab = new ArrayBuffer(1);
    var dv = new DataView(ab);
    dv.setUint8(0, 4);

    t.is(7, M.add(3, ab));
});

