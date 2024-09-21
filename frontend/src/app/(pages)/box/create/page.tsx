"use client";

import * as React from "react";
import Header from "./components/header";
import NameField from "./components/name-field";
import BoxField from "./components/box-field";
import CircuitEdit from "./components/circuit-edit";
import { useCreateContext } from "./hooks/use-create-context";
import { Circuit } from "@/lib/box/circuit";
import { useWatch } from "react-hook-form";
import { Box } from "@/lib/box/box";

const CreatePage = () => {
  const { box, setActiveCircuit, setDepth, form, setBox } = useCreateContext();
  // read search params
  const boxNameField = useWatch({ control: form.control, name: "boxName" });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams) {
      const content = searchParams.get('content') === 'unstake' ? '[{\"id\":\"0\",\"data\":{\"inputToken\":[\"ezETH\"],\"params\":{},\"actionId\":\"unstake-zenzo\",\"outputToken\":[\"stETH\"]}},{\"id\":\"0-0\",\"data\":{\"inputToken\":[\"stETH\"],\"actionId\":\"unstake-lido\",\"outputToken\":[\"ETH\"]}},{\"id\":\"0-0-0\",\"data\":{\"inputToken\":[\"ETH\"],\"actionId\":\"swap\",\"outputToken\":[\"USDC\"]}}]' : '';

      if (content) {
        console.log(JSON.parse(content));
        const box = Box.fromJSON(JSON.parse(content));

        setBox(box);
        form.setValue('boxName', 'Unstake ezETH to USDC');
        if (box.getRoot()) {
          setActiveCircuit(box.getRoot()!.getId());
          setDepth(box.getDepth());
        }

        return;
      }
    }

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
  }, [setActiveCircuit, setDepth]);

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