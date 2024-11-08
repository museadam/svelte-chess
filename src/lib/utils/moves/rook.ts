import type { SquareOnBoard } from '$types/board';
import { calculateValidMove } from '.';

export function getValidMovesForRook(board: SquareOnBoard[], position: number[], newPos: number[]) {
	const file = position[0];
	const rank = position[1];
	const validMoves = [];

	for (let i = 0; i < 8; i++) {
		if (i !== file) {
			const row = i;
			const col = rank;
			const move = calculateValidMove(board, position, [row, col]);
			if (move) validMoves.push(move);
		}
	}

	// check vertical moves
	for (let i = 0; i <= 7; i++) {
		if (i !== rank) {
			const row = file;
			const col = i;
			const move = calculateValidMove(board, position, [row, col]);

			if (move) validMoves.push(move);
		}
	}

	const found = validMoves.some((arr) => arr[0] === newPos[0] && arr[1] === newPos[1]);

	if (found && validMoves) {
		return validMoves;
	} else {
		return false;
	}
}
