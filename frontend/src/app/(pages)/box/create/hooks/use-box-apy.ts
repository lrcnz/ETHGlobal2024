import * as React from "react";
import { useCreateContext } from "./use-create-context";
import { RiskLevel } from "@/lib/actions/types";
import { useActionManager } from "@/hooks/ues-action-manager";

const RISK_LEVELS: RiskLevel[] = ["safe", "medium", "risk"];

export function useBoxAPY () {
  const [apy, setAPY] = React.useState<number>(0);
  const { box } = useCreateContext();
  const actionManager = useActionManager();

  React.useEffect(() => {
    if (!box || !actionManager) return;

    function updateRiskLevel() {
      const circuits = box.levelOrderTraversal();

      // calculate APY
      const apy = circuits.reduce((acc, circuits) => {
        const apy = circuits.reduce((acc, circuit) => {
          if (!actionManager) return acc;
          // get largest APY
          const data = circuit.details;
          const action = actionManager.getAction(data.actionId);

          if (!action || !action.getAPY) return acc;

          const apy = action.getAPY(data);

          if (apy === 0) return acc;

          return Math.max(acc, apy);
        }, 0);

        return acc + apy;
      }, 0);

      setAPY(apy);
    }

    box.watchTreeChange(updateRiskLevel);

    return () => {
      box.unwatchTreeChange(updateRiskLevel);
    }
  }, [box, actionManager]);

  return apy;
}