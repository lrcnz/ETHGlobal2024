// disable eslint for this file
/* eslint-disable */
import * as React from "react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { TarGPTAvatar } from "./targpt-icon";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useCreateContext } from "../hooks/use-create-context";
import { Box } from "@/lib/box/box";
import AccountAvatar from "@/components/account-avatar";
import { atom, useAtom } from "jotai";

const TypedText = ({ text, className, onCompletedTyping }: { text: string, className?: string, onCompletedTyping?: () => void }) => {
  const [displayResponse, setDisplayResponse] = useState("");
  const [, setCompletedTyping] = useState(false);

  useEffect(() => {
    setCompletedTyping(false);

    let i = 0;
    const stringResponse = text;

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));

      i++;

      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
        onCompletedTyping?.();
      }
    }, 20);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      {displayResponse}
    </div>
  );
}

// should be a component that takes an array of strings and types them out one by one
const TypedTextFlow = ({ className, children }: { className?: string, children: ReactNode }) => {
  const [index, setIndex] = useState(1);
  const content = useMemo(() => {
    return React.Children.toArray(children).map((child, index) => {
      if ((child as React.ReactElement).type !== TypedText) {
        return child;
      }

      return React.cloneElement(child as React.ReactElement, {
        onCompletedTyping: () => {
          (child as React.ReactElement).props.onCompletedTyping?.();
          setIndex(index + 2);
        }
      });
    });
  }, [children]);

  return (
    <div className={className}>
      {
        content.slice(0, index)
      }
    </div>
  );
}



interface DialogItemProps {
  avatar: ReactNode;
  content: ReactNode;
  position?: "left" | "right";
}

function DialogItem({ avatar, content, position = "left" }: DialogItemProps) {
  return (
    <div className={twMerge("flex items-start gap-2 mb-4", position === "left" ? "flex-row" : "flex-row-reverse")}>
      <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 flex-grow-0">
        {avatar}
      </div>
      <div className="bg-[#EEE] p-4 rounded-[20px]">
        {content}
      </div>
    </div>
  );
}

const messageAtom = atom<any[]>([]);

