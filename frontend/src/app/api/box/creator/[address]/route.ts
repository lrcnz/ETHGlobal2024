import { getBoxListByCreatorAddress } from "../../servers";

export async function GET(
  _request: Request,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  try {
    const data = await getBoxListByCreatorAddress(address);

    return Response.json(data);
  } catch (error) {

    return Response.json({
      status: "error",
      message: error
    }, { status: 500 });
  }
}