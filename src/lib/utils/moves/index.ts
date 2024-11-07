import type { SquareOnBoard } from '$types/board';

export function getPathBetweenPositions(start: number[], end: number[], moves: number[][]) {
	const path = [];
	const [startRow, startCol] = start;
	const [endRow, endCol] = end;

	// Determine direction of movement
	const rowDirection = Math.sign(endRow - startRow);
	const colDirection = Math.sign(endCol - startCol);

	// Traverse path
	let currentRow = startRow + rowDirection;
	let currentCol = startCol + colDirection;

	// Add each intermediate position until reaching `end`
	while (currentRow !== endRow || currentCol !== endCol) {
		if (moves.some(([r, c]) => r === currentRow && c === currentCol)) {
			path.push([currentRow, currentCol]);
		}
		currentRow += rowDirection;
		currentCol += colDirection;
		if (currentRow < 0 || currentRow > 7 || currentCol < 0 || currentCol > 7) {
			throw new Error('Out of bounds encountered during path traversal.');
		}
	}

	return path;
}

export function getValidMovesForRook(board: SquareOnBoard[], position: number[], newPos: number[]) {
	// const rowI = row;
	const file = position[0];
	const rank = position[1];
	const validMoves = [];
	const search = newPos;
	// console.log('is a rook');
	// check horizontal moves
	for (let i = 0; i < 8; i++) {
		if (i !== file) {
			const row = i;
			validMoves.push([row, rank]);
		}
	}

	// check vertical moves
	for (let i = 0; i <= 8; i++) {
		if (i !== rank) {
			const row = file;
			const col = i;
			validMoves.push([row, col]);
		}
	}

	// console.log(matrix);

	// console.log(search);

	let found = validMoves.some((arr) => arr.every((val, i) => val === search[i]));

	const getBetween = getPathBetweenPositions(position, newPos, validMoves);
	// console.log(getBetween);
	// is there a piece in the po
	// get squares between moves
	let spaceFree = true;
	for (let i = 0; i < getBetween.length; i++) {
		const getSquare = getSquareFromRC(getBetween[i]);
		const boardDetail = board.filter((el) => el.square === getSquare)[0];
		if (boardDetail.piece !== '') {
			spaceFree = false;
		}
	}
	// let found;
	// for (let i = 0; i < validMoves.length; i++) {
	// 	console.log(search);
	// 	console.log(validMoves[i]);

	// 	if (validMoves[i] === newPos) {
	// 		found = true;
	// 	} else {
	// 		found = false;
	// 	}
	// }
	// console.log(found);

	if (found && spaceFree) {
		return true;
	} else {
		return false;
	}
}
export function getValidMovesForBishop(
	board: SquareOnBoard[],
	position: number[],
	newPos: number[]
) {
	const validMoves = [];
	const search = newPos;
	// console.log('is a bishop');

	// console.log(search);

	let found = false;
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
			validMoves.push([row, col]);
		}

		// Check the diagonal line that goes from top-right to bottom-left
		row = position[0] + i;
		col = position[1] - i;
		if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
			validMoves.push([row, col]);
		}
	}
	found = validMoves.some((arr) => arr.every((val, i) => val === search[i]));
	// console.log(validMoves);
	// console.log('validMoves');
	const getBetween = getPathBetweenPositions(position, newPos, validMoves);
	// console.log(getBetween);
	// is there a piece in the po
	// get squares between moves
	let spaceFree = true;
	for (let i = 0; i < getBetween.length; i++) {
		const getSquare = getSquareFromRC(getBetween[i]);
		const boardDetail = board.filter((el) => el.square === getSquare)[0];
		// console.log(boardDetail);

		if (boardDetail.piece !== '') {
			spaceFree = false;
		}
	}
	// const foundOther = matrix.some((arr) => arr.every((val, i) => val === search[i]));

	if (found && spaceFree) {
		return true;
	} else {
		return false;
	}
}

export function getValidMovesKnight(position: number[], newPos: number[]) {
	const moves = [];
	const [x, y] = position;
	const potentialMoves = [
		[x + 2, y + 1],
		[x + 2, y - 1],
		[x - 2, y + 1],
		[x - 2, y - 1],
		[x + 1, y + 2],
		[x + 1, y - 2],
		[x - 1, y + 2],
		[x - 1, y - 2]
	];
	// console.log('is a knight');

	for (let i = 0; i < potentialMoves.length; i++) {
		const [nextX, nextY] = potentialMoves[i];
		// if (nextX < 0 || nextX > 7 || nextY < 0 || nextY > 7) {
		// 	continue; // Skip invalid moves that go off the board
		// }
		moves.push([nextX, nextY]);
	}

	const search = newPos;
	const matrix = moves;
	// console.log(search);
	// console.log(matrix);
	// console.log('matrix');

	const found = matrix.some((arr) => arr.every((val, i) => val === search[i]));

	if (found) {
		return true;
	} else {
		return false;
	}
}

export function kingMove(currentPos: number[], newPos: number[]) {
	const [currentRow, currentCol] = currentPos;
	const [newRow, newCol] = newPos;

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
	return true;
}

export function getRowAndColumn(square: string): number[] {
	const file = square.charAt(0);
	const rank = parseInt(square.charAt(1), 10) - 1;
	const column = file.charCodeAt(0) - 97;
	const row = 7 - rank;
	return [row, column];
}
export function getSquareFromRC(square: number[]): string {
	const [row, column] = square;
	const file = String.fromCharCode(column + 97); // Convert column to file letter (a-h)
	const rank = 8 - row; // Convert row to rank number (1-8)
	return `${file}${rank}`;
}
