<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	const dispatch = createEventDispatcher();
	import ChessPiece from '$routes/ChessPiece.svelte';
	import type { SquareOnBoard, ValidMove } from '$types/board';
	import { getRowAndColumn } from '$lib/utils/moves';
	import { calcMoves, validateMove } from '$lib/utils/moves/validate';
	import { findBestMove } from '$src/lib/utils/minmax';

	interface Props {
		board: SquareOnBoard[];
		botBoard: SquareOnBoard[];
	}

	let { board = $bindable(), botBoard = $bindable() }: Props = $props();
	let newRowIndex: string = $state('');

	let newLocation: number | undefined = $state(); // index
	let oldLocation = $state('');
	let touch = $state(false);

	let currentPlayer = $state('white');
	let nextPlayer = $state('black');

	// interface EventDetails {
	// 	piece: SquareOnBoard;
	// 	rowIndex: number;
	// 	pieceSquare: string;
	// 	pieceColor: string;
	// }
	function moveBot(move) {
		const moveI = board.findIndex((element) => element.square === move?.from.square);
		const newI = board.findIndex((element) => element.square === move?.to.sq);

		// console.log(move.to);
		// console.log(move);

		if (move?.to.moveT === 'attack') {
			const kill = board[newI].piece;

			const killBy = currentPlayer;
			dispatch('kills', { kill, killBy });
		}

		board[newI].piece = move?.from.piece;
		board[moveI].piece = '';
		board[moveI].potentialMoves = [];
		botBoard[newI].piece = move?.from.piece;
		botBoard[moveI].piece = '';
		botBoard[moveI].potentialMoves = [];
	}

	async function handleDrop(
		event: string | (DragEvent & { currentTarget: EventTarget & HTMLDivElement }),
		row: number,
		square: SquareOnBoard
	) {
		// Get the piece data from the data transfer object
		// console.log(event?.dataTransfer);
		// console.log('event.dataTransfer');
		let attackMove = false;

		let piece, rowIndex, pieceSquare: string, pieceColor;
		if (!touch) {
			event.preventDefault();

			[piece, rowIndex, pieceSquare, pieceColor] = event.dataTransfer
				.getData('text/plain')
				.split(',');
		} else {
			[piece, rowIndex, pieceSquare, pieceColor] = event.split(',');
		}

		const selectedPiece = board.find((piece) => piece.square === pieceSquare) ?? square;
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

		const isValidMove = validateMove(board, piece, currentPos, newPos);

		if (currentPlayer === selectedColor) {
			if (isValidMove && selectedPiece && (attackMove || square.piece === '')) {
				if (attackMove) {
					const kill = board[row].piece;

					const killBy = currentPlayer;
					dispatch('kills', { kill, killBy });
				}
				const strValidMov = isValidMove.toString();
				let upgradePiece: boolean | ValidMove[] = false;
				upgradePiece = strValidMov?.includes('queen') === true ? isValidMove : false;
				board[row].piece = upgradePiece !== false ? upgradePiece : piece;
				board[rowIndex].piece = '';
				board[rowIndex].potentialMoves = [];
				botBoard[row].piece = upgradePiece !== false ? upgradePiece : piece;
				botBoard[rowIndex].piece = '';
				botBoard[rowIndex].potentialMoves = [];
				touch = false;
				// recalculate all moves for bot
				calcMoves(botBoard);

				if (selectedColor === 'white') {
					currentPlayer = 'black';

					const bes = findBestMove(botBoard, 3, 'black');
					moveBot(bes);
					calcMoves(botBoard);
				}

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
		touch = false;
	}

	function handleDragOver(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		event.preventDefault();
		if (event?.dataTransfer) event.dataTransfer.dropEffect = 'drop';
	}

	function handleChessTouchingEnd(event: CustomEvent) {
		oldLocation = event.detail.item.oldLocation;
		newLocation = event.detail.item.newLocation as number;
		const square = board[newLocation];
		touch = true;
		handleDrop(oldLocation, newLocation, square);
	}
</script>

<!-- 
<div class="score-card">
	<div class="player-name">Player 1</div>
	<div class="score">{myKills.length}</div>
</div> -->
<h2 class="turn-text">
	Its {currentPlayer}'s turn
</h2>
<!-- kills: {kills.length} -->
<div class="chess-board">
	{#each board as square, rowIndex}
		<div class="chess-row" aria-label={rowIndex.toString()}>
			<!-- {rowIndex}
			{square.square} -->
			<div
				role="figure"
				class="square {square.color}"
				ondrop={(event) => handleDrop(event, rowIndex, square)}
				ondragover={(event) => handleDragOver(event)}
			>
				{#if square.piece}
					<ChessPiece
						{square}
						{rowIndex}
						{board}
						{newRowIndex}
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
	.m-2 {
		margin: 0.5rem; /* 4px */
		margin-top: 0.8rem;
	}
	.turn-text {
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		font-weight: 800;
		font-size: 1.125rem; /* 18px */
		line-height: 1.75rem; /* 28px */
		color: rgb(33, 33, 33);
	}
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
		/* font-weight: 600; */
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
