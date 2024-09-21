import { atom } from "jotai";
import { UseCallsStatusReturnType } from "wagmi/experimental";

export const callsStatusAtom = atom<'pending' | 'success' | undefined>();