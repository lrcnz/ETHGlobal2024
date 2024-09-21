import { Circuit } from "@/lib/box/circuit";
import { useCircuitData } from "./use-circuit-data";
import { useActionManager } from "@/storage/hooks/use-action-manager";
import { useCreateContext } from "./use-create-context";

export function useSetOutputToken(circuit: Circuit) {
  const { box } = useCreateContext();
  const [data, setData] = useCircuitData(circuit);
  const actionManager = useActionManager();

  return [data.outputToken, (value: string, index: number) => {
    setData((prev) => {
      if (!prev.outputToken) {
        prev.outputToken = [];
      }

      prev.outputToken[index] = value;

      const action = actionManager?.getAction(prev.actionId);

      if (!action) return;

      debugger;

      const nextCircuits = action.getNextCircuit(data);

      circuit.clearChildren();

      nextCircuits.forEach((item) => {
        circuit.appendChild(item);
      });

      setTimeout(() => {
        box.notifyTreeChange();
      });
    })
  }] as const;
}