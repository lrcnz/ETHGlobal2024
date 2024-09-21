import * as React from "react";
import { twMerge } from "tailwind-merge";

// statistic card component
const StatisticCardRoot = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={twMerge("p-4 rounded-3xl bg-gray-100", className)} {...props} ref={ref} />;
});

StatisticCardRoot.displayName = "StatisticCardRoot";

// statistic card header component
const StatisticCardHeader = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={twMerge("text-sm font-bold text-black/40 mb-2" ,className)} {...props} ref={ref} />;
});

StatisticCardHeader.displayName = "StatisticCardHeader";

// statistic card content component
const StatisticCardContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={twMerge("text-2xl leading-6 font-bold text-black/60", className)} {...props} ref={ref} />;
});

StatisticCardContent.displayName = "StatisticCardContent";

const StatisticCard = StatisticCardRoot as typeof StatisticCardRoot & {
  Header: typeof StatisticCardHeader;
  Content: typeof StatisticCardContent;
};

StatisticCard.Header = StatisticCardHeader;
StatisticCard.Content = StatisticCardContent

StatisticCard.displayName = "StatisticCard";

export { StatisticCard };