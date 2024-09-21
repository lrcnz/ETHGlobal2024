import { Circuit } from "../box/circuit";
import { CircuitInput } from "../box/types";
import { Action } from "./types";

export class ActionManager {
  private actions: Action[] = [];

  constructor(actions: Action[]) {
    this.actions = actions;
  }

  public getAction (id?: string) {
    if (!id) return undefined;

    return this.actions.find((action) => action.id === id);
  }

  public getUseableActions (circuit: Circuit) {
    return this.actions.filter((action) => action.checkIfUseable(circuit));
  }
}