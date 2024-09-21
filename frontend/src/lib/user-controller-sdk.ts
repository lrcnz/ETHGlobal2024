import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";

if (!process.env.API_KEY) {
  throw new Error("API_KEY is required");
}

export const userControlledWalletsClient = initiateUserControlledWalletsClient({
  apiKey: process.env.API_KEY as string,
  baseUrl: "https://api.circle.com",
  userAgent: "PW-USER-WALLET-WEB-SAMPLE-APP"
});