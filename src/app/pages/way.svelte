<script lang="ts">
	import { meta, router } from "tinro";

	const route = meta();

	$: console.log($route.query);
</script>

<style lang="scss">
</style>
