<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import ChessPiece from './ChessPiece.svelte';
	import type { SquareOnBoard } from '$types/board';
	import {
		attackMove,
		getRowAndColumn,
		pawnBlkMove,
		pawnWtMove,
		getValidMovesForRook,
		getValidMovesForBishop,
		getValidMovesKnight,
		kingMove
	} from '$lib/utils/moves';
	export let board: SquareOnBoard[];
	export let myKills;
	let newRowIndex: string;
	let newLocation;
	let oldLocation;
	let touch = false;
	let moveValid = false;
	let attackValid = false;

	function validateMove(piece: string, currentPos: string, newPos: string) {
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

	let currentPlayer = 'white';
	let nextPlayer = 'black';
	let kills = [];

	async function handleDrop(event, row: string, square: SquareOnBoard) {
		// Get the piece data from the data transfer object
		let piece, rowIndex, pieceSquare, pieceColor;
		if (!touch) {
			event.preventDefault();
			[piece, rowIndex, pieceSquare, pieceColor] = event.dataTransfer
				.getData('text/plain')
				.split(',');
		} else {
			[piece, rowIndex, pieceSquare, pieceColor] = event.split(',');
		}
		// is piece a piece?? where you came from
		const selectedPiece = board.find((piece) => piece.square === pieceSquare);
		// console.log(selectedPiece);
		// console.log('selectedPiece');

		// Check if the move is valid
		const currentPos = getRowAndColumn(pieceSquare);
		const newPos = getRowAndColumn(square.square);
		// console.log(currentPos);
		// console.log(newPos);
		const [color, p] = square.piece.split('-');
		const [selectedColor, sp] = selectedPiece.piece.split('-');

		if (square.piece === '') {
			attackMove = false;
		} else if (color === selectedColor) {
			attackMove = false;
		} else {
			attackMove = true;
		}

		// validateMove(piece, currentPos, newPos);
		const isValidMove = validateMove(piece, currentPos, newPos); // moveValid; // true; // checkMove(board, [piecePosition], [row, square.position]);
		const isAttackValid = attackValid;
		// console.log(isValidMove);

		// console.log(color);
		// console.log(p);
		if (currentPlayer === selectedColor) {
			if (isValidMove && selectedPiece && (attackMove || square.piece === '')) {
				// After each move, toggle the current player

				// Update the board state with the new position of the piece
				if (attackMove) {
					const kill = board[row].piece;
					// kills.push(kill);
					// console.log('killed');
					// console.log(kills);
					const killBy = currentPlayer;
					dispatch('kills', { kill, killBy });
				}

				board[row].piece = piece;
				board[rowIndex].piece = '';
				attackMove = false;

				if (currentPlayer === 'white') {
					currentPlayer = 'black';
					nextPlayer = 'white';
				} else {
					currentPlayer = 'white';
					nextPlayer = 'black';
				}
			} else {
				console.log('Cant move there');
			}
		} else {
			console.log('Its not your turn');
		}
	}
	let handleDragFlag = false;
	function handleDragOver(event, square) {
		// console.log(square);
		// console.log('event');

		event.preventDefault();
		event.dataTransfer.dropEffect = 'drop';
	}

	function handleChessComponent(event) {
		// console.log(event);
		handleDragFlag = event;
	}
	function handleChessTouchingEnd(event) {
		// console.log(event);
		oldLocation = event.detail.item.oldLocation;
		newLocation = event.detail.item.newLocation;
		// console.log(oldLocation);
		const square = board[newLocation];
		// console.log(newLocation);
		// console.log('newLocation');

		// console.log(square);

		touch = true;
		handleDrop(oldLocation, newLocation, square);
	}
</script>

<!-- 
<div class="score-card">
	<div class="player-name">Player 1</div>
	<div class="score">{myKills.length}</div>
</div> -->
<h2>
	Its player {currentPlayer}'s turn
</h2>
<!-- kills: {kills.length} -->
<div class="chess-board">
	{#each board as square, rowIndex}
		<div class="chess-row" aria-label={rowIndex.toString()}>
			<!-- {rowIndex}
			{square.square} -->
			<div
				class="square {square.color}"
				on:drop={(event) => handleDrop(event, rowIndex, square)}
				on:dragover={() => handleDragOver(event, square)}
			>
				{#if square.piece}
					<ChessPiece
						{square}
						{rowIndex}
						{board}
						{newRowIndex}
						on:dragger={() => handleChessComponent}
						on:touchingend={(e) => handleChessTouchingEnd(e)}
					>
						<span class={square.piece} />
					</ChessPiece>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	/* :global([draggable]) {
		-webkit-touch-callout: none;
		-ms-touch-action: none;
		touch-action: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	} */

	.chess-board {
		display: grid;
		grid-template-columns: repeat(8, 40px);
		grid-template-rows: repeat(8, 40px);
		grid-gap: 0;
	}
	.chess-piece {
		position: absolute;
		width: 40px;
		height: 40px;
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
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30px;
	}

	.dark {
		background-color: #769656;
	}

	.light {
		background-color: #eee;
	}

	.dark:hover {
		background-color: #41532d;
	}

	.light:hover {
		background-color: rgb(99, 98, 98);
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
