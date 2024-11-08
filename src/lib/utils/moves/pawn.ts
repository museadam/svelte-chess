import type { SquareOnBoard, ValidMove } from '$types/board';
import { getSquareFromRC } from '.';

export function pawnMove(
	board: SquareOnBoard[],
	currentPos: number[],
	color: 'white' | 'black',
	newPos?: number[] | undefined
): string | boolean | ValidMove[] {
	const [currentRow, currentCol] = currentPos;
	const direction = color === 'white' ? -1 : 1;
	let upgradePiece;

	const startRow = color === 'white' ? 6 : 1;
	const promotionRow = color === 'white' ? 0 : 7;
	let potentialMoves: ValidMove[] = [];
	// console.log(board);
	// console.log('board');

	// Calculate all possible moves if `newPos` is not provided
	if (!newPos) {
		return (potentialMoves = calculatePawnMoves(board, currentPos, color));
	} else {
		// Calculate the movement based on the `newPos` provided
		const [newRow, newCol] = newPos;
		const checkCol = currentCol - 1 === newCol || currentCol + 1 === newCol;
		const checkUpDown = newRow - currentRow !== direction;

		// Check if pawn is moving in the wrong direction
		if (
			(color === 'black' && newRow <= currentRow) ||
			(color === 'white' && newRow >= currentRow)
		) {
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
}

export function calculatePawnMoves(
	board: SquareOnBoard[],
	currentPos: number[],
	color: 'white' | 'black'
): ValidMove[] {
	const [currentRow, currentCol] = currentPos;
	const direction = color === 'white' ? -1 : 1;
	const startRow = color === 'white' ? 6 : 1;
	const potentialMoves: ValidMove[] = [];

	// Convert row/col to chess notation
	const toChessNotation = (row: number, col: number): string => {
		const file = String.fromCharCode(97 + col); // Convert col index (0-7) to file (a-h)
		const rank = (8 - row).toString(); // Convert row index (0-7) to rank (8-1)
		return `${file}${rank}`;
	};

	// One square forward
	const forwardOne = toChessNotation(currentRow + direction, currentCol);
	if (board.some((square) => square.square === forwardOne && square.piece === '')) {
		potentialMoves.push([currentRow + direction, currentCol, 'move', 0]);
	}

	// Two squares forward from start position
	const forwardTwo = toChessNotation(currentRow + 2 * direction, currentCol);
	if (
		currentRow === startRow &&
		board.some((square) => square.square === forwardTwo && square.piece === '')
	) {
		potentialMoves.push([currentRow + 2 * direction, currentCol, 'move', 0]);
	}

	// Diagonal attack moves
	const attackCols = [currentCol - 1, currentCol + 1];
	for (const col of attackCols) {
		if (col >= 0 && col <= 7) {
			const attackSquare = toChessNotation(currentRow + direction, col);
			if (
				board.some(
					(square) =>
						square.square === attackSquare &&
						square.piece !== '' &&
						square.piece.startsWith(color === 'white' ? 'black-' : 'white-')
				)
			) {
				potentialMoves.push([currentRow + direction, col, 'attack', 0]);
			}
		}
	}

	return potentialMoves;
}
