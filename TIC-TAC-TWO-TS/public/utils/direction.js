var _a;
class Direction {
    static fromKey(key) {
        var _b;
        return (_b = this.keyDirectionMap.get(key)) !== null && _b !== void 0 ? _b : null;
    }
}
_a = Direction;
Direction.UP_LEFT = -6;
Direction.UP = -5;
Direction.UP_RIGHT = -4;
Direction.LEFT = -1;
Direction.RIGHT = 1;
Direction.DOWN_LEFT = 4;
Direction.DOWN = 5;
Direction.DOWN_RIGHT = 6;
Direction.keyDirectionMap = new Map([
    ['r', _a.UP_LEFT],
    ['t', _a.UP],
    ['y', _a.UP_RIGHT],
    ['f', _a.LEFT],
    ['h', _a.RIGHT],
    ['v', _a.DOWN_LEFT],
    ['b', _a.DOWN],
    ['n', _a.DOWN_RIGHT]
]);
export default Direction;
