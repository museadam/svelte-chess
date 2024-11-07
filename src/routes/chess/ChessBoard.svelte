<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import ChessPiece from './ChessPiece.svelte';
	import type { SquareOnBoard } from '$types/board';
	import {
		// 	pawnBlkMove,
		// 	pawnWtMove,
		getValidMovesForRook,
		getValidMovesForBishop,
		getValidMovesKnight,
		kingMove,
		getRowAndColumn,
		getPathBetweenPositions,
		getSquareFromRC
	} from './moves';

	interface Props {
		// } from '$lib/utils/moves';
		board: SquareOnBoard[];
	}

	let { board = $bindable() }: Props = $props();
	// export let myKills;
	let newRowIndex: string = $state('');
	let newLocation = $state();
	let oldLocation = $state();
	let touch = $state(false);
	let moveValid = $state(false);
	let attackValid = $state(false);

	// import type { SquareOnBoard } from '$types/board.ts';

	let attackMove = $state(false);

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

	function validateMove(piece: string, currentPos: number[], newPos: number[]) {
		// const moves = [];
		// // Calculate valid moves for knight
		// const piec = board.find((p) => p.square === square);

		// if (!piec) {
		// 	return moves;
		// }
		// const movableBish = getValidMovesForBishop(board, currentPos, newPos);
		// const movableRook = getValidMovesForRook(board, currentPos, newPos);
		// pawn is the only one that needs to know
		const pieceSelect = piece;
		let str = pieceSelect;
		function removeColorPrefix(str: string) {
			if (!str.includes('pawn')) str.replace(/^(white-|black-)/, '');
			return str;
		}
		str = removeColorPrefix(str);
		console.log(pieceSelect);
		switch (pieceSelect) {
			case 'white-pawn':
				moveValid = pawnWtMove(currentPos, newPos);
				break;
			case 'black-pawn':
				moveValid = pawnBlkMove(currentPos, newPos);
				break;
			case 'white-rook':
				moveValid = getValidMovesForRook(board, currentPos, newPos);
				break;
			case 'black-rook':
				moveValid = getValidMovesForRook(board, currentPos, newPos);
				break;
			case 'white-knight':
				moveValid = getValidMovesKnight(currentPos, newPos);
				break;
			case 'black-knight':
				moveValid = getValidMovesKnight(currentPos, newPos);
				break;
			case 'white-bishop':
				moveValid = getValidMovesForBishop(board, currentPos, newPos);
				break;
			case 'black-bishop':
				moveValid = getValidMovesForBishop(board, currentPos, newPos);
				break;
			case 'white-queen':
				moveValid =
					getValidMovesForRook(board, currentPos, newPos) === false
						? getValidMovesForBishop(board, currentPos, newPos)
						: true;
				break;
			case 'black-queen':
				moveValid =
					getValidMovesForRook(board, currentPos, newPos) === false
						? getValidMovesForBishop(board, currentPos, newPos)
						: true;
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

	let currentPlayer = $state('white');
	let nextPlayer = 'black';
	let kills = [];

	async function handleDrop(event, row: number, square: SquareOnBoard) {
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
		// console.log(board);
		// console.log('board');

		// Check if the move is valid
		// console.log(square.square);
		// console.log('square.square');
		const currentPos = getRowAndColumn(pieceSquare);
		const newPos = getRowAndColumn(square.square);

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
		console.log(isValidMove);
		console.log('isValidMove');

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
				moveValid = false;
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
			// attackMove = false;
			// moveValid = false;
			console.log('Its not your turn');
		}
		moveValid = false;
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
				role="application"
				class="square {square.color}"
				ondrop={(event) => handleDrop(event, rowIndex, square)}
				ondragover={(event) => handleDragOver(event, square)}
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
						<span class={square.piece}></span>
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
