import { app, BrowserWindow } from "electron";
import path from "path";

const a: number = 2;

app.on("ready", () => {
  console.log(a);

  const mainWindow = new BrowserWindow();
  mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
});
