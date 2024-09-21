// import { Action, TokenWithBalance } from "./types";

// export class UniswapAction implements Action {
//   readonly id = 'uniswap';
//   readonly description = 'Uniswap swap';
//   readonly availableInputTokens = ['USDC'];
//   readonly availableOutputTokens = ['ETH'];
//   readonly riskLevel = 'low';

//   async run (input: TokenWithBalance[]): Promise<TokenWithBalance[]> {
//     if (input.length !== 1 || input[0].token !== 'USDC') {
//       throw new Error('Invalid input');
//     }

//     // Wrap ETH
//     return [{ token: 'ETH', balance: input[0].balance }];
//   }

//   getOutputTokens (input: string): string[] {
//     if (input === 'USDC') {
//       return ['ETH'];
//     }

//     return [];
//   }
// }