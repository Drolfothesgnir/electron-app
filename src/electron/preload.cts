import { IpcRendererEvent } from "electron";

const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback) => {
    ipcOn("statistics", (stats) => callback(stats));
  },
  getStaticData: ipcInvoke("getStaticData"),
} satisfies Window["electron"]);

function ipcInvoke<K extends keyof EventPayloadMapping>(key: K) {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<K extends keyof EventPayloadMapping>(
  key: K,
  callback: (payload: EventPayloadMapping[K]) => void
) {
  electron.ipcRenderer.on(
    key,
    (_: IpcRendererEvent, payload: EventPayloadMapping[K]) => callback(payload)
  );
}
