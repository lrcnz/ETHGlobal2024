import * as React from "react";
import { createBoxContext } from "../components/provider";

export function useCreateContext () {
  return React.useContext(createBoxContext);
}