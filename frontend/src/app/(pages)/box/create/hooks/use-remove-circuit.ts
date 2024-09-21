import { useCircuitDepth } from "./use-circuit-depth";
import { useCreateContext } from "./use-create-context";

export function useRemoveCircuit () {
  const { box } = useCreateContext();
  const [, setDepth] = useCircuitDepth();

  return () => {
    if (!box) return;

    const depth = box.getDepth();

    if (depth <= 3) return;

    // get the last level circuits
    const circuits = box.getCircuitAtLevel(depth - 1);

    // remove the last level circuits
    circuits.forEach(circuit => {
      box.removeCircuit(circuit);
    });

    setDepth(box.getDepth());
  }
}