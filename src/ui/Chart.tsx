import { useMemo } from "react";
import BaseChart from "./BaseChart";
import { COLOR_MAP } from "./util";

type ChartProps = {
  data: number[];
  maxDataPoints: number;
  view: View;
};

export default function Chart({ data, maxDataPoints, view }: ChartProps) {
  const preparedData = useMemo(() => {
    const newData = data.map((value) => ({ value: value * 100 }));
    return [
      ...Array.from({ length: maxDataPoints - newData.length }).map(() => ({
        value: undefined,
      })),
      ...newData,
    ];
  }, [data, maxDataPoints]);

  return <BaseChart data={preparedData} {...COLOR_MAP[view]} />;
}
