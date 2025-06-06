import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import useStatistics from "./useStatistics";
import Chart from "./Chart";
import useView from "./useView";

function App() {
  const [count, setCount] = useState(0);

  const statistics = useStatistics(10);

  const view = useView();

  const cpuUsages = useMemo(() => {
    return statistics.map(({ cpuUsage }) => cpuUsage);
  }, [statistics]);

  const ramUsages = useMemo(() => {
    return statistics.map(({ ramUsage }) => ramUsage);
  }, [statistics]);

  const storageUsages = useMemo(() => {
    return statistics.map(({ storageUsage }) => storageUsage);
  }, [statistics]);

  const [title, activeUsages] = useMemo(() => {
    switch (view) {
      case "CPU":
        return ["CPU Usage", cpuUsages];

      case "RAM":
        return ["RAM Usage", ramUsages];

      case "STORAGE":
        return ["Storage Usage", storageUsages];
      default:
        return ["CPU Usage", cpuUsages];
    }
  }, [view, cpuUsages, ramUsages, storageUsages]);

  return (
    <>
      <header>
        <button
          id="close"
          onClick={() => window.electron.sendFrameAction("CLOSE")}
        />
        <button
          id="minimize"
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
        />
        <button
          id="maximize"
          onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
        />
      </header>
      <h1>{title}</h1>
      <div style={{ height: 120 }}>
        <Chart data={activeUsages} maxDataPoints={10} />
      </div>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + Pizda</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Pidar <code>src/ui/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
