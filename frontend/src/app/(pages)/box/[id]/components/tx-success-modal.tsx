export function TxSuccessModal({ name }: { name: string }) {
  return (
    <dialog id="tx-success-modal" className="modal">
      <div className="modal-box bg-white flex flex-col items-center justify-center h-[320px] w-[320px]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[60px] mb-6 stroke-success">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3 className="font-bold text-lg mb-5 text-center">{`Run ${name} Success`}</h3>
      </div>
    </dialog >
  );
}