"use client";

import { userTokenAtom } from "@/atoms/user-token";
import { w3sSDKAtmo } from "@/atoms/w3s";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useAtom } from "jotai";
import { useEffect } from "react";

export function W3SProvider({ children }: { children: React.ReactNode }) {
  const [w3sSDK, setW3sSDK] = useAtom(w3sSDKAtmo);
  const [userToken] = useAtom(userTokenAtom);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_APP_ID;

    if (!w3sSDK && appId) {
      const client = new W3SSdk();

      client.setAppSettings({ appId });

      setW3sSDK(client);
    }
  }, [w3sSDK, setW3sSDK]);

  useEffect(() => {
    if (!userToken || !w3sSDK) return;

    w3sSDK?.setAuthentication(userToken);

  }, [userToken, w3sSDK]);

  return children;
}