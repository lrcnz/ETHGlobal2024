"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { truncateAddress } from "@/utils/truncate-address";
import { RunBoxButton } from "./run-box-modal";
import { useAtom } from "jotai";
import { callsStatusAtom } from "../atoms";
import useInitBox from "@/hooks/use-init-box";
import TokenImage from "../../create/components/token-image";
import { BoxOverview } from "@/app/(pages)/profile/components/box-overview";

export const Detail = () => {
  const params = useParams<{ id: string }>();
  const { id: boxId } = params;
  const details = useQuery({
    queryKey: ["box", boxId],
    queryFn: async () => {
      const response = await fetch(`/api/box/${boxId}`);
      const data = await response.json();

      return {
        id: data.id,
        name: data.name,
        content: JSON.parse(data.content),
        creatorAddress: data.creatorAddress,
        apy: Number(data.apy || '0')
      }
    }
  })
  const { id, name, content, creatorAddress, apy } = details.data || {};
  const box = useInitBox(content);
  const inputToken = box?.getRoot()?.details?.inputToken || [];
  const [callsStatus] = useAtom(callsStatusAtom);

  console.log(callsStatus);

  return (
    <div className="w-full rounded-[20px] p-5 bg-white">
      {
        details.isLoading ? (
          <div className="w-full min-h-[460px] flex items-center justify-center ">
            <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>
        ) : (
          <div>
            <div className="text-xs font-light mb-2">Box {id}</div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={46}
                  height={46}
                  fill="none"
                >
                  <rect width={46} height={46} fill="#13DC91" rx={23} />
                  {/* <path fill="#fff" d="M11 34.68h24v-24H11v24Z" /> */}
                  <text fill="#fff" x="50%" y="55%" fontSize={24} textAnchor="middle" dominantBaseline="middle">
                    🔖
                  </text>
                </svg>
                <div>
                  <p className="text-2xl leading-[24px] font-bold mb-2">{name}</p>
                  <p className="text-sm leading-[14px]">By{' '}
                    <span className="text-[#1866F7]">{truncateAddress(creatorAddress)}</span>
                  </p>
                </div>
              </div>
              <div>
                <RunBoxButton data={content} name={name} />
              </div>
            </div>

            <div className="flex items-stretch gap-6 mb-6">
              <div className="p-4 bg-[#f6ff7f] rounded-[20px] flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-black/40 text-sm font-bold leading-[14px]">Input</div>
                <div className="justify-start items-start gap-2 inline-flex">
                  <div className="w-[18px] h-[18px] relative">
                    {inputToken.map((token, index) => (<TokenImage key={index} token={token} />))}
                  </div>
                  <div className="text-black text-lg font-normal leading-[18px]">{inputToken}</div>
                </div>
              </div>
              <div className="p-4 bg-[#F6DDFF] rounded-[20px] flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-black/40 text-sm font-bold leading-[14px]">APY</div>
                <div className="justify-start items-start gap-2 inline-flex">
                  <div className="text-lg leading-[18px]">
                    <span className="font-normal">1D</span> | <span className="font-normal">1W</span> | <span className="font-bold">1M</span>
                  </div>
                  <div className="text-black text-lg font-normal leading-[18px]">{((apy || 0) * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
            <div>
              {
                callsStatus?.status === "PENDING" ? (
                  <div role="status" className="mb-2 flex items-center gap-2">
                    <div>
                      <svg aria-hidden="true" className="inline w-4 h-4 text-gray animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="text-sm font-bold text-black">Runing ...</p>
                  </div>
                ) : callsStatus?.status === "CONFIRMED" ? (
                  <div className="mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-success">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p className="text-sm font-bold text-black">Success</p>
                  </div>

                ) : null
              }
            </div>
            {box && <BoxOverview data={box} id={id} />}
          </div>
        )
      }
    </div>
  );
}

Detail.displayName = "Detail"
