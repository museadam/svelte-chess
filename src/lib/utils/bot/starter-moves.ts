import type { SquareOnBoard } from '$types/board';
import { getRowAndColumn } from '../moves';

export function useOpeningMove(): string[] {
	// use a random open move
	const move = getRandomInt(openingMoves.length - 1);
	return openingMoves[move];
}

export function getMovePiece(board: SquareOnBoard[], color: string, move: string) {
	let letter = 'p';
	// console.log(move);
	// console.log('move');
	let mv = move;
	if (move.length > 2) letter = move[0].toLocaleLowerCase();
	// console.log(letter);
	// console.log('letter');
	let piece = getPieceByLetter(letter);
	piece = `${color}-${piece}`;

	if (letter !== 'p') mv = mv.substring(1);
	if (color === 'black') mv = getMirroredSquare(mv);
	// console.log(mv);
	// console.log('mv');

	const rc = getRowAndColumn(mv);

	let filteredPieces;
	filteredPieces = [...board.filter((el) => el.piece === piece)];
	// if (move.length > 2)
	// else filteredPieces = board.filter((el) => el.square === move);
	// console.log(filteredPieces);
	// console.log('filteredPieces');

	let square;
	for (const move of filteredPieces) {
		// console.log(move);
		// console.log('move');
		if (move?.potentialMoves) {
			for (const potentialMoves of move.potentialMoves) {
				// console.log(potentialMoves);
				// console.log('potentialMoves');
				// console.log(rc);
				// console.log('rc');
				if (potentialMoves[0] === rc[0] && potentialMoves[1] === rc[1]) {
					square = move;
				}
			}
			// console.log(square2);
			// console.log('square2');
		}
	}
	return { square, mv };
}

function getPieceByLetter(letter: string) {
	let ret;
	switch (letter) {
		case 'p':
			ret = 'pawn';
			break;
		case 'r':
			ret = 'rook';
			break;
		case 'n':
			ret = 'knight';
			break;
		case 'b':
			ret = 'bishop';
			break;
		case 'q':
			ret = 'queen';
			break;
		case 'k':
			ret = 'king';
			break;
		default:
			break;
	}
	return ret;
}

const openingMoves = [
	// queens open
	// 	Trompowsky: 1.d4  2.Bg5.
	['d4', 'Bg5'],
	// London System: 1.d4  2.Nf3.
	['d4', 'Nf3'],

	// Colle System: 1.d4 2.Nf3 3.Bf4.
	['d4', 'Nf3', 'Bf4'],

	// Torre Attack:  1.d4  2.Nf3 3.Bg5.
	['d4', 'Nf3', 'Bg5'],

	// kings open
	// Ruy Lopez: 1.e4  2.Nf3  3.Bb5 (or 3.Bc4)
	['e4', 'Nf3', 'Bb5'],
	['e4', 'Nf3', 'Bc4'],

	// Italian Game: 1.e4  2.Nf3  3.Bc4
	['e4', 'Nf3', 'Bc5'],

	// Vienna Game: 1.e4  2.Nf3  3.Nc3
	['e4', 'Nf3', 'Nc3'],

	// King’s Gambit: 1.e4  2.f4 (or 2.d4)
	['e4', 'f4'],
	['e4', 'd4'],

	// other
	['c4', 'Nf3']
];

function getRandomInt(max: number) {
	return Math.floor(Math.random() * (max + 1));
}

export function getMirroredSquare(square: string): string {
	const file = square[0]; // Get the file (e.g., 'e' from 'e6')
	const rank = parseInt(square[1]); // Get the rank as an integer (e.g., 6 from 'e6')

	// Mirror the rank (8 - current rank + 1)
	const mirroredRank = 9 - rank;

	// Return the mirrored square
	return `${file}${mirroredRank}`;
}
