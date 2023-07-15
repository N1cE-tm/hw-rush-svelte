<script lang="ts">
	import { meta, router } from "tinro";
	import { servers, npc, files, computed, atom } from "@/store";
	import { emitter } from "@/core";

	const route = meta();
	const name = atom($route.params.name);
	const server = computed([name, servers, files, npc], (name, servers) => {
		const server = servers.find((i) => i.name === name);
		const inner = server?.links?.filter((i) => i.to === name).map((i) => i.from) || [];
		const outer = server?.links?.filter((i) => i.from === name).map((i) => i.to) || [];

		emitter.emit("graph/select", name);

		return {
			...server,
			name,
			inner,
			outer,
		};
	});

	const onClose = () => {
		router.goto("/");
		// emitter.emit("panel/destroy");
	};

	$: $name = $route.params.name;
</script>

{#if $server}
	<div class="server-info">
		<div class="header">
			<div class="title">
				<i class="icon fa-solid fa-server" />
				{$server?.name}
			</div>
			<ul class="description">
				<li>
					<i class=" fa-solid fa-arrow-right-to-bracket" />
					{$server?.inner?.length || 0}
				</li>
				<li>
					<i class=" fa-solid fa-arrow-right-from-bracket" />
					{$server?.outer?.length || 0}
				</li>
				<li>
					<i class=" fa-solid fa-user" />
					{$server?.npc?.length || 0}
				</li>
				<li>
					<i class=" fa-solid fa-file" />
					{$server?.files?.length || 0}
				</li>
			</ul>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="close" on:click={onClose}>
				<i class="fa-solid fa-circle-xmark" />
			</div>
		</div>

		<section>
			<div class="title">
				С реализацией поиска маршрутов тут будет кнопка для построения паршрута, а так же список всех ближайших
				файлов и боссов с возможностью быстрого посторения маршрута
			</div>
		</section>

		{#if $server?.npc?.length > 0}
			<section>
				<div class="title">Пользователи</div>
				<div class="list">
					{#each $server.npc as item}
						<div class="item">
							<div class="data">
								<i class="icon fa-solid fa-user" />

								<div class="content">
									<div class="label">{item.name}</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if $server?.files?.length > 0}
			<section>
				<div class="title">Файлы</div>
				<div class="list">
					{#each $server.files as file}
						<div class="item">
							<div class="data">
								<i class="icon fa-solid fa-file" />

								<div class="content">
									<div class="label">{file.name}</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section>
			<div class="title">Исходящие подключения</div>
			<div class="list">
				{#each $server?.outer as server}
					<a class="item" href="/server/{server}">
						<div class="data">
							<i class="icon fa-solid fa-server" />

							<div class="content">
								<div class="label">{server}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section>
			<div class="title">Входящие подключения</div>
			<div class="list">
				{#each $server?.inner as server}
					<a class="item" href="/server/{server}">
						<div class="data">
							<i class="icon fa-solid fa-server" />

							<div class="content">
								<div class="label">{server}</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	</div>
{/if}

<style lang="scss">
	.server-info {
		display: flex;
		flex-direction: column;
		padding: 6px 18px;
		gap: 18px;

		.header {
			position: relative;

			.title {
				display: flex;
				align-items: center;
				font-weight: 700;
				font-size: 24px;
				letter-spacing: -0.24px;
				color: rgba(235, 235, 245, 1);

				i {
					margin-right: 6px;
				}
			}

			.description {
				margin-top: 5px;
				display: flex;
				align-items: center;
				list-style: none;
				gap: 14px;

				li {
					display: flex;
					align-items: center;
					font-weight: 400;
					font-size: 15px;
					line-height: 20px;
					letter-spacing: -0.24px;
					color: rgba(235, 235, 245, 0.6);

					i {
						margin-right: 5px;
						font-size: 12px;
					}
				}
			}

			.close {
				position: absolute;
				top: 0;
				right: 0;
				// right: 18px;
				// color: rgba(37, 37, 37, 0.78);
				color: rgba(118, 118, 128, 0.24);
				font-size: 24px;
				cursor: pointer;
				transition: 0.3s;

				&:hover {
					color: #fff;
				}
			}
		}

		section {
			.title {
				font-weight: 400;
				font-size: 12px;
				line-height: 16px;
				color: rgba(235, 235, 245, 0.6);
			}
			.list {
				margin-top: 8px;
				border-radius: 10px;
				background: #1c1c1e;
				overflow: hidden;

				.item {
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
						padding: 12px 12px 12px 0;
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
								font-size: 15px;
								line-height: 22px;
								letter-spacing: -0.408px;
								color: #ffffff;

								span {
									font-size: 10px;
									color: rgba(235, 235, 245, 0.6);
								}
							}
						}
					}

					&:last-child .data {
						border-bottom: none;
					}
				}
			}
		}
	}
</style>
