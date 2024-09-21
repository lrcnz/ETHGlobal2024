import { useCreateContext } from "./use-create-context";

export function useActiveCircuit() {
  const { activeCircuit, setActiveCircuit } = useCreateContext();

  return [activeCircuit, setActiveCircuit] as const ;
}
