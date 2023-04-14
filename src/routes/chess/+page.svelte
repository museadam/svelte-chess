<script lang="ts">
	import ChessBoard from './ChessBoard.svelte';

	let rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
	let columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	let board = [];
	$: myKills = [];
	const theirKills = [];
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
	console.log(board);
	// let board = [];
</script>

<div class="sheet">
	<div class="score-card">
		<div class="player-name">Black Player</div>
		<div class="score">{theirKills.length}</div>
	</div>
	<ChessBoard {board} {myKills} />
	<div class="score-card">
		<div class="player-name">White Player</div>
		<div class="score">{myKills.length}</div>
	</div>
</div>

<!-- <div>
	{#if myKills.length > 0}
		{#each myKills as kill}
			<div class="chess-piece">
				<span class={kill} />
			</div>
		{/each}
	{/if}
</div> -->
<style>
	.sheet {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.score-card {
		display: flex;
		margin: auto;
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #f2f2f2;
		padding: 10px;
		border-radius: 5px;
		width: 280px;
		margin-bottom: 10px;
		border-style: solid;
		border-width: 5px;
		border-image: radial-gradient(circle at center, indigo, blue, indigo, blue, indigo);
		animation: gradient-border 10s ease infinite;
		padding: 20px;
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

	.score {
		font-size: 24px;
	}
</style>
