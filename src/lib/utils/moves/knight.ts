import type { SquareOnBoard } from '$types/board';
import { getSquareFromRC } from '.';

export function getValidMovesKnight(board: SquareOnBoard[], position: number[], newPos?: number[]) {
	const moves = [];
	const getPlayer = getSquareFromRC(position);
	const getPlayPositionDetails = board.filter((el) => el.square === getPlayer)[0];

	const player = getPlayPositionDetails.piece.includes('white') === true ? 'white' : 'black';

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
		if (nextX < 0 || nextX > 7 || nextY < 0 || nextY > 7) {
			continue; // Skip invalid moves that go off the board
		}
		const getSquare = getSquareFromRC([nextX, nextY]);
		const boardDetail = board.filter((el) => el.square === getSquare)[0];

		if (boardDetail.piece !== '' && !boardDetail.piece.includes(player)) {
			moves.push([nextX, nextY, 'attack']);
		} else if (boardDetail.piece === '') {
			moves.push([nextX, nextY, 'move']);
		}
	}
	// console.log(moves);
	let found;

	if (newPos) found = moves.some((arr) => arr[0] === newPos[0] && arr[1] === newPos[1]);

	if (!newPos || found) {
		return moves;
	} else {
		return false;
	}
}
