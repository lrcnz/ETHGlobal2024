export const ST_ETH_ADDRESS = "0xE8241C59ABFac0168637e3a8749C44A9D64291d3";
export const EZ_ETH_ADDRESS = "0xDb6E4c8ff8Bb8f4006277616bCB124EC49Be15Ba";
export const USDT_ADDRESS = "0x58951c5b8B431f3Be1910c58e04d63951c8Bb082";
export const USDC_ADDRESS = "0x3fC8A8fCA14FbC5dE3557f0afaA3CCDABd5bF21c";
export const UNI_WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
export const WETH_ADDRESS = "0xf531B8F309Be94191af87605CfBf600D71C2cFe0";

export function getTokenAddress(token?: string) {
  switch (token) {
    case "USDT":
      return USDT_ADDRESS;
    case "USDC":
      return USDC_ADDRESS;
    case "WETH":
      return UNI_WETH_ADDRESS;
    case "ETH":
      return "ETH";
    case "stETH":
      return ST_ETH_ADDRESS;
    case "ezETH":
      return EZ_ETH_ADDRESS;
    default:
      return undefined;
  }
}

export const SWAP_CONTRACT = "0xc532a74256d3db42d0bf7a0400fefdbad7694008";
export const SHORT_MARKET = "0xF21f7b8d11B2A7E07DE73227D40FCAC2eb8FF6b6";
export const LENDING_POOL = "0x8C94c0dCb2f39cb9C39c6CBc39a348F34FBBA90d";