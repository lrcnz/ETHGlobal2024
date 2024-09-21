import { Circuit } from "@/lib/box/circuit";
import { useCircuitData } from "./use-circuit-data";
import { useActionManager } from "@/hooks/ues-action-manager";

export function useSetInputToken (circuit: Circuit) {
  const [data, setData] = useCircuitData(circuit);
  const actionManager = useActionManager();

  return [data.inputToken, (value: string, index: number) => {
    setData((data) => {
      if (!data.inputToken) {
        data.inputToken = [];
      }

      data.inputToken[index] = value;

      // clear params
      data.params = {};

      // check if action is useable
      if (!data.actionId || !actionManager) return;

      const action = actionManager.getAction(data.actionId);

      if (!action) return;

      const isUsabled = action.checkIfUseable(circuit);

      if (!isUsabled) {
        data.actionId = undefined;
        data.outputToken = undefined;
      }
    })
  }] as const;
}