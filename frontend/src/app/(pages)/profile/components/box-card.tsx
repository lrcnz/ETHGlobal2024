import * as React from "react";
// import { BoxOverview } from "./box-overview";
import { useRouter } from "next/navigation";
import useInitBox from "../../../../hooks/use-init-box";
import { truncateAddress } from "../../../../utils/truncate-address";
import TokenImage from "../../box/create/components/token-image";
import { BoxOverview } from "./box-overview";

interface BoxCardProps {
  id: string;
  name: string;
  content: string;
  creatorAddress: string;
  apy: number
}

export function BoxCard({ id, name, creatorAddress, content, apy }: BoxCardProps) {
  const router = useRouter();
  const box = useInitBox(content);
  const inputToken = box?.getRoot()?.details?.inputToken || [];
  const handleToBoxDetail = () => {
    router.push(`/box/${id}`);
  }

  return (
    <div className="border border-[#F3F3F3] bg-white rounded-[20px] p-5 mb-6 last:mb-0 cursor-pointer" onClick={handleToBoxDetail}>
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
        {/* <div>
          <RunBoxButton data={content} name={name} />
        </div> */}
      </div>
      <div className="flex items-stretch gap-6 mb-6">
        <div className="p-4 bg-[#f6ff7f] rounded-[20px] flex-col justify-start items-start gap-2 inline-flex">
          <div className="text-black/40 text-sm font-bold leading-[14px]">Input</div>
          <div className="justify-start items-start gap-2 inline-flex">
            <div className="w-[18px] h-[18px] relative">
              {
                inputToken.map((token, index) => {
                  return (
                    <TokenImage key={`${id}-${token}-${index}`} token={token} />
                  )
                })
              }
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
            <div className="text-black text-lg font-normal leading-[18px]">{(apy * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
      {box && <BoxOverview data={box} id={id} />}
    </div>
  );
}