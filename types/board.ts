export type SquareOnBoard = {
	square: string;
	color: Colors;
	piece: string;
	coordinates?: Coord;
};

export type Coord = {
	x: number;
	y: number;
};

export type Colors = 'dark' | 'light';

export type ValidMove = [number, number, 'move' | 'attack'] | undefined;
