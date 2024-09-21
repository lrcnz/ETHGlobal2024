import { Box } from "@/lib/box/box";
import * as React from "react";
import { useForm } from "react-hook-form";

interface ContextData {
  box: Box;
  setBox: React.Dispatch<React.SetStateAction<Box>>;
  form: ReturnType<typeof useForm>;
  depth: number;
  setDepth: React.Dispatch<React.SetStateAction<number>>;
  activeCircuit: string;
  setActiveCircuit: React.Dispatch<React.SetStateAction<string>>;
}

export const createBoxContext = React.createContext<ContextData>({} as ContextData);

export const CreateProvider = ({ children }: { children: React.ReactNode }) => {
  const [box, setBox] = React.useState<Box>(new Box());
  const form = useForm();
  const [depth, setDepth] = React.useState(0);
  const [activeCircuit, setActiveCircuit] = React.useState<string>("0");

  React.useEffect(() => {
    box.watchTreeChange(() => {
      setDepth(box.getDepth());
    });
  }, [box, setDepth]);

  return (
    <createBoxContext.Provider value={{
      box,
      setBox,
      form,
      depth,
      setDepth,
      activeCircuit,
      setActiveCircuit,
    }}>
      {children}
    </createBoxContext.Provider>
  );
}
