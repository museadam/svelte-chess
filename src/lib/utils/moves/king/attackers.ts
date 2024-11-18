import type { SquareOnBoard, ValidMove, MoveHistory } from '$types/board';
import { getRowAndColumn, getSquareDetails, getSquareFromRC } from '..';
import { calcMoves } from '../validate';
export function createMovesAfter(
	board: SquareOnBoard[],
	move: number[],
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

export function isPotentialDeath(
	board: SquareOnBoard[],
	newPos: number[] | ValidMove[],
	player: string
): boolean {
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
				// if (square.piece.includes('knight')) {
				// 	console.log('knight moves: ');

				// }

				// console.log(square);

				if (move[0] === newPos[0] && move[1] === newPos[1]) {
					console.log(move);
					console.log('move');
					console.log(newPos);
					console.log('newPos');
					if (square.piece.includes('pawn')) {
						if (move[2] !== 'attack') {
							ret = false;
							// console.log('pawwn retter');
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
