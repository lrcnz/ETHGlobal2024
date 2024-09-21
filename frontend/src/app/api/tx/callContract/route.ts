import { userControlledWalletsClient } from "@/lib/user-controller-sdk";

export async function POST(req: Response) {
  const body = await req.json();
  const headers = req.headers;

  // circle-sdk: create user transaction contract execution challenge
  const response = await userControlledWalletsClient.createUserTransactionContractExecutionChallenge({
    userToken: headers.get('token') as string,
    abiFunctionSignature: body.abiFunctionSignature,
    abiParameters: body.abiParameters,
    amount: body.amount,
    contractAddress: body.contractAddress,
    idempotencyKey: body.idempotencyKey,
    refId: body.refId,
    walletId: body.walletId,
    fee: {
      type: "level",
      config: {
        feeLevel: body.feeLevel
      }
    }
  });

  return Response.json({ result: "success", data: {
    challengeId: response.data?.challengeId
  }}, { status: 200 });
}