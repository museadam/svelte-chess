<script>
	import { onMount } from 'svelte';
	import { run } from 'svelte/legacy';

	let letters = [];
	let index = 0; // Index to control the spiral

	const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

	// Function to generate letters periodically
	onMount(() => {
		const interval = setInterval(() => {
			letters = [...letters, createLetter()];
		}, 500); // Slower addition for better visibility

		// Clear interval when the component is destroyed
		return () => clearInterval(interval);
	});

	// Function to create a letter object with unique properties
	function createLetter() {
		const angle = goldenAngle * index; // Circular rotation
		const radius = 20 + index * 5; // Radius expands incrementally
		index++; // Increment index for the next letter

		return {
			id: Date.now() + Math.random(),
			lifetime: Math.random() * 8 + 6, // Lifetime between 6-14 seconds
			x: radius * Math.cos(angle), // Convert polar to Cartesian
			y: radius * Math.sin(angle)
		};
	}
	// Remove letters after their lifetime expires
	run(() => {
		letters = letters.filter((letter) => letter.lifetime > 0);
	});
	// Remove letters after their lifetime expires
</script>

<div class="container">
	{#each letters as letter (letter.id)}
		<div
			class="letter"
			style="
              --x: {letter.x}px;
              --y: {letter.y}px;
              --lifetime: {letter.lifetime}s;
          "
		>
			A
		</div>
	{/each}
</div>

<style>
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.letter {
		position: absolute;
		font-size: 2rem;
		color: crimson;
		animation: moveAndDisappear var(--lifetime) linear forwards;
		transform-origin: center;
	}

	@keyframes moveAndDisappear {
		0% {
			transform: translate(0, 0) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate(var(--x), var(--y)) scale(1);
			opacity: 0;
		}
	}
</style>
