"use client";

import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react";

export function useSignIn () {
  const mutation = useMutation({
    mutationFn: async (data: { email: string, password: string }) => {
      const res = await fetch("/api/wallet/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      return res.json();
    }
  });

  return useCallback(async (data: { email: string, password: string }) => {
    return mutation.mutateAsync(data);
  }, [mutation]);
}