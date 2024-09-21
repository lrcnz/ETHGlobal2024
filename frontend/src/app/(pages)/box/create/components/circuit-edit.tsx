import * as React from "react";
import { Circuit } from "@/lib/box/circuit";
import { useActiveCircuit } from "../hooks/use-active-circuit";
import { useCircuitById } from "../hooks/use-circuit-by-id";
import { LegendEdit } from "./legend-edit";
import { useSetInputToken } from "../hooks/use-set-input-token";
import { TokenFilter } from "./token-filter";

const TokenEdit = ({ circuit, disabled }: CircuitEditProps) => {
  const [value, setValue] = useSetInputToken(circuit);

  if (!value) return;

  return (
    <div className="mb-4">
      {
        value.map((token, index) => (
          <TokenFilter
            key={`input-token-${token}-${index}-${circuit.getId()}`}
            value={token}
            onChange={(value) => setValue(value, index)}
            tokens={['ETH', "USDC", "stETH", 'ezETH']}
            disabled={disabled}
          />
        ))
      }
    </div>
  );
};

TokenEdit.displayName = 'TokenEdit';

interface CircuitEditProps {
  circuit: Circuit;
  disabled?: boolean;
}

const CircuitEdit = () => {
  const [activeCircuitId] = useActiveCircuit();
  const circuit = useCircuitById(activeCircuitId || '');
  const level = circuit?.getLevel() || 0;
  const isRoot = level === 0;

  if (!circuit) return;

  return (
    <div className="rounded-[20px] p-4 bg-white min-h-[200px]">
      <h3 className="text-[16px] leading-4 font-bold mb-4">Please drag or double click to Circuit {level + 1}</h3>
      <div>
        <TokenEdit circuit={circuit} disabled={!isRoot} />
        <LegendEdit circuit={circuit} />
      </div>
    </div>
  );
}

CircuitEdit.displayName = 'CircuitEdit';

export default CircuitEdit;