import type { SquareOnBoard, ValidMove, MoveHistory } from '$types/board';
import { getSquareDetails, getSquareFromRC } from '..';
import { createMovesAfter, isPotentialDeath } from './attackers';
import { castleMoves } from './castle';

export function getKingMoves(
	board: SquareOnBoard[],
	currentPos: number[],
	moveHistory: MoveHistory[]
): ValidMove[] | [] {
	const [currentRow, currentCol] = currentPos;
	let validMoves: ValidMove[] = [];
	const getPlayer = getSquareFromRC(currentPos);
	const player = board.find((el) => el.square === getPlayer)?.piece.includes('white')
		? 'white'
		: 'black';

	// console.log(moveHistory);
	// console.log('moveHistory');

	// console.log(hasRightRookMoved);
	// console.log('hasRightRookMoved');
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

	// Calculate standard king moves
	for (const [dRow, dCol] of directions) {
		const newRow = currentRow + dRow;
		const newCol = currentCol + dCol;

		// Check if the move is within board boundaries
		if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
			const targetSquare = getSquareFromRC([newRow, newCol]);
			const boardDetail = board.find((el) => el.square === targetSquare);
			if (boardDetail) {
				// const safeMove = isPotentialDeath(board, [newRow, newCol], player);
				// if (!safeMove) {
				// 	// console.log(getPlayer);

				// 	const getSquare = getSquareDetails(getPlayer, board);
				// 	// console.log(getSquare);
				// 	const safeMoveAfter = createMovesAfter(
				// 		board,
				// 		[newRow, newCol],
				// 		getSquare,
				// 		moveHistory,
				// 		player
				// 	);
				// 	if (!safeMoveAfter) {
				if (boardDetail.piece === '') {
					validMoves.push([newRow, newCol, 'move', 0]);
				} else if (!boardDetail.piece.includes(player)) {
					validMoves.push([newRow, newCol, 'attack', 0]);
				}
				// }
				// }
			}
		}
	}

	// Check for castling moves if king and rook have not moved
	const getMoves = castleMoves(board, currentPos, moveHistory);
	if (getMoves) validMoves = [...validMoves, ...getMoves];

	return validMoves.length > 0 ? validMoves : [];
}

// Helper function to determine if a square is under attack

export function kingMove(
	board: SquareOnBoard[],
	currentPos: number[],
	moveHistory: MoveHistory[],
	newPos?: number[]
) {
	const [currentRow, currentCol] = currentPos;
	let ret;
	ret = getKingMoves(board, currentPos, moveHistory);
	const getPlayer = getSquareFromRC(currentPos);
	const player = board.find((el) => el.square === getPlayer)?.piece.includes('white')
		? 'white'
		: 'black';
	let newRow: number | undefined, newCol: number | undefined;
	if (newPos) [newRow, newCol] = newPos;
	// const validMoves = []
	// console.log(ret);
	// let basic move check
	if (newRow && newCol && newPos) {
		// console.log(newPos);
		// console.log('newPos');

		// if ()

		// const getMoves = castleMoves(board, currentPos, moveHistory);
		// if (getMoves) validMoves = [...validMoves, ...getMoves];

		// if (newRow - currentRow > 1) {
		// 	console.log('row check');

		// 	return false;
		// }
		// if (newCol - currentCol > 1) {
		// 	console.log('col check');

		// 	return false;
		// }
		// if (currentRow - newRow > 1) {
		// 	console.log('row check');

		// 	return false;
		// }
		// if (currentCol - newCol > 1) {
		// 	console.log('col check');

		// 	return false;
		// }
		// const check = ret.some((el) => el[0] === newRow && el[1] === newCol);
		// const item = ret.filter((el) => el[0] === newRow && el[1] === newCol);

		// console.log(item);
		// console.log('item');
		// console.log(check);
		// console.log('check');
		// console.log(newPos);
		// console.log('newPos');
		const safeMove = isPotentialDeath(board, newPos, player);
		let safeMoveAfter = false;
		if (!safeMove && newPos) {
			// console.log(getPlayer);

			const getSquare = getSquareDetails(getPlayer, board);
			// console.log(getSquare);
			safeMoveAfter = createMovesAfter(board, newPos, getSquare, moveHistory, player);
		}
		console.log(safeMove);
		console.log('safeMove');
		console.log(safeMoveAfter);
		console.log('safeMoveAfter');
		if (safeMove || safeMoveAfter) {
			return false;
		} else {
			// const castler = item[0][2] ?? false;

			// console.log('found a castle move');
			// const ret = castler === 'castle' ? 'castle' : true;

			return ret;
		}
	}
	return ret;
}
