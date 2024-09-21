"use client";

import AccountAvatar from "@/components/account-avatar";
// import { truncateAddress } from "@/utils/truncate-address";
// import { StatisticCard } from "@/components/statistic-card";
// import { useAccount } from "wagmi";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Prisma } from "@prisma/client";
// import { useState } from "react";
// import { WithSkeleton } from "@/components/skeleton";
// import { Button } from "@/components/button";
// import { useUserInfo } from "@/hooks/use-user-info";
import { useWalletInformation } from "@/hooks/use-wallet-information";
import { truncateAddress } from "@/utils/truncate-address";
import { StatisticCard } from "./statistic-card";
 
const UserInfo = () => {
  const walletInfo = useWalletInformation();

  if (!walletInfo) return null;

  console.log(walletInfo);

  return (
    <div className="flex flex-col items-center pb-[30px] mt-[30px] bg-white rounded-[20px] p-6 mb-10">
      <div className="w-[120px] h-[120px] rounded-full bg-black/5 flex items-center justify-center mb-3">
        <AccountAvatar address={walletInfo.data.address} size={80} />
      </div>

      <div className="mb-3 text-black text-[40px] leading-[48px] font-bold">
        {walletInfo.data?.address ? truncateAddress(walletInfo.data?.address) : "Loading..."}
      </div>
      <div className="mb-6 flex items-center justify-center gap-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
      </div>
      <div className="flex flex-row items-center justify-center gap-6">
        <StatisticCard className="w-[168px]">
          <StatisticCard.Header>Published Box</StatisticCard.Header>
          <StatisticCard.Content>1</StatisticCard.Content>
        </StatisticCard>
        <StatisticCard className="w-[168px]">
          <StatisticCard.Header>Box tx</StatisticCard.Header>
          <StatisticCard.Content>10</StatisticCard.Content>
        </StatisticCard>
        <StatisticCard className="w-[168px]">
          <StatisticCard.Header>Subscribers</StatisticCard.Header>
          <StatisticCard.Content>256</StatisticCard.Content>
        </StatisticCard>
        <StatisticCard className="w-[168px]">
          <StatisticCard.Header>Following</StatisticCard.Header>
          <StatisticCard.Content>100</StatisticCard.Content>
        </StatisticCard>
      </div>
    </div>
  );
}

export default UserInfo;