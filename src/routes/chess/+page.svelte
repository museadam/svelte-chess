<script lang="ts">
	import { onMount } from 'svelte';
	import ChessBoard from './ChessBoard.svelte';

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

	function setBoard() {
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
	}
	setBoard();

	// console.log(board);

	// let board = [];
	let myKills = 0;
	let theirKills = 0;
	function handleKill(event) {
		event.preventDefault();
		console.log(event);
		let tempKills;
		tempKills = event.detail.killBy;
		if (tempKills === 'white') {
			myKills = event.detail.kills.length;
		} else {
			theirKills = event.detail.kills.length;
		}
	}
	import { spring } from 'svelte/motion';

	const displayed_count = spring();
	$: displayed_count.set(myKills);
	const their_displayed_count = spring();

	$: their_displayed_count.set(theirKills);

	$: offset = modulo($displayed_count, 1);

	$: offset2 = modulo($their_displayed_count, 1);
	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
	onMount(() => {
		// drop_zone = document.querySelectorAll('.chess-board');

		const squares = document.querySelectorAll('.chess-row');

		// Loop through each square and add its position to the board object
		squares.forEach((square) => {
			// Get the position of the square relative to the screen
			const rect = square.getBoundingClientRect();
			// console.log(square.getBoundingClientRect());

			// Calculate the top-left corner of the square
			const x = rect.left + window.pageXOffset;
			const y = rect.top + window.pageYOffset;

			// Get the row and column of the square
			const row = square.ariaLabel;
			// console.log(row);
			// Add the position to the board object
			const coordinates = { x, y };

			board[row] = { ...board[row], coordinates };
		});
		// console.log(board);
	});
</script>

<div class="sheet">
	<div class="score-card">
		<div class="player-name">Black Player</div>
		<div class="counter-viewport">
			<div class="counter-digits" style="transform: translate(0, {100 * offset2}%)">
				<strong class="hidden" aria-hidden="true">{Math.floor($their_displayed_count + 1)}</strong>
				<strong>{Math.floor($their_displayed_count)}</strong>
			</div>
		</div>
	</div>
	<ChessBoard {board} {myKills} on:kills={(e) => handleKill(e)} />
	<div class="score-card">
		<div class="player-name">White Player</div>
		<div class="counter-viewport">
			<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
				<strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
				<strong>{Math.floor($displayed_count)}</strong>
			</div>
		</div>
	</div>
</div>

<!-- <div>
	{#if myKills > 0}
		{#each myKills as kill}
			<div class="chess-piece">
				<span class={kill} />
			</div>
		{/each}
	{/if}
</div> -->

<style>
	.counter-viewport {
		width: 8em;
		height: 4em;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--color-theme-1);
		font-size: 2rem;
		align-items: center;
		justify-content: end;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
	.sheet {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.score-card {
		display: flex;
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #f2f2f2;
		width: 280px;
		padding-right: 10px;
		padding-left: 10px;
		border-style: solid;
		border-image: radial-gradient(circle at center, indigo, blue, indigo, blue, indigo);
		animation: gradient-border 10s ease infinite;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	}
	@keyframes gradient-border {
		0% {
			border-image-slice: 1;
		}
		25% {
			border-image-slice: 15;
		}
		50% {
			border-image-slice: 20;
		}
		75% {
			border-image-slice: 25;
		}
		100% {
			border-image-slice: 35;
		}
	}

	.player-name {
		font-weight: bold;
	}
</style>
