import { atom } from "jotai";

export const userTokenAtom = atom<{
  encryptionKey: string;
  userToken: string;
}>({
  encryptionKey: "",
  userToken: "",
});