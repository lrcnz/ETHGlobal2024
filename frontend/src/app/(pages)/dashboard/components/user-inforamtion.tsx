"use client";

import { useWalletInformation } from "@/hooks/use-wallet-information";


export default function UserInformation () {
  const walletInformation = useWalletInformation()

  console.log(walletInformation);

  return (
    <div>
      <h1>User Information</h1>
      <p>Here is where the user information will go.</p>
    </div>
  );
}