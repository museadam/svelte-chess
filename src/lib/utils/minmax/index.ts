import type { BotMove, MoveHistory, SquareOnBoard, ValidMove } from '$types/board';
import { getSquareFromRC, getRowAndColumn } from '../moves';
import { calcMoves, calcMove } from '../moves/validate';

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

// 	return bestValue;
// }

// Helper function to check if a move is safe from immediate threats by the opponent
// function isMoveSafe(
// 	board: SquareOnBoard[],
// 	move: ValidMove,
// 	opponentColor: 'white' | 'black'
// ): boolean {
// 	// Check if any of the opponent's pieces can reach the position in `move`
// 	for (const square of board) {
// 		if (square.piece?.startsWith(opponentColor) && square.potentialMoves) {
// 			for (const opponentMove of square.potentialMoves) {
// 				if (opponentMove[0] === move[0] && opponentMove[1] === move[1]) {
// 					// Found an opponent move to this position, meaning it's unsafe
// 					return false;
// 				}
// 			}
// 		}
// 	}
// 	return true;
// }

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
		// console.log(square.piece);
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
		pawn: 3,
		knight: 4,
		bishop: 4,
		rook: 5,
		queen: 11,
		king: 1000
	};
	return weights[piece.split('-')[1]] || 0;
}

function isGameOver(board: SquareOnBoard[]): boolean {
	const whiteKing = board.some((square) => square.piece === 'white-king');
	const blackKing = board.some((square) => square.piece === 'black-king');
	return !(whiteKing || blackKing); // Game over if one king is missing
}

// Convert square notation (e.g., 'a2') to row/column format
// function getRowColFromSquare(square: string): [number, number] {
// 	const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
// 	const row = 8 - parseInt(square[1], 10);
// 	return [row, col];
// }

// function toChessNotation(row: number, col: number): string {
// 	const files = 'abcdefgh';
// 	return `${files[col]}${8 - row}`;
// }

const shuffleArray = (board: SquareOnBoard[]) => {
	for (let i = board.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = board[i];
		board[i] = board[j];
		board[j] = temp;
	}
};
export function findBestMove(
	b: SquareOnBoard[],
	depth: number,
	color: 'white' | 'black',
	moveHistory: MoveHistory[]
): BotMove | null {
	let bestMove: BotMove | null = null;
	let bestValue = color === 'white' ? -Infinity : Infinity;
	let board = [...b];
	let boardStatic = [...b];

	shuffleArray(board);

	for (const square of board) {
		if (square.piece?.startsWith(color) && square?.potentialMoves) {
			for (const move of square.potentialMoves) {
				const newBoard = makeMove(boardStatic, square, move, moveHistory);

				const boardValue = minimax(newBoard, depth - 1, color === 'black', moveHistory);

				// Update best move based on maximizing or minimizing player
				if (
					(color === 'white' && boardValue > bestValue) ||
					(color === 'black' && boardValue < bestValue)
				) {
					// console.log(boardValue);
					// console.log('boardValue');
					// console.log(move);
					// console.log('move');

					// console.log(square.piece);
					// console.log('piece');
					bestValue = boardValue;
					if (!square?.piece) continue;
					// if (!square.piece?.includes('pawn')) {
					// 	const sq = square.piece?.replace(/^(white-|black-)/, '');
					// 	let letter = '';
					// 	letter = square.piece?.includes('knight') === true ? 'N' : sq.charAt(0).toUpperCase();
					// 	console.log(letter);
					// 	bestMove = {
					// 		move: letter + square.square,
					// 		moveT: move[2]
					// 	};
					// }
					// bestMove = {
					// 	move: square.square,
					// 	moveT: move[2]
					// };
					if (move) {
						bestMove = {
							from: { ...square }, // starting position in chess notation
							to: { sq: getSquareFromRC([move[0], move[1]]), moveT: move[2] }, // target position in chess notation
							piece: square.piece
						};
					}
				}
			}
		}
	}

	return bestMove;
}
