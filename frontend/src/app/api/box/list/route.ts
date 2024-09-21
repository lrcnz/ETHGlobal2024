import { NextRequest } from "next/server";
import { getAllBoxList, getBoxListByCreatorAddress } from "../servers";

export async function GET(
  request: NextRequest,
) {
  try {
    const data = await getAllBoxList();

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}