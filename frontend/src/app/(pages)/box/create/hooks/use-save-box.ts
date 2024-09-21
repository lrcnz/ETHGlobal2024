import { useCreateContext } from "./use-create-context";
import { useMutation } from "@tanstack/react-query";
import { useBoxAPY } from "./use-box-apy";
import { useForm } from "./use-form";
import { useWalletInformation } from "@/hooks/use-wallet-information";

export function useSaveBox(onSuccess: () => void) {
  const wallet = useWalletInformation();
  const { box } = useCreateContext();
  const apy = useBoxAPY();
  const form = useForm();

  const saveBox = useMutation({
    mutationFn: async (data: { name: string; creatorAddress: string; content: string, apy: number | undefined }) => {
      return fetch('/api/box', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(res => res.json());
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSave = async () => {
    await form.trigger(['boxName']);

    if (form.formState.errors.boxName || !wallet?.data?.address) return;
    const name = form.getValues('boxName');
    const address = wallet.data.address;

    saveBox.mutate({
      name,
      creatorAddress: address,
      content: JSON.stringify(box.toJSON()),
      apy: apy
    });
  };


  return {
    isLoading: saveBox.isPending,
    handleSave
  };
}