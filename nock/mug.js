/*
compute mug of any atom
take a bigint and gives us the mug or compute and store
take two mugs and return a new mug
take a cell return cache mug or compute
function that computes a hash given a seed and an atom -> 32bit number 
*/

import JSBI from 'jsbi'
import * as E from './errors.js'
import * as M from './math.js'
import murmur32 from 'murmur-32'
import * as N from './noun.js'

function raw(i, seed) {
    return murmur32(i, seed);
}

function mug(a) {
    var syd = 0xcafebabe;
    var fal = 0x7fff;

    if(a instanceof ArrayBuffer) {
        if(!a.hasOwnProperty('mug')) {
            console.log("hot path arraybuffer");
            a.mug = mum(syd, fal, a);
        }

        return a.mug;
    }
    
    //if a is a cell, split in half, mug both halfs.
    //
    if (a instanceof N.Cell) {
        if(a.mug == 0) {
            console.log("hot path cell");
            a.mug = mugmug(mug(a.head), mug(a.tail));
        }
        return a.mug;
    }
    //needs to be replaced with numberToAb
    // cause it's so hawt.
    a = M.jsbiToAB(JSBI.BigInt(a));

    return mum(syd, fal, a);
    
}


function mugmug(a, b) {
    var syd = 0xdeadbeef;
    var fal = 0xfffe;

    return mum(syd, fal, M.cat(5, a, b));
}

function mum(syd, fal, key) {
    var i;
    var haz = 0;
    var ham = 0;
    
    for(i = 0; i < 8; i++, syd++) {
        var dv = new DataView(raw(key, syd));
        haz = dv.getUint32(0, true);
        ham = (haz >>> 31) ^ (haz & 0x7fffffff);
        if (ham != 0) {
            return ham;
        }
    }

    return fal;    
}

export { raw, mug, mugmug }