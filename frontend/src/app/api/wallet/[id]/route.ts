import { userControlledWalletsClient } from "@/lib/user-controller-sdk";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // circle-sdk: get user's wallet
  const walletListResponse = await userControlledWalletsClient.listWallets({
    userId: id
  });

  if (walletListResponse.data?.wallets.length === 0) {
    return Response.json({
      result: "error",
      message: "Wallet not found"
    }, { status: 400 });
  }

  const wallet = walletListResponse.data?.wallets[0];

  return Response.json({
    result: "success",
    data: wallet
  });
}