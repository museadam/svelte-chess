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

// ValidMove is for potential moves
// [x, y, moveType, weight(strength of move)]
export type ValidMove = [number, number, 'move' | 'attack' | 'castle' | 'promotion', number];

// for bots
export type BotMove = {
	// move: string;
	// moveT: string;
	from: SquareOnBoard;
	to: { sq: string; moveT: string };
	piece: string;
};

export type MoveHistory = {
	to: string; // to square
	from: string; // from square
	movedPiece: string;
	removedPiece?: string;
};
