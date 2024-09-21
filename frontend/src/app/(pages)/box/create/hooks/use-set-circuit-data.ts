import { Circuit } from "@/lib/box/circuit";
import { useCircuitData } from "./use-circuit-data";
import { CircuitData } from "@/lib/box/types";
import { useCreateContext } from "./use-create-context";
import { useActionManager } from "@/hooks/ues-action-manager";

function isComplete(data: CircuitData) {
  return data.inputToken && data.inputToken.length !== 0 && data.actionId && data.outputToken && data.outputToken.length !== 0;
}

export function useSetCircuitData(circuit: Circuit) {
  const { box } = useCreateContext();
  const [data, setData] = useCircuitData(circuit);
  const actionManager = useActionManager();

  return [data, (updateData: Partial<CircuitData>) => {
    setData((data) => {
      const { inputToken, actionId, outputToken } = updateData;

      if (inputToken) {
        data.inputToken = inputToken;
      }

      if (actionId) {
        data.actionId = actionId;
      }

      if (outputToken) {
        data.outputToken = outputToken;
      }

      const action = actionManager?.getAction(data.actionId);

      if (!action) return;

      if (action.onSelect && actionId) {
        action.onSelect(circuit);
      }

      if (actionId && action.getOutputToken) {
        // try to get output token from action
        const outputToken = action.getOutputToken(data);

        if (outputToken) {
          data.outputToken = outputToken;
        }
      }

      if (isComplete(data)) {
        const nextCircuits = action.getNextCircuit(data);

        circuit.clearChildren();

        nextCircuits.forEach((item) => {
          circuit.appendChild(item);
        });
      }

      setTimeout(() => {
        box.notifyTreeChange();
      });
    });
  }] as const;
}