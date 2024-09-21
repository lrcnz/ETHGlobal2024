import * as React from "react";
import { useCreateContext } from "./use-create-context";

export function useCircuitsByLevel(level: number) {
  const { box } = useCreateContext();
  const [data, setData] = React.useState(box.getCircuitAtLevel(level));

  React.useEffect(() => {
    const onChange = () => setData(box.getCircuitAtLevel(level));
    box.watchTreeChange(onChange);

    return () => {
      box.unwatchTreeChange(onChange);
    };
  }, [level, box]);

  return data;
}