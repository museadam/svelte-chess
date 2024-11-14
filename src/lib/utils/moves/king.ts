import type { SquareOnBoard, ValidMove, MoveHistory } from '$types/board';
import { getRowAndColumn, getSquareFromRC } from '.';
import { calcMoves } from './validate';

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
				if (boardDetail.piece === '') {
					validMoves.push([newRow, newCol, 'move', 0]);
				} else if (!boardDetail.piece.includes(player)) {
					validMoves.push([newRow, newCol, 'attack', 0]);
				}
			}
		}
	}

	// Check for castling moves if king and rook have not moved
	const getMoves = castleMoves(board, currentPos, moveHistory);
	if (getMoves) validMoves = [...validMoves, ...getMoves];

	return validMoves.length > 0 ? validMoves : [];
}

// Helper function to determine if a square is under attack
function isUnderAttack(board: SquareOnBoard[], row: number, col: number, player: string): boolean {
	for (const square of board) {
		if (square.piece && !square.piece.includes(player) && square.potentialMoves) {
			for (const move of square.potentialMoves) {
				if (move[0] === row && move[1] === col) {
					return true; // Square is under attack
				}
			}
		}
	}
	return false;
}
function createMovesAfter(
	board: SquareOnBoard[],
	move: ValidMove[],
	oldLocation: SquareOnBoard,
	moveHistory: MoveHistory[],
	player: string
) {
	const newBoard = board.map((sq) => ({ ...sq })); // Create a deep copy of the board
	const targetSquare = newBoard.find((sq) => sq.square === getSquareFromRC([move[0], move[1]]));
	const oldSquare = newBoard.find((sq) => sq.square === oldLocation.square);
	if (targetSquare && oldSquare) {
		targetSquare.piece = oldLocation.piece; // Move piece to target
		// targetSquare.potentialMoves = squa;re.potentialMoves

		oldSquare.piece = ''; // Clear original square
		oldSquare.potentialMoves = undefined; // Clear original square
		calcMoves(newBoard, moveHistory);
	}
	return isPotentialDeath(newBoard, move, player);
}

function isPotentialDeath(board: SquareOnBoard[], newPos: number[], player: string): boolean {
	let ret = false;
	for (const square of board) {
		if (square.piece && !square.piece.includes(player) && square.potentialMoves) {
			if (square.piece.includes('pawn')) {
				const move = getRowAndColumn(square.square);
				const pawnAttack = checkPotentialPawnAttacks(player, move);
				if (pawnAttack[0][0] === newPos[0] && pawnAttack[0][1] === newPos[1]) ret = true;
				if (pawnAttack[1][0] === newPos[0] && pawnAttack[1][1] === newPos[1]) ret = true;
			}
			for (const move of square.potentialMoves) {
				if (square.piece.includes('knight')) {
					console.log('knight moves: ');

					console.log(move);
					console.log('move');
					console.log(newPos);
					console.log('newPos');
				}

				// console.log(square);

				if (move[0] === newPos[0] && move[1] === newPos[1]) {
					if (square.piece.includes('pawn')) {
						if (move[2] !== 'attack') {
							ret = false;
							console.log('pawwn retter');
						} else ret = true;
					} else {
						ret = true;
					}
				}
			}
		}
	}

	return ret;
}
function checkPotentialPawnAttacks(player: string, move: ValidMove | number[]) {
	let retL = [0, 0];
	let retR = [0, 0];
	if (player === 'white') {
		retL[0] = move[0] + 1;
		retR[0] = move[0] + 1;
	} else {
		retL[0] = move[0] - 1;
		retR[0] = move[0] - 1;
	}

	retL[1] = move[1] - 1;
	retR[1] = move[1] + 1;

	return [retL, retR];
}

function castleMoves(board: SquareOnBoard[], currentPos: number[], moveHistory: MoveHistory[]) {
	const getPlayer = getSquareFromRC(currentPos);
	const player = board.find((el) => el.square === getPlayer)?.piece.includes('white')
		? 'white'
		: 'black';
	const [currentRow, currentCol] = currentPos;
	const king = `${player}-king`;
	// console.log(player);
	let leftRook = 'a1';
	let rightRook = 'h1';
	if (player === 'black') {
		leftRook = 'h8';
		rightRook = 'a8';
	}
	let validMoves;
	let hasKingMoved: boolean = moveHistory.find((el) => el.movedPiece === king) ?? false;
	let hasLeftRookMoved: boolean = moveHistory.find((el) => el.from === leftRook) ?? false;
	let hasRightRookMoved: boolean = moveHistory.find((el) => el.from === rightRook) ?? false;
	if (!hasKingMoved) {
		validMoves = [];
		// King-side castling (right)
		if (!hasRightRookMoved) {
			const rightSquares = [
				getSquareFromRC([currentRow, currentCol + 1]),
				getSquareFromRC([currentRow, currentCol + 2])
			];
			const isClearPath = rightSquares.every(
				(sq) => board.find((el) => el.square === sq)?.piece === ''
			);

			if (
				isClearPath &&
				!isUnderAttack(board, currentRow, currentCol + 1, player) &&
				!isUnderAttack(board, currentRow, currentCol + 2, player)
			) {
				validMoves.push([currentRow, currentCol + 3, 'castle', 0]); // Add king-side castle move
			}
		}

		// Queen-side castling (left)
		if (!hasLeftRookMoved) {
			const leftSquares = [
				getSquareFromRC([currentRow, currentCol - 1]),
				getSquareFromRC([currentRow, currentCol - 2]),
				getSquareFromRC([currentRow, currentCol - 3])
			];
			const isClearPath = leftSquares.every(
				(sq) => board.find((el) => el.square === sq)?.piece === ''
			);

			if (
				isClearPath &&
				!isUnderAttack(board, currentRow, currentCol - 1, player) &&
				!isUnderAttack(board, currentRow, currentCol - 2, player)
			) {
				validMoves.push([currentRow, currentCol - 3, 'castle', 0]); // Add queen-side castle move
				// validMoves.push([currentRow, currentCol - 2, 'castleRook', 0]); // Add queen-side castle move
			}
		}
	}
	return validMoves;
}

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
	if (newRow && newCol) {
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
		const check = ret.some((el) => el[0] === newRow && el[1] === newCol);
		const item = ret.filter((el) => el[0] === newRow && el[1] === newCol);

		// console.log(item);
		// console.log('item');
		// console.log(check);
		// console.log('check');
		// console.log(newPos);
		// console.log('newPos');
		const safeMove = isPotentialDeath(board, newPos, player);
		let safeMoveAfter = false;
		if (!safeMove) {
			safeMoveAfter = createMovesAfter(board, newPos, getPlayer, moveHistory, player);
		}
		console.log(safeMove);
		console.log('safeMove');
		console.log(safeMoveAfter);
		console.log('safeMoveAfter');
		if (safeMove || safeMoveAfter) {
			return false;
		}
		if (check) {
			const castler = item[0][2] ?? false;

			// console.log('found a castle move');
			const ret = castler === 'castle' ? 'castle' : true;

			return ret;
		}
	}
	return false;
}
