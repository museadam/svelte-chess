import type { SquareOnBoard, ValidMove } from '$types/board';
import { getSquareFromRC } from '../moves';

function minimax(board: SquareOnBoard[], depth: number, isMaximizingPlayer: boolean): number {
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
					const newBoard = makeMove(board, square, move);
					const evals = minimax(newBoard, depth - 1, false);
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
					const newBoard = makeMove(board, square, move);
					const evals = minimax(newBoard, depth - 1, true);
					minEval = Math.min(minEval, evals);
				}
			}
		}
		return minEval;
	}
}
function makeMove(board: SquareOnBoard[], square: SquareOnBoard, move: ValidMove): SquareOnBoard[] {
	const newBoard = board.map((sq) => ({ ...sq })); // Create a deep copy of the board
	const targetSquare = newBoard.find((sq) => sq.square === getSquareFromRC([move[0], move[1]]));
	const oldSquare = newBoard.find((sq) => sq.square === square.square);

	if (targetSquare && oldSquare) {
		targetSquare.piece = square.piece; // Move piece to target
		targetSquare.potentialMoves = square.potentialMoves;

		// board[row].piece = targetSquare.piece;
		// board[rowIndex].piece = '';
		// board[rowIndex].potentialMoves = [];
		oldSquare.piece = ''; // Clear original square
		oldSquare.potentialMoves = undefined; // Clear original square
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
	return !(whiteKing && blackKing); // Game over if one king is missing
}

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
	b: SquareOnBoard[],
	depth: number,
	color: 'white' | 'black'
): Move | null {
	let bestMove: Move | null = null;
	let bestValue = color === 'white' ? -Infinity : Infinity;
	const stds = structuredClone(b);
	const board = [...stds];
	for (const square of board) {
		if (square.piece?.startsWith(color) && square?.potentialMoves) {
			for (const move of square.potentialMoves) {
				const newBoard = makeMove(board, square, move);
				const boardValue = minimax(newBoard, depth - 1, color === 'black');
				// console.log(newBoard);
				// console.log(boardValue);
				// console.log(bestValue);

				// Update best move based on maximizing or minimizing player
				if (
					(color === 'white' && boardValue > bestValue) ||
					(color === 'black' && boardValue < bestValue)
				) {
					console.log(move);
					console.log('move');

					// console.log(square.piece);
					// console.log('piece');
					bestValue = boardValue;
					if (!square?.piece) continue;

					bestMove = {
						from: { ...square }, // starting position in chess notation
						to: { sq: getSquareFromRC([move[0], move[1]]), moveT: move[2] } // target position in chess notation
						// piece: square?.piece
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
