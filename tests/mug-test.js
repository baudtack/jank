import test from 'ava'
import * as M from '../nock/mug.js'
import '../nock/errors.js'
import JSBI from 'jsbi'
import * as N from '../nock/noun.js'


test('mug(0) is 2046756072', t => {
    t.is(2046756072, M.mug(0));
});

test('mug(50) is 1.971.556.966', t => {
    t.is(1971556966, M.mug(50));
});

test('mug(5000) is 1.974.699.195', t => {
    t.is(1974699195, M.mug(5000));
});

test('mugmug', t => {
    t.is(439145499, M.mugmug(1974699195, 1971556966));
});

test('mug cells', t => {
    t.is(439145499, M.mug(new N.Cell(5000, 50)));
});