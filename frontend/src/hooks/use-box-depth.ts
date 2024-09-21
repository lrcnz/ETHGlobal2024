import { useEffect, useState } from "react";
import { Box } from "../box";

export function useBoxDepth (box: Box | undefined | null) {
  const [depth, setDepth] = useState<number>(0);

  useEffect(() => {
    if (!box) return;

    const depth = box.getDepth();

    setDepth(depth);
  }, [box]);

  return depth;
}