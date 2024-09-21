import * as React from "react";
import { twMerge } from "tailwind-merge";
import CircuitItem from "./circuit-item";
import { useCircuitsByLevel } from "../hooks/use-circuits-by-level";
import { useActiveCircuit } from "../hooks/use-active-circuit";
import { Circuit as CircuitEntity } from "@/lib/box/circuit";
import { useActionManager } from "@/hooks/ues-action-manager";

interface CircuitProps {
  index: number;
  isEnd?: boolean;
  isSelected?: boolean;
}

function useCircuitsAPY(circuits: CircuitEntity[]) {
  const actionManager = useActionManager();
  const apy = circuits.reduce((acc, circuit) => {
    const { actionId, inputToken } = circuit.details;

    const action = actionManager?.getAction(actionId);

    if (!action || !action.getAPY || !inputToken) return acc;

    const apy = action.getAPY(circuit.details);

    if (apy === 0) return acc;

    return Math.min(acc, apy);
  }, Infinity);

  // when apy is Infinity, return 0
  if (apy === Infinity) return 0;

  return apy;
}


const Circuit = ({ index, isEnd, isSelected }: CircuitProps) => {
  const circuits = useCircuitsByLevel(index);
  const [, setActiveCircuit] = useActiveCircuit();
  const apy = useCircuitsAPY(circuits);

  const handleClick = () => {
    const firstChild = circuits[0];

    if (firstChild) {
      setActiveCircuit(firstChild.getId());
    }
  }

  return (
    <div
      onClick={handleClick}
      className={twMerge("min-h-[224px] w-[323px] flex-shrink-0 flex-grow-0 p-4 rounded-[20px] bg-gra bg-gray-100 cursor-pointer transition-all", isSelected ? " shadow-[0px_6px_20px_0px_rgba(0,0,0,0.14)] bg-white" : "")}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[18px] h-5 leading-[18px] font-bold">{`Circuit ${index + 1}`}</p>
        {
          apy ? (
        <label className="p-1 rounded-[4px] text-xs leading-3 bg-[#E8E8E8]">APY: <span className="font-bold">{(apy * 100).toFixed(2)}%</span></label>
          ) : null
        }
      </div>
      <div>
        {
          circuits.map((item, subIndex) => (
            <CircuitItem
              circuit={item}
              key={`create-box-Circuit${index}-subCircuit${subIndex}`}
              hasMultiSub={circuits.length > 1}
              parentIndex={index}
              subIndex={subIndex}
              isParentEnd={isEnd}
            />
          ))
        }
      </div>
    </div>
  );
}

Circuit.displayName = 'Circuit';

export default Circuit;
