import { useEffect, useState } from "react";
import { Box } from "../lib/box/box";

export default function useInitBox (data: string) {
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    if (!data) return;

    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    const box = Box.fromJSON(parsed);

    setBox(box);
  }, [data]);

  return box;
}