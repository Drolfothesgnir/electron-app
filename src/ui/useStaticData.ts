import { useEffect, useState } from "react";

export default function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.electron
      .getStaticData()
      .then(setStaticData)
      .finally(() => setIsLoading(false));
  }, []);

  return { staticData, isLoading };
}
