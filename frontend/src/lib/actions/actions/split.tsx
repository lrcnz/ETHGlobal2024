import { Action } from "../types";
import { CommonOutputPreview } from "./utils/common-output-preview";
import { CircuitData } from "@/lib/box/types";
import { Circuit } from "@/lib/box/circuit";
import { useCircuitData } from "@/app/(pages)/box/create/hooks/use-circuit-data";

export class SplitAction implements Action {
  readonly id = "split";
  readonly riskLevel = "safe";

  public getDescription(data: Circuit): string {
    const { inputToken } = data.details;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return `Split ${inputToken} into two way contract`;
  }

  public getOutputPreviewElement?: ((circuit: Circuit) => () => JSX.Element) | undefined = (circuit) => {
    const Previwe = () => {
      const [data] = useCircuitData(circuit);

      return <CommonOutputPreview tokens={data.inputToken || []} />;
    }

    return Previwe;
  }

  public getOutputToken(data: CircuitData) {
    const { inputToken } = data;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return [inputToken[0], inputToken[0]];
  }

  public getNextCircuit(data: CircuitData) {
    const { inputToken } = data;

    if (!inputToken || inputToken.length !== 1) throw new Error("Invalid input token");

    return [
      new Circuit({ inputToken: [inputToken[0]] }),
      new Circuit({ inputToken: [inputToken[0]] }),
    ];
  }

  public checkIfUseable(data: Circuit): boolean {
    const { inputToken } = data.details;

    // only useable if input is one token
    return !!inputToken && inputToken.length === 1;
  }

  public getOutput(amount: bigint): bigint[] {
    return [amount / BigInt(2), amount / BigInt(2)];
  }
}