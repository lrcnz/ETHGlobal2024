import { prisma } from "@/lib/prisma";
import { userControlledWalletsClient } from "@/lib/user-controller-sdk";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const users = await prisma.user.findMany({
    where: { email: email }
  });

  if (users.length !== 0) {
    return Response.json({
      result: "error",
      message: "User already exists"
    }, { status: 400 })
  }

  try {
    const uuid = randomUUID();

    await prisma.user.create({
      data: { userId: uuid, email: email, password: password }
    });

    console.log(`create user ${uuid}/${email} successfully`);

    // circle-sdk: create user
    await userControlledWalletsClient.createUser({ userId: uuid });

    // circle-sdk: create user token
    const createTokenRes = await userControlledWalletsClient.createUserToken({ userId: uuid });

    // circle-sdk: create user wallet pin
    const createWalletPinRes = await userControlledWalletsClient.createUserPinWithWallets({
      userId: uuid,
      blockchains: ["ETH-SEPOLIA"],
      accountType: "SCA"
    });

    return Response.json({
      result: "success",
      data: {
        userId: uuid,
        userToken: createTokenRes.data?.userToken,
        encryptionKey: createTokenRes.data?.encryptionKey,
        challengeId: createWalletPinRes.data?.challengeId
      }
    }, { status: 200 })

  } catch (e) {
    console.error(e);
    return Response.json({
      result: "error",
      message: "Internal server error"
    }, { status: 500 })
  }
}