import * as React from "react";

import { Detail } from "./components/details";
import { Header } from "./components/header";

export default function Page () {
  return (
    <div>
      <Header />
      <Detail />
    </div>
  );
}