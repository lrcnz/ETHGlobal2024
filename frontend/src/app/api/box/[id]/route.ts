import { getBoxById } from "../servers";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log(id);

  try {
    const data = await getBoxById(parseInt(id));

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}