import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./util.js";

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(path.join(getAssetPath(), "trayIcon.png"));

  const toggleWindow = () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  };

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );

  tray.on("click", toggleWindow);
}
