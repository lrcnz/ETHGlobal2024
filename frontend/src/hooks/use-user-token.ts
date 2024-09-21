"use client";

import { userTokenAtom } from "@/atoms/user-token";
import { useAtom } from "jotai";

export function useUserToken () {
  return useAtom(userTokenAtom);
}