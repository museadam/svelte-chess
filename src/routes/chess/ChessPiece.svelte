<script>
	export let square;
	export let rowIndex;
	export let newRowIndex;
	export let board;

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
			// console.log(square.piece);
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
	function distance(x1, y1, x2, y2) {
		const pow1 = Math.pow(x2 - x1, 2);
		const pow2 = Math.pow(y2 - y1, 2);
		// console.log(pow1);
		// console.log(pow2);

		return Math.sqrt(pow1 + pow2);
		// return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
	}

	// 	function getDistance(coord1, coord2) {
	//   const xDiff = coord1.x - coord2.x;
	//   const yDiff = coord1.y - coord2.y;
	//   return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	// }
	function findClosestCoordinates(coords, arr) {
		// Calculate distance between two coordinates using distance formula
		// console.log(coords);
		// console.log(arr);

		// Calculate distance between given coordinates and each coordinate in array
		const distances = arr.map((c) => {
			return {
				coordinates: c,
				distance: distance(coords.x, coords.y, c.coordinates.x, c.coordinates.y)
			};
		});

		// Sort array by distance and return closest coordinates

		distances.sort((a, b) => a.distance - b.distance);
		// console.log(distances);

		return distances[0].coordinates;
	}

	// function findClosestCoordinates(arr, coords) {
	// 	const distances = arr.map((point) =>
	// 		distance(point.coordinates.x, point.coordinates.y, coords.x, coords.y)
	// 	);
	// 	const minDistance = Math.min(...distances);
	// 	return arr[distances.indexOf(minDistance)];
	// }
	let dropped = [];
	let status = '';

	let dropped_in = '';
	let activeEvent = '';
	let originalX = '';
	let originalY = '';
	// get pixel locations of each square

	// this offsets the piece to more easily see when touched
	function handleTouchStart(e) {
		status = 'Touch start with element ' + e.target.getAttribute('id');
		originalX = e.target.offsetLeft - 10 + 'px';
		originalY = e.target.offsetTop - 10 + 'px';
		activeEvent = 'start';
	}
	let boardRowIndex;
	// this is determining the new location
	function handleTouchMove(e) {
		// console.log(e);

		let touchLocation = e.targetTouches[0];
		// console.log(touchLocation);
		let pageX = Math.floor(touchLocation.pageX - 50) + 'px';
		let pageY = Math.floor(touchLocation.pageY - 50) + 'px';
		status = 'Touch x ' + pageX + ' Touch y ' + pageY;
		// console.log(status);
		e.target.style.position = 'absolute';
		e.target.style.left = pageX;
		e.target.style.top = pageY;
		const x = touchLocation.clientX - 50;
		const y = touchLocation.clientY - 50;
		const currentLocation = {
			x,
			y
		};
		activeEvent = 'move';
		// is it over a square? compare locations
		// console.log(drop_zone);
		// const rows = drop_zone.querySelectorAll('.chess-row');
		const rows = board;
		// console.log(currentLocation);

		// console.log(drop_zone.querySelectorAll('.chess-row'));
		const getLocation = findClosestCoordinates(currentLocation, rows);
		// console.log(getLocation);
		boardRowIndex = board.indexOf(getLocation);
		// console.log(boardRowIndex);
		newRowIndex = boardRowIndex;
		// rows.forEach((el) => {
		// 	const location = el.coordinates; // el.getBoundingClientRect();
		// 	// console.log(location);
		// 	if (location.x === currentLocation.pageX && location.y === currentLocation.pageY) {
		// 		console.log(location.x);
		// 		console.log(location.y);

		// 		console.log(currentLocation.pageX);
		// 		console.log(currentLocation.pageY);
		// 	}
		// });
	}

	// handles drop
	function handleTouchEnd(e) {
		e.preventDefault();
		// console.log(e);
		if (activeEvent === 'move') {
			const oldLocation = `${square.piece},${rowIndex},${square.square},${square.color}`;
			const newLocation = boardRowIndex;
			const item = { oldLocation, newLocation };
			dispatch('touchingend', { item });
			e.target.style.left = originalX;
			e.target.style.top = originalY;
			e.target.style.position = 'initial';

			// let pageX = parseInt(e.target.style.left) - 50;
			// let pageY = parseInt(e.target.style.top) - 50;
			// console.log(drop_zone);
			// if (
			// 	detectTouchEnd(
			// 		drop_zone.offsetLeft,
			// 		drop_zone.offsetTop,
			// 		pageX,
			// 		pageY,
			// 		drop_zone.offsetWidth,
			// 		drop_zone.offsetHeight
			// 	)
			// ) {
			// 	dropped = dropped.concat(e.target.id);
			// 	e.target.style.position = 'initial';
			// 	dropped_in = true;
			// 	status = 'You dropped ' + e.target.getAttribute('id') + ' into drop zone';
			// } else {
			// 	e.target.style.left = originalX;
			// 	e.target.style.top = originalY;
			// 	status = 'You let the ' + e.target.getAttribute('id') + ' go.';
			// }
		}
	}
	function detectTouchEnd(x1, y1, x2, y2, w, h) {
		//Very simple detection here
		if (x2 - x1 > w) return false;
		if (y2 - y1 > h) return false;
		return true;
	}
</script>

<!-- Chess piece element -->
<!-- {#if square.piece !== ''} -->
<div
	class="chess-piece"
	draggable={drag}
	on:dragstart={handleDragStart}
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
>
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
