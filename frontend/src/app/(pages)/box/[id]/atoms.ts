import { atom } from "jotai";

export const callsStatusAtom = atom<'pending' | 'success' | undefined>();