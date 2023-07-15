import { emitter } from "@/core";
import { edges, files, npc, servers } from "@/store";
import { computed } from "nanostores";
import ForceGraph from "force-graph";

/**
 * Exports
 */
export const graph = ForceGraph();
export const createGraph = (element: HTMLElement) => graph(element);

/**
 * Variables
 */
let hoverNode = null;
let selectedNode = null;
const hoveredHighlightNodes = new Set();
const hoveredHighlightLinks = new Set();
const selectedHighlightNodes = new Set();
const selectedHighlightLinks = new Set();

const icons = ["empty", "base", "file", "npc", "cross"].reduce((r: any, name) => {
	const img = new Image();
	img.src = `./servers/${name}.png`;
	r[name] = img;
	return r;
}, {});

/**
 * Data manipulations
 */
const data = computed([servers, edges, files, npc], (servers, edges, files, npc) => {
	for (let link of edges) {
		const a = servers.find((i) => i.name == link.from);
		const b = servers.find((i) => i.name == link.to);
		if (!a && !b) continue;
		if (!a.neighbors) a.neighbors = [];
		if (!b.neighbors) b.neighbors = [];
		a.neighbors.push(b);
		b.neighbors.push(a);

		!a.links && (a.links = []);
		!b.links && (b.links = []);
		a.links.push(link);
		b.links.push(link);
	}

	for (let server of servers as any) {
		server.files = files.filter((i) => i.server === server.name) || [];
		server.npc = npc.filter((i) => i.server === server.name) || [];
		server.type = "empty";
		if (server?.files.length > 0) server.type = "file";
		if (server?.npc.length > 0) server.type = "npc";
		if (server?.npc.length > 0 && server?.files.length > 0) server.type = "cross";
		server.trader = server?.npc.filter((i) => i.type === "trader")?.length > 0;
		server.track = server?.npc.filter((i) => i.type === "track")?.length > 0;
		server.fast = server?.files.filter((i) => i.type === "fast")?.length > 0;
	}

	return {
		nodes: servers,
		links: edges,
	};
});

/**
 * Callbacks
 */
const onNodeClick = (node) => emitter.emit("graph/node/click", node.name);

const onNodeDragEnd = (node) => {
	node.fx = node.x;
	node.fy = node.y;
};

const onNodeHover = (node: any) => {
	hoveredHighlightNodes.clear();
	hoveredHighlightLinks.clear();
	if (node) {
		hoveredHighlightNodes.add(node);
		node.neighbors?.forEach((neighbor) => hoveredHighlightNodes.add(neighbor));
		node.links?.forEach((link) => hoveredHighlightLinks.add(link));
	}

	hoverNode = node || null;
};

const onLinkHover = (link) => {
	hoveredHighlightNodes.clear();
	hoveredHighlightLinks.clear();

	if (link) {
		hoveredHighlightLinks.add(link);
		hoveredHighlightNodes.add(link.source);
		hoveredHighlightNodes.add(link.target);
	}
};

const nodeCanvasObject = (node, ctx) => {
	const size = 6;
	const fontSize = 2;
	const padding = 1;

	// Bg
	ctx.fillStyle = "#e1e3e6";
	ctx.strokeStyle = "rgb(0, 0, 0)";
	if (hoveredHighlightNodes.has(node)) ctx.strokeStyle = "#828282";
	if (selectedHighlightNodes.has(node)) ctx.strokeStyle = "#71aaeb";
	if (node === hoverNode) ctx.strokeStyle = "orange";
	if (node === selectedNode) ctx.strokeStyle = "red";

	if (node.type === "file") ctx.fillStyle = "#90EE90";
	if (node.fast) ctx.fillStyle = "#581845";
	if (node.type === "npc") ctx.fillStyle = "#FFB6C1";
	if (node.trader) ctx.fillStyle = "#FFA756";
	if (node.track) ctx.fillStyle = "#ff5e4b";

	ctx.beginPath();
	ctx.roundRect(
		node.x - size / 2 - padding,
		node.y - size / 2 - padding,
		size + padding * 2,
		size + padding * 2,
		padding
	);
	ctx.stroke();
	ctx.fill();

	// Icon
	ctx.drawImage(icons?.[node?.type], node.x - size / 2, node.y - size / 2, size, size);

	// Text
	ctx.fillStyle = "#e1e3e6";
	ctx.font = `${fontSize}px Sans-Serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(node.name, node.x, node.y + size / 2 + 3);
};

const linkColor = (link) => {
	let color = "#828282";
	if (selectedHighlightLinks.has(link)) color = "#71aaeb";

	return color;
};

const linkWidth = (link) => {
	return hoveredHighlightLinks.has(link) || selectedHighlightLinks.has(link) ? 2 : 0.2;
};

const linkDirectionalParticleWidth = (link) => {
	return hoveredHighlightLinks.has(link) || selectedHighlightLinks.has(link) ? 4 : 0;
};

const nodePointerAreaPaint = (node, color, ctx) => {
	const size = 6;
	const padding = 1;

	ctx.fillStyle = color;
	ctx.fillRect(
		node.x - size / 2 - padding,
		node.y - size / 2 - padding,
		size + padding * 2,
		size + padding * 2,
		padding
	);
};

/**
 * Configuration
 */
graph.nodeId("name");
graph.nodeRelSize(5);
graph.nodeCanvasObject(nodeCanvasObject);
graph.nodePointerAreaPaint(nodePointerAreaPaint);

graph.linkSource("from");
graph.linkTarget("to");
graph.linkColor(linkColor);
graph.linkWidth(linkWidth);
graph.linkDirectionalArrowLength(2);
graph.linkDirectionalArrowRelPos(1);
graph.linkDirectionalParticles(4);
graph.linkDirectionalParticleWidth(linkDirectionalParticleWidth);

graph.onNodeClick(onNodeClick);
graph.onNodeHover(onNodeHover);
graph.onNodeDragEnd(onNodeDragEnd);
graph.onLinkHover(onLinkHover);

graph.autoPauseRedraw(false);
graph.minZoom(1);
graph.maxZoom(10);

// graph.d3Force('link').distance(150);

data.subscribe((data: any) => graph.graphData(data));
emitter.on("graph/select", (name) => {
	const node = data.get().nodes.find((i) => i.name === name);
	selectedHighlightNodes.clear();
	selectedHighlightLinks.clear();
	if (node) {
		selectedHighlightNodes.add(node);
		node.neighbors?.forEach((neighbor) => selectedHighlightNodes.add(neighbor));
		node.links?.forEach((link) => selectedHighlightLinks.add(link));
	}
	selectedNode = node;
});

emitter.on("graph/unselect", () => {
	selectedHighlightNodes.clear();
	selectedHighlightLinks.clear();
	selectedNode = null;
});
