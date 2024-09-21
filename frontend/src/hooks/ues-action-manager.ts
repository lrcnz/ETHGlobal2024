import { actionManager } from "@/atoms/action-manager";
import { useAtom } from "jotai";

export function useActionManager () {
  return useAtom(actionManager)[0];
}