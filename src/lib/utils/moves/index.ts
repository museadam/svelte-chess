import type { SquareOnBoard } from '$types/board.ts';

function getRowAndColumn(square: SquareOnBoard) {
    const file = square.charAt(0);
    const rank = parseInt(square.charAt(1), 10) - 1;
    const column = file.charCodeAt(0) - 97;
    const row = 7 - rank;
    return [row, column];
}
let attackMove = false;

function pawnBlkMove(currentPos: number[], newPos: number[]) {
    const [currentRow, currentCol] = currentPos;
    const [newRow, newCol] = newPos;

    const checkCol = currentCol - 1 === newCol || currentCol + 1 === newCol;
    // const checkRow = currentRow - 1 === newRow || currentRow + 1 === newRow;
    const checkUpDown = newRow - currentRow !== 1;
    // console.log(checkUpDown);
    // console.log('checkUpDown');

    // is it attacking left to right?
    if (newRow <= currentRow) {
        console.log('hi3');
        return false;
    }
    // check if pawn is moving forward
    if (newCol !== currentCol) {
        if (checkCol && !checkUpDown && attackMove) {
            console.log('attack');

            return true;
        } else {
            console.log('hi1 move false');

            return false;
        }
    }

    // check if pawn is moving more than one space forward
    if (newRow - currentRow > 2) {
        console.log('hi2');

        return false;
    }

    // check if pawn is moving two spaces forward on its first move
    if (currentRow === 1 && newRow === 3) {
        console.log('hi4');

        return true;
    }
    // check if pawn is moving one space forward
    if (newRow - currentRow !== 1) {
        console.log('hi5' + (newRow - currentRow));

        return false;
    }
    console.log(newRow - currentRow);

    // check if there is a piece blocking the pawn's path
    // if (board[newRow][newCol] !== null) {
    // 	return false;
    // }
    // !not valid move attack getting this far is not vaild!
    //
    if (attackMove) {
        return false;
    }
    return true;
}

function pawnWtMove(currentPos: number[], newPos: number[]) {
    const [currentRow, currentCol] = currentPos;
    const [newRow, newCol] = newPos;
    const checkCol = currentCol - 1 === newCol || currentCol + 1 === newCol;
    const checkUpDown = newRow - currentRow !== -1;
    if (newRow >= currentRow) {
        console.log('hi3');
        return false;
    }

    // check if pawn is moving forward
    if (newCol !== currentCol) {
        if (checkCol && !checkUpDown && attackMove) {
            console.log('attack');

            return true;
        } else {
            console.log('hi1 move false');

            return false;
        }
    }

    // check if pawn is moving more than one space forwards
    if (newRow - currentRow > 2) {
        console.log('hi2');

        return false;
    }

    // check if pawn is moving direction

    // check if pawn is moving two spaces forward on its first move
    if (currentRow === 6 && newRow === 4) {
        console.log('hi4');

        return true;
    }

    // check if pawn is moving one space forward
    if (newRow - currentRow !== -1) {
        // console.log(newRow - currentRow);
        console.log('hi5' + (newRow - currentRow));

        return false;
    }

    // check if there is a piece blocking the pawn's path
    // if (board[newRow][newCol] !== null) {
    // 	return false;
    // }

    // !not valid move attack getting this far is not vaild!
    //
    if (attackMove) {
        return false;
    }
    return true;
}

function getValidMovesForRook(position: number[], newPos: number[]) {
    const file = position[0];
    const rank = position[1];
    const validMoves = [];

    // check horizontal moves
    for (let i = 0; i < 8; i++) {
        if (i !== file) {
            const row = i;
            validMoves.push([row, rank]);
        }
    }

    // check vertical moves
    for (let i = 0; i <= 8; i++) {
        if (i !== rank) {
            const row = file;
            const col = i;
            validMoves.push([row, col]);
        }
    }
    const matrix = validMoves;
    const search = newPos;

    // console.log(matrix);

    // console.log(search);
    const found = matrix.some((arr) => arr.every((val, i) => val === search[i]));
    // let found;
    // for (let i = 0; i < validMoves.length; i++) {
    // 	console.log(search);
    // 	console.log(validMoves[i]);

    // 	if (validMoves[i] === newPos) {
    // 		found = true;
    // 	} else {
    // 		found = false;
    // 	}
    // }
    // console.log(found);

    if (found) {
        return true;
    } else {
        return false;
    }
}
function getValidMovesForBishop(position: number[], newPos: number[]) {
    const validMoves = [];
    // The bishop can move diagonally in any direction, so we need to check all diagonal lines
    for (let i = -7; i <= 7; i++) {
        // Ignore moves that don't actually move the bishop
        if (i === 0) {
            continue;
        }

        // Check the diagonal line that goes from top-left to bottom-right
        let row = position[0] + i;
        let col = position[1] + i;
        if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
            validMoves.push([row, col]);
        }

        // Check the diagonal line that goes from top-right to bottom-left
        row = position[0] + i;
        col = position[1] - i;
        if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
            validMoves.push([row, col]);
        }
    }
    const search = newPos;
    const matrix = validMoves;

    const found = matrix.some((arr) => arr.every((val, i) => val === search[i]));

    if (found) {
        return true;
    } else {
        return false;
    }
}

function getValidMovesKnight(position: number[], newPos: number[]) {
    const moves = [];
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

    for (let i = 0; i < potentialMoves.length; i++) {
        const [nextX, nextY] = potentialMoves[i];
        if (nextX < 0 || nextX > 7 || nextY < 0 || nextY > 7) {
            continue; // Skip invalid moves that go off the board
        }
        moves.push([nextX, nextY]);
    }

    const search = newPos;
    const matrix = moves;
    // console.log(search);
    // console.log(moves);

    const found = matrix.some((arr) => arr.every((val, i) => val === search[i]));

    if (found) {
        return true;
    } else {
        return false;
    }
}

function kingMove(currentPos: number[], newPos: number[]) {
    const [currentRow, currentCol] = currentPos;
    const [newRow, newCol] = newPos;

    if (newRow - currentRow > 1) {
        console.log('row check');

        return false;
    }
    if (newCol - currentCol > 1) {
        console.log('col check');

        return false;
    }
    if (currentRow - newRow > 1) {
        console.log('row check');

        return false;
    }
    if (currentCol - newCol > 1) {
        console.log('col check');

        return false;
    }
    return true;
}