import { useCircuitDepth } from "./use-circuit-depth";
import { useCreateContext } from "./use-create-context";

export function useAddCircuit() {
  const { box } = useCreateContext();
  const [, setDepth] = useCircuitDepth();

  return () => {
    if (!box) return;

    box.notifyTreeChange();
    setDepth(box.getDepth());
  }
}
