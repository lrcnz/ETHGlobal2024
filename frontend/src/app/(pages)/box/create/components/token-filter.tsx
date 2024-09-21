import * as React from "react";
import { twMerge } from "tailwind-merge";
import * as Select from '@radix-ui/react-select';
// import { ArrowDownIcon } from "./icons/arrow-down";
import TokenImage from "./token-image";

export interface TokenFilterProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  tokens: string[];
  value?: string;
  onChange: (token: string) => void;
  disabled?: boolean;
}

const TokenFilter = ({ value, onChange, className, tokens = ['ETH', 'USDC'], disabled }: TokenFilterProps) => {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger className={twMerge("flex items-center gap-2 px-[10px] py-[6px] w-fit h-[38px] rounded-[10px] border border-[#79747E] outline-none", disabled ? "opacity-80 cursor-not-allowed" : "", className)}>
        <span className="text-sm leading-5 font-medium text-[#79747E]">Token Filter</span>
        {value && (
          <div className="bg-[#E8E8E8] rounded-[4px] text-[12px] leading-[16px]">
            {value}
          </div>
        )}
        <Select.Icon asChild>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="w-[var(--radix-select-trigger-width)] overflow-hidden bg-white rounded-md drop-shadow-lg"
          position="popper"
        >
          <Select.Viewport>
            {
              tokens.map((token) => (
                <Select.Item key={token} value={token} className="outline-none flex items-center gap-2 px-[10px] py-2 hover:bg-black/5 cursor-pointer">
                  <TokenImage token={token} />
                  <Select.ItemText>{token}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))
            }
          </Select.Viewport>
          <Select.Arrow className="fill-white" />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

TokenFilter.displayName = "TokenFilter";

export { TokenFilter };