const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback) =>
    ipcOn("statistics", (stats) => callback(stats)),
  getStaticData: () => ipcInvoke("getStaticData"),
  subscribeChangeView: (callback) =>
    ipcOn("changeView", (view) => callback(view)),
} satisfies Window["electron"]);

function ipcInvoke<K extends keyof EventPayloadMapping>(key: K) {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<K extends keyof EventPayloadMapping>(
  key: K,
  callback: (payload: EventPayloadMapping[K]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);

  electron.ipcRenderer.on(key, cb);

  return () => electron.ipcRenderer.off(key, cb);
}
