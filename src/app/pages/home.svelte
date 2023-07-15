<script lang="ts">
	import { emitter } from "@/core";
	import { servers } from "@/store";

	// Components
	import SearchBar from "@/app/components/search/bar.svelte";
	import SearchResults from "@/app/components/search/results.svelte";
	import Main from "@/app/components/main.svelte";

	/**
	 * Variables
	 */
	let query = "";
	let activeSearch = false;
	let results: any = [];

	/**
	 * Search Focus Callback
	 */
	const onSearchFocus = async () => {
		emitter.emit("panel/moveToBreak", "top");
	};

	/**
	 * Search Cancel Callback
	 */
	const onSearchCancel = async () => {
		results = [];
		emitter.emit("panel/moveToBreak", "bottom");
	};

	/**
	 * Search Query
	 */
	const onSearch = (q) => {
		results = $servers.filter((i) => i.name.toLocaleLowerCase().includes(q.toLocaleLowerCase(), 6));
	};

	$: onSearch(query);

	emitter.emit("graph/unselect");
</script>

<SearchBar bind:query bind:active={activeSearch} on:focus={onSearchFocus} on:cancel={onSearchCancel} />
{#if activeSearch}
	<SearchResults {results} />
{:else}
	<Main />
{/if}

<style>
</style>
