import { useEffect, useState } from "react";

export default function useView(): [View, React.Dispatch<View>] {
  const [view, setView] = useState<View>("CPU");

  useEffect(() => {
    const unsub = window.electron.subscribeChangeView(setView);

    return unsub;
  }, []);

  return [view, setView];
}
