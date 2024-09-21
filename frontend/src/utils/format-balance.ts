"use client";

import { formatUnits } from "viem";

export function formatBalance(balance: bigint | undefined, decimals: number = 18): string {
  if (!balance) return '0';

  const balanceString = formatUnits(balance, decimals);

  // keep 4 decimal places
  const [whole, decimal] = balanceString.split('.');

  if (!decimal) return whole;

  return `${whole}.${decimal.slice(0, 4)}`;
}