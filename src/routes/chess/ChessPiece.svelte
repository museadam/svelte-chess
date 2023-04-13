<script>
	export let square;
	export let rowIndex;
	// export let column;

	function handleDragStart(event) {
		// Set the data transfer object to identify the piece being dragged
		event.dataTransfer.setData(
			'text/plain',
			`${square.piece},${rowIndex},${square.square},${square.color}`
		);
		event.dataTransfer.effectAllowed = 'move';
	}
</script>

<!-- Chess piece element -->
<div class="chess-piece" draggable="true" on:dragstart={handleDragStart}>
	<slot />
</div>

<style>
	/* .chess-piece {
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
	} */
</style>
