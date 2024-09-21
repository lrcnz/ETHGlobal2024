import { Circuit } from "@/lib/box/circuit";
import { useCircuitData } from "./use-circuit-data";
import { useActionManager } from "@/storage/hooks/use-action-manager";
import { useCreateContext } from "./use-create-context";
import { useSetOutputToken } from "./use-set-output-token";

export function useSetActionId(circuit: Circuit) {
  const [data, setData] = useCircuitData(circuit);
  const { box } = useCreateContext();
  const actionManager = useActionManager();
  const [, setOutputToken] = useSetOutputToken(circuit);

  return [data.actionId, (value: string) => {
    setData((data) => {
      const action = actionManager?.getAction(value);

      if (!action) return;

      data.actionId = value;
      // clear output tokens
      data.outputToken = [];

      // set output token
      if (!data.inputToken || !action.getOutputToken) return;

      const outputToken = action.getOutputToken(data);

      setTimeout(() => {
        outputToken.forEach((token, index) => {
          setOutputToken(token, index);
        });
      })
    })
  }] as const;
}