import type { SquareOnBoard } from '$types/board';
import { calculateValidMove } from '.';

export function getValidMovesForBishop(
	board: SquareOnBoard[],
	position: number[],
	newPos?: number[]
) {
	const validMoves = [];

	// console.log('is a bishop');
	// The bishop can move diagonally in any direction, so we need to check all diagonal lines
	for (let i = -7; i <= 7; i++) {
		// Ignore moves that don't actually move the bishop
		if (i === 0) {
			continue;
		}
		// Check the diagonal line that goes from top-left to bottom-right
		let row = position[0] + i;
		let col = position[1] + i;
		if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
			const move = calculateValidMove(board, position, [row, col]);

			if (move) validMoves.push(move);
		}

		// Check the diagonal line that goes from top-right to bottom-left
		row = position[0] + i;
		col = position[1] - i;
		if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
			const move = calculateValidMove(board, position, [row, col]);

			if (move) validMoves.push(move);
		}
	}
	let found;
	if (newPos) found = validMoves.some((arr) => arr[0] === newPos[0] && arr[1] === newPos[1]);

	// const foundOther = matrix.some((arr) => arr.every((val, i) => val === search[i]));
	// console.log(validMoves);
	if (!newPos || found) {
		return validMoves;
	} else {
		return false;
	}
}
