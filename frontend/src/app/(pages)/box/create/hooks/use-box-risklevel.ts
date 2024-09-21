import * as React from "react";
import { useCreateContext } from "./use-create-context";
import { RiskLevel } from "@/lib/actions/types";
import { useActionManager } from "@/hooks/ues-action-manager";

const RISK_LEVELS: RiskLevel[] = ["safe", "medium", "risk"];

export function useBoxRiskLevel () {
  const [riskLevel, setRiskLevel] = React.useState<RiskLevel>("safe");
  const { box } = useCreateContext();
  const actionManager = useActionManager();

  React.useEffect(() => {
    if (!box || !actionManager) return;

    function updateRiskLevel() {
      let riskLevel: RiskLevel = "safe";

      box.preorderTraversal((circuit) => {
        const data = circuit.details;

        if (!data.actionId || !actionManager) return;

        const action = actionManager.getAction(data.actionId);
        const level = action?.riskLevel;

        // set risk level when action is more risky
        if (level && RISK_LEVELS.indexOf(level) > RISK_LEVELS.indexOf(riskLevel)) {
          riskLevel = level;
        }

        setRiskLevel(riskLevel);
      });
    }

    box.watchTreeChange(updateRiskLevel);

    return () => {
      box.unwatchTreeChange(updateRiskLevel);
    }
  }, [box, actionManager]);

  return riskLevel;
}