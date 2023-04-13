<script lang="ts">
	import ChessPiece from './ChessPiece.svelte';
	let rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
	let columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	let board = [];
	let pieces = [
		{ type: 'rook', color: 'white', position: 'a1' },
		{ type: 'knight', color: 'white', position: 'b1' },
		{ type: 'bishop', color: 'white', position: 'c1' },
		{ type: 'queen', color: 'white', position: 'd1' },
		{ type: 'king', color: 'white', position: 'e1' },
		{ type: 'bishop', color: 'white', position: 'f1' },
		{ type: 'knight', color: 'white', position: 'g1' },
		{ type: 'rook', color: 'white', position: 'h1' },
		{ type: 'pawn', color: 'white', position: 'a2' },
		{ type: 'pawn', color: 'white', position: 'b2' },
		{ type: 'pawn', color: 'white', position: 'c2' },
		{ type: 'pawn', color: 'white', position: 'd2' },
		{ type: 'pawn', color: 'white', position: 'e2' },
		{ type: 'pawn', color: 'white', position: 'f2' },
		{ type: 'pawn', color: 'white', position: 'g2' },
		{ type: 'pawn', color: 'white', position: 'h2' },
		{ type: 'rook', color: 'black', position: 'a8' },
		{ type: 'knight', color: 'black', position: 'b8' },
		{ type: 'bishop', color: 'black', position: 'c8' },
		{ type: 'queen', color: 'black', position: 'd8' },
		{ type: 'king', color: 'black', position: 'e8' },
		{ type: 'bishop', color: 'black', position: 'f8' },
		{ type: 'knight', color: 'black', position: 'g8' },
		{ type: 'rook', color: 'black', position: 'h8' },
		{ type: 'pawn', color: 'black', position: 'a7' },
		{ type: 'pawn', color: 'black', position: 'b7' },
		{ type: 'pawn', color: 'black', position: 'c7' },
		{ type: 'pawn', color: 'black', position: 'd7' },
		{ type: 'pawn', color: 'black', position: 'e7' },
		{ type: 'pawn', color: 'black', position: 'f7' },
		{ type: 'pawn', color: 'black', position: 'g7' },
		{ type: 'pawn', color: 'black', position: 'h7' }
	];

	function getSquareColor(row, column) {
		if ((columns.indexOf(column) + rows.indexOf(row)) % 2 === 0) {
			return 'light';
		} else {
			return 'dark';
		}
	}

	function getPieceType(color, type) {
		return color + '-' + type;
	}

	for (let row of rows) {
		for (let column of columns) {
			let squareColor = getSquareColor(row, column);
			let piece = pieces.find((p) => p.position === column + row);
			let pieceType = piece ? getPieceType(piece.color, piece.type) : '';

			board.push({
				square: column + row,
				color: squareColor,
				piece: pieceType
			});
		}
	}
	console.log(board);
	// let board = [];

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
	function pawnBlkMove(currentPos, newPos) {
		const [currentRow, currentCol] = currentPos;
		const [newRow, newCol] = newPos;

		// check if pawn is moving forward
		if (newCol !== currentCol) {
			console.log('hi1');
			return false;
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
			console.log('hi1');
			return false;
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
	function validateMove(piece, currentPos, newPos) {
		// const moves = [];
		// // Calculate valid moves for knight
		// const piec = board.find((p) => p.square === square);

		// if (!piec) {
		// 	return moves;
		// }

		switch (piece) {
			case 'white-pawn':
				moveValid = pawnWtMove(currentPos, newPos);
				break;
			case 'black-pawn':
				moveValid = pawnBlkMove(currentPos, newPos);
				break;
			case 'white-rook':
				moveValid = true;
				break;
			case 'black-rook':
				// TODO: add logic for rook
				moveValid = true;
				break;
			case 'white-knight':
				moveValid = true;
				break;
			case 'black-knight':
				// TODO: add logic for knight
				moveValid = true;

				break;
			case 'white-bishop':
				moveValid = true;
				break;
			case 'black-bishop':
				// TODO: add logic for bishop
				moveValid = true;

				break;
			case 'white-queen':
				moveValid = true;
				break;
			case 'black-queen':
				// TODO: add logic for queen
				moveValid = true;

				break;
			case 'white-king':
				moveValid = true;
				break;
			case 'black-king':
				// TODO: add logic for king
				moveValid = true;

				break;
			default:
				break;
		}

		return moveValid;
	}
	// export let board;

	async function handleDrop(event, row, square) {
		// Get the piece data from the data transfer object
		const [piece, rowIndex, pieceSquare, pieceColor] = event.dataTransfer
			.getData('text/plain')
			.split(',');

		// is piece a piece??
		const selectedPiece = board.find((piece) => piece.square === pieceSquare);
		console.log(selectedPiece);

		// Check if the move is valid
		const currentPos = getRowAndColumn(pieceSquare);
		const newPos = getRowAndColumn(square.square);
		console.log(currentPos);
		console.log(newPos);

		// validateMove(piece, currentPos, newPos);
		const isValidMove = validateMove(piece, currentPos, newPos); // moveValid; // true; // checkMove(board, [piecePosition], [row, square.position]);
		const isAttackValid = attackValid;

		if (isValidMove && square.piece === '' && selectedPiece) {
			// Update the board state with the new position of the piece

			// new position
			console.log(square);

			board[row].piece = piece;
			// board[row].type = square.position //  = { position: square.position, type: pieceType, color: pieceColor };
			// console.log(typeof row);
			// console.log(typeof rowIndex);

			// remove old position if position is diff
			if (square.square !== pieceSquare) {
				board[rowIndex].piece = '';
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

<div class="chess-board">
	{#each board as square, rowIndex}
		<div class="chess-row">
			<!-- {#each square as col, columnIndex}-->
			<!-- {square.square} -->
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
			<!-- 	{/each} -->
		</div>
	{/each}
	<!-- class:dark={isDarkSquare(rowIndex, columnIndex)} -->
	<!--  -->
	<!-- {#each board as row, rowIndex}
		<div class="chess-row">
			{#each row as square, columnIndex}
				<div
					class="chess-square"
					on:drop={(event) => handleDrop(event, rowIndex, columnIndex)}
					on:dragover={handleDragOver}
				>
					{#if square.piece}
						<ChessPiece piece={square.piece} row={rowIndex} column={columnIndex} />
					{/if}
				</div>
			{/each}
		</div>
	{/each} -->
</div>

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
