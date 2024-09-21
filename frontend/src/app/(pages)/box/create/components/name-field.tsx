import { twMerge } from "tailwind-merge";
import { useBoxRiskLevel } from "../hooks/use-box-risklevel";
import { useBoxAPY } from "../hooks/use-box-apy";
import { useForm } from "../hooks/use-form";

const NameField = ({ className }: { className: string }) => {
  const riskLevel = useBoxRiskLevel();
  const form = useForm();
  const apy = useBoxAPY();

  return (
    <div className={twMerge("rounded-[20px] p-5 bg-white grid grid-cols-[5fr_2fr_3fr] gap-6", className)}>
      <div className="px-6 py-4 rounded-[20px] bg-[#F5F5F5]">
        <p className="mb-2">Name</p>
        <input
          {...form.register("boxName", { required: true })}
          type="text"
          placeholder="Please write your Box name"
          className={twMerge("transition-colors input input-bordered w-full rounded-[12px] px-4 h-[56px]", form.formState.errors["boxName"] ? "input-error" : "!border-black ")}
        />
      </div>
      <div className="px-6 py-4 rounded-[20px] bg-[#F5F5F5] flex flex-col">
        <p className="mb-2">Est. APY</p>
        <div className="flex items-center flex-1">
          <p className="text-[24px] leading-[18px]">{(apy * 100).toFixed(2)}%</p>
        </div>
      </div>
      <div className="px-6 py-4 rounded-[20px] bg-[#F5F5F5] flex flex-col">
        <p className="mb-2">Risk Level (Calculated): <span className="uppercase">{riskLevel}</span></p>
        <div className="flex items-center gap-1 flex-1">
          <div className={twMerge("flex-1 h-3 bg-black/20", riskLevel === "safe" ? "bg-safe" : riskLevel === "medium" ? "bg-medium" : riskLevel === "risk" ? "bg-risky" : "")} />
          <div className={twMerge("flex-1 h-3 bg-black/20", riskLevel === "medium" ? "bg-medium" : riskLevel === "risk" ? "bg-risky" : "")} />
          <div className={twMerge("flex-1 h-3 bg-black/20", riskLevel === "risk" ? "bg-risky" : "")} />
        </div>
      </div>
    </div>
  )
}

NameField.displayName = 'NameField';

export default NameField;