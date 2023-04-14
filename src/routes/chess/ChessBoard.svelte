<script lang="ts">
	import ChessPiece from './ChessPiece.svelte';
	export let board;
	function handleKeyPress(event) {
		console.log(event);
	}
	function getRowAndColumn(square) {
		const file = square.charAt(0);
		const rank = parseInt(square.charAt(1), 10) - 1;
		const column = file.charCodeAt(0) - 97;
		const row = 7 - rank;
		return [row, column];
	}
	let attackMove = false;

	function pawnBlkMove(currentPos, newPos) {
		const [currentRow, currentCol] = currentPos;
		const [newRow, newCol] = newPos;

		// check if pawn is moving forward
		if (newCol !== currentCol) {
			if ((currentCol - 1 === newCol || currentCol + 1 === newCol) && attackMove) {
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

		// check if pawn is moving backwards
		if (newRow <= currentRow) {
			console.log('hi3');

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

		// valid move
		return true;
	}

	function pawnWtMove(currentPos, newPos) {
		const [currentRow, currentCol] = currentPos;
		const [newRow, newCol] = newPos;

		// check if pawn is moving forward
		if (newCol !== currentCol) {
			if ((currentCol - 1 === newCol || currentCol + 1 === newCol) && attackMove) {
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
		if (newRow >= currentRow) {
			console.log('hi3');

			return false;
		}

		// check if pawn is moving two spaces forward on its first move
		if (currentRow === 6 && newRow === 4) {
			console.log('hi4');

			return true;
		}

		// check if pawn is moving one space forward
		if (newRow - currentRow !== -1) {
			console.log(newRow - currentRow);
			console.log('hi5' + (newRow - currentRow));

			return false;
		}

		// check if there is a piece blocking the pawn's path
		// if (board[newRow][newCol] !== null) {
		// 	return false;
		// }

		// valid move
		return true;
	}
	let moveValid = false;
	let attackValid = false;
	function getValidMovesForRook(position, newPos) {
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
		console.log(found);

		if (found) {
			return true;
		} else {
			return false;
		}
	}
	function getValidMovesForBishop(position, newPos) {
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

	function getValidMovesKnight(position, newPos) {
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

	function kingMove(currentPos, newPos) {
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
	function validateMove(piece, currentPos, newPos) {
		// const moves = [];
		// // Calculate valid moves for knight
		// const piec = board.find((p) => p.square === square);

		// if (!piec) {
		// 	return moves;
		// }
		const movableBish = getValidMovesForBishop(currentPos, newPos);
		const movableRook = getValidMovesForRook(currentPos, newPos);

		switch (piece) {
			case 'white-pawn':
				moveValid = pawnWtMove(currentPos, newPos);
				break;
			case 'black-pawn':
				moveValid = pawnBlkMove(currentPos, newPos);
				break;
			case 'white-rook':
				moveValid = movableRook;
				break;
			case 'black-rook':
				moveValid = movableRook;
				break;
			case 'white-knight':
				moveValid = getValidMovesKnight(currentPos, newPos);
				break;
			case 'black-knight':
				moveValid = getValidMovesKnight(currentPos, newPos);
				break;
			case 'white-bishop':
				moveValid = movableBish;
				break;
			case 'black-bishop':
				moveValid = movableBish;
				break;
			case 'white-queen':
				moveValid = movableRook === false ? movableBish : true;
				break;
			case 'black-queen':
				moveValid = movableRook === false ? movableBish : true;
				break;
			case 'white-king':
				moveValid = kingMove(currentPos, newPos);
				break;
			case 'black-king':
				moveValid = kingMove(currentPos, newPos);
				break;
			default:
				break;
		}

		return moveValid;
	}
	// export let board;
	const myKills = [];
	const theirKills = [];
	async function handleDrop(event, row, square) {
		// Get the piece data from the data transfer object
		const [piece, rowIndex, pieceSquare, pieceColor] = event.dataTransfer
			.getData('text/plain')
			.split(',');

		// is piece a piece?? where you came from
		const selectedPiece = board.find((piece) => piece.square === pieceSquare);
		console.log(selectedPiece);
		console.log('selectedPiece');

		// Check if the move is valid
		const currentPos = getRowAndColumn(pieceSquare);
		const newPos = getRowAndColumn(square.square);
		console.log(currentPos);
		console.log(newPos);
		const [color, p] = square.piece.split('-');
		const [selectedColor, sp] = selectedPiece.piece.split('-');
		if (square.piece === '') {
			attackMove = false;
		} else if (color == selectedColor) {
			attackMove = false;
		} else {
			attackMove = true;
		}

		// validateMove(piece, currentPos, newPos);
		const isValidMove = validateMove(piece, currentPos, newPos); // moveValid; // true; // checkMove(board, [piecePosition], [row, square.position]);
		const isAttackValid = attackValid;
		console.log(isValidMove);

		// console.log(color);
		// console.log(p);

		if (isValidMove && selectedPiece) {
			// Update the board state with the new position of the piece
			if (attackMove) {
				board[row].piece = piece;

				myKills.push(board[rowIndex].piece);
				attackMove = false;

				if (square.square !== pieceSquare) {
					board[rowIndex].piece = '';
				}
			} else if (square.piece === '') {
				board[row].piece = piece;

				if (square.square !== pieceSquare) {
					board[rowIndex].piece = '';
				}
			}
		}

		event.preventDefault();
	}
	let handleDragFlag = false;
	function handleDragOver(event, square) {
		// console.log(square);
		// console.log('event');

		event.preventDefault();
		event.dataTransfer.dropEffect = 'drop';
	}

	function handleChessComponent(event) {
		console.log(event);
		handleDragFlag = event;
	}
</script>

<!-- 
<div class="score-card">
	<div class="player-name">Player 1</div>
	<div class="score">{myKills.length}</div>
</div> -->
<div class="chess-board">
	{#each board as square, rowIndex}
		<div class="chess-row">
			<div
				class="square {square.color}"
				on:drop={(event) => handleDrop(event, rowIndex, square)}
				on:dragover={() => handleDragOver(event, square)}
			>
				{#if square.piece}
					<ChessPiece {square} {rowIndex} on:dragger={() => handleChessComponent}>
						<span class={square.piece} />
					</ChessPiece>
				{/if}
			</div>
		</div>
	{/each}
</div>

<!-- <div class="score-card">
	<div class="player-name">Player 2</div>
	<div class="score">{myKills.length}</div>
</div>

{#if myKills.length > 0}
	{#each myKills as kill}
		<div class="chess-piece">
			<span class={kill} />
		</div>
	{/each}
{/if} -->
<style>
	:global([draggable]) {
		-webkit-touch-callout: none;
		-ms-touch-action: none;
		touch-action: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.score-card {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #f2f2f2;
		padding: 10px;
		border-radius: 5px;
		width: 300px;
		margin-bottom: 10px;
		border-style: solid;
		border-width: 4px;
		border-image: radial-gradient(
			circle at center,
			red,
			orange,
			yellow,
			green,
			blue,
			indigo,
			violet,
			red
		);
		animation: gradient-border 10s ease infinite;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}
	@keyframes gradient-border {
		0% {
			border-image-slice: 1;
		}
		25% {
			border-image-slice: 20;
		}
		50% {
			border-image-slice: 40;
		}
		75% {
			border-image-slice: 60;
		}
		100% {
			border-image-slice: 80;
		}
	}

	.player-name {
		font-weight: bold;
	}

	.score {
		font-size: 24px;
	}
	.chess-board {
		display: grid;
		grid-template-columns: repeat(8, 50px);
		grid-template-rows: repeat(8, 50px);
		grid-gap: 0;
	}
	.chess-piece {
		position: absolute;
		width: 60px;
		height: 60px;
		user-select: none;
		z-index: 10;
		pointer-events: none;
	}

	.chess-square:hover .chess-piece {
		pointer-events: all;
	}

	.chess-piece:active {
		opacity: 0.5;
	}
	.square {
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40px;
	}

	.dark {
		background-color: #769656;
	}

	.light {
		background-color: #eee;
	}

	.white-king:before {
		content: '\2654';
	}

	.white-queen:before {
		content: '\2655';
	}

	.white-rook:before {
		content: '\2656';
	}

	.white-bishop:before {
		content: '\2657';
	}

	.white-knight:before {
		content: '\2658';
	}

	.white-pawn:before {
		content: '\2659';
	}

	.black-king:before {
		content: '\265A';
	}

	.black-queen:before {
		content: '\265B';
	}

	.black-rook:before {
		content: '\265C';
	}

	.black-bishop:before {
		content: '\265D';
	}

	.black-knight:before {
		content: '\265E';
	}

	.black-pawn:before {
		content: '\265F';
	}
</style>
