import type { SquareOnBoard } from '$types/board';
import { getSquareFromRC } from '.';

export function pawnMove(
	board: SquareOnBoard[],
	currentPos: number[],
	newPos: number[] | null = null,
	color: 'white' | 'black'
): string | boolean | number[][] {
	const [currentRow, currentCol] = currentPos;
	const direction = color === 'white' ? -1 : 1;
	const startRow = color === 'white' ? 6 : 1;
	const promotionRow = color === 'white' ? 0 : 7;
	let upgradePiece;
	let potentialMoves: number[][] = [];

	// Calculate all possible moves if `newPos` is not provided
	if (newPos === null) {
		return (potentialMoves = getPotentialMoves(board, currentPos, direction));
	}

	// Calculate the movement based on the `newPos` provided
	const [newRow, newCol] = newPos;
	const checkCol = currentCol - 1 === newCol || currentCol + 1 === newCol;
	const checkUpDown = newRow - currentRow !== direction;

	// Check if pawn is moving in the wrong direction
	if ((color === 'black' && newRow <= currentRow) || (color === 'white' && newRow >= currentRow)) {
		console.log('Invalid move direction');
		return false;
	}
	const getSquare = getSquareFromRC(newPos);
	const boardDetail = board.filter((el) => el.square === getSquare)[0];
	let attack = false;

	if (!boardDetail.piece.includes(color) && boardDetail.piece !== '') attack = true;
	// Check if pawn is attacking
	if (newCol !== currentCol) {
		if (checkCol && !checkUpDown && attack) {
			console.log('Attack move');

			if (newRow === promotionRow) {
				upgradePiece = color === 'black' ? 'black-queen' : 'white-queen';
			}
			return upgradePiece ?? true;
		} else {
			console.log('Invalid attack move');
			return false;
		}
	}

	// Check if pawn is moving forward more than one space
	if (Math.abs(newRow - currentRow) > 2) {
		console.log('Invalid forward move');
		return false;
	}

	// Check for two-square forward move on first move
	if (currentRow === startRow && newRow === currentRow + 2 * direction) {
		const getSquare = getSquareFromRC([currentRow + direction, currentCol]);
		const boardDetail = board.find((el) => el.square === getSquare);
		if (boardDetail && boardDetail.piece === '') {
			return true;
		} else {
			return false;
		}
	}

	// Check for one-square forward move
	if (newRow !== currentRow + direction) {
		console.log('Invalid one-step forward move');
		return false;
	}

	// Set promotion for reaching the last rank
	if (newRow === promotionRow) upgradePiece = color === 'black' ? 'black-queen' : 'white-queen';

	return upgradePiece ?? true;
}

function getPotentialMoves(board: SquareOnBoard[], currentPos: number[], direction: number) {
	const [currentRow, currentCol] = currentPos;
	let potentialMoves: number[][] = [];

	if (
		board.some(
			(square) =>
				square.coordinates?.[0].x === currentRow + direction &&
				square.coordinates?.[0].y === currentCol
		)
	) {
		potentialMoves.push([currentRow + direction, currentCol]);
	}
	// Two-square forward move from start position
	if (
		currentRow === startRow &&
		board.some(
			(square) =>
				square.coordinates?.[0].x === currentRow + 2 * direction &&
				square.coordinates?.[0].y === currentCol
		)
	) {
		potentialMoves.push([currentRow + 2 * direction, currentCol]);
	}
	// Attack moves
	const attackCols = [currentCol - 1, currentCol + 1];
	for (const col of attackCols) {
		if (
			col >= 0 &&
			col <= 7 &&
			board.some(
				(square) =>
					square.coordinates?.[0].x === currentRow + direction && square.coordinates?.[0].y === col
			)
		) {
			potentialMoves.push([currentRow + direction, col]);
		}
	}
	return potentialMoves;
}
