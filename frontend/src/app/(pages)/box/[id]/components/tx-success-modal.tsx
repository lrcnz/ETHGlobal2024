import { Box } from "@/lib/box/box";
import { useEffect, useId } from "react";
import { usePublicClient } from "wagmi";
import { useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { useAtom } from "jotai";
import { callsStatusAtom } from "../atoms";
import { encodeFunctionData, parseUnits } from "viem";
import { useActionManager } from "@/hooks/ues-action-manager";
import { UserCreatedBoxData } from "@/lib/box/types";
import { useBalance } from "@/hooks/use-balance";
import { formatBalance } from "@/utils/format-balance";
import { useWalletInformation } from "@/hooks/use-wallet-information";
import { useMutation } from "@tanstack/react-query";
import { useUserToken } from "@/hooks/use-user-token";
import { useW3SClient } from "@/hooks/use-w3s-client";


export function TxSuccessModal({ name }: { name: string }) {
  return (
    <dialog id="tx-success-modal" className="modal">
      <div className="modal-box bg-white flex flex-col items-center justify-center h-[320px] w-[320px]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[60px] mb-6 stroke-success">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3 className="font-bold text-lg mb-5 text-center">{`Run ${name} Success`}</h3>
      </div>
    </dialog >
  );
}