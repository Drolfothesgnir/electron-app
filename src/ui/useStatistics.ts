import { useEffect, useState } from "react";

export default function useStatistics(dataPointCount: number) {
  const [statistics, setStatistics] = useState<Statistics[]>([]);

  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((stats) =>
      setStatistics((prev) => {
        const newData = prev.concat([stats]);
        if (newData.length > dataPointCount) {
          newData.shift();
        }
        return newData;
      })
    );

    return unsub;
  }, [dataPointCount]);

  return statistics;
}
