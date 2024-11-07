<script lang="ts">
	import { onMount } from 'svelte';
	import ChessBoard from './ChessBoard.svelte';
	import type { SquareOnBoard } from '$types/board.ts';
	import { spring } from 'svelte/motion';
	import { setBoard } from './board';

	let startBoard: SquareOnBoard[] = $state.raw(setBoard());
	let board: SquareOnBoard[] = $state(setBoard());

	$inspect(board[0]);

	let myKills = $state(0);
	let myKillsArr = $state([]);

	let theirKills = $state(0);
	let theirKillsArr = $state([]);

	function handleKill(event: CustomEvent) {
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

	const displayed_count = spring();
	const their_displayed_count = spring();

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}

	$effect(() => {
		displayed_count.set(myKills);
	});
	$effect(() => {
		their_displayed_count.set(theirKills);
	});
	let offset = $derived(modulo($displayed_count, 1));
	let offset2 = $derived(modulo($their_displayed_count, 1));
	function restartGame() {
		board = startBoard;
	}

	onMount(() => {
		const squares = document.querySelectorAll('.chess-row');
		// Loop through each square and add its position to the board object
		squares.forEach((square) => {
			// Get the position of the square relative to the screen
			const rect = square.getBoundingClientRect();
			// Calculate the top-left corner of the square
			const x = rect.left + window.pageXOffset;
			const y = rect.top + window.pageYOffset;

			// Get the row and column of the square
			const row = square.ariaLabel;

			// Add the position to the board object
			const coordinates = { x, y };
			// convert str to num to stop type errors
			if (row) board[+row] = { ...board[+row], coordinates };
			if (row) startBoard[+row] = { ...startBoard[+row], coordinates };
		});
	});
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
