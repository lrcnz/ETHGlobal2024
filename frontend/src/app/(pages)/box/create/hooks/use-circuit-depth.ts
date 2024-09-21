import { useCreateContext } from "./use-create-context";

export function useCircuitDepth () {
  const { depth, setDepth } = useCreateContext();

  return [depth, setDepth] as const;
}