import { ipcMain, app } from "electron";
import type { WebContents, WebFrameMain } from "electron";
import path from "path";
import { pathToFileURL } from "url";

export function isDev() {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<K extends keyof EventPayloadMapping>(
  key: K,
  handler: () => EventPayloadMapping[K]
) {
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame);
    return handler();
  });
}

export function ipcWebContentsSend<K extends keyof EventPayloadMapping>(
  key: K,
  webContents: WebContents,
  payload: EventPayloadMapping[K]
) {
  webContents.send(key, payload);
}

export function getUiPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}

export function validateEventFrame(frame: WebFrameMain | null) {
  if (!frame) return;

  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }

  if (frame.url !== pathToFileURL(getUiPath()).toString()) {
    throw new Error("Malicious event");
  }
}

export function ipcMainOn<K extends keyof EventPayloadMapping>(
  key: K,
  callback: (payload: EventPayloadMapping[K]) => void
) {
  ipcMain.on(key, (event, payload) => {
    validateEventFrame(event.senderFrame);
    callback(payload);
  });
}
