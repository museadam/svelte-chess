import type { SquareOnBoard } from '$types/board';

import {
	getValidMovesForRook,
	getValidMovesForBishop,
	getValidMovesKnight,
	kingMove,
	pawnMove
} from '.';

export function validateMove(
	board: SquareOnBoard[],
	piece: string,
	currentPos: number[],
	newPos: number[]
) {
	let moveValid = false;
	const pieceSelect =
		piece.includes('pawn') === true ? piece : piece.replace(/^(white-|black-)/, '');

	switch (pieceSelect) {
		case 'white-pawn':
			moveValid = pawnMove(board, currentPos, newPos, 'white'); //pawnWtMove(currentPos, newPos);
			break;
		case 'black-pawn':
			moveValid = pawnMove(board, currentPos, newPos, 'black'); //  pawnBlkMove(currentPos, newPos);
			break;
		case 'rook':
			moveValid = getValidMovesForRook(board, currentPos, newPos);
			break;
		case 'knight':
			moveValid = getValidMovesKnight(board, currentPos, newPos);
			break;
		case 'bishop':
			moveValid = getValidMovesForBishop(board, currentPos, newPos);
			break;
		case 'queen':
			moveValid =
				getValidMovesForRook(board, currentPos, newPos) === false
					? getValidMovesForBishop(board, currentPos, newPos)
					: true;
			break;
		case 'king':
			moveValid = kingMove(board, currentPos, newPos);
			break;
		default:
			break;
	}

	return moveValid;
}
