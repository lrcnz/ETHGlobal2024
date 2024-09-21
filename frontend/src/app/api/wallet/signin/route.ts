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
    const user = users[0];

    console.log(user.password);
    if (user.password !== password) {
      return Response.json({
        result: "error",
        message: "Invalid password"
      }, { status: 400 })
    }

    const createTokenRes = await userControlledWalletsClient.createUserToken({
      userId: user.userId
    });

    const getUserResponse = await userControlledWalletsClient.getUser({
      userId: user.userId
    });

    let createWalletPinRes;

    if (
      getUserResponse.data?.user?.pinStatus !== 'ENABLED' ||
      getUserResponse.data?.user?.securityQuestionStatus !== 'ENABLED'
    ) {
      // when user has not enabled their PIN or security questions yet
      createWalletPinRes = await userControlledWalletsClient.createUserPinWithWallets({
        userId: user.userId,
        blockchains: ['ETH-SEPOLIA'],
        accountType: 'SCA'
      });

      return Response.json({
        result: "success",
        data: {
          userId: user.userId,
          userToken: createTokenRes.data?.userToken,
          encryptionKey: createTokenRes.data?.encryptionKey,
          challengeId: createWalletPinRes.data?.challengeId
        }
      }, { status: 200 })
    }

    return Response.json({
      result: "success",
      data: {
        userId: user.userId,
        userToken: createTokenRes.data?.userToken,
        encryptionKey: createTokenRes.data?.encryptionKey
      }
    }, { status: 200 })
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
