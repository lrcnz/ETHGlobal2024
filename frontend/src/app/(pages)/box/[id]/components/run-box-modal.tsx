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


export function RunBoxButton({ data, name }: { name: string; data: UserCreatedBoxData['data'] }) {
  const id = useId();
  const wallet = useWalletInformation();
  const actionManager = useActionManager();
  const inputToken = data?.[0]?.data?.inputToken?.[0];
  const balance = useBalance(inputToken);
  const publicClient = usePublicClient();
  const form = useForm();
  const watchAmount = useWatch({ control: form.control, name: "amount" });
  const [, setCallsStatus] = useAtom(callsStatusAtom);
  const userToken = useUserToken();
  const client = useW3SClient();

  useEffect(() => {
    if (watchAmount) form.trigger(['amount']);
  }, [watchAmount, form]);

  const handleOpenRunModal = () => {
    if (typeof window === "undefined") return;

    const modal = document.getElementById(`run-box-${id}`) as HTMLDialogElement;
    modal.showModal();
    form.reset({ amount: "" });
    setCallsStatus(undefined);
  }
  const mutation = useMutation({
    mutationKey: ['send-tx'],
    mutationFn: async (data: unknown) => {
      const response = await fetch('/api/tx/callContract', {
        method: 'POST',
        headers: {
          token: userToken?.[0]?.userToken || "",
        },
        body: JSON.stringify(data)
      });

      return response.json();
    }
  })

  const handleSend: React.MouseEventHandler = async (e) => {
    // prevent form submission first
    e.preventDefault();
    const address = wallet?.data?.address;
    const walletId = wallet?.data?.id;
    const userTokenStr = userToken?.[0]?.userToken

    if (!actionManager || !publicClient || !address || !walletId || !userTokenStr) return;

    // trigger form validation
    await form.trigger(['amount']);

    // if amount is invalid, return
    if (form.formState.errors.amount) return;


    try {
      const amount = form.getValues("amount");
      const box = Box.fromJSON(data);
      const parsed = parseUnits(amount.toString(), balance?.decimals || 18);

      console.log(parsed);

      const contracts = await box.execute(actionManager, publicClient, address, [parsed]);

      const params = contracts.map((item) => {
        return [
          item.address,
          item?.value?.toString() || '0',
          encodeFunctionData({
            abi: item.abi,
            functionName: item.functionName,
            args: item.args
          })
        ];
      });

      const response = await mutation.mutateAsync({
        "abiParameters": [[...params]],
        "abiFunctionSignature": "executeBatch((address,uint,bytes)[])",
        contractAddress: address,
        walletId: walletId,
        feeLevel: "LOW",
      });

      setCallsStatus('pending');

      client?.execute(response.data.challengeId, (err) => {
        console.log(err);

        setTimeout(() => {
          setCallsStatus('success');
          handleOpenModal()
        }, 2000);
      });

      // writeContracts({ contracts: contracts });
    } catch (e) {
      console.log(e);
    }

    const modal = document.getElementById(`run-box-${id}`) as HTMLDialogElement;
    modal.close();
  }

  const handleOpenModal = () => {
    if (typeof window === "undefined") return;

    const modal = document.getElementById("tx-success-modal") as HTMLDialogElement;

    modal.showModal();

    setTimeout(() => {
      modal.close();
    }, 3000);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={handleOpenRunModal}>Run</button>
      <dialog id={`run-box-${id}`} className="modal">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
        </form>
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg mb-5">{`Run ${name}`}</h3>
          <div className="mb-10">
            <label htmlFor={`run-amount-${id}`} className="label text-sm font-semibold mb-2">
              Amount
              <div className="text-sm font-bold text-black/60 ">{formatBalance(balance.balance, balance.decimals)} {inputToken}</div>
            </label>
            <div className={twMerge("input input-bordered w-full h-12 flex items-center gap-2", form.formState.errors.amount ? "input-error" : "")}>
              <input
                id={`run-amount-${id}`}
                type="number"
                placeholder="Enter amount"
                className="flex-1"
                {...form.register("amount", { required: true, max: 100, min: 0 })}
              />
              <div className="text-base font-bold">{inputToken}</div>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn w-20 btn-md" onClick={handleSend}>RUN</button>
            </form>
          </div>
        </div>
      </dialog >
    </>
  );
}