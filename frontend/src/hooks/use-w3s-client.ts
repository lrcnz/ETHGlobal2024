import { w3sSDKAtmo } from "@/atoms/w3s";
import { useAtom } from "jotai";

export function useW3SClient () {
  return useAtom(w3sSDKAtmo)?.[0];
}