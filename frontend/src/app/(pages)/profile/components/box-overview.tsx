import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Box } from "../../../../lib/box/box";
import { useActionManager } from "../../../../hooks/ues-action-manager";
import { Circuit } from "../../../../lib/box/circuit";
import { useBoxDepth } from "@/hooks/use-box-depth";

interface BoxOverviewProps {
  id: string;
  data: Box;
}

interface BoxItemProps {
  id: string;
  index: number;
  data: Circuit[];
}

const getBackgroundColor = (index: number) => {
  switch (index % 3) {
    case 0: return 'bg-[#F7F9C6]';
    case 1: return 'bg-[#E4E8FC]';
    case 2: return 'bg-[#E4F2F1]';
  }
}

function BoxItem({ id, data, index }: BoxItemProps) {
  const actionManager = useActionManager();

  if (!actionManager) return null;

  let circuitCount = -1;

  return (
    <div className={twMerge("relative flex-1 flex flex-col justify-center", getBackgroundColor(index))} style={{ zIndex: 100 - index }}>
      {
        data.map((circuit, circuitIndex) => {

          const { inputToken, outputToken, actionId } = circuit.details;
          const action = actionManager.getAction(actionId);

          if (!action || !inputToken || !outputToken) return null;

          const description = action.getDescription(circuit);

          return (
            <div key={`box-overview-${id}-${index}-${circuitIndex}`} className="min-h-[72px] flex items-center gap-2 px-8 py-4 ">
              <div className="text-sm leading[14px]">
                <p className="font-light mb-1">Input</p>
                <p className="font-bold">{inputToken}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
              </svg>

              <div className="text-sm leading[14px]">
                <p className="font-light mb-1">Process</p>
                <p className="font-bold">{description}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
              </svg>
              <div className="flex flex-col gap-0">
                {
                  outputToken.map((token, tokenIndex) => {
                    const isOnlyOneOutput = outputToken.length === 1;
                    circuitCount = circuitCount + 1;

                    return (
                      <React.Fragment key={`box-overview-${id}-${index}-${circuitIndex}-${tokenIndex}`}>
                        <div className="flex items-start justify-center flex-col text-sm leading[14px] min-h-[72px]" key={`box-overview-${id}-${index}-${circuitIndex}-output-${tokenIndex}`}>
                          <p className="font-light mb-1">Output {isOnlyOneOutput ? "" : tokenIndex + 1}</p>
                          <p className="font-bold">{token}</p>
                        </div>
                        <svg
                          className="absolute -right-4"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ top: 104 * (circuitCount) + 'px' }}
                          width={17}
                          height={104}
                          fill="none"
                        >
                          <path fill="#F7F9C6" d="M.666 104V0l16 52-16 52Z" />
                        </svg>
                      </React.Fragment>
                    )
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export function BoxOverview({ data, id }: BoxOverviewProps) {
  const depth = useBoxDepth(data);

  return (
    <div className="flex items-stretch rounded-[20px] overflow-hidden w-full">
      {
        new Array(depth).fill('').map((_, index) => (
          <BoxItem key={`box-overfiew-${id}-${index}`} data={data.getCircuitAtLevel(index)} id={id} index={index} />
        ))
      }
    </div>
  );
}

BoxOverview.displayName = "BoxOverview";
