import { useMemo } from "react";
import BaseChart from "./BaseChart";

type ChartProps = {
  data: number[];
  maxDataPoints: number;
};

export default function Chart({ data, maxDataPoints }: ChartProps) {
  const preparedData = useMemo(() => {
    const newData = data.map((value) => ({ value: value * 100 }));
    return [
      ...Array.from({ length: maxDataPoints - newData.length }).map(() => ({
        value: undefined,
      })),
      ...newData,
    ];
  }, [data, maxDataPoints]);

  return <BaseChart data={preparedData} />;
}