export function TarGPTModal() {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const { box, form } = useCreateContext();
  const [message, setMessage] = useAtom(messageAtom);

  useEffect(() => {
    setMessage((prev) => ([
      <DialogItem
        key="targpt-response-1"
        avatar={<TarGPTAvatar />}
        content={
          <div className="text-sm font-normal">
            <TypedTextFlow>
              <TypedText className="font-bold mb-2" text="Welcome to TarGPT! 🎉" />
              <TypedText className="mb-8" text="I’m here to help you quickly create and optimize Boxes with personalized recommendations based on your past usage and preferences." />
              <TypedText className="font-semibold mb-2" text="Interact with me:" />
              <div>
                <ul className="list-disc">
                  <li>
                    <span className="font-bold mr-1">Box recommendations:</span>
                    <div className="inline">
                      Create Box with common strategies. Try ETH Restake or USDC Delta Neutral, Unstake and get USDC
                    </div>
                  </li>
                  <li>
                    <span className="font-bold mr-1">Customize your Box:</span> Have specific needs? Like Reduce risk or Increase APY
                  </li>
                  <li>
                    <span className="font-bold">Generate a Box:</span> Not sure where to start? Let me see what suits your portfolio and {" "}
                    <span className="underline font-bold cursor-pointer" onClick={() => handleNormalGenerateBox()}>Generate a Box</span>
                  </li>
                </ul>
              </div>
            </TypedTextFlow>
          </div>
        }
      />
    ]));

    return () => {
      setMessage([]);
    }
  }, []);

  const handleOpenModal = () => {
    if (typeof window === "undefined") return;

    setOpen(true);
    // setStep(1);

    const modal = document.getElementById("targpt-modal") as HTMLDialogElement;

    modal.showModal();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNormalGenerateBox = React.useCallback(() => {
    function callback() {
      const newBox = Box.fromJSON(
        [
          {
            "id": "0",
            "data": {
              "inputToken": ["USDC"],
              "actionId": "swap",
              "outputToken": ["ETH"]
            }
          },
          {
            "id": "0-0",
            "data": {
              "inputToken": ["ETH"],
              "actionId": "lido",
              "outputToken": ["stETH"]
            }
          },
          {
            "id": "0-0-0",
            "data": {
              "inputToken": ["stETH"],
              "actionId": "zenzo",
              "outputToken": ["ezETH"]
            }
          }
        ]
      );

      if (newBox.getRoot()) {
        box.setRoot(newBox.getRoot()!);
        box.notifyTreeChange();
        form.setValue('boxName', 'Restake to ezETH')
      }
    }

    setMessage((prev) => [
      ...prev,
      <DialogItem
        key="targpt-response-2-1"
        avatar={<AccountAvatar address={address} className="w-[22px] h-[22px]" />}
        content={<span>Generate a Box</span>}
        position="right"
      />,
      <DialogItem
        key="targpt-response-1"
        avatar={<TarGPTAvatar />}
        content={
          <div className="text-sm font-normal">
            <TypedTextFlow>
              <TypedText className="" text="Looking at your token balance..." />
              <TypedText className="" text="Analysing your transaction history..." />
              <TypedText className="" text="Analysing your transaction history..." />
              <TypedText className="" text="Picking Circuits..." />
              <TypedText className="font-bold" text="Box (Mocked) Created🚀" />
              <TypedText
                className=""
                text="Please review the newly created Box. You may save and run it, or provide feedback and I can modify accordingly."
                onCompletedTyping={callback}
              />
              <div className="my-4">
                <div className="flex gap-8 mb-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handleDeltaNeutra()}>Lower Risk</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleHigherAPY()}>Higher APY</button>
                </div>
                <p>Provide your feedback for adjustments</p>
              </div>
            </TypedTextFlow>
          </div>
        }
      />,
    ])
  }, [message])

  const handleHigherAPY = React.useCallback(() => {
    function callback() {
      const newBox = Box.fromJSON(
        JSON.parse(`[{\"id\":\"0\",\"data\":{\"inputToken\":[\"USDC\"],\"actionId\":\"swap\",\"outputToken\":[\"ETH\"]}},{\"id\":\"0-0\",\"data\":{\"inputToken\":[\"ETH\"],\"actionId\":\"lido\",\"outputToken\":[\"stETH\"]}},{\"id\":\"0-0-0\",\"data\":{\"inputToken\":[\"stETH\"],\"actionId\":\"lending-pool\",\"outputToken\":[\"USDC\"]}},{\"id\":\"0-0-0-0\",\"data\":{\"inputToken\":[\"USDC\"],\"actionId\":\"swap\",\"outputToken\":[\"ETH\"]}}]`)
      );

      if (newBox.getRoot()) {
        box.setRoot(newBox.getRoot()!);
        box.notifyTreeChange();
        form.setValue('boxName', 'Long ETH')
      }
    }
    setMessage((prev) => [
      ...prev,
      <DialogItem
        key="targpt-response-2-1"
        avatar={<AccountAvatar address={address} className="w-[22px] h-[22px]" />}
        content={<span>Higher APY</span>}
        position="right"
      />,
      <DialogItem
        key="targpt-response-2-2"
        avatar={<TarGPTAvatar />}
        content={
          <div className="text-sm font-normal">
            <TypedTextFlow>
              <TypedText text="Finding suitable Circuits for overall lower risk Box..." />
              <TypedText text="Box updated🚀" />
              <TypedText text="Please review the updated created Box with lower overall risk." onCompletedTyping={callback} />
              <div className="my-4">
                <div className="flex gap-8 mb-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handleNormalGenerateBox()}>Normal Risk</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleDeltaNeutra()}>Lower Risk</button>
                </div>
                <p>Provide your feedback for adjustments</p>
              </div>
            </TypedTextFlow>
          </div>
        }
      />
    ])
  }, [message, handleNormalGenerateBox])

  const handleDeltaNeutra = React.useCallback(() => {
    function callback() {
      const newBox = Box.fromJSON(
        [
          {
            "id": "0",
            "data": {
              "inputToken": [
                "USDC"
              ],
              "actionId": "split",
              "outputToken": [
                "USDC",
                "USDC"
              ]
            }
          },
          {
            "id": "0-0",
            "data": {
              "inputToken": [
                "USDC"
              ],
              "actionId": "swap",
              "outputToken": [
                "ETH"
              ]
            }
          },
          {
            "id": "0-0-0",
            "data": {
              "inputToken": [
                "ETH"
              ],
              "actionId": "lido",
              "outputToken": [
                "stETH"
              ]
            }
          },
          {
            "id": "0-1",
            "data": {
              "inputToken": [
                "USDC"
              ],
              "actionId": "short-market",
              "outputToken": [
                "Short USDC"
              ]
            }
          }
        ]);

      if (newBox.getRoot()) {
        box.setRoot(newBox.getRoot()!);
        box.notifyTreeChange();
        form.setValue('boxName', 'Delta Neutral')
      }
    }

    setMessage((prev) => [
      ...prev,
      <DialogItem
        key="targpt-response-2-1"
        avatar={<AccountAvatar address={address} className="w-[22px] h-[22px]" />}
        content={<span>Lower Risk</span>}
        position="right"
      />,
      <DialogItem
        key="targpt-response-2-2"
        avatar={<TarGPTAvatar />}
        content={
          <div className="text-sm font-normal">
            <TypedTextFlow>
              <TypedText text="Finding suitable Circuits for overall lower risk Box..." />
              <TypedText text="Box updated🚀" />
              <TypedText text="Please review the updated created Box with lower overall risk." onCompletedTyping={callback} />
              <div className="my-4">
                <div className="flex gap-8 mb-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handleNormalGenerateBox()}>Normal Risk</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleHigherAPY()}>Higher APY</button>
                </div>
                <p>Provide your feedback for adjustments</p>
              </div>
            </TypedTextFlow>
          </div>
        }
      />
    ])
  }, [message, handleNormalGenerateBox, handleHigherAPY]);

  return (
    <>
      <button
        className="btn btn-outline w-[120px] min-h-8 h-8 rounded-[10px] px-[10px] gap-2 text-sm hover:bg-transparent hover:text-black"
        onClick={handleOpenModal}
      >
        TarGPT
      </button>
      <dialog id="targpt-modal" className="modal" onClose={() => setOpen(false)}>
        <div className="modal-box bg-white translate-x-[560px] mt-[200px]">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-5">TarGPT Assistant</h3>
          <div className="h-[600px] overflow-auto">
            {message}
          </div>
          <div className="">
            <input placeholder="Message TarGPT" className="input w-full h-[34px] px-4 py-[6px] rounded-[30px] border border-black/40" />
          </div>
        </div>
      </dialog>
    </>
  );
}