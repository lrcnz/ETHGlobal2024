import { getAllBoxList } from "../servers";

export async function GET() {
  try {
    const data = await getAllBoxList();

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}