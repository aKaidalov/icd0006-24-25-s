class Direction {
    static UP_LEFT = -6;
    static UP = -5;
    static UP_RIGHT = -4;
    static LEFT = -1;
    static RIGHT = 1;
    static DOWN_LEFT = 4;
    static DOWN = 5;
    static DOWN_RIGHT = 6;

    static #keyDirectionMap = new Map([
        ['r', this.UP_LEFT],
        ['t', this.UP],
        ['y', this.UP_RIGHT],
        ['f', this.LEFT],
        ['h', this.RIGHT],
        ['v', this.DOWN_LEFT],
        ['b', this.DOWN],
        ['n', this.DOWN_RIGHT]
    ]);

    static fromKey(key) {
        return this.#keyDirectionMap.get(key) || null;
    }
};

export default Direction;