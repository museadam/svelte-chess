import type { SquareOnBoard, ValidMove, MoveHistory } from '$types/board';
import { getSquareFromRC } from '..';

export function castleMoves(
	board: SquareOnBoard[],
	currentPos: number[],
	moveHistory: MoveHistory[]
): ValidMove[] | undefined {
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
	let validMoves: ValidMove[] | undefined;
	let hasKingMoved: boolean | MoveHistory =
		moveHistory.find((el) => el.movedPiece === king) ?? false;
	let hasLeftRookMoved: boolean | MoveHistory =
		moveHistory.find((el) => el.from === leftRook) ?? false;
	let hasRightRookMoved: boolean | MoveHistory =
		moveHistory.find((el) => el.from === rightRook) ?? false;
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
				isClearPath // &&
				// !isUnderAttack(board, currentRow, currentCol + 1, player) &&
				// !isUnderAttack(board, currentRow, currentCol + 2, player)
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
				isClearPath // &&
				// !isUnderAttack(board, currentRow, currentCol - 1, player) &&
				// !isUnderAttack(board, currentRow, currentCol - 2, player)
			) {
				validMoves.push([currentRow, currentCol - 3, 'castle', 0]); // Add queen-side castle move
				// validMoves.push([currentRow, currentCol - 2, 'castleRook', 0]); // Add queen-side castle move
			}
		}
	}
	return validMoves;
}

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

export function getCastlePositions(square: string, newPos: number[], board: SquareOnBoard[]) {
	let rookSq;
	let kingSq;
	switch (square) {
		case 'h1':
			rookSq = [newPos[0], newPos[1] - 2];
			kingSq = [newPos[0], newPos[1] - 1];
			break;
		case 'a1':
			rookSq = [newPos[0], newPos[1] + 2];
			kingSq = [newPos[0], newPos[1] + 1];
			break;
		case 'a8':
			rookSq = [newPos[0], newPos[1] + 2];
			kingSq = [newPos[0], newPos[1] + 1];
			break;
		case 'h8':
			rookSq = [newPos[0], newPos[1] - 2];
			kingSq = [newPos[0], newPos[1] - 1];
			break;
		default:
			rookSq = [newPos[0], newPos[1] - 2];
			kingSq = [newPos[0], newPos[1] - 1];
			break;
	}
	const newKingSq = getSquareFromRC(kingSq);
	const newRookSq = getSquareFromRC(rookSq);

	const indexKing = board.findIndex((element) => element.square === newKingSq);
	const indexRook = board.findIndex((element) => element.square === newRookSq);
	return { indexRook, indexKing };
}
