/* eslint-disable @typescript-eslint/no-unused-vars */
import { Action } from "../types";
import { ST_ETH_ADDRESS } from "@/configs/contracts";
import { Circuit } from "@/lib/box/circuit";
import { CircuitData, CircuitInput } from "@/lib/box/types";
import { CommonOutputPreview } from "./utils/common-output-preview";

export class JoinAction implements Action {
  readonly id = "Join";
  readonly riskLevel = "safe";
  readonly contractAddress = ST_ETH_ADDRESS;

  public getDescription(_data: Circuit): string {
    return `Join Two Circles`;
  }

  public getOutputPreviewElement (circuit: Circuit) {
    const Preview = () => <CommonOutputPreview tokens={circuit.details?.inputToken || []} />;

    return Preview;
  };

  public onSelect (circuit: Circuit) {
    const parentNode = circuit.getParent();
    const grandParentNode = circuit.getParent()?.getParent();
    const grandChildNodes = grandParentNode?.getChildren() || [];

    if (!parentNode || !grandParentNode) return;

    // clear all children in grand child node except the current node
    grandChildNodes.forEach((child) => {
      if (child.getId() !== parentNode.getId()) {
        child.clearChildren();
      }
    });
  }

  public getOutputToken(data: CircuitData) {
    if (!data.inputToken) return [];

    return [data.inputToken[0]];
  }

  public getNextCircuit(data: CircuitData): Circuit[] {
    return [
      new Circuit({ inputToken: [(data.inputToken || [])[0]] }),
    ];
  }

  public checkIfUseable(circuit: Circuit): boolean {
    const input = circuit.details?.inputToken;

    if (input?.length !== 1) return false;

    const grandParentNode = circuit.getParent()?.getParent();
    const grandChildNodes = grandParentNode?.getChildren() || [];

    if (!grandParentNode) return false;

    // only useable when all children have save output token
    const grandChildrenOutputList = grandChildNodes.map((child) => child.details?.outputToken)

    return grandChildrenOutputList.every((item) => item && item.length === 1 && item[0] === input[0]);
  }

  public getNextCircuitData(inputToken: CircuitInput): CircuitData[] {
    if (Array.isArray(inputToken)) throw new Error("Invalid input token");

    return [{ inputToken: inputToken }];
  }

  public getDirectOutput(amount: bigint, data: CircuitData): bigint[] {
    return [amount];
  }
}