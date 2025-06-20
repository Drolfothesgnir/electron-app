import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const { usage: storageUsage } = getStorageData();
    ipcWebContentsSend("statistics", mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage,
    });
  }, POLLING_INTERVAL);
}

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => osUtils.cpuUsage(resolve));
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;
  return {
    total: Math.floor(total / 1e9),
    usage: 1 - free / total,
  };
}

export function getStaticResourcesData(): StaticData {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model.trim();
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);
  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}
