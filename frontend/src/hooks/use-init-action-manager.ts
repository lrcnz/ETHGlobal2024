import { useAtom } from "jotai";
import { useEffect } from "react";
import { ActionManager } from "@/lib/actions/manager";
import { SplitAction } from "@/lib/actions/actions/split";
import { LidoAction } from "@/lib/actions/actions/lido";
import { RenzoAction } from "@/lib/actions/actions/renzo";
import { SwapAction } from "@/lib/actions/actions/swap";
import { JoinAction } from "@/lib/actions/actions/join";
import { LendingPool } from "@/lib/actions/actions/lending-pool";
import { ShortMarket } from "@/lib/actions/actions/short-market";
import { CloseShortMarket } from "@/lib/actions/actions/close-short-market";
import { actionManager } from "@/atoms/action-manager";
import { UnstakeRenzoAction } from "@/lib/actions/actions/unstake-renzo";
import { UnstakeLidoAction } from "@/lib/actions/actions/unstake-lido";
import { CctpAction } from "@/lib/actions/actions/cctp";

export function useInitActionManager () {
  const [, setActionManager] = useAtom(actionManager);

  useEffect(() => {
    setActionManager(new ActionManager([
      new SplitAction(),
      new LidoAction(),
      new RenzoAction(),
      new SwapAction(),
      new JoinAction(),
      new LendingPool(),
      new ShortMarket(),
      new CloseShortMarket(),
      new UnstakeRenzoAction(),
      new UnstakeLidoAction(),
      new CctpAction()
    ]));
  }, [setActionManager]);
}