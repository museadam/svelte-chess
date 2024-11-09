import type { MoveHistory, SquareOnBoard, ValidMove } from '$types/board';
import { getSquareFromRC } from '../moves';
import { calcMoves } from '../moves/validate';

//  version 1

function minimax(
	board: SquareOnBoard[],
	depth: number,
	isMaximizingPlayer: boolean,
	moveHistory: MoveHistory[]
): number {
	// Base case: Evaluate the board at the given depth or if the game is over
	if (depth === 0 || isGameOver(board)) {
		return evaluateBoard(board);
	}

	// Maximize for white, minimize for black
	if (isMaximizingPlayer) {
		let maxEval = -Infinity;
		for (const square of board) {
			if (square.piece?.startsWith('white') && square.potentialMoves) {
				for (const move of square.potentialMoves) {
					const newBoard = makeMove(board, square, move, moveHistory);
					const evals = minimax(newBoard, depth - 1, false, moveHistory);
					maxEval = Math.max(maxEval, evals);
				}
			}
		}
		return maxEval;
	} else {
		let minEval = Infinity;
		for (const square of board) {
			if (square.piece?.startsWith('black') && square.potentialMoves) {
				for (const move of square.potentialMoves) {
					const newBoard = makeMove(board, square, move, moveHistory);
					const evals = minimax(newBoard, depth - 1, true, moveHistory);
					minEval = Math.min(minEval, evals);
				}
			}
		}
		return minEval;
	}
}

//  version 2
// function minimax(
// 	board: SquareOnBoard[],
// 	depth: number,
// 	isMaximizingPlayer: boolean,
// 	color: 'white' | 'black'
// ): number {
// 	// Base case: Evaluate the board at max depth or if the game is over
// 	if (depth === 0 || isGameOver(board)) {
// 		return evaluateBoard(board);
// 	}

// 	let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

// 	for (const square of board) {
// 		// Check if the square has the current player's piece and moves
// 		if (square.piece?.startsWith(color) && square.potentialMoves) {
// 			for (const move of square.potentialMoves) {
// 				const newBoard = makeMove(board, square, move);

// 				// Check if moving here would be threatened by opponent moves
// 				if (!isMoveSafe(newBoard, move, isMaximizingPlayer ? 'black' : 'white')) {
// 					continue; // Skip moves that are immediately threatened
// 				}

// 				// Run minimax recursively for the next depth and opponent
// 				const evalValue = minimax(
// 					newBoard,
// 					depth - 1,
// 					!isMaximizingPlayer,
// 					isMaximizingPlayer ? 'black' : 'white'
// 				);

// 				if (isMaximizingPlayer) {
// 					bestValue = Math.max(bestValue, evalValue);
// 				} else {
// 					bestValue = Math.min(bestValue, evalValue);
// 				}
// 			}
// 		}
// 	}

// 	return bestValue;
// }

// Helper function to check if a move is safe from immediate threats by the opponent
function isMoveSafe(
	board: SquareOnBoard[],
	move: ValidMove,
	opponentColor: 'white' | 'black'
): boolean {
	// Check if any of the opponent's pieces can reach the position in `move`
	for (const square of board) {
		if (square.piece?.startsWith(opponentColor) && square.potentialMoves) {
			for (const opponentMove of square.potentialMoves) {
				if (opponentMove[0] === move[0] && opponentMove[1] === move[1]) {
					// Found an opponent move to this position, meaning it's unsafe
					return false;
				}
			}
		}
	}
	return true;
}

function makeMove(
	board: SquareOnBoard[],
	square: SquareOnBoard,
	move: ValidMove,
	moveHistory: MoveHistory[]
): SquareOnBoard[] {
	const newBoard = board.map((sq) => ({ ...sq })); // Create a deep copy of the board
	const targetSquare = newBoard.find((sq) => sq.square === getSquareFromRC([move[0], move[1]]));
	const oldSquare = newBoard.find((sq) => sq.square === square.square);

	if (targetSquare && oldSquare) {
		targetSquare.piece = square.piece; // Move piece to target
		// targetSquare.potentialMoves = squa;re.potentialMoves

		oldSquare.piece = ''; // Clear original square
		oldSquare.potentialMoves = undefined; // Clear original square
		calcMoves(newBoard, moveHistory);
	}
	return newBoard;
}

