class Direction {
    static readonly UP_LEFT: number = -6;
    static readonly UP: number = -5;
    static readonly UP_RIGHT: number = -4;
    static readonly LEFT: number = -1;
    static readonly RIGHT: number = 1;
    static readonly DOWN_LEFT: number = 4;
    static readonly DOWN: number = 5;
    static readonly DOWN_RIGHT: number = 6;

    private static readonly keyDirectionMap: Map<string, number> = new Map([
        ['r', this.UP_LEFT],
        ['t', this.UP],
        ['y', this.UP_RIGHT],
        ['f', this.LEFT],
        ['h', this.RIGHT],
        ['v', this.DOWN_LEFT],
        ['b', this.DOWN],
        ['n', this.DOWN_RIGHT]
    ]);

    static fromKey(key: string): number | null {
        return this.keyDirectionMap.get(key) ?? null;
    }
}

export default Direction;
