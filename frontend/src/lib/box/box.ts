import { PublicClient } from "viem";
import { ActionManager } from "../actions/manager";
import { Circuit } from "./circuit";
import { CircuitData } from "./types";
import { Contracts } from "../actions/types";

export class Box {
  private root: Circuit | null;
  private watchTreeChangeCallbacks: (() => void)[] = [];

  constructor() {
    this.root = null;
  }

  public watchTreeChange(callback: () => void) {
    this.watchTreeChangeCallbacks.push(callback);
  }

  public unwatchTreeChange(callback: () => void) {
    const index = this.watchTreeChangeCallbacks.indexOf(callback);

    if (index === -1) return;

    this.watchTreeChangeCallbacks.splice(index, 1);
  }

  public notifyTreeChange() {
    this.watchTreeChangeCallbacks.forEach((callback) => {
      callback();
    })
  }

  public addCircuit(
    data: Circuit,
    parent: Circuit | null = null,
    secondParent: Circuit | null = null
  ) {
    if (!parent) {
      this.root = data;

      return;
    }

    parent.appendChild(data);

    if (secondParent) data.setSecondParent(secondParent);

    this.notifyTreeChange();
  }

  public removeCircuit(data: Circuit) {
    data.getParent()?.removeChild(data);
    this.notifyTreeChange();
  }

  public getRoot() {
    return this.root;
  }

  public setRoot(data: Circuit) {
    this.root = data;
  }

  public getDepth() {
    let max = 0;

    if (!this.root) return max;

    // get the depth of the tree
    const inner = (node: Circuit, depth: number) => {
      if (depth > max) max = depth;

      for (const child of node.getChildren()) {
        inner(child, depth + 1);
      }
    }

    inner(this.root, 1);

    return max;
  }

  public levelOrderTraversal() {
    if (!this.root) return [];

    const queue: Circuit[][] = [];
    const result: Circuit[][] = [];

    queue.push([this.root]);
    result.push([this.root]);

    while (queue.length) {
      const level = queue.shift() as Circuit[];
      const nextLevel: Circuit[] = [];

      for (const node of level) {
        nextLevel.push(...node.getChildren());
      }

      if (nextLevel.length) {
        result.push(nextLevel);
        queue.push(nextLevel);
      }
    }

    return result;
  }

  public getCircuitAtLevel(level: number) {
    const result = this.levelOrderTraversal();

    return result[level] || [];
  }

  public preorderTraversal(callback: (node: Circuit) => void) {
    function inner(node: Circuit | null) {
      if (!node) return;

      callback(node);

      for (const child of node.getChildren()) {
        inner(child);
      }
    }

    inner(this.root);
  }

  public async execute(
    actionManager: ActionManager,
    publicClient: PublicClient,
    address: string,
    amount: bigint[],
  ) {
    let contracts: Contracts = [];

    async function inner(node: Circuit | null, amount: bigint[]) {
      if (!node) return;

      const parentData = node.details;
      const parentAction = actionManager.getAction(parentData.actionId);

      if (!parentAction || !parentAction.getContracts || !parentData.inputToken) {
        contracts = [...contracts];
      } else {
        const result = await parentAction.getContracts(
          amount[0],
          address,
          node.details,
          publicClient
        );

        contracts = [...contracts, ...result];
      }

      const children = node.getChildren();

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        let simulateResult: bigint[] = amount;

        if (parentAction && parentAction.getSimulateOutput && parentData.inputToken) {
          simulateResult = await parentAction.getSimulateOutput(
            amount[0],
            address,
            node.details,
            publicClient
          );
        };

        if (parentAction && parentAction.getDirectOutput && parentData.inputToken) {
          simulateResult = parentAction.getDirectOutput(
            amount[0],
            node.details
          ) || amount;
        }

        await inner(child, simulateResult);
      }
    }

    await inner(this.root, amount);

    return contracts;
  }

  public findCircuitById(id: string) {
    let result: Circuit | null = null;

    this.preorderTraversal((node) => {
      if (node.getId() === id) {
        result = node;
      }
    })

    return result as Circuit | null;
  }

  public toJSON() {
    const result: Circuit[] = [];

    this.preorderTraversal((node) => {
      result.push(node);
    });

    return result.map((circuit) => circuit.toJSON())
      .filter((circuit) => circuit.data.actionId);
  }

  public static fromJSON(data: { id: string; data: CircuitData }[]) {
    const box = new Box();

    const map = new Map<string, Circuit>();

    data.forEach((circuit) => {
      const node = new Circuit(circuit.data);

      map.set(circuit.id, node);
    });

    map.forEach((node, id) => {
      const parent = map.get(id.split('-').slice(0, -1).join('-')) || null;

      box.addCircuit(node, parent);
    });

    return box;
  }
}