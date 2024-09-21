import { Circuit } from "@/lib/box/circuit";
import { useCircuitData } from "./use-circuit-data";

export function useSetParams (circuit: Circuit) {
  const [data, setData] = useCircuitData(circuit);

  return [data.params, (value: { [k in string]: any}) => {
    setData((data) => {
      data.params = {
        ...data.params,
        ...value
      };
    })
  }] as const;
}