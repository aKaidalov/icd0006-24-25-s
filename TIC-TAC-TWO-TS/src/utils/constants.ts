export const TOTAL_SQUARES: number = 25;
export const GRID_STARTING_SQUARES: number[] = [6, 7, 8, 11, 12, 13, 16, 17, 18];
export const GAME_MODE = {
    PVP: "PvP",
    PVE: "PvE",
};
export type GameMode = typeof GAME_MODE[keyof typeof GAME_MODE];
export const PLAYERS: [string, string] = ['X', 'O'];
export const GRID_BOUNDS: number[] = [6, 7, 8, 11, 12, 13, 16, 17, 18];
export const FOUR_MOVES: number = 4;
export const AI_DELAY:number = 500;
export const POSSIBLE_KEYS: string[] = ['r', 't', 'y', 'f', 'h', 'v', 'b', 'n'];
