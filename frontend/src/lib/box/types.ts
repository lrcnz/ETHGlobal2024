/* eslint-disable @typescript-eslint/no-explicit-any */

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

export interface UserCreatedBoxData {
  name: string;
  creator: string;
  data: CreatedBoxRecord;
};

export type UserCreatedBoxRecord = { [key in string]: UserCreatedBoxData };