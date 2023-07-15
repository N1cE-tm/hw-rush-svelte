<script lang="ts">
	import { fade } from "svelte/transition";

	export let results = [];
</script>

<div class="search-results" transition:fade|local>
	{#each results as server}
		<a class="result" href="/server/{server.name}">
			<div class="data">
				<i class="icon fa-solid fa-server" />

				<div class="content">
					<div class="label">{server.name}</div>
					<div class="text">
						<i class="fa-solid fa-file" />
						{server?.files?.length || 0}
						<i class="fa-solid fa-user" />
						{server?.npc?.length || 0}
					</div>
				</div>
			</div>
		</a>
	{/each}
</div>

<style lang="scss">
	.search-results {
		border-top: 0.5px solid rgba(84, 84, 88, 0.65);

		.result {
			display: flex;
			padding-left: 16px;
			text-decoration: none;
			transition: 0.3s;

			&:hover {
				background-color: rgba(235, 235, 245, 0.1);
			}

			.data {
				width: 100%;
				display: flex;
				align-items: center;
				padding: 6px 6px 6px 0;
				gap: 13px;
				border-bottom: 0.5px solid rgba(84, 84, 88, 0.65);

				.icon {
					display: flex;
					align-items: center;
					justify-content: center;
					color: #ffffff;
				}

				.content {
					.label {
						margin-top: 8px;
						font-weight: 600;
						font-size: 17px;
						line-height: 22px;
						letter-spacing: -0.408px;
						color: #ffffff;
					}
					.text {
						margin-top: 2px;
						font-weight: 400;
						font-size: 15px;
						line-height: 20px;
						letter-spacing: -0.24px;
						color: rgba(235, 235, 245, 0.6);
						display: flex;
						align-items: center;

						i {
							margin: 0 10px;
							font-size: 10px;

							&:first-child {
								margin-left: 0;
							}
						}
					}
				}
			}
		}
	}
</style>
