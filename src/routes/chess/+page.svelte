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

	// function createBoard() {
	// 	const board = [];
	// 	for (let row = 0; row < rows.length; row++) {
	// 		for (let col = 0; col < columns.length; col++) {
	// 			const square = {
	// 				row,
	// 				col,
	// 				piece: null
	// 			};
	// 			board.push(square);
	// 		}
	// 	}
	// 	return board;
	// }
	// $: board = createBoard();
	function movePiece(position) {
		const selectedPiece = pieces.find((piece) => piece.position === position);

		if (!selectedPiece) {
			// If no piece is selected, do nothing
			return;
		}

		const validMoves = getValidMoves(selectedPiece);

		const destination = prompt(`Valid moves: ${validMoves.join(', ')}. Choose a destination:`);

		if (!destination || !validMoves.includes(destination)) {
			// If no destination is chosen or the destination is not valid, do nothing
			return;
		}

		selectedPiece.position = destination;

		// Update the board
		board = createBoard(rows, columns, pieces);
	}
	function handleKeyPress(event) {
		console.log(event);
	}
	function getRowAndColumn(position) {
		const file = position.charAt(0);
		const rank = parseInt(position.charAt(1), 10) - 1;
		const column = file.charCodeAt(0) - 97;
		const row = 7 - rank;
		return [row, column];
	}
	const knightMoves = [
		[2, 1],
		[1, 2],
		[-1, 2],
		[-2, 1],
		[-2, -1],
		[-1, -2],
		[1, -2],
		[2, -1]
	];
	const bishopMoves = [
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1]
	];
	const rookMoves = [
		[-1, 0],
		[0, -1],
		[1, 0],
		[0, 1]
	];
	const queenMoves = [
		[-1, 0],
		[0, -1],
		[1, 0],
		[0, 1],
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1]
	];

	const kingMoves = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1]
	];
	let row;
	let column;
	let piece;
	function getValidMoves(piece) {
		const validMoves = [];
		// Calculate valid moves for knight

		let knightRow;
		let knightColumn;

		let kingRow;
		let kingColumn;

		switch (piece.type) {
			case 'pawn':
				// Calculate valid moves for pawn
				row = parseInt(piece.position[1]);
				column = columns.indexOf(piece.position[0]);

				// Calculate valid moves for white pawn
				if (piece.color === 'white') {
					if (row === 2) {
						// White pawn can move two squares forward from starting position
						if (!board[3][column].piece) {
							validMoves.push(`${columns[column]}3`);
							if (!board[4][column].piece) {
								validMoves.push(`${columns[column]}4`);
							}
						}
					}

					// White pawn can move one square forward if destination square is empty
					if (row < 8 && !board[row][column].piece) {
						validMoves.push(`${columns[column]}${row + 1}`);
					}

					// White pawn can capture diagonally if destination square contains a black piece
					if (row < 8 && column > 0 && board[row + 1][column - 1].piece?.color === 'black') {
						validMoves.push(`${columns[column - 1]}${row + 1}`);
					}

					if (row < 8 && column < 7 && board[row + 1][column + 1].piece?.color === 'black') {
						validMoves.push(`${columns[column + 1]}${row + 1}`);
					}
				}
				// Calculate valid moves for black pawn
				else if (piece.color === 'black') {
					if (row === 7) {
						// Black pawn can move two squares forward from starting position
						if (!board[6][column].piece) {
							validMoves.push(`${columns[column]}6`);
							if (!board[5][column].piece) {
								validMoves.push(`${columns[column]}5`);
							}
						}
					}

					// Black pawn can move one square forward if destination square is empty
					if (row > 1 && !board[row - 2][column].piece) {
						validMoves.push(`${columns[column]}${row - 1}`);
					}

					// Black pawn can capture diagonally if destination square contains a white piece
					if (row > 1 && column > 0 && board[row - 2][column - 1].piece?.color === 'white') {
						validMoves.push(`${columns[column - 1]}${row - 1}`);
					}

					if (row > 1 && column < 7 && board[row - 2][column + 1].piece?.color === 'white') {
						validMoves.push(`${columns[column + 1]}${row - 1}`);
					}
				}
				break;
			case 'knight':
				[knightRow, knightColumn] = getRowAndColumn(piece.position);
				row = parseInt(piece.position[1]);
				column = columns.indexOf(piece.position[0]);

				for (const [rowOffset, columnOffset] of knightMoves) {
					const destinationRow = knightRow + rowOffset;
					const destinationColumn = knightColumn + columnOffset;

					if (
						destinationRow >= 0 &&
						destinationRow <= 7 &&
						destinationColumn >= 0 &&
						destinationColumn <= 7
					) {
						const destinationSquare = board[destinationRow][destinationColumn];

						if (!destinationSquare.piece || destinationSquare.piece.color !== piece.color) {
							validMoves.push(destinationSquare.position);
						}
					}
				}
				break;
			case 'bishop':
				row = parseInt(piece.position[1]);
				column = columns.indexOf(piece.position[0]);
				for (const [rowOffset, columnOffset] of bishopMoves) {
					for (let i = 1; i <= 7; i++) {
						const destinationRow = row + i * rowOffset;
						const destinationColumn = column + i * columnOffset;

						if (
							destinationRow < 0 ||
							destinationRow > 7 ||
							destinationColumn < 0 ||
							destinationColumn > 7
						) {
							break;
						}

						const destinationSquare = board[destinationRow][destinationColumn];

						if (!destinationSquare.piece) {
							validMoves.push([destinationRow, destinationColumn]);
						} else {
							if (destinationSquare.piece.color !== board[row][column].piece.color) {
								validMoves.push([destinationRow, destinationColumn]);
							}
							break;
						}
					}
				}
				break;
			case 'rook':
				row = parseInt(piece.position[1]);
				column = columns.indexOf(piece.position[0]);

				for (const [rowOffset, columnOffset] of rookMoves) {
					for (let i = 1; i <= 7; i++) {
						const destinationRow = row + i * rowOffset;
						const destinationColumn = column + i * columnOffset;

						if (
							destinationRow < 0 ||
							destinationRow > 7 ||
							destinationColumn < 0 ||
							destinationColumn > 7
						) {
							break;
						}

						const destinationSquare = board[destinationRow][destinationColumn];

						if (!destinationSquare.piece) {
							validMoves.push([destinationRow, destinationColumn]);
						} else {
							if (destinationSquare.piece.color !== board[row][column].piece.color) {
								validMoves.push([destinationRow, destinationColumn]);
							}
							break;
						}
					}
				}
				break;
			case 'queen':
				for (const [rowOffset, columnOffset] of queenMoves) {
					for (let i = 1; i <= 7; i++) {
						const destinationRow = row + i * rowOffset;
						const destinationColumn = column + i * columnOffset;

						if (
							destinationRow < 0 ||
							destinationRow > 7 ||
							destinationColumn < 0 ||
							destinationColumn > 7
						) {
							break;
						}

						const destinationSquare = board[destinationRow][destinationColumn];

						if (!destinationSquare.piece) {
							validMoves.push([destinationRow, destinationColumn]);
						} else {
							if (destinationSquare.piece.color !== board[row][column].piece.color) {
								validMoves.push([destinationRow, destinationColumn]);
							}
							break;
						}
					}
				}

				break;
			case 'king':
				[kingRow, kingColumn] = getRowAndColumn(piece.position);

				for (const [rowOffset, columnOffset] of kingMoves) {
					const destinationRow = kingRow + rowOffset;
					const destinationColumn = kingColumn + columnOffset;

					if (
						destinationRow >= 0 &&
						destinationRow <= 7 &&
						destinationColumn >= 0 &&
						destinationColumn <= 7
					) {
						const destinationSquare = board[destinationRow][destinationColumn];

						if (!destinationSquare.piece || destinationSquare.piece.color !== piece.color) {
							validMoves.push(destinationSquare.position);
						}
					}
				}

				// Check for castling moves and logic for what king can do
				// if (!piece.hasMoved) {
				// 	const row = piece.color === 'white' ? 7 : 0;

				// 	const kingsideRook = board[row][7].piece;
				// 	const queensideRook = board[row][0].piece;

				// 	if (kingsideRook && kingsideRook.type === 'rook' && !kingsideRook.hasMoved) {
				// 		const path = board[row].slice(kingColumn + 1, kingsideRook.position.charAt(0) - 'a');

				// 		if (
				// 			path.every((square) => !square.piece) &&
				// 			!isAttacked(board, piece.color, [kingRow, kingColumn + 1]) &&
				// 			!isAttacked(board, piece.color, [kingRow, kingColumn + 2])
				// 		) {
				// 			validMoves.push(`${kingsideRook.position.charAt(0)}${row + 1}`);
				// 		}
				// 	}

				// 	if (queensideRook && queensideRook.type === 'rook' && !queensideRook.hasMoved) {
				// 		const path = board[row].slice(queensideRook.position.charAt(0) - 'a' + 1, kingColumn);

				// 		if (
				// 			path.every((square) => !square.piece) &&
				// 			!isAttacked(board, piece.color, [kingRow, kingColumn - 1]) &&
				// 			!isAttacked(board, piece.color, [kingRow, kingColumn - 2])
				// 		) {
				// 			validMoves.push(`${queensideRook.position.charAt(0)}${row + 1}`);
				// 		}
				// 	}
				// }
				break;
			default:
				break;
		}

		return validMoves;
	}
	// export let board;

	function handleDrop(event, row, square) {
		// Get the piece data from the data transfer object
		const [piece, rowIndex, pieceSquare, pieceColor] = event.dataTransfer
			.getData('text/plain')
			.split(',');

		// Check if the move is valid
		const isValidMove = true; // checkMove(board, [piecePosition], [row, square.position]);

		if (isValidMove) {
			// Update the board state with the new position of the piece

			// new position
			console.log(square);

			board[row].piece = piece;
			// board[row].type = square.position //  = { position: square.position, type: pieceType, color: pieceColor };
			console.log(typeof row);
			console.log(typeof rowIndex);

			// remove old positon
			board[rowIndex].piece = '';
		}

		event.preventDefault();
	}

	function handleDragOver(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}
</script>

<div class="chess-board">
	{#each board as square, rowIndex}
		<div class="chess-row">
			<!-- {#each square as col, columnIndex}-->
			<div
				class="square {square.color}"
				on:keypress={() => handleKeyPress}
				on:drop={(event) => handleDrop(event, rowIndex, square)}
				on:dragover={handleDragOver}
				on:click={() => movePiece(square)}
			>
				{#if square.piece}
					<ChessPiece {square} {rowIndex}>
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
