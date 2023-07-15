<script lang="ts">
	import { emitter } from "@/core/emmiter";
	import { panel } from "@/services/panel";
	import { Route, router } from "tinro";

	import Lazy from "./components/lazy.svelte";

	router.mode.hash();
	router.subscribe(async (_) => {
		await panel.hide();
		await panel.moveToBreak("bottom");
	});

	emitter.on("graph/node/click", (server) => router.goto(`/server/${server}`));
</script>

<Route path="/"><Lazy component={import("./pages/home.svelte")} /></Route>
<Route path="/server/:name"><Lazy component={import("./pages/server.svelte")} /></Route>
<Route path="/way"><Lazy component={import("./pages/way.svelte")} /></Route>

<style>
</style>
