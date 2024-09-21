import * as React from "react";
import { Circuit } from "@/lib/box/circuit";
import { Action } from "@/lib/actions/types";
import { useSetInputToken } from "../hooks/use-set-input-token";
import { twMerge } from "tailwind-merge";
import { useSetCircuitData } from "../hooks/use-set-circuit-data";
import { useActionManager } from "@/hooks/ues-action-manager";

export const LegendEdit = ({ circuit }: { circuit: Circuit }) => {
  const [inputToken] = useSetInputToken(circuit);
  const [, setData] = useSetCircuitData(circuit);
  const actionManager = useActionManager();
  const [selectableActions, setSelectableActions] = React.useState<Action[]>([]);

  React.useEffect(() => {
    if (!inputToken || !actionManager) return;

    const actions = actionManager.getUseableActions(circuit);

    setSelectableActions(actions);
  }, [inputToken, actionManager, circuit])

  if (!inputToken) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm leading-[14px] text-black/60">Legend:</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe" />Safe</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-medium" />Medium</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-risky" />Risky</div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded-[20px] min-h-[120px]">
        {
          selectableActions.map((action, index) => {
            const apy = action.getAPY ? action.getAPY(circuit.details) : 0;

            const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
              // set data to drag event
              e.dataTransfer.setData("action-id", action.id);
              e.dataTransfer.setData("circuit-id", circuit.getId());

              // find the target circuit item
              if (typeof window !== "undefined") {
                const elem = document.querySelector(`[data-circuit-id="${circuit.getId()}"]`);

                if (!elem) return;

                elem.setAttribute("data-dragging", "true");
              }
            }
            const handleDragEnd = () => {
              if (typeof window !== "undefined") {
                const elem = document.querySelector(`[data-circuit-id="${circuit.getId()}"]`);

                if (!elem) return;

                elem.removeAttribute("data-dragging");
              }
            }

            return (
              <div
                draggable
                key={`action-${action.id}-${index}`}
                className="flex items-center gap-2 p-2 bg-white rounded-[8px] w-fit cursor-pointer mb-[10px] text-base leading-4 last:mb-0"
                onClick={() => setData({ actionId: action.id })}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className={
                  twMerge(
                    "w-2 h-2 rounded-full",
                    action.riskLevel === "safe" ? "bg-safe" : action.riskLevel === "medium" ? "bg-medium" : "bg-risky"
                  )
                } />
                <div>
                  {
                    action.getDescriptionElement
                    ? React.createElement(action.getDescriptionElement(circuit))
                    : action.getDescription
                    ? action.getDescription(circuit)
                    : null
                  }
                </div>
                {
                  apy ? (
                    <div className="text-base leading-4 flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#E8E8E8]">
                      APY: <p className="font-bold">{(apy * 100).toFixed(2)}</p>%
                    </div>
                  ) : null
                }
                {
                  action.getOutputPreviewElement ? React.createElement(action.getOutputPreviewElement(circuit)) : null
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

LegendEdit.displayName = "LegendEdit";