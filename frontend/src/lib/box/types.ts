
export type CircuitInput = string[];
export type CircuitOutput = string[];
export type CircuitParams = { [key: string]: any };

export interface CircuitData {
  actionId?: string;
  inputToken?: CircuitInput;
  outputToken?: CircuitOutput;
  params?: CircuitParams;
}

export interface CircuitRecord {
  id: string;
  data: CircuitData;
}

export type CreatedBoxRecord = CircuitRecord[];