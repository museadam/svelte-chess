export type SquareOnBoard = {
	square: string;
	color: Colors;
	piece: string;
	coordinates?: Coord;
	potentialMoves?: ValidMove[];
	weight?: number;
};

export type Coord = {
	x: number;
	y: number;
};

export type Colors = 'dark' | 'light';

// [x, y, moveType, weight(strength of move)]
export type ValidMove = [number, number, 'move' | 'attack', number] | undefined;
