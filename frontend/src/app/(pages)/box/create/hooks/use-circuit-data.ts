import { Circuit } from "@/lib/box/circuit";
import { useAtom } from "jotai";

export function useCircuitData (circuit: Circuit) {
  return useAtom(circuit.getData());
}