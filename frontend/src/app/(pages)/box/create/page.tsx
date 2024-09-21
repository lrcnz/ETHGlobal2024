"use client";

import * as React from "react";
import Header from "./components/header";
import NameField from "./components/name-field";
import BoxField from "./components/box-field";
import CircuitEdit from "./components/circuit-edit";
import { useCreateContext } from "./hooks/use-create-context";
import { Circuit } from "@/lib/box/circuit";
import { useWatch } from "react-hook-form";

const CreatePage = () => {
  const { box, setActiveCircuit, setDepth, form } = useCreateContext();

  const boxNameField = useWatch({ control: form.control, name: "boxName" });

  React.useEffect(() => {
    const root = new Circuit({ inputToken: ["USDC"] });
    const circuit1 = new Circuit();
    const circuit2 = new Circuit();

    // init box data
    box.setRoot(root);
    box.addCircuit(circuit1, root);
    box.addCircuit(circuit2, circuit1);

    // init active circuit and depth
    setActiveCircuit(root.getId());
    setDepth(box.getDepth());

    // reset form when unmount
    return () => {
      form.reset();
    }
  }, [form, box, setActiveCircuit, setDepth]);

  // trigger boxName validation when boxNameField changes
  React.useEffect(() => {
    if (!boxNameField) return;

    form.trigger(['boxName']);
  }, [form, boxNameField]);

  return (
    <div>
      <Header className="mb-[10px]" />
      <NameField className="mb-[10px]" />
      <BoxField className="mb-4" />
      <CircuitEdit />
    </div>
  );
}

CreatePage.displayName = 'CreatePage';

export default CreatePage;