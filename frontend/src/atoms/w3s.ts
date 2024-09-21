import { atom } from "jotai";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

export const w3sSDKAtmo = atom<W3SSdk | null>(null);