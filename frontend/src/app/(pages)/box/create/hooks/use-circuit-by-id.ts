import { useCreateContext } from "./use-create-context";
import * as React from "react";

export function useCircuitById(id: string) {
  const { box } = useCreateContext();
  const [data, setData] = React.useState(box.findCircuitById(id));

  React.useEffect(() => {
    setData(box.findCircuitById(id));
  }, [id]);

  React.useEffect(() => {
    const fn = () => setData(box.findCircuitById(id));

    box.watchTreeChange(fn);

    return () => {
      box.unwatchTreeChange(fn);
    }
  }, [box, id]);

  return data;
}
