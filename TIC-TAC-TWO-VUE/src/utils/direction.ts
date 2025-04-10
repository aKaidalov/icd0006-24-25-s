class Direction {
    static readonly UP_LEFT = -6;
    static readonly UP = -5;
    static readonly UP_RIGHT = -4;
    static readonly LEFT = -1;
    static readonly RIGHT = 1;
    static readonly DOWN_LEFT = 4;
    static readonly DOWN = 5;
    static readonly DOWN_RIGHT = 6;

    private static readonly keyDirectionMap: Map<string, number> = new Map([
        ["r", this.UP_LEFT],
        ["t", this.UP],
        ["y", this.UP_RIGHT],
        ["f", this.LEFT],
        ["h", this.RIGHT],
        ["v", this.DOWN_LEFT],
        ["b", this.DOWN],
        ["n", this.DOWN_RIGHT],
    ]);

    static fromKey(key: string): number | null {
        return this.keyDirectionMap.get(key) ?? null;
    }
}

export default Direction;
