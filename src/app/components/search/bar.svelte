<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

	export let active = false;
	export let query = "";

	const emit = createEventDispatcher();

	const onFocus = () => {
		active = true;
		emit("focus");
	};

	const onCancel = () => {
		active = false;
		query = "";
		emit("cancel");
	};
</script>

<div class="search-bar" class:active>
	<i class="icon fa-solid fa-magnifying-glass" />
	<input type="text" placeholder="Поиск сервера" on:focus={onFocus} bind:value={query} />

	{#if active}
		<button transition:fade|local class="cancel" on:click={onCancel}>Отмена</button>
	{/if}
</div>

<style lang="scss">
	.search-bar {
		position: relative;
		padding: 0 14px 14px;
		display: flex;
		gap: 14px;

		.icon {
			position: absolute;
			left: 24px;
			top: 10px;
			color: rgba(235, 235, 245, 0.6);
		}

		input {
			height: 36px;
			background: rgba(118, 118, 128, 0.24);
			border-radius: 10px;
			border: none;
			font-weight: 400;
			font-size: 17px;
			line-height: 22px;
			padding: 7px 7px 7px 34px;
			width: 100%;
			transition: 0.3s, width 0.5s;
			color: rgb(235, 235, 245);

			&::placeholder {
				color: rgba(235, 235, 245, 0.6);
			}

			&:focus {
				outline: none !important;
			}
		}

		.cancel {
			display: flex;
			align-items: center;
			background-color: transparent;
			border: none;
			border-radius: 0;
			font-weight: 400;
			font-size: 17px;
			line-height: 22px;
			text-align: right;
			letter-spacing: -0.408px;
			color: #0a84ff;
			cursor: pointer;
			transition: opacity 0.3s;

			&:hover {
				opacity: 0.8;
			}
		}
	}
</style>
