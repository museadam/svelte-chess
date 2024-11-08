import type { SquareOnBoard, ValidMove } from '$types/board';
import { getSquareFromRC } from '.';

export function getKingMoves(
	board: SquareOnBoard[],
	currentPos: number[]
): ValidMove[] | undefined {
	const [currentRow, currentCol] = currentPos;
	const validMoves: ValidMove[] = [];
	const getPlayer = getSquareFromRC(currentPos);
	const player =
		board.filter((el) => el.square === getPlayer)[0].piece.includes('white') === true
			? 'white'
			: 'black';
	// Define possible move directions for the king (1 square in any direction)
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1], // Top-left, top, top-right
		[0, -1],
		[0, 1], // Left,       , right
		[1, -1],
		[1, 0],
		[1, 1] // Bottom-left, bottom, bottom-right
	];

	// Calculate potential moves
	for (const [dRow, dCol] of directions) {
		const newRow = currentRow + dRow;
		const newCol = currentCol + dCol;

		// Check if the move is within board boundaries
		if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
			const getSquare = getSquareFromRC([newRow, newCol]);
			const boardDetail = board.filter((el) => el.square === getSquare)[0];
			if (boardDetail.piece !== '' && !boardDetail.piece.includes(player)) {
				validMoves.push([newRow, newCol, 'attack']);
			} else if (boardDetail.piece === '') {
				validMoves.push([newRow, newCol, 'move']);
			}
		}
	}
	let ret;
	if (validMoves.length > 0) ret = validMoves;
	return ret;
}

export function kingMove(board: SquareOnBoard[], currentPos: number[], newPos: number[]) {
	const [currentRow, currentCol] = currentPos;
	const [newRow, newCol] = newPos;
	// const validMoves = []

	// if ()
	let ret;
	ret = getKingMoves(board, currentPos);

	if (newRow - currentRow > 1) {
		console.log('row check');

		return false;
	}
	if (newCol - currentCol > 1) {
		console.log('col check');

		return false;
	}
	if (currentRow - newRow > 1) {
		console.log('row check');

		return false;
	}
	if (currentCol - newCol > 1) {
		console.log('col check');

		return false;
	}
	return ret ?? true;
}
