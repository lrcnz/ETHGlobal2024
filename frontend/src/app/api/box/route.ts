import { NextRequest } from "next/server";
import { createBox, getBoxListByCreatorAddress } from "./servers";

export async function POST(
  request: Request,
) {
  const data = await request.json();

  // check if the name is provided
  if (!data.name) return Response.json({ error: "Name is required" }, { status: 400 });
  // check if content is provided
  if (!data.content) return Response.json({ error: "Content is required" }, { status: 400 });
  // check if creatorAddress is provided
  if (!data.creatorAddress) return Response.json({ error: "Creator Address is required" }, { status: 400 });

  try {
    await createBox(data);

    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
) {
  const creatorAddress = request.nextUrl.searchParams.get("creator");

  if (!creatorAddress) return Response.json({ error: "Creator Address is required" }, { status: 400 });

  try {
    const data = await getBoxListByCreatorAddress(creatorAddress);

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}