function evaluateBoard(board: SquareOnBoard[]): number {
	let score = 0;
	for (const square of board) {
		if (square.piece?.startsWith('white')) {
			score += getPieceValue(square.piece);
		} else if (square.piece?.startsWith('black')) {
			score -= getPieceValue(square.piece);
		}
	}
	return score;
}

function getPieceValue(piece: string): number {
	const weights: { [key: string]: number } = {
		pawn: 1,
		knight: 3,
		bishop: 3,
		rook: 5,
		queen: 9,
		king: 1000
	};
	return weights[piece.split('-')[1]] || 0;
}

function isGameOver(board: SquareOnBoard[]): boolean {
	const whiteKing = board.some((square) => square.piece === 'white-king');
	const blackKing = board.some((square) => square.piece === 'black-king');
	return !(whiteKing || blackKing); // Game over if one king is missing
}

// function isUnderThreat(
// 	board: SquareOnBoard[],
// 	position: ValidMove,
// 	opponentColor: 'white' | 'black'
// ): boolean {
// 	// Checks if any opponent piece has a move to the given position
// 	// console.log(opponentColor);
// 	// console.log('opponentColor');

// 	for (const square of board) {
// 		if (square.piece?.startsWith(opponentColor) && square.potentialMoves) {
// 			// console.log('enemy moves detected');
// 			// console.log(square.potentialMoves);
// 			// console.log(position);

// 			if (
// 				square.potentialMoves.some((move) => move[0] === position[0] && move[1] === position[1])
// 			) {
// 				const targetSquare = board.find(
// 					(sq) => sq.square === getSquareFromRC([position[0], position[1]])
// 				);
// 				if (
// 					targetSquare &&
// 					targetSquare.piece?.startsWith(opponentColor === 'white' ? 'black' : 'white')
// 				) {
// 					// console.log('enemy move at given position');
// 					// console.log(position);
// 					return true; // It's a real threat if it targets a piece
// 				}
// 			}
// 		}
// 	}
// 	return false;
// }

// function respondToThreats(board: SquareOnBoard[], color: 'white' | 'black'): ValidMove | null {
// 	const opponentColor = color === 'white' ? 'black' : 'white';

// 	for (const square of board) {
// 		if (square.piece?.startsWith(color) && square.potentialMoves) {
// 			// console.log(square);
// 			// console.log('square');
// 			const piecePosition = getRowColFromSquare(square.square);

// 			if (isUnderThreat(board, piecePosition, opponentColor)) {
// 				// Attempt to counter the threat:

// 				// 1. Move the threatened piece to a safe square
// 				for (const move of square.potentialMoves) {
// 					if (!isUnderThreat(board, move, opponentColor)) {
// 						return move; // Return a safe move to escape the threat
// 					}
// 				}

// 				// 2. Attempt to capture the threatening piece
// 				for (const move of square.potentialMoves) {
// 					const targetSquare = board.find(
// 						(sq) => sq.square === getSquareFromRC([move[0], move[1]])
// 					);
// 					if (targetSquare && targetSquare.piece?.startsWith(opponentColor)) {
// 						return move; // Return the move to capture the threat
// 					}
// 				}

// 				// 3. Attempt to block the threat with another piece
// 				for (const allySquare of board) {
// 					if (allySquare.piece?.startsWith(color) && allySquare.potentialMoves) {
// 						for (const move of allySquare.potentialMoves) {
// 							const blockingSquare = getSquareFromRC([move[0], move[1]]);
// 							if (blockingSquare === square.square) {
// 								return move; // Return the blocking move
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// 	return null; // No immediate threat response needed
// }

// Convert square notation (e.g., 'a2') to row/column format
// function getRowColFromSquare(square: string): [number, number] {
// 	const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
// 	const row = 8 - parseInt(square[1], 10);
// 	return [row, col];
// }

// Integrate into minimax, prioritizing threat responses if any

// function minimax(
// 	board: SquareOnBoard[],
// 	depth: number,
// 	isMaximizingPlayer: boolean,
// 	color: 'white' | 'black'
// ): number {
// 	if (depth === 0 || isGameOver(board)) {
// 		return evaluateBoard(board);
// 	}

// 	let threatResponse;
// 	if (!threatResponse) threatResponse = respondToThreats(board, color);
// 	if (threatResponse) {
// 		// If there's a threat response, handle it immediately
// 		const newBoard = makeMove(
// 			board,
// 			board.find((sq) => sq.square === getSquareFromRC(threatResponse)),
// 			threatResponse
// 		);
// 		return minimax(newBoard, depth - 1, !isMaximizingPlayer, color === 'white' ? 'black' : 'white');
// 	}

// 	let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
// 	const currentColor = isMaximizingPlayer ? color : color === 'white' ? 'black' : 'white';

// 	for (const square of board) {
// 		if (square.piece?.startsWith(currentColor) && square.potentialMoves) {
// 			const opponentColor = color === 'white' ? 'black' : 'white';

// 			const enemyKingPos = board.find((sq) => sq.piece.includes(`${opponentColor}-king`))?.square;
// 			const kingRC = getRowColFromSquare(enemyKingPos);
// 			const yourKingPos = board.find((sq) => sq.piece.includes(`${color}-king`))?.square;
// 			const uKingRC = getRowColFromSquare(yourKingPos);
// 			// console.log(enemyKingPos);
// 			// console.log('enemyKingPos');

// 			for (const move of square.potentialMoves) {
// 				if (kingRC[0] === move[0] && kingRC[1] === move[1])
// 					return isMaximizingPlayer ? -Infinity : Infinity;
// 				if (uKingRC[0] === move[0] && uKingRC[1] === move[1])
// 					return isMaximizingPlayer ? -Infinity : Infinity;
// 				const newBoard = makeMove(board, square, move);
// 				const evalValue = minimax(
// 					newBoard,
// 					depth - 1,
// 					!isMaximizingPlayer,
// 					currentColor === 'white' ? 'black' : 'white'
// 				);
// 				if (!isMoveSafe(newBoard, move, isMaximizingPlayer ? 'black' : 'white')) {
// 					continue; // Skip moves that are immediately threatened
// 				}
// 				bestValue = isMaximizingPlayer
// 					? Math.max(bestValue, evalValue)
// 					: Math.min(bestValue, evalValue);
// 			}
// 		}
// 	}
// 	return bestValue;
// }

// function toChessNotation(row: number, col: number): string {
// 	const files = 'abcdefgh';
// 	return `${files[col]}${8 - row}`;
// }

type Move = {
	from: SquareOnBoard; // starting square in chess notation, e.g., "e2"
	to: string; // target square in chess notation, e.g., "e4"
	// piece: string; // the piece being moved, e.g., "white-pawn"
};

export function findBestMove(
	board: SquareOnBoard[],
	depth: number,
	color: 'white' | 'black',
	moveHistory: MoveHistory[]
): Move | null {
	let bestMove: Move | null = null;
	let bestValue = color === 'white' ? -Infinity : Infinity;
	// const stds = structuredClone(b);
	// const board = [...stds];
	// console.log(color);
	// console.log('finding BestMove');

	for (const square of board) {
		if (square.piece?.startsWith(color) && square?.potentialMoves) {
			for (const move of square.potentialMoves) {
				const newBoard = makeMove(board, square, move, moveHistory);

				const boardValue = minimax(newBoard, depth - 1, color === 'black', moveHistory);
				// console.log(newBoard);
				// console.log(boardValue);
				// console.log(bestValue);

				// Update best move based on maximizing or minimizing player
				if (
					(color === 'white' && boardValue > bestValue) ||
					(color === 'black' && boardValue < bestValue)
				) {
					// console.log(move);
					// console.log('move');

					// console.log(square.piece);
					// console.log('piece');
					bestValue = boardValue;
					if (!square?.piece) continue;

					bestMove = {
						from: { ...square }, // starting position in chess notation
						to: { sq: getSquareFromRC([move[0], move[1]]), moveT: move[2] }, // target position in chess notation
						piece: square.piece
					};
					// console.log(bestMove);
					// console.log('bestMove1');
					// break;
				}
			}
		}
	}

	// console.log(bestMove);
	// console.log('bestMove2');
	return bestMove;
}
