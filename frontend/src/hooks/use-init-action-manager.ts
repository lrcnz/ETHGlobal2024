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
import { OpenShortMarket } from "@/lib/actions/actions/open-short-market";
import { actionManager } from "@/atoms/action-manager";
import { UnstakeRenzoAction } from "@/lib/actions/actions/unstake-renzo";
import { UnstakeLidoAction } from "@/lib/actions/actions/unstake-lido";
import { SuperstateDepositAction } from "@/lib/actions/actions/superstate-deposit";
import { SuperstateWithdrawAction } from "@/lib/actions/actions/superstate-withdraw";
import { SuperstateSellAction } from "@/lib/actions/actions/superstate-sell";

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
      new OpenShortMarket(),
      new UnstakeRenzoAction(),
      new UnstakeLidoAction(),
      new SuperstateDepositAction(),
      new SuperstateWithdrawAction(),
      new SuperstateSellAction()
    ]));
  }, [setActionManager]);
}