import { useContext } from "react";
import { createBoxContext } from "../components/provider";

export function useForm () {
  return useContext(createBoxContext).form;
}