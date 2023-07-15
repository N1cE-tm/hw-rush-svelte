import { emitter } from "@/core";
import { CupertinoPane, type CupertinoSettings } from "cupertino-pane";

let settings: CupertinoSettings = {
	initialBreak: "bottom",
	fastSwipeClose: false,
	bottomClose: false,
	clickBottomOpen: true,
	buttonDestroy: false,
};
export let panel: CupertinoPane;

export const createPanel = (element) => {
	panel = new CupertinoPane(element, settings);
	panel.present({ animate: true });
};

emitter.on("panel/moveToBreak", (b) => panel.moveToBreak(b));
emitter.on("panel/destroy", (b) => panel.destroy({ animate: true }));
