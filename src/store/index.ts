import { atom, computed } from "nanostores";
export * from "nanostores";

export type INpc = { name: string; type: string; server: string };
export type IFile = { name: string; type: string; server: string };
export type IEdge = { from: string; to: string };
export type IServer = {
	name: string;
	type: string;
	fraction?: string;
	neighbors?: any;
	links: any;
	files?: IFile[];
	npc?: INpc[];
};

export const servers = atom<IServer[]>([]);
export const edges = atom<IEdge[]>([]);
export const npc = atom<INpc[]>([]);
export const files = atom<IFile[]>([]);
