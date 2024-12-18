import type { MoveHistory, SquareOnBoard, ValidMove } from '$types/board';

import {
	getValidMovesForRook,
	getValidMovesForBishop,
	getValidMovesKnight,
	kingMove,
	pawnMove,
	getRowAndColumn
} from '.';

export function validateMove(
	board: SquareOnBoard[],
	piece: string,
	currentPos: number[],
	moveHistory: MoveHistory[],
	newPos?: number[]
): boolean | string | ValidMove[] {
	let moveValid: boolean | any = false;
	const pieceSelect =
		piece.includes('pawn') === true ? piece : piece.replace(/^(white-|black-)/, '');

	switch (pieceSelect) {
		case 'white-pawn':
			moveValid = pawnMove(board, currentPos, 'white', newPos); //pawnWtMove(currentPos, newPos);
			break;
		case 'black-pawn':
			moveValid = pawnMove(board, currentPos, 'black', newPos); //  pawnBlkMove(currentPos, newPos);
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
			moveValid = newPos
				? validateQueenMove(board, currentPos, newPos)
				: getQueenMoves(board, currentPos);
			break;
		case 'king':
			moveValid = kingMove(board, currentPos, moveHistory, newPos);
			break;
		default:
			break;
	}
	// console.log(moveValid);
	// console.log('moveValid');
	return moveValid;
}

function getQueenMoves(board: SquareOnBoard[], currentPos: number[]) {
	let rook = getValidMovesForRook(board, currentPos);
	if (!rook) rook = [];
	let bishop = getValidMovesForBishop(board, currentPos) ?? [];
	if (!bishop) bishop = [];
	const queen = [...rook, ...bishop];
	return queen;
}
function validateQueenMove(board: SquareOnBoard[], currentPos: number[], newPos?: number[]) {
	return getValidMovesForRook(board, currentPos, newPos) === false
		? getValidMovesForBishop(board, currentPos, newPos)
		: true;
}

export function calcMoves(board: SquareOnBoard[], moveHistory: MoveHistory[]) {
	for (let i = 0; i < board.length; i++) {
		if (board[i].piece !== '') {
			// console.log('getting mvoes for ' + board[i].piece);
			const currentPos = getRowAndColumn(board[i].square);
			const currentPiece = board[i].piece;
			board[i].potentialMoves = validateMove(board, currentPiece, currentPos, moveHistory) as
				| ValidMove[]
				| undefined;
		}
	}
	return board;
}
export function calcMove(
	board: SquareOnBoard[],
	currentSquare: SquareOnBoard,
	moveHistory: MoveHistory[]
) {
	if (currentSquare.piece !== '') {
		// console.log('getting mvoes for ' + board[i].piece);
		const currentPos = getRowAndColumn(currentSquare.square);
		const currentPiece = currentSquare.piece;
		return validateMove(board, currentPiece, currentPos, moveHistory) as ValidMove[] | undefined;
	}
	// return board;
}
