/* eslint-disable */
import * as React from "react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { TarGPTAvatar } from "./targpt-icon";
import { twMerge } from "tailwind-merge";
import { useAccount } from "wagmi";
import { useCreateContext } from "../hooks/use-create-context";
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

export function ExitTarGPTModal() {
  const { address } = useAccount();
  const { box, form } = useCreateContext();
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useAtom(messageAtom);
  const [name, setName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);

    const fromName = searchParams.get('from');

    if (fromName) {
      setName(fromName);
    }

    setMessage((prev) => ([
      <DialogItem
        key="targpt-response-1"
        avatar={<TarGPTAvatar />}
        content={
          <div className="text-sm font-normal">
            <TypedTextFlow>
              <TypedText className="font-bold mb-2" text={`Exit Box for ${fromName || ""} created`} />
            </TypedTextFlow>
          </div>
        }
      />
    ]));

    return () => {
      setMessage([]);
    }
  }, []);

  return (
    <dialog id="exit-targpt-modal" className="modal" onClose={() => setOpen(false)}>
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
  );
}