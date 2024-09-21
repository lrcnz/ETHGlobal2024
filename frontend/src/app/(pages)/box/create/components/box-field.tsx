import { twMerge } from "tailwind-merge";
import Circuit from "./circuit";
import { useCircuitDepth } from "../hooks/use-circuit-depth";
import { useAddCircuit } from "../hooks/use-add-circuit";
import { useRemoveCircuit } from "../hooks/use-remove-circuit";
import { useActiveCircuit } from "../hooks/use-active-circuit";
import { TarGPTModal } from "./targpt-modal";

const Header = ({ className }: { className: string }): JSX.Element => {
  const handleAddCircuit = useAddCircuit();
  const handleRemoveCircuit = useRemoveCircuit();

  return (
    <div className={twMerge("flex items-center justify-between", className)}>
      <div>
        <h3>Selected Circuit will appear here</h3>
      </div>
      <div className="flex items-center gap-[10px]">
        <button className="btn btn-outline w-[96px] min-h-8 h-8 rounded-[10px] px-[10px]" onClick={handleRemoveCircuit}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>

        </button>
        <button className="btn btn-outline w-[96px] min-h-8 h-8 rounded-[10px] px-[10px]" onClick={handleAddCircuit}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <TarGPTModal />
      </div>
    </div>
  );
}

Header.displayName = 'Header';

const BoxContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full overflow-auto scroll-smooth p-5">
      <div className="flex items-stretch gap-8 pb-2">
        {children}
      </div>
    </div>
  );
}

BoxContainer.displayName = 'BoxContainer';

const BoxField = ({ className }: { className: string }): JSX.Element => {
  const [depth] = useCircuitDepth();
  const [activeCircuitId] = useActiveCircuit();

  return (
    <div className={className}>
      <Header className="mb-2" />
      <div className="rounded-[20px]  bg-white">
        <BoxContainer>
          {
            Array.from({ length: depth }).map((_, index) => (
              <Circuit
                key={`create-box-circuit-${index}`}
                index={index}
                isEnd={index === depth - 1}
                isSelected={activeCircuitId.split('-').length - 1 === index}
              />
            ))
          }
        </BoxContainer>
      </div>
    </div>
  );
}

BoxField.displayName = 'BoxField';

export default BoxField;