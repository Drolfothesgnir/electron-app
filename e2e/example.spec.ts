import { test, expect, _electron } from "@playwright/test";

let electornApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage: Awaited<ReturnType<typeof electornApp.firstWindow>>;

async function waitForPreloadScript() {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const electronBridge = await mainPage.evaluate(() => {
        return (window as Window & { electron?: unknown }).electron;
      });

      if (electronBridge) {
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
}

test.beforeEach(async () => {
  electornApp = await _electron.launch({
    args: ["."],
    env: { NODE_ENV: "development" },
  });
  mainPage = await electornApp.firstWindow();
  await waitForPreloadScript();
});

test.afterEach(async () => {
  await electornApp.close();
});

test("Custom frame should minimize the mainWindow", async () => {
  await mainPage.click("#minimize");
  const isMinimized = await electornApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMinimized();
  });
  expect(isMinimized).toBeTruthy();
});

test("should create cusom menu", async () => {
  const menu = await electornApp.evaluate((electron) => {
    return electron.Menu.getApplicationMenu();
  });
  expect(menu).not.toBeNull();
  expect(menu?.items).toHaveLength(2);
  expect(menu?.items[0].submenu?.items).toHaveLength(2);
  expect(menu?.items[1].submenu?.items).toHaveLength(3);
  expect(menu?.items[1].label).toBe("View");
});
