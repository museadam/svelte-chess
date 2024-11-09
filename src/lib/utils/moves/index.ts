import type { SquareOnBoard, ValidMove } from '$types/board';

export * from './pawn';
export * from './rook';
export * from './knight';
export * from './bishop';
export * from './king';

export function getPathBetweenPositions(start: number[], end: number[], moves: number[][]) {
	const path: number[][] = [];
	const [startRow, startCol] = start;
	const [endRow, endCol] = end;

	// Check if start and end are in a valid straight line (diagonal, horizontal, or vertical)
	const isDiagonal = Math.abs(endRow - startRow) === Math.abs(endCol - startCol);
	const isHorizontal = startRow === endRow;
	const isVertical = startCol === endCol;
	// console.log(isDiagonal);
	// console.log(isHorizontal);
	// console.log(isVertical);

	if (!(isDiagonal || isHorizontal || isVertical)) {
		throw new Error('Start and end positions are not on a valid path.');
	}

	// If start and end are the same, return an empty path
	if (startRow === endRow && startCol === endCol) {
		return path;
	}

	// Determine direction of movement
	const rowDirection = Math.sign(endRow - startRow);
	const colDirection = Math.sign(endCol - startCol);

	// Traverse path
	let currentRow = startRow + rowDirection;
	let currentCol = startCol + colDirection;

	while (currentRow !== endRow || currentCol !== endCol) {
		if (moves.some(([r, c]) => r === currentRow && c === currentCol)) {
			path.push([currentRow, currentCol]);
		}
		currentRow += rowDirection;
		currentCol += colDirection;

		// Safety check to avoid infinite loops
		if (currentRow < 0 || currentRow > 7 || currentCol < 0 || currentCol > 7) {
			throw new Error('Out of bounds encountered during path traversal.');
		}
	}

	return path;
}

export function getRowAndColumn(square: string): number[] {
	const file = square.charAt(0);
	const rank = parseInt(square.charAt(1), 10) - 1;
	const column = file.charCodeAt(0) - 97;
	const row = 7 - rank;
	return [row, column];
}
export function getSquareFromRC(square: number[]) {
	const [row, column] = square;
	const file = String.fromCharCode(column + 97); // Convert column to file letter (a-h)
	const rank = 8 - row; // Convert row to rank number (1-8)
	return `${file}${rank}`;
}

function setAllMoves() {
	const allMoves = [];

	for (let row = 0; row <= 7; row++) {
		for (let col = 0; col <= 7; col++) {
			allMoves.push([row, col]);
		}
	}
	return allMoves;
}

export function calculateValidMove(
	board: SquareOnBoard[],
	oldPosition: number[],
	newPosition: number[]
): ValidMove {
	const getPlayer = getSquareFromRC(oldPosition);
	const player =
		board.filter((el) => el.square === getPlayer)[0].piece.includes('white') === true
			? 'white'
			: 'black';

	const allMoves = setAllMoves();
	const [row, col] = newPosition;
	const getSquare = getSquareFromRC(newPosition);
	const boardDetail = board.filter((el) => el.square === getSquare)[0];

	const getBetween = getPathBetweenPositions(oldPosition, newPosition, allMoves);
	// console.log(boardDetail);

	let spacesBetweenFree = true;
	for (let i = 0; i < getBetween.length; i++) {
		const getSq = getSquareFromRC(getBetween[i]);
		const boardDet = board.filter((el) => el.square === getSq)[0];
		// console.log(boardDet);

		if (boardDet.piece !== '') {
			spacesBetweenFree = false;
		}
	}
	if (boardDetail.piece !== '' && spacesBetweenFree && !boardDetail.piece.includes(player)) {
		return [row, col, 'attack', 0];
	} else if (boardDetail.piece === '' && spacesBetweenFree && !boardDetail.piece.includes(player)) {
		return [row, col, 'move', 0];
	} else {
		return;
	}
}
