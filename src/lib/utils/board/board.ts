import type { SquareOnBoard, Colors } from '$types/board.ts';

const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const pieces = [
	{ type: 'rook', color: 'white', position: 'a1' },
	{ type: 'knight', color: 'white', position: 'b1' },
	{ type: 'bishop', color: 'white', position: 'c1' },
	{ type: 'queen', color: 'white', position: 'd1' },
	{ type: 'king', color: 'white', position: 'e1' },
	{ type: 'bishop', color: 'white', position: 'f1' },
	{ type: 'knight', color: 'white', position: 'g1' },
	{ type: 'rook', color: 'white', position: 'h1' },
	{ type: 'pawn', color: 'white', position: 'a2' },
	{ type: 'pawn', color: 'white', position: 'b2' },
	{ type: 'pawn', color: 'white', position: 'c2' },
	{ type: 'pawn', color: 'white', position: 'd2' },
	{ type: 'pawn', color: 'white', position: 'e2' },
	{ type: 'pawn', color: 'white', position: 'f2' },
	{ type: 'pawn', color: 'white', position: 'g2' },
	{ type: 'pawn', color: 'white', position: 'h2' },
	{ type: 'rook', color: 'black', position: 'a8' },
	{ type: 'knight', color: 'black', position: 'b8' },
	{ type: 'bishop', color: 'black', position: 'c8' },
	{ type: 'queen', color: 'black', position: 'd8' },
	{ type: 'king', color: 'black', position: 'e8' },
	{ type: 'bishop', color: 'black', position: 'f8' },
	{ type: 'knight', color: 'black', position: 'g8' },
	{ type: 'rook', color: 'black', position: 'h8' },
	{ type: 'pawn', color: 'black', position: 'a7' },
	{ type: 'pawn', color: 'black', position: 'b7' },
	{ type: 'pawn', color: 'black', position: 'c7' },
	{ type: 'pawn', color: 'black', position: 'd7' },
	{ type: 'pawn', color: 'black', position: 'e7' },
	{ type: 'pawn', color: 'black', position: 'f7' },
	{ type: 'pawn', color: 'black', position: 'g7' },
	{ type: 'pawn', color: 'black', position: 'h7' }
];

function getSquareColor(row: string, column: string): Colors {
	if ((columns.indexOf(column) + rows.indexOf(row)) % 2 === 0) {
		return 'light';
	} else {
		return 'dark';
	}
}

function getPieceType(color: string, type: string) {
	return color + '-' + type;
}

export function setBoard(): SquareOnBoard[] {
	let brd = [];

	for (let row of rows) {
		for (let column of columns) {
			let squareColor = getSquareColor(row, column);
			let piece = pieces.find((p) => p.position === column + row);
			let pieceType = piece ? getPieceType(piece.color, piece.type) : '';
			brd.push({
				square: column + row,
				color: squareColor,
				piece: pieceType
			});
		}
	}
	return brd;
}
