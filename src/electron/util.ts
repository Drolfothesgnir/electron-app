import { ipcMain, WebContents } from "electron";

export function isDev() {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<K extends keyof EventPayloadMapping>(
  event: K,
  handler: () => EventPayloadMapping[K]
) {
  ipcMain.handle(event, () => handler());
}

export function ipcWebContentsSend<K extends keyof EventPayloadMapping>(
  key: K,
  webContents: WebContents,
  payload: EventPayloadMapping[K]
) {
  webContents.send(key, payload);
}
