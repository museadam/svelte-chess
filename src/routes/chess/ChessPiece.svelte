<script>
	export let square;
	export let rowIndex;
	// export let column;
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let item = true;
	const noDrag = () => dispatch('dragger', { item });
	let drag = false;
	if (square.piece !== '') {
		drag = true;
	} else {
		drag = false;
	}
	function handleDragStart(event) {
		// console.log(event);

		// Set the data transfer object to identify the piece being dragged
		if (square.piece !== '') {
			item = true;
			noDrag();
			console.log(square.piece);
			event.dataTransfer.setData(
				'text/plain',
				`${square.piece},${rowIndex},${square.square},${square.color}`
			);
			event.dataTransfer.effectAllowed = 'move';
		} else {
			item = false;
			noDrag();
		}
	}
</script>

<!-- Chess piece element -->
<!-- {#if square.piece !== ''} -->
<div class="chess-piece" draggable={drag} on:dragstart={handleDragStart}>
	<!-- {drag} -->
	<slot />
</div>

<!-- {:else}
	<div class="chess-piece" draggable="false" on:dragstart={handleDragStart}>
		<slot />
	</div>
{/if} -->
<style>
	.chess-piece {
		cursor: grab;
	}
	.chess-piece:-moz-drag-over {
		cursor: grabbing;
	}
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
