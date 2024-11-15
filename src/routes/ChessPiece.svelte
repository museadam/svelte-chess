<script lang="ts">
	import type { SquareOnBoard, Coord } from '$types/board';
	import { slide } from 'svelte/transition';
	// export let column;
	import { createEventDispatcher } from 'svelte';
	// import type { TouchEventHandler } from 'svelte/elements';
	interface Props {
		rowIndex: number;
		newRowIndex: any;
		square: SquareOnBoard;
		board: SquareOnBoard[];
		children?: import('svelte').Snippet;
	}

	let { rowIndex, newRowIndex = $bindable(), square, board, children }: Props = $props();
	// $inspect(board);

	const dispatch = createEventDispatcher();
	let item = $state(true);
	// const noDrag = () => dispatch('dragger', { item });
	let drag = $state(false);
	$effect(() => {
		if (square.piece !== '') {
			drag = true;
		} else {
			drag = false;
		}
	});

	function handleDragStart(event: Event) {
		// Set the data transfer object to identify the piece being dragged
		if (square.piece !== '') {
			item = true;
			// noDrag();
			// console.log(square.piece);
			event.dataTransfer.setData(
				'text/plain',
				`${square.piece},${rowIndex},${square.square},${square.color}`
			);
			event.dataTransfer.effectAllowed = 'move';
		} else {
			item = false;
			// noDrag();
		}
	}
	function distance(x1: number, y1: number, x2: number, y2: number) {
		const pow1 = Math.pow(x2 - x1, 2);
		const pow2 = Math.pow(y2 - y1, 2);
		return Math.sqrt(pow1 + pow2);
	}

	function findClosestCoordinates(coords: Coord, arr: SquareOnBoard[]) {
		const distances = arr.map((c) => {
			// console.log(coords);
			// console.log(c);

			return {
				coordinates: c,
				distance: distance(coords.x, coords.y, c?.coordinates?.x ?? 0, c?.coordinates?.y ?? 0)
			};
		});
		distances.sort((a, b) => a.distance - b.distance);
		return distances[0].coordinates;
	}

	// let dropped = $state([]);
	let status = $state('');

	// let dropped_in = $state('');
	let activeEvent = $state('');
	let originalX = $state('');
	let originalY = $state('');
	// get pixel locations of each square

	// this offsets the piece to more easily see when touched
	function handleTouchStart(e) {
		console.log('hand touch start');

		status = 'Touch start with element ' + e.target.getAttribute('id');
		originalX = e.target.offsetLeft - 10 + 'px';
		originalY = e.target.offsetTop - 10 + 'px';
		activeEvent = 'start';
	}
	let boardRowIndex: number;
	// this is determining the new location
	function handleTouchMove(e) {
		// console.log(e);
		// console.log('hand touch move');
		// console.log(status);
		// console.log('status');

		let touchLocation = e.targetTouches[0];
		// console.log(touchLocation);
		let pageX = Math.floor(touchLocation.pageX - 20) + 'px';
		let pageY = Math.floor(touchLocation.pageY - 60) + 'px';
		// console.log(pageX);
		// console.log(pageY);

		// console.log('pageY');
		status = 'Touch x ' + pageX + ' Touch y ' + pageY;

		// console.log(status);
		e.target.style.position = 'absolute';
		e.target.style.left = pageX;
		e.target.style.top = pageY;
		const x = touchLocation.clientX - 20;
		// console.log(x);

		const y = touchLocation.clientY - 60;
		const currentLocation = {
			x,
			y
		};
		activeEvent = 'move';
		const rows = board;
		// console.log(currentLocation);
		// console.log('currentLocation');
		// console.log(rows);
		// console.log('rows');

		const getLocation = findClosestCoordinates(currentLocation, board);
		// console.log(getLocation);
		// console.log('getLocation');
		boardRowIndex = board.indexOf(getLocation);
		// console.log(boardRowIndex);
		// console.log('boardRowIndex');
		newRowIndex = boardRowIndex;
	}

	// handles drop
	function handleTouchEnd(e) {
		e.preventDefault();
		// console.log(e);
		console.log('hand touch end');

		if (activeEvent === 'move') {
			// console.log(square);
			// console.log('square');
			// console.log(boardRowIndex);
			// console.log('boardRowIndex');
			const oldLocation = `${square.piece},${rowIndex},${square.square},${square.color}`;
			const newLocation = boardRowIndex;
			const item = { oldLocation, newLocation };
			// console.log(item);
			// console.log('item');

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
	// function detectTouchEnd(x1, y1, x2, y2, w, h) {
	// 	//Very simple detection here
	// 	if (x2 - x1 > w) return false;
	// 	if (y2 - y1 > h) return false;
	// 	return true;
	// }
</script>

<div
	role="banner"
	class="chess-piece"
	draggable={drag}
	ondragstart={handleDragStart}
	ontouchstart={(e) => handleTouchStart(e)}
	ontouchmove={(e) => handleTouchMove(e)}
	ontouchend={handleTouchEnd}
	transition:slide
>
	{@render children?.()}
</div>

<style>
	/* .dragging {
		background-color: pink;
	} */
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
