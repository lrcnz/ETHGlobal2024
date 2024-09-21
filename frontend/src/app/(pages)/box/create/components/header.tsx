import { useSaveBox } from "../hooks/use-save-box";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const Header = ({ className }: { className: string }): JSX.Element => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/profile");
  };

  const { handleSave, isLoading } = useSaveBox(handleGoBack);

  return (
    <div className={className}>
      <div className={"flex items-center justify-between mb-[30px]"}>
        <h2 className="text-[40px] leading-10 font-bold">Build New Box</h2>
        <div className="flex items-center gap-6">
          <button className="btn btn-outline px-4 py-3" onClick={handleSave}>Save</button>
          <button className="btn btn-outline px-4 py-3">Preview</button>
          <button className="btn btn-outline px-4 py-3">Publish</button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <p className="text-xs leading-3 font-light cursor-pointer" onClick={handleGoBack}>back to My Box</p>
      </div>
    </div>
  );
}

Header.displayName = 'Header';

export default Header;