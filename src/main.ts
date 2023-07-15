import { api, ws } from "@/core";
import { createPanel, createGraph, createApp, graph } from "@/services";
import { edges, files, servers, npc } from "@/store";
import config from "./config";

/**
 * Работа с WS
 */
ws.on("data/servers", (data) => servers.set(data));
ws.on("data/edges", (data) => edges.set(data));
ws.on("data/files", (data) => files.set(data));
ws.on("data/npc", (data) => npc.set(data));
ws.once("connected", () => {
	ws.send("data/servers");
	ws.send("data/edges");
	ws.send("data/files");
	ws.send("data/npc");
});
ws.connect(config.ws);

/**
 * Конфигурация API
 */
api.defaults.baseURL = config.api;

/**
 * Инициализация приложений
 */
createGraph(document.getElementById("graph"));
createPanel(document.getElementById("panel"));
createApp(document.getElementById("app"));

graph.zoom(3);
