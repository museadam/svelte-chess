<script lang="ts">
	import { slide } from 'svelte/transition';
	import '$lib/assets/pieces.css';
	import './menu.css';

	import { onMount, tick } from 'svelte';
	import ChessBoard from '$routes/ChessBoard.svelte';
	import type { MoveHistory, SquareOnBoard } from '$types/board.ts';
	import { spring } from 'svelte/motion';
	import { setBoard } from '$src/lib/utils/board';
	import { calcMoves } from '$lib/utils/moves/validate';
	import { notifications } from '$src/store/notifications/notifications';
	// import PieceSpiral from './PieceSpiral.svelte';
	// import { findBestMove } from '$src/lib/utils/minmax';
	let startBoard: SquareOnBoard[] = $state.raw(setBoard());
	let board: SquareOnBoard[] = $state(setBoard());
	// let botBoard: SquareOnBoard[] = $state(setBoard());
	let moveHistory: MoveHistory[] = $state([]);

	// $inspect(board);
	// $inspect(moveHistory);

	let myKills = $state(0);
	let myKillsArr = $state([]);

	let theirKills = $state(0);
	let theirKillsArr = $state([]);
	let startGame = $state(false);
	let cpu = $state(false);
	let botVsBot = $state(false);
	let gameOver = $state(false);

	async function restartGame() {
		myKills = 0;
		theirKills = 0;
		myKillsArr = [];
		theirKillsArr = [];
		board = startBoard;
		// botBoard = startBoard;
		// calcMoves(board);
		calcMoves(board, []);
	}

	async function handleKill(event: CustomEvent) {
		// event.preventDefault();
		// console.log(event);
		let tempKills;
		tempKills = event.detail.killBy;
		if (tempKills === 'white') {
			myKillsArr.push(event.detail.kill);
			myKills += 1;
		} else {
			theirKillsArr.push(event.detail.kill);
			theirKills += 1;
		}
		if (event.detail.kill === 'black-king') {
			// alert('YOU WIN!');
			// await tick();
			notifications.success('YOU WIN!', 2000);
			await tick();

			gameOver = true;

			restartGame();
		} else if (event.detail.kill === 'white-king') {
			// alert('YOU LOSE!');
			// await tick();
			notifications.danger('YOU LOSE!', 2000);
			await tick();
			gameOver = true;
			restartGame();
		}
	}
	async function setBoardCoords() {
		await tick();
		const squares = document.querySelectorAll('.chess-row');
		// Loop through each square and add its position to the board object
		// console.log(squares);
		// console.log('squares');

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
			// console.log(coordinates);
			// console.log('coordinates');

			if (row) board[+row] = { ...board[+row], coordinates };
			if (row) startBoard[+row] = { ...startBoard[+row], coordinates };
			// console.log(row);
			// console.log('row');

			// if (row) botBoard[+row] = { ...botBoard[+row], coordinates };
		});
		// calcMoves(board, []);
	}
	// $effect(() => {});

	const displayed_count = $state(spring(0));
	const their_displayed_count = $state(spring(0));

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

	onMount(() => {
		// setBoardCoords()
		calcMoves(board, []);
		// const bes = findBestMove(botBoard, 3, 'black');
		// console.log(bes);
	});
</script>

{#if startGame}
	<div transition:slide class="sheet">
		<button class="btn gradient-border" onclick={restartGame}> Restart </button>

		<div class="gradient-border score-card">
			<div class="player-name">Black Player</div>
			<div class="kills container">
				{#each theirKillsArr as piece}
					<span class={piece}></span>
				{/each}
			</div>
			<div class="counter-viewport">
				<div class="counter-digits" style="transform: translate(0, {100 * offset2}%)">
					<strong class="hidden" aria-hidden="true">{Math.floor($their_displayed_count + 1)}</strong
					>
					<strong>{Math.floor($their_displayed_count)}</strong>
				</div>
			</div>
		</div>
		<ChessBoard
			bind:board
			bind:moveHistory
			{cpu}
			{botVsBot}
			{gameOver}
			on:kills={(e) => handleKill(e)}
		/>
		<!-- bind:myKills
		bind:myKillsArr
		bind:theirKills
		bind:theirKillsArr -->

		<div class="gradient-border score-card">
			<div class="player-name">White Player</div>
			<div class="kills flex-wr">
				{#each myKillsArr as piece}
					<span class="{piece} chess-piece-win"></span>
				{/each}
			</div>
			<div class="counter-viewport">
				<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
					<strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
					<strong>{Math.floor($displayed_count)}</strong>
				</div>
			</div>
		</div>
	</div>
{/if}
{#if !startGame}
	<div transition:slide class="sheet">
		<div class="gradient-border">
			<button
				tabindex="0"
				class=" startBtn split-button"
				onclick={async () => {
					startGame = true;
					await setBoardCoords();
					cpu = false;
				}}
				onkeypress={(e) => {
					if (e.key === 'Shift+c') startGame = true;
				}}
			>
				<div class="slide-red"></div>
				<div class="slide-blue"></div>
				<span class="button-text">Player vs Player</span>
			</button>
		</div>
		<button
			tabindex="0"
			class="gradient-border startBtn split-button"
			onclick={async () => {
				startGame = true;
				await setBoardCoords();
				cpu = true;
			}}
			onkeypress={(e) => {
				if (e.key === 'Shift+c') startGame = true;
			}}
		>
			<div class="slide-red"></div>
			<div class="slide-blue"></div>
			<div class="button-text">Player vs CPU</div>
		</button>
		<button
			tabindex="0"
			class=" startBtn split-button"
			onclick={async () => {
				startGame = true;
				await setBoardCoords();
				botVsBot = true;
			}}
			onkeypress={(e) => {
				if (e.key === 'Shift+c') startGame = true;
			}}
		>
			<div class="slide-red"></div>
			<div class="slide-blue"></div>
			<div class="button-text">CPU vs CPU</div>
		</button>
	</div>
{/if}

<!-- <PieceSpiral {board} /> -->

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
	.kills {
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		align-items: center;
		justify-content: center;
		-ms-flex-wrap: wrap;
		-webkit-flex-wrap: wrap;
		flex-wrap: wrap;
		width: 80%;
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
		width: 200px;
		height: 70px;
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
		animation: animated-gradient 9s ease alternate infinite;
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
