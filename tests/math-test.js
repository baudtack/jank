import test from 'ava';
import * as M from '../nock/math.js';
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
    t.is(54, M.met(0, JSBI.BigInt('0x20000000000000')));
});

test('met(0, 0xffff.ffff.ffff.ffff) is 64', t => {
    t.is(64, M.met(0, JSBI.BigInt('0xffffffffffffffff')));
});

test('met(0, 0xffff.ffff.ffff.ffff.ffff.ffff.ffff.ffff) is 128', t => {
    t.is(128, M.met(0, JSBI.BigInt('0xffffffffffffffffffffffffffffffff')));
});

test('met(3, 0x2.ffff.ffff.ffff.ffff.ffff.ffff.ffff.ffff) is 17', t => {
    t.is(17, M.met(3, JSBI.BigInt('0x2ffffffffffffffffffffffffffffffff')));
});
