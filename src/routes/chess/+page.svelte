<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import ChessBoard from './ChessBoard.svelte';
	import type { SquareOnBoard } from '$types/board.ts';

	const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
	const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const pieces = [
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

	function getSquareColor(row: string, column: string) {
		if ((columns.indexOf(column) + rows.indexOf(row)) % 2 === 0) {
			return 'light';
		} else {
			return 'dark';
		}
	}

	function getPieceType(color: string, type: string) {
		return color + '-' + type;
	}

	function setBoard() {
		let brd = [];

		for (let row of rows) {
			for (let column of columns) {
				let squareColor = getSquareColor(row, column);
				let piece = pieces.find((p) => p.position === column + row);
				let pieceType = piece ? getPieceType(piece.color, piece.type) : '';
				brd.push({
					square: column + row,
					color: squareColor,
					piece: pieceType
				});
			}
		}
		return brd;
	}

	let startBoard: SquareOnBoard[] = $state.raw(setBoard());

	// $: startBoard = board;
	let board: SquareOnBoard[] = $state(setBoard());

	// board = startBoard
	// console.log(board);

	// let board = [];
	let myKills = $state(0);
	let myKillsArr = $state([]);

	let theirKills = $state(0);
	let theirKillsArr = $state([]);

	function handleKill(event) {
		event.preventDefault();
		console.log(event);
		let tempKills;
		tempKills = event.detail.killBy;
		if (tempKills === 'white') {
			myKillsArr.push(event.detail.kill);
			myKills += 1;
		} else {
			theirKillsArr.push(event.detail.kill);
			theirKills += 1;
		}
		if (event.detail.kill === 'white-king' || event.detail.kill === 'black-king') {
			alert('YOU WIN!');
			board = startBoard;
		}
	}
	import { spring } from 'svelte/motion';

	const displayed_count = spring();
	const their_displayed_count = spring();

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
	function restartGame() {
		// board = [];
		// setBoard();
		// setBoard();

		board = startBoard;
		// console.log(board);
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
			const row: string | null = square.ariaLabel;
			// console.log(row);
			// Add the position to the board object
			const coordinates = { x, y };

			board[row] = { ...board[row], coordinates };
			startBoard[row] = { ...startBoard[row], coordinates };
		});
	});
	$effect(() => {
		displayed_count.set(myKills);
	});
	$effect(() => {
		their_displayed_count.set(theirKills);
	});
	let offset = $derived(modulo($displayed_count, 1));
	let offset2 = $derived(modulo($their_displayed_count, 1));
</script>

<div class="sheet">
	<button class="btn gradient-border" onclick={restartGame}> Restart </button>

	<div class="gradient-border score-card">
		<div class="player-name">Black Player</div>
		<div class="counter-viewport">
			<div class="counter-digits" style="transform: translate(0, {100 * offset2}%)">
				<strong class="hidden" aria-hidden="true">{Math.floor($their_displayed_count + 1)}</strong>
				<strong>{Math.floor($their_displayed_count)}</strong>
			</div>
		</div>
	</div>
	<ChessBoard {board} on:kills={(e) => handleKill(e)} />
	<div class="gradient-border score-card">
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
	.btn {
		all: unset;
		display: flex;
		width: 210px;
		height: 40px;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 400;
		background-color: #f2f2f2;
		cursor: pointer;
	}

	.btn:active {
		width: 200px;
		height: 30px;
	}
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
		padding-right: 10px;
		padding-left: 10px;
		width: 210px;
		height: 80px;
	}
	.gradient-border {
		--borderWidth: 3px;
		position: relative;
		border-radius: var(--borderWidth);
	}
	.gradient-border:after {
		content: '';
		position: absolute;
		top: calc(-1 * var(--borderWidth));
		left: calc(-1 * var(--borderWidth));
		height: calc(100% + var(--borderWidth) * 2);
		width: calc(100% + var(--borderWidth) * 2);
		background: linear-gradient(
			60deg,
			#f79533,
			#f37055,
			#ef4e7b,
			#a166ab,
			#5073b8,
			#1098ad,
			#07b39b,
			#6fba82
		);
		border-radius: calc(2 * var(--borderWidth));
		z-index: -1;
		animation: animated-gradient 3s ease alternate infinite;
		background-size: 300% 300%;
	}

	@keyframes animated-gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	.player-name {
		font-weight: bold;
	}
</style>
