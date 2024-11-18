<script lang="ts">
	import '$lib/assets/board.css';

	import { createEventDispatcher, tick } from 'svelte';
	const dispatch = createEventDispatcher();
	import ChessPiece from '$routes/ChessPiece.svelte';
	import type { MoveHistory, SquareOnBoard, ValidMove } from '$types/board';
	import { getRowAndColumn, getSquareFromRC } from '$lib/utils/moves';
	import { calcMoves, validateMove } from '$lib/utils/moves/validate';
	import { findBestMove } from '$src/lib/utils/minmax';
	import { getMovePiece, useOpeningMove } from '$src/lib/utils/bot/starter-moves';
	import { getCastlePositions } from '$src/lib/utils/moves/king/castle';
	// import Page from './+page.svelte';

	interface Props {
		board: SquareOnBoard[];
		moveHistory: MoveHistory[];
		cpu: boolean;
		botVsBot: boolean;
		gameOver: boolean;
		// myKills: number;
		// myKillsArr: string[];
		// theirKills: number;
		// theirIKillsArr: string[];
	}

	let {
		board = $bindable(),
		moveHistory = $bindable(),
		cpu,
		botVsBot,
		gameOver = false
		// myKills = $bindable(),
		// myKillsArr = $bindable(),
		// theirKills = $bindable(),
		// theirIKillsArr = $bindable()
	}: Props = $props();
	let watchGame = $derived(gameOver);
	let newRowIndex: string = $state('');

	let newLocation: number | undefined = $state(); // index
	let oldLocation = $state('');
	let touch = $state(false);

	let currentPlayer = $state('white');
	let nextPlayer = $state('black');
	let botMoves: string[] = $state(setBotStarterMoves());
	let botMoves2: string[] = $state(setBotStarterMoves());

	let botCurrentMove = $state(0);
	// $inspect(botMoves);
	// $inspect(botCurrentMove);

	$effect(() => {
		if (botVsBot)
			setTimeout(() => {
				vsBots();
			}, 1000);
	});

	// $effect(() => {
	// 	runAgain;
	// 	return () => {
	// 		vsBots();
	// 	};
	// });

	// interface EventDetails {
	// 	piece: SquareOnBoard;
	// 	rowIndex: number;
	// 	pieceSquare: string;
	// 	pieceColor: string;
	// }
	function moveBot(move) {
		const moveI = board.findIndex((element) => element.square === move?.from.square);
		const newI = board.findIndex((element) => element.square === move?.to.sq);

		let removedPiece;
		// console.log(move);
		if (move?.to.moveT === 'attack') {
			const kill = board[newI].piece;
			removedPiece = kill;
			const killBy = currentPlayer;
			// console.log(killBy);
			// console.log('killBy');

			dispatch('kills', { kill, killBy });
		}
		const moveItem: MoveHistory = {
			to: move?.to.sq,
			from: move?.from.square,
			movedPiece: move?.piece,
			removedPiece
		};

		moveHistory.push(moveItem);

		board[newI].piece = move?.from.piece;
		board[moveI].piece = '';
		board[moveI].potentialMoves = [];
	}

	async function handleDrop(
		event: string | (DragEvent & { currentTarget: EventTarget & HTMLDivElement }),
		row: number,
		square: SquareOnBoard
	) {
		// Get the piece data from the data transfer object
		// console.log(event?.dataTransfer);
		// console.log('event.dataTransfer');
		// console.log(square);
		// console.log('square');

		let attackMove = false;

		let piece, rowIndex, pieceSquare: string, pieceColor;
		if (!touch) {
			if (typeof event !== 'string') event.preventDefault();

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
		// console.log(newPos);
		// console.log('newPos');

		const isValidMove = validateMove(board, piece, currentPos, moveHistory, newPos);
		console.log(isValidMove);
		console.log('isValidMove');
		if (currentPlayer === selectedColor) {
			if (isValidMove) {
				// && selectedPiece && (attackMove || square.piece === '')) {
				let removedPiece;
				if (attackMove) {
					const kill = board[row].piece;
					removedPiece = kill;
					const killBy = currentPlayer;
					dispatch('kills', { kill, killBy });
				}
				const strValidMov = isValidMove.toString();
				let upgradePiece: boolean | ValidMove[] | string = false;
				upgradePiece = strValidMov?.includes('queen') === true ? isValidMove : false;

				let castleIt: boolean = false;
				const castle = board.filter((el) => el.piece?.includes(`${currentPlayer}-king`))[0];
				console.log(castle);
				if (castle?.potentialMoves)
					castleIt = castle.potentialMoves.some((el) => el[2] === 'castle') ?? false;
				// if (isValidMove) castleIt = strValidMov?.includes('castle') === true ? true : false;
				if (castleIt) {
					console.log('castleIt ' + castleIt);
					let { indexKing, indexRook } = getCastlePositions(square.square, newPos, board);

					board[row].piece = '';
					board[row].potentialMoves = [];
					board[indexKing].piece = 'white-king';
					board[indexRook].piece = 'white-rook';
				} else {
					board[row].piece = upgradePiece !== false ? upgradePiece : piece;
				}

				board[rowIndex].piece = '';
				board[rowIndex].potentialMoves = [];
				touch = false;

				const moveItem: MoveHistory = {
					to: square.square,
					from: pieceSquare,
					movedPiece: board[row].piece,
					removedPiece
				};

				moveHistory = [...moveHistory, moveItem];

				calcMoves(board, moveHistory);
				// setTimeout(() => {}, 1000);
				// setTimeout( () => {
				if (selectedColor === 'white' && cpu) {
					currentPlayer = 'black';

					let bes;

					let bmL = [...$state.snapshot(botMoves)].length;

					if (bmL < botCurrentMove + 1) {
						await tick();

						// setTimeout(() => {
						bes = findBestMove([...$state.snapshot(board)], 2, 'black', moveHistory);

						// }, 300);
					} else {
						bes = getBotStarterMoves('black', botMoves);
					}
					// setTimeout(() => {

					moveBot(bes);
					// }, 500);
					calcMoves(board, moveHistory);
				}
				// }, 1000);

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

	async function vsBots() {
		// await tick();

		let bes;
		const moves = currentPlayer === 'white' ? botMoves2 : botMoves;

		let bmL = [...$state.snapshot(moves)].length;
		let num = 6;
		if (bmL === 2) num = 4;
		if ([...$state.snapshot(moveHistory)].length >= num) {
			// setTimeout(() => {
			bes = findBestMove([...$state.snapshot(board)], 2, currentPlayer, moveHistory);

			// }, 300);
		} else {
			bes = getBotStarterMoves(currentPlayer, moves);
		}
		// console.log(bes);
		// console.log('bes');
		moveBot(bes);
		calcMoves(board, moveHistory);
		// await tick();

		if (currentPlayer === 'white' && [...$state.snapshot(moveHistory)].length <= num)
			botCurrentMove -= 1;

		currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
		setTimeout(() => {
			recursive();
		}, 2500);
	}
	function recursive() {
		if (!watchGame) vsBots();
	}

	function handleDragOver(event: DragEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		event.preventDefault();
		if (event?.dataTransfer) event.dataTransfer.dropEffect = 'drop';
	}
	function setBotStarterMoves() {
		const moves = useOpeningMove();
		return moves;
	}
	function getBotStarterMoves(color: string, moves: string[]) {
		let move = moves[botCurrentMove];
		const { square, mv } = getMovePiece(board, color, move);
		move = mv;
		botCurrentMove += 1;
		return {
			from: { ...square }, // starting position in chess notation
			to: { sq: move, moveT: 'move' }, // target position in chess notation
			piece: square?.piece
		};
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
			<!-- {#if rowIndex < 8}
				<p class="squareLabel top-0">{square.square}</p>
			{/if} -->

			<div
				role="figure"
				class="square {square.color}"
				ondrop={async (event) => await handleDrop(event, rowIndex, square)}
				ondragover={(event) => handleDragOver(event)}
			>
				<!-- <p class="squareLabel top-0">{square.square}</p> -->

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

	.chess-square:hover .chess-piece {
		pointer-events: all;
	}
</style>
