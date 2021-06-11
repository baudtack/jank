import JSBI from 'jsbi'
import * as E from './errors.js'
import * as M from './math.js'

function Cell(head, tail) {
    this.head = head;
    this.tail = tail;
    this.mug = 0;
}

Cell.prototype.constructor = Cell;
Cell.prototype.deep = true;

export { Cell }