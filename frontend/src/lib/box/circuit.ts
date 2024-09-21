import { atomWithImmer } from "jotai-immer";
import { CircuitData } from "./types";
import { store } from "@/components/providers/providers";

export class Circuit {
  private id: string = '0';
  private parent: Circuit | null = null;
  private secondParent: Circuit | null = null;
  private children: Circuit[] = [];
  private data: ReturnType<typeof atomWithImmer<CircuitData>>;

  constructor(initValue: CircuitData = {}) {
    this.parent = null;
    this.children = [];
    this.data = atomWithImmer<CircuitData>(initValue);
  }

  public getParent() {
    return this.parent;
  }

  public getSecondParent() {
    return this.secondParent;
  }

  public clearChildren() {
    this.children = [];
  }

  public getChildren() {
    return this.children;
  }

  public setParent(parent: Circuit) {
    this.parent = parent;
  }

  public setSecondParent(parent: Circuit) {
    // this is used for the second parent in the case of a merge
    this.secondParent = parent;
  }

  public appendChild(child: Circuit) {
    child.setParent(this);
    child.setId(`${this.id}-${this.children.length}`);
    this.children.push(child);
  }

  public removeChild(child: Circuit) {
    this.children = this.children.filter((c) => c !== child);
  }

  public getData() {
    return this.data;
  }

  public setId(id: string) {
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public getLevel() {
    let level = 0;
    let parent = this.parent;

    while (parent) {
      level++;
      parent = parent.getParent();
    }

    return level;
  }

  public get details () {
    return store.get(this.data);
  }

  public toJSON(): { id: string; data: CircuitData } {
    return {
      id: this.id,
      data: store.get(this.data),
    }
  }
}