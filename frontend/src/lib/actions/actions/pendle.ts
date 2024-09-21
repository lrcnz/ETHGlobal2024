// import { Action, TokenWithBalance } from "./types";

// export class PendleAction implements Action {
//   readonly id = 'pendle';
//   readonly description = 'Stake on Pendle';
//   readonly availableInputTokens = ['wstETH'];
//   readonly availableOutputTokens = ['SY-wstETH'];
//   readonly riskLevel = 'low';

//   async run (input: TokenWithBalance[]): Promise<TokenWithBalance[]> {
//     if (input.length !== 1 || input[0].token !== 'wsETH') {
//       throw new Error('Invalid input');
//     }

//     // Wrap ETH
//     return [{ token: 'SY-wstETH', balance: input[0].balance }];
//   }

//   getOutputTokens (input: string): string[] {
//     if (input === 'wstETH') {
//       return ['SY-wstETH'];
//     }

//     return [];
//   }
// }