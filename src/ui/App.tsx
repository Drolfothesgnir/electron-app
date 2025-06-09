import { useMemo } from "react";
import "./App.css";
import useStatistics from "./useStatistics";
import Chart from "./Chart";
import useView from "./useView";
import useStaticData from "./useStaticData";

function App() {
  const statistics = useStatistics(10);
  const { staticData } = useStaticData();

  const [view, setView] = useView();

  const cpuUsages = useMemo(() => {
    return statistics.map(({ cpuUsage }) => cpuUsage);
  }, [statistics]);

  const ramUsages = useMemo(() => {
    return statistics.map(({ ramUsage }) => ramUsage);
  }, [statistics]);

  const storageUsages = useMemo(() => {
    return statistics.map(({ storageUsage }) => storageUsage);
  }, [statistics]);

  const activeUsages = useMemo(() => {
    switch (view) {
      case "CPU":
        return cpuUsages;

      case "RAM":
        return ramUsages;

      case "STORAGE":
        return storageUsages;
      default:
        return cpuUsages;
    }
  }, [view, cpuUsages, ramUsages, storageUsages]);

  return (
    <>
      <Header />
      <div className="main">
        <div>
          <SelectOption
            data={cpuUsages}
            subTitle={staticData?.cpuModel || ""}
            title="CPU"
            onClick={() => setView("CPU")}
            view="CPU"
          />
          <SelectOption
            data={ramUsages}
            subTitle={`${staticData?.totalMemoryGB.toString() || ""} GB`}
            title="RAM"
            onClick={() => setView("RAM")}
            view="RAM"
          />
          <SelectOption
            data={storageUsages}
            subTitle={`${staticData?.totalStorage.toString() || ""} GB`}
            title="STORAGE"
            onClick={() => setView("STORAGE")}
            view="STORAGE"
          />
        </div>
        <div className="mainGrid">
          <Chart data={activeUsages} maxDataPoints={10} view={view} />
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
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
  );
}

type SelectOptionProps = {
  data: number[];
  title: string;
  subTitle: string;
  onClick: () => void;
  view: View;
};

function SelectOption({
  data,
  title,
  subTitle,
  onClick,
  view,
}: SelectOptionProps) {
  return (
    <button className="selectOption" onClick={onClick}>
      <div className="selectOptionTitle">
        <div>{title}</div>
        <div>{subTitle}</div>
      </div>
      <div className="selectOptionChart">
        <Chart data={data} maxDataPoints={10} view={view} />
      </div>
    </button>
  );
}

export default App;
