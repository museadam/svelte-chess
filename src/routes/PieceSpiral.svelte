<script>
	import { onMount, tick } from 'svelte';
	// export let index = 0;
	const { board } = $props();

	let divElement;
	let pathLength;

	// Fibonacci function to generate the first N Fibonacci numbers
	function fibonacci(n) {
		let fibs = [1, 1];
		for (let i = 2; i < n; i++) {
			fibs.push(fibs[i - 1] + fibs[i - 2]);
		}
		return fibs;
	}

	// Generate a Fibonacci Spiral path
	function generateSpiralPath(fibNumbers, j) {
		let path = 'M250,250 '; // Start point (center of the spiral)

		let currentX = 250,
			currentY = 250;
		let angle = 0;
		if (j !== 0) (currentX += j * 3), (currentY += j * 3);
		// Generate arcs for each Fibonacci number
		for (let i = 1; i < fibNumbers.length; i++) {
			const radius = fibNumbers[i];
			angle += Math.PI / 2; // Quarter-circle arcs
			let endX = currentX + radius * Math.cos(angle);
			let endY = currentY + radius * Math.sin(angle);
			path += `A${radius},${radius} 0 0,1 ${endX},${endY} `;
			currentX = endX;
			currentY = endY;
		}

		return path;
	}
	const pieces = [
		'black-rook',
		'black-knight',
		'black-bishop',
		'black-queen',
		'black-king',
		'black-bishop',
		'black-knight',
		'black-rook',
		'black-pawn',
		'black-pawn',
		'black-pawn',
		'black-pawn',
		'black-pawn',
		'black-pawn',
		'black-pawn',
		'black-pawn',
		'white-pawn',
		'white-pawn',
		'white-pawn',
		'white-pawn',
		'white-pawn',
		'white-pawn',
		'white-pawn',
		'white-pawn',
		'white-rook',
		'white-knight',
		'white-bishop',
		'white-queen',
		'white-king',
		'white-bishop',
		'white-knight',
		'white-rook'
	];

	const animate = () => {
		// await tick();

		const path = document.querySelector('#fibonacci-path');

		// const elements = document.getElementsByClassName('moving-div');
		// console.log(elements);
		// console.log('elements');
		// console.log(divElement);
		// console.log('divElement');

		for (let i = 0; i < pieces.length; i++) {
			const pt = document.querySelector(`#${pieces[i]}`);
			console.log(pt);
			console.log('pt');
			const fibNumbers = fibonacci(15);
			const spiralPath = generateSpiralPath(fibNumbers, i);
			path.setAttribute('d', spiralPath);
			pathLength = path.getTotalLength();
			pt.animate(
				[
					{
						offset: 0,
						transform: `translate(${path.getPointAtLength(0).x}px, ${path.getPointAtLength(0).y}px)`
					},
					...Array.from({ length: 100 }, (_, j) => {
						const point = path.getPointAtLength((j / 99) * pathLength);
						return {
							offset: j / 99,
							transform: `translate(${point.x - i}px, ${point.y}px)`
						};
					}),
					{
						offset: 1,
						transform: `translate(${path.getPointAtLength(pathLength).x}px, ${path.getPointAtLength(pathLength).y}px)`
					}
				],
				{
					duration: 15000,
					iterations: Infinity,
					easing: 'ease-in-out'
				}
			);
		}
	};

	// onMount(() => {
	// 	// Animate the div element along the spiral path

	// 	animate();
	// });
</script>

<button onclick={animate}>click</button>
{#each board as b, i}
	{#if b.piece !== ''}
		<span id={b.piece} class="moving-div {b.piece}"></span>
	{/if}
{/each}

<svg>
	<path id="fibonacci-path" fill="none" stroke="black" stroke-width="1" />
</svg>

<style>
	.moving-div {
		position: absolute;
	}

	svg {
		width: 100%;
		height: 100vh;
	}
</style>
