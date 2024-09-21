import * as React from "react";
import { twMerge } from "tailwind-merge";
import NextCircuitArrow from "./svgs/next-circuit-arrow";
import { Circuit } from "@/lib/box/circuit";
import { useActiveCircuit } from "../hooks/use-active-circuit";
import { useCircuitData } from "../hooks/use-circuit-data";
import { Token } from "./token";
import { useSetCircuitData } from "../hooks/use-set-circuit-data";
import { useActionManager } from "@/hooks/ues-action-manager";

interface CircuitItemProps {
  circuit: Circuit;
  parentIndex?: number;
  subIndex?: number;
  hasMultiSub?: boolean;
  isParentEnd?: boolean;
}

interface ItemProps {
  circuit: Circuit;
  isActive?: boolean;
  isDisabled?: boolean;
}

const numberToLetter = (num: number) => {
  return String.fromCharCode(97 + num);
}

const Empty = () => {
  return <div className="w-full h-6 bg-black/10 rounded-[4px]" />
}

Empty.displayName = 'Empty';

function getValueClassName(isActive: boolean, isDisabled: boolean, className?: string) {
  return twMerge(
    "flex max-h-6 items-center gap-1 w-fit px-2 py-1 rounded-[4px] text-sm font-bold leading-4",
    isActive ? "border border-black/60" : "",
    isDisabled ? "bg-[#E8E8E8]" : "bg-white",
    className || ""
  );
}

const InputField = ({ circuit, isActive = false, isDisabled = false }: ItemProps) => {
  const [data] = useCircuitData(circuit);
  const inputToken = data.inputToken || [];

  return (
    <div className="mb-4">
      <p className="text-sm leading-[14px] text-black/60 mb-1">Input</p>
      {
        inputToken && inputToken.length !== 0 ? (
          <div className={getValueClassName(isActive, isDisabled)}>
            {
              inputToken.map((token, index) => {
                return <Token token={token} key={`${circuit.getId()}-${token}-${index}`} />
              })
            }
          </div>
        ) : <Empty />
      }
    </div>
  );
}

InputField.displayName = 'InputField';

const ActionField = ({ circuit, isActive = false, isDisabled = false }: ItemProps) => {
  const [data] = useCircuitData(circuit);
  const action = useActionManager()?.getAction(data.actionId);

  return (
    <div className="mb-4">
      <p className="text-sm leading-[14px] text-black/60 mb-1">Action</p>
      {
        action && data.inputToken ? (
          <div className={getValueClassName(isActive, isDisabled, "text-ellipsis overflow-hidden text-nowrap")}>
            {action.getDescription(circuit)}
          </div>
        ) : <Empty />
      }
    </div>
  );
}

ActionField.displayName = 'ActionField';

const OutputField = ({ circuit }: { circuit: Circuit }) => {
  const [data] = useCircuitData(circuit);
  const outputToken = data.outputToken || [];

  return (
    <div>
      <p className="text-sm leading-[14px] text-black/60 mb-1">Output</p>
      {
        outputToken && outputToken.length !== 0 ? (
          <div className="flex items-center gap-2 w-fit h-6 rounded-[4px] bg-transparent">
            {
              outputToken.map((token, index) => {
                const isLast = index === outputToken.length - 1;

                return (
                  <React.Fragment key={`output-${token}-${index}`}>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#E8E8E8]">
                      <span>Get</span>
                      <Token token={token} />
                    </div>
                    {!isLast ? <div className="text-base leading-4">&</div> : null}
                  </React.Fragment>
                );
              })
            }
          </div>
        ) : <Empty />
      }
    </div>
  );
}

OutputField.displayName = 'OutputField';

const CircuitItem = ({
  circuit,
  hasMultiSub,
  subIndex,
  parentIndex = 0,
  isParentEnd = false
}: CircuitItemProps) => {
  const [activeCircuit, setActiveCircuit] = useActiveCircuit();
  const isActive = activeCircuit === circuit.getId();
  // only root circuit can edit the input
  const isRoot = parentIndex === 0;
  const [, setCircuitData] = useSetCircuitData(circuit);

  const handleClick = (e: React.MouseEvent) => {
    setActiveCircuit(circuit.getId());

    e.stopPropagation();
  }

  // handle drop event
  const handleDrop = (e: React.DragEvent) => {
    console.log(e);
    e.preventDefault();
    const circuitId = e.dataTransfer.getData('circuit-id');
    const actionId = e.dataTransfer.getData('action-id');

    if (circuitId === circuit.getId()) {
      setCircuitData({ actionId });
    }
  }

  return (
    <div className={"text-sm leading-[14px] font-bold mb-4 last:mb-0"} onClick={handleClick}>
      {hasMultiSub ? (
        <p className="mb-2">{`Circuit ${parentIndex + 1}-${numberToLetter(subIndex || 0)}`}</p>
      ) : null}
      <div
        data-circuit-id={circuit.getId()}
        data-dragging="false"
        className={
          twMerge(
            "relative curcuit-item p-2 transition-all rounded-lg box-border max-h-[174px] border  border-black/10",
            isActive ? "bg-white border-black" : "bg-[#F3F3F3]",
            "data-[dragging=true]:border-[2px] data-[dragging=true]:border-[#1866F7]"
          )
        }
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <InputField circuit={circuit} isActive={isActive} isDisabled={!isRoot} />
        <ActionField circuit={circuit} isActive={isActive} />
        <OutputField circuit={circuit} />
        {!isParentEnd && <NextCircuitArrow className="absolute -right-10 top-[50%] -translate-y-2" />}
      </div>
    </div>
  );
}

CircuitItem.displayName = 'CircuitItem';

export default CircuitItem;