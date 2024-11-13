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
export type ValidMove = [number, number, 'move' | 'attack' | 'castle' | 'promotion', number];

export type MoveHistory = {
	to: string; // to square
	from: string; // from square
	movedPiece: string;
	removedPiece?: string;
};
