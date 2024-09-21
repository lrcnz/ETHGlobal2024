import * as React from "react"

const ETH = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    ref={ref}
    {...props}
  >
    <circle cx={8} cy={8} r={8} fill="#F9F9F9" />
    <path fill="#8C8C8C" d="M4.525 7.988 7.881 9.97V2.422L4.525 7.988Z" />
    <path fill="#343434" d="M11.234 7.99 7.88 6.46v-4.04l3.355 5.568Z" />
    <path fill="#8C8C8C" d="M4.524 8.624 7.88 13.35v-2.744L4.524 8.624Z" />
    <path fill="#3C3C3B" d="M7.88 10.606v2.744l3.356-4.726-3.356 1.982Z" />
    <path fill="#141414" d="M11.234 7.99 7.88 9.97v-3.51l3.355 1.528Z" />
    <path fill="#393939" d="M7.879 6.461v3.51L4.523 7.99 7.88 6.461Z" />
  </svg>
));

ETH.displayName = 'ETH';



const TokenImage = ({ token }: { token?: string }) => {
  if (token === 'ETH') {
    return <ETH />
  }

  return (
    <div className="w-4 h-4 rounded-full bg-purple-400"  />
  );
}

TokenImage.displayName = 'TokenImage';

export default TokenImage